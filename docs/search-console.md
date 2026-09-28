# Google Search Console (coformia.com)

1. Open [Google Search Console](https://search.google.com/search-console) and add a **Domain** or **URL-prefix** property for `https://coformia.com/`.
2. Verify via DNS TXT (recommended) or HTML file upload to the site root.
3. Submit sitemap: `https://coformia.com/sitemap.xml`
4. After deploy, confirm **www** and **keshvarco.com** redirect with 301 to `coformia.com` (handled in `worker.js`).
5. Monitor: Performance → filter queries containing `formula`, `specification`, `food manufacturing`, `ERP`, `BOM`.
6. Validate FAQ rich results: [Rich Results Test](https://search.google.com/test/rich-results) on `/`, `/formulane`, and solution pages.
