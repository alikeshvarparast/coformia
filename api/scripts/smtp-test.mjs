#!/usr/bin/env node
import nodemailer from 'nodemailer';

const fields = {
  name: 'Docker stack test',
  email: 'hoseinkhodabakhsh@gmail.com',
  shortForm: true,
  message: 'Coformia Docker SMTP test to info@coformia.com — please ignore.',
  sourcePage: '/test',
};

const mailTo = process.env.MAIL_TO || 'info@coformia.com';
const mailFrom = process.env.MAIL_FROM || 'Coformia website <info@coformia.com>';
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const text = `New message from coformia.com\n\nName: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}\n`;
await transporter.sendMail({
  from: mailFrom,
  to: mailTo,
  replyTo: fields.email,
  subject: `Coformia contact — ${fields.name}`,
  text,
});
console.log('sent ok to', mailTo);
