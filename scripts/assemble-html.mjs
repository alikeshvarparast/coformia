#!/usr/bin/env node
/**
 * Splice shared header/footer into marketing pages and stamp ?v= from asset-version.txt.
 * Pages must contain <!-- @header -->…<!-- /@header --> and <!-- @footer -->…<!-- /@footer -->.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  'index.html',
  'about.html',
  'formulane.html',
  'qualane.html',
  'countin.html',
  '404.html',
  'privacy.html',
  'security.html',
  'formulane/erp-integration.html',
  'formulane/food-formula-management.html',
  'formulane/specification-change-control.html',
  'insights/index.html',
  'insights/erp-formula-sync.html',
  'insights/human-in-the-loop-batch-planning.html',
];

const watched = [
  'site.js',
  'ambient.js',
  'nav.js',
  'home.js',
  'home.css',
  'theme.css',
  'marketing.css',
  'fit.css',
  'fit.js',
  'prose.css',
  'contact-form.js',
  'analytics.js',
  'fonts/fonts.css',
];

function sha12() {
  try {
    return execSync('git rev-parse --short=12 HEAD', { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return 'local';
  }
}

function bumpVersionIfNeeded() {
  const versionPath = join(root, 'asset-version.txt');
  const prev = existsSync(versionPath) ? readFileSync(versionPath, 'utf8').trim() : '';
  const hash = createHash('sha256');
  for (const rel of watched) {
    const p = join(root, rel);
    if (existsSync(p)) hash.update(readFileSync(p));
  }
  const digest = hash.digest('hex').slice(0, 8);
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const next = `${day}-${sha12()}-${digest}`;
  if (!prev.includes(digest)) {
    writeFileSync(versionPath, next + '\n');
    return next;
  }
  return prev;
}

function fill(template, version) {
  return template.replaceAll('{{ASSET_VERSION}}', version);
}

const version = bumpVersionIfNeeded();
const header = fill(readFileSync(join(root, 'partials/header.html'), 'utf8').trim(), version);
const footer = fill(readFileSync(join(root, 'partials/footer.html'), 'utf8').trim(), version);

const assetRe = /(\/(?:theme|marketing|prose|home|fit)\.css|\/(?:site|ambient|nav|home|fit|contact-form|analytics)\.js)(?:\?v=[^"']*)?/g;

for (const rel of pages) {
  const path = join(root, rel);
  if (!existsSync(path)) {
    console.error('skip missing', rel);
    continue;
  }
  let html = readFileSync(path, 'utf8');
  if (!html.includes('<!-- @header -->') || !html.includes('<!-- @footer -->')) {
    console.error('missing markers', rel);
    process.exitCode = 1;
    continue;
  }
  html = html.replace(/<!-- @header -->[\s\S]*?<!-- \/@header -->/, `<!-- @header -->\n${header}\n<!-- /@header -->`);
  html = html.replace(/<!-- @footer -->[\s\S]*?<!-- \/@footer -->/, `<!-- @footer -->\n${footer}\n<!-- /@footer -->`);
  html = html.replace(assetRe, `$1?v=${version}`);
  writeFileSync(path, html);
  console.log('assembled', rel);
}

const sitemapPath = join(root, 'sitemap.xml');
if (existsSync(sitemapPath)) {
  const today = new Date().toISOString().slice(0, 10);
  let xml = readFileSync(sitemapPath, 'utf8');
  xml = xml.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
  writeFileSync(sitemapPath, xml);
  console.log('sitemap lastmod', today);
}
