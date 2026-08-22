# Calm Shop

A responsive React storefront for curated geometric objects. It includes browsing, product detail pages with 3D previews, a persistent cart, and a demo checkout flow.

## Run locally

```bash
npm install
npm run dev
```

Run a production check with:

```bash
npm run build
npm run lint
```

## Checkout status

Checkout validation, order totals, and confirmation are fully functional in demo mode. No real card data is sent or charged.

To accept live payments, connect a payment provider such as Stripe through a server-side API. Keep provider secret keys on the server only; do not put them in a `VITE_` variable or commit them to this repository. Use `.env.example` as the public-configuration reference.

## Deploy

This is a Vite single-page application. Run `npm run build` and deploy the generated `dist` folder.

- Netlify: the included `public/_redirects` keeps direct links such as `/checkout` working.
- Vercel: `vercel.json` includes the same single-page-app rewrite.

Configure the hosting service with build command `npm run build` and publish directory `dist`.
