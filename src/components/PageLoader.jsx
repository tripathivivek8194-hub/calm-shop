import './PageLoader.css';

export function PageLoader() {
  return <div className="page-loader" role="status" aria-live="polite"><span className="page-loader-orb" aria-hidden="true" /><span>Loading Calm Shop</span></div>;
}
