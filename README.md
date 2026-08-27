# Calm Shop

A responsive React storefront for curated geometric objects. It includes browsing, product detail pages with 3D previews, a persistent cart, and a demo checkout flow.

## Features

- **Product Browsing** - Shop page with category filtering, search, and pagination
- **3D Product Visualization** - Interactive Three.js models with material/geometry switching
- **Shopping Cart** - Persistent drawer with quantity controls and shipping calculation
- **Wishlist** - Save favorites with localStorage persistence
- **Checkout Flow** - 3-step wizard (Contact → Shipping → Payment) with validation
- **Order History** - Track past orders with status updates
- **User Authentication** - Mock auth with login/signup/password reset
- **Reviews System** - Customer reviews with ratings, helpful votes
- **Dark/Light Mode** - Theme switching with localStorage persistence
- **Accessibility** - ARIA labels, focus management, semantic HTML
- **Indian Market Localization** - INR currency, 6-digit PIN codes, Indian states

## Tech Stack

- **React 19** with Vite 8
- **React Router 7** for client-side routing with lazy loading
- **React Three Fiber** + **@react-three/drei** + **Three.js** for 3D
- **Context API** + **useReducer** for state management
- **CSS Custom Properties** design system
- **Node.js native test runner** for unit tests

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Run Tests

```bash
npm test
```

## Production Build

```bash
npm run build
npm run lint
npm run preview
```

The `dist` folder contains the production-ready static assets.

## Deploy

### GitHub Pages (Automatic via Actions)

1. Push to `main` branch
2. GitHub Actions workflow builds and deploys to GitHub Pages
3. Configure in Settings → Pages → Source: GitHub Actions

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/calm-shop)

- Build command: `npm run build`
- Publish directory: `dist`
- Includes `netlify.toml` for SPA redirects and caching headers

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/calm-shop)

- Framework preset: Vite
- Includes `vercel.json` for SPA rewrites and caching headers

### Docker

```bash
# Build production image
docker build -t calm-shop .

# Run container
docker run -p 8080:80 calm-shop

# Or use docker-compose
docker-compose up -d
```

#### Development with Docker

```bash
docker-compose up dev
```

Opens http://localhost:5173 with hot reload.

### Manual Static Hosting

Deploy the `dist` folder to any static host:
- AWS S3 + CloudFront
- Azure Static Web Apps
- Firebase Hosting
- Surge.sh
- Cloudflare Pages

## Environment Variables

Create `.env` file for local development:

```env
# Optional: Show legacy US states in checkout
VITE_SHOW_LEGACY_STATES=true
```

## Project Structure

```
src/
├── components/
│   ├── cart/          # CartDrawer, CartItem
│   ├── layout/        # Header, Footer, Layout
│   ├── product/       # ProductViewer, ProductCard, ProductGallery
│   ├── reviews/       # ReviewList, ReviewForm, ReviewStats
│   └── ui/            # Button, Input, Modal, etc.
├── contexts/
│   ├── CartContext.jsx
│   ├── WishlistContext.jsx
│   ├── AuthContext.jsx
│   ├── ReviewsContext.jsx
│   └── OrderContext.jsx
├── data/
│   └── products.js    # Product catalog
├── hooks/
│   ├── useLocalStorage.js
│   └── useSessionStorage.js
├── pages/
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Wishlist.jsx
│   ├── Checkout.jsx
│   ├── Account.jsx
│   ├── Auth.jsx
│   └── InfoPage.jsx
├── utils/
│   ├── validators.js
│   └── formatters.js
└── styles/
    ├── index.css      # Design system
    └── components.css
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests |
| `npm run lint` | Run oxlint |

## Accessibility

- Semantic HTML5 elements
- ARIA labels and roles
- Focus management for modals/drawers
- Skip to main content link
- Sufficient color contrast
- Keyboard navigation support
- Screen reader announcements for dynamic content

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

## License

MIT