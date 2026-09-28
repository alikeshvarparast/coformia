# Cloudflare cache rules (optional complement to worker headers)

The worker sets long cache headers for `/images/*`, `/fonts/*`, and selected static files. In the Cloudflare dashboard you can add matching **Cache Rules** for extra edge behavior:

- **Path** `/images/*` → Cache eligibility: eligible, Edge TTL: 1 year
- **Path** `/fonts/*` → same
- **Path** `/theme.css`, `/prose.css`, `/fonts/fonts.css` → Edge TTL: 7 days

Keep HTML on shorter TTL or default revalidate if you deploy frequently.
