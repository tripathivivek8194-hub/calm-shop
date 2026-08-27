import { Component } from 'react';
import './ErrorBoundary.css';

export class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('Calm Shop interface error:', error, info); }
  reset = () => this.setState({ hasError: false });
  render() {
    if (!this.state.hasError) return this.props.children;
    return <main className="error-page"><div><p className="error-eyebrow">A quiet pause</p><h1>Something went wrong</h1><p>We could not display this part of Calm Shop. Your saved cart and wishlist are safe.</p><div className="error-actions"><button className="btn btn-secondary" onClick={this.reset}>Try again</button><a className="btn btn-primary" href="/">Go home</a></div></div></main>;
  }
}
