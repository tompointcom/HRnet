import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CreateEmployee from './CreateEmployee';

describe('CreateEmployee Component', () => {
  it('renders the form title', () => {
    render(<CreateEmployee />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Create Employee')).toBeInTheDocument();
  });

  it('renders the form fields', () => {
    render(<CreateEmployee />);
    expect(screen.getByLabelText('First Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of Birth:')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date:')).toBeInTheDocument();
    expect(screen.getByLabelText('Street:')).toBeInTheDocument();
    expect(screen.getByLabelText('City:')).toBeInTheDocument();
    expect(screen.getByLabelText('State:')).toBeInTheDocument();
    expect(screen.getByLabelText('Zip:')).toBeInTheDocument();
    expect(screen.getByLabelText('Department:')).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    render(<CreateEmployee />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders the address fieldset', () => {
    render(<CreateEmployee />);
    expect(screen.getByRole('group', { name: 'Address' })).toBeInTheDocument();
  });
});