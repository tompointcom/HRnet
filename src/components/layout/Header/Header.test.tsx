import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from './Header';

describe('Header Component', () => {
  it('renders the title correctly', () => {
    render(<Header />);
    expect(screen.getByText('HRnet')).toBeInTheDocument();
  });

  it('renders the logo', () => {
    render(<Header />);
    expect(screen.getByAltText('logo')).toBeInTheDocument();
  });

  it('renders the navigation link', () => {
    render(<Header />);
    expect(screen.getByText('View Current Employees')).toBeInTheDocument();
  });

  it('renders with correct test id', () => {
    render(<Header />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
});