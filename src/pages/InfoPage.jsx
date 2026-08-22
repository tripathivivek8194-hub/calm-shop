import { Link, useParams } from 'react-router-dom';
import './InfoPage.css';

const pages = {
  about: {
    title: 'Our Story',
    description: 'Calm Shop curates geometric forms designed to bring a quiet, considered presence to everyday spaces.',
  },
  contact: {
    title: 'Contact Us',
    description: 'Questions about a piece or an order? Email us at hello@calmshop.com and we will be happy to help.',
  },
  shipping: {
    title: 'Shipping Information',
    description: 'Orders over ₹8,500 qualify for free standard shipping. This prototype does not place or fulfil real orders.',
  },
  returns: {
    title: 'Returns',
    description: 'We offer a 30-day return policy for unused items. Return handling will be connected when the store goes live.',
  },
  faq: {
    title: 'Frequently Asked Questions',
    description: 'This is a demonstration storefront. Product availability, checkout, and order confirmation are simulated.',
  },
  sustainability: {
    title: 'Sustainability',
    description: 'We believe objects for the home should be made thoughtfully, chosen intentionally, and enjoyed for years.',
  },
  careers: {
    title: 'Careers',
    description: 'There are no open roles at the moment. Please check back as Calm Shop grows.',
  },
  press: {
    title: 'Press',
    description: 'For press enquiries, contact hello@calmshop.com.',
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'This prototype stores only cart items and display preferences in your browser. It does not send personal or payment information to a server.',
  },
  terms: {
    title: 'Terms of Service',
    description: 'This website is a prototype for demonstration purposes and does not sell or process payments for real products.',
  },
  'gift-cards': {
    title: 'Gift Cards',
    description: 'Gift cards are planned for the live store. They are not available in this prototype.',
  },
};

export function InfoPage() {
  const { page } = useParams();
  const content = pages[page] || {
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
  };

  return (
    <section className="info-page">
      <div className="container info-content">
        <p className="info-eyebrow">Calm Shop</p>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
        <Link to="/shop" className="btn btn-primary">Browse Collection</Link>
      </div>
    </section>
  );
}
