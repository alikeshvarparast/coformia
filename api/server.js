import http from 'node:http';
import nodemailer from 'nodemailer';

const MAX_BODY = 32_000;
const PORT = Number(process.env.PORT || 3000);

function json(res, data, status = 200, extra = {}) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extra,
  });
  res.end(body);
}

function corsHeaders(origin) {
  const allowed = new Set([
    'https://coformia.com',
    'https://www.coformia.com',
    'https://coformia.sspi.trade',
    'https://preview-coformia.sspi.trade',
    'http://127.0.0.1:8102',
    'http://localhost:8102',
  ]);
  const h = { 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
  if (origin && allowed.has(origin)) h['Access-Control-Allow-Origin'] = origin;
  return h;
}

async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret || !token) return false;
  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip || '',
  });
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const data = await r.json();
  return Boolean(data.success);
}

function validate(payload) {
  if (payload.website) return null;
  const name = String(payload.name || '').trim().slice(0, 120);
  const email = String(payload.email || '').trim().slice(0, 160);
  const team = String(payload.team || '').trim().slice(0, 200);
  const process = String(payload.process || '').trim().slice(0, 300);
  const outcome = String(payload.outcome || '').trim().slice(0, 500);
  const message = String(payload.message || '').trim().slice(0, 4000);
  const sourcePage = String(payload.sourcePage || payload.source_page || '').trim().slice(0, 240);
  if (!name || !email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  const legacy = team && process && outcome;
  if (!legacy && message.length < 10) return null;
  if (legacy) return { name, email, team, process, outcome, message, sourcePage, shortForm: false };
  return { name, email, team: '', process: '', outcome: '', message, sourcePage, shortForm: true };
}

function buildMessage(fields) {
  const subject = fields.shortForm
    ? `Coformia contact — ${fields.name}`
    : `Coformia contact — ${fields.team}`;
  const sourceLine = fields.sourcePage ? `Source page: ${fields.sourcePage}\n` : '';
  const text = fields.shortForm
    ? `New message from coformia.com

Name: ${fields.name}
Email: ${fields.email}
${sourceLine}
${fields.message}

Reply to reach the visitor.`
    : `New message from coformia.com

Name: ${fields.name}
Email: ${fields.email}
${sourceLine}Team: ${fields.team}
Spreadsheet or chat: ${fields.process}
What done looks like: ${fields.outcome}
${fields.message ? `\nExtra details:\n${fields.message}\n` : ''}
Reply to reach the visitor.`;
  return { subject, text };
}

async function sendViaResend(fields, mailTo, mailFrom) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const { subject, text } = buildMessage(fields);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: mailFrom,
      to: [mailTo],
      reply_to: fields.email,
      subject,
      text,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend failed (${res.status}): ${detail.slice(0, 400)}`);
  }
  return true;
}

async function sendViaSmtp(fields, mailTo, mailFrom) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return false;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
  const { subject, text } = buildMessage(fields);
  await transporter.sendMail({
    from: mailFrom,
    to: mailTo,
    replyTo: `"${fields.name.replace(/"/g, '')}" <${fields.email}>`,
    subject,
    text,
  });
  return true;
}

async function sendMail(fields) {
  const mailTo = process.env.MAIL_TO || 'info@coformia.com';
  const mailFrom = process.env.MAIL_FROM || 'Coformia website <info@coformia.com>';
  if (await sendViaResend(fields, mailTo, mailFrom)) return;
  if (await sendViaSmtp(fields, mailTo, mailFrom)) return;
  throw new Error('Configure RESEND_API_KEY or SMTP_HOST, SMTP_USER, SMTP_PASS');
}

async function handleContact(req, res) {
  const origin = req.headers.origin || '';
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      ...corsHeaders(origin || 'https://coformia.com'),
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }
  if (req.method !== 'POST') {
    json(res, { error: 'Method not allowed' }, 405);
    return;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (raw.length > MAX_BODY) {
    json(res, { error: 'Payload too large' }, 413);
    return;
  }

  let payload;
  try {
    payload = JSON.parse(raw || '{}');
  } catch {
    json(res, { error: 'Invalid JSON' }, 400);
    return;
  }

  const fields = validate(payload);
  if (!fields) {
    json(res, { error: 'Please fill in all required fields.' }, 400);
    return;
  }

  const ip =
    req.headers['cf-connecting-ip'] ||
    (req.headers['x-forwarded-for'] || '').split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    '';

  const ok = await verifyTurnstile(payload.turnstileToken, ip);
  if (!ok) {
    json(res, { error: 'Verification failed. Please try again.' }, 403);
    return;
  }

  try {
    await sendMail(fields);
  } catch (err) {
    console.error('contact send failed', err?.message || err);
    json(res, { error: 'Could not send your message. Email info@coformia.com directly.' }, 502);
    return;
  }

  json(res, { ok: true }, 200, corsHeaders(origin || undefined));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  if (url.pathname === '/api/health') {
    const hasMail = Boolean(
      process.env.RESEND_API_KEY ||
        (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
    );
    json(res, {
      ok: true,
      mail: hasMail ? 'configured' : 'missing',
      turnstile: process.env.TURNSTILE_SECRET ? 'configured' : 'missing',
    });
    return;
  }
  if (url.pathname === '/api/contact') {
    await handleContact(req, res);
    return;
  }
  json(res, { error: 'Not found' }, 404);
});

server.listen(PORT, () => {
  console.log(`coformia-api listening on ${PORT}`);
});
