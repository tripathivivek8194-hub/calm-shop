import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const defaults = { title: 'Calm Shop | Geometric Forms for Calm Spaces', description: 'Curated geometric forms for calm spaces. Discover tactile objects designed to bring quiet beauty to everyday life.' };

export function Seo() {
  const { pathname } = useLocation();
  const section = pathname.startsWith('/shop') ? 'Shop' : pathname === '/wishlist' ? 'Wishlist' : pathname === '/cart' ? 'Cart' : pathname === '/checkout' ? 'Checkout' : pathname === '/login' ? 'Sign in' : pathname === '/register' ? 'Create account' : pathname === '/account' ? 'Your account' : null;
  const title = section ? `${section} | Calm Shop` : defaults.title;
  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', defaults.description);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical); }
    canonical.setAttribute('href', `${window.location.origin}${pathname}`);
  }, [pathname, title]);
  return null;
}
