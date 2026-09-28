const MAX_BODY = 32_000;
const CANONICAL_HOST = 'coformia.com';
const REDIRECT_HOSTS = new Set([
  'www.coformia.com',
  'keshvarco.com',
  'www.keshvarco.com',
]);

const LONG_CACHE_PATHS = /^\/(images|fonts)\//;
const MEDIUM_CACHE_PATHS = /^\/(theme\.css|prose\.css|fonts\/fonts\.css|favicon\.svg|ambient\.js|analytics\.js|contact-form\.js)/;

function redirectToCanonical(request) {
  const url = new URL(request.url);
  if (!REDIRECT_HOSTS.has(url.hostname)) return null;
  url.hostname = CANONICAL_HOST;
  url.protocol = 'https:';
  return Response.redirect(url.toString(), 301);
}

function withCacheHeaders(response, pathname) {
  if (response.status !== 200) return response;
  let cacheControl;
  if (LONG_CACHE_PATHS.test(pathname)) {
    cacheControl = 'public, max-age=31536000, immutable';
  } else if (MEDIUM_CACHE_PATHS.test(pathname)) {
    cacheControl = 'public, max-age=604800, stale-while-revalidate=86400';
  } else if (pathname === '/' || pathname.endsWith('.html')) {
    cacheControl = 'no-cache, must-revalidate';
  } else {
    return response;
  }
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', cacheControl);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

function corsHeaders(origin) {
  const h = { 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
  if (origin) h['Access-Control-Allow-Origin'] = origin;
  return h;
}

async function verifyTurnstile(token, ip, secret) {
  if (!secret) return false;
  if (!token) return false;
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

async function sendMail(fields, env) {
  const mailTo = env.MAIL_TO || 'info@coformia.com';
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

  const res = await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: mailTo, name: 'Coformia' }] }],
      from: { email: 'info@coformia.com', name: 'Coformia website' },
      reply_to: { email: fields.email, name: fields.name },
      subject,
      content: [{ type: 'text/plain', value: text }],
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Mail send failed (${res.status}): ${detail.slice(0, 200)}`);
  }
}

async function handleContact(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = new Set(['https://coformia.com', 'https://www.coformia.com']);
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders(allowed.has(origin) ? origin : 'https://coformia.com'),
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ error: 'Payload too large' }, 413);

  let payload;
  try {
    payload = JSON.parse(raw || '{}');
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const fields = validate(payload);
  if (!fields) return json({ error: 'Please fill in all required fields.' }, 400);

  const ip =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    '';
  const ok = await verifyTurnstile(payload.turnstileToken, ip, env.TURNSTILE_SECRET);
  if (!ok) return json({ error: 'Verification failed. Please try again.' }, 403);

  try {
    await sendMail(fields, env);
  } catch {
    return json({ error: 'Could not send your message. Email info@coformia.com directly.' }, 502);
  }

  const headers = corsHeaders(allowed.has(origin) ? origin : undefined);
  return json({ ok: true }, 200, headers);
}

export default {
  async fetch(request, env) {
    const redirect = redirectToCanonical(request);
    if (redirect) return redirect;

    const url = new URL(request.url);
    if (url.pathname === '/api/contact') {
      return handleContact(request, env);
    }
    const response = await env.ASSETS.fetch(request);
    return withCacheHeaders(response, url.pathname);
  },
};
