import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders the main application page with demo title', () => {
    render(<App />);
    // Check for the CardTitle text
    expect(screen.getByText('ShadCN Component Demo')).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});
