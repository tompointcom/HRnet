import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer Component', () => {
    it('renders with correct test id', () => {
        render(<Footer />);
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
    it('renders the current year and the footer content', () => {
        const currentYear = new Date().getFullYear();
        render(<Footer />);
        expect(screen.getByText(`© ${currentYear} Wealth Health. All rights reserved.`)).toBeInTheDocument();
    });  
});