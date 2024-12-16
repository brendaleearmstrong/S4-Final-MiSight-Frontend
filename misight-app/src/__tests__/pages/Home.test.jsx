import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home';

const MockHome = () => {
  return (
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
};

describe('Home', () => {
  test('renders main heading', () => {
    render(<MockHome />);
    expect(screen.getByText('Mining')).toBeInTheDocument();
    expect(screen.getByText('Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Reimagined')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<MockHome />);
    const navLinks = screen.getAllByRole('link');
    const aboutLink = navLinks.find(link => link.getAttribute('href') === '/about');
    const featuresLink = navLinks.find(link => link.getAttribute('href') === '/features');
    const solutionsLink = navLinks.find(link => link.getAttribute('href') === '/solutions');
    const pricingLink = navLinks.find(link => link.getAttribute('href') === '/pricing');
    const contactLink = navLinks.find(link => link.getAttribute('href') === '/contact');
    const loginLink = navLinks.find(link => link.getAttribute('href') === '/login');

    expect(aboutLink).toBeInTheDocument();
    expect(featuresLink).toBeInTheDocument();
    expect(solutionsLink).toBeInTheDocument();
    expect(pricingLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
  });

  test('renders feature cards', () => {
    render(<MockHome />);
    expect(screen.getByText('Safety First')).toBeInTheDocument();
    expect(screen.getByText('Environmental Impact')).toBeInTheDocument();
    expect(screen.getByText('Data Analytics')).toBeInTheDocument();
    expect(screen.getByText('Stakeholder Portal')).toBeInTheDocument();
  });

  test('renders call-to-action buttons', () => {
    render(<MockHome />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('Watch Demo')).toBeInTheDocument();
  });

  test('renders footer content', () => {
    render(<MockHome />);
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
    expect(screen.getByText('Follow Us')).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });
});