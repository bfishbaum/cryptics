import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

// Wrapper component to provide router context
const HeaderWithRouter = () => (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
);

describe('Header Component', () => {
  it('renders the logo/title', () => {
    render(<HeaderWithRouter />);
    expect(screen.getByText('Cryptograms')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<HeaderWithRouter />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Archive')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('has correct navigation link URLs', () => {
    render(<HeaderWithRouter />);
    
    const homeLink = screen.getByRole('link', { name: 'Home' });
    const archiveLink = screen.getByRole('link', { name: 'Archive' });
    const submitLink = screen.getByRole('link', { name: 'Submit' });
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(archiveLink).toHaveAttribute('href', '/archive');
    expect(submitLink).toHaveAttribute('href', '/submit');
  });

  it('has logo that links to home', () => {
    render(<HeaderWithRouter />);
    
    const logoLink = screen.getByRole('link', { name: 'Cryptograms' });
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('has proper structure with title above navigation', () => {
    const { container } = render(<HeaderWithRouter />);
    
    const headerContent = container.querySelector('.header-content');
    const navLinks = container.querySelector('.nav-links');
    
    expect(headerContent).toBeInTheDocument();
    expect(navLinks).toBeInTheDocument();
    
    // Verify that header-content comes before nav-links in DOM order
    const headerContentIndex = Array.from(container.querySelectorAll('*')).indexOf(headerContent!);
    const navLinksIndex = Array.from(container.querySelectorAll('*')).indexOf(navLinks!);
    
    expect(headerContentIndex).toBeLessThan(navLinksIndex);
  });
});