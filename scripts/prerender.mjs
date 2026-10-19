import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false, watch: null }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const markup = renderToString(createElement(App));
  let html = await readFile('dist/index.html', 'utf8');
  html = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
  const org = { '@context': 'https://schema.org', '@type': 'Organization', name: 'Barak Microelectronics', description: 'Intelligent systems for energy, electronics, and mobility.', email: 'barakmicroelectronics@gmail.com', address: { '@type': 'PostalAddress', addressRegion: 'Tamil Nadu', addressCountry: 'IN' } };
  let metadata = `<script type="application/ld+json">${JSON.stringify(org)}</script>`;
  const siteUrl = process.env.SITE_URL;
  if (siteUrl) {
    const url = new URL(siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('SITE_URL must use http or https');
    const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
    metadata += `<link rel="canonical" href="${escape(url.href)}"/><meta property="og:url" content="${escape(url.href)}"/><meta property="og:image" content="${escape(new URL('images/journey/board.webp', url).href)}"/><meta name="twitter:image" content="${escape(new URL('images/journey/board.webp', url).href)}"/>`;
    await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(url.href)}</loc></url></urlset>`);
    await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', url).href}\n`);
  }
  await writeFile('dist/index.html', html.replace('<!-- SITE_METADATA -->', metadata));
  const { default: CompanyApp } = await server.ssrLoadModule('/src/CompanyApp.tsx');
  const companyStyles = (await readdir('dist/assets')).find(file => /^styles-.*\.css$/.test(file));
  const companyHtml = (await readFile('dist/company.html', 'utf8')).replace('</head>', `<link rel="stylesheet" href="./assets/${companyStyles}"/></head>`);
  await writeFile('dist/company.html', companyHtml.replace('<div id="root"></div>', `<div id="root">${renderToString(createElement(CompanyApp))}</div>`).replace('<!-- SITE_METADATA -->', metadata));
  console.log('Pre-rendered all site content for fast first paint and search indexing.');
  if (!siteUrl) console.log('Set SITE_URL at build time to add canonical URL, social image URLs, and sitemap.');
} finally { await server.close(); }
