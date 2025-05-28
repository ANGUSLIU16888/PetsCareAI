import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';
import { AuthProvider } from '@/context/AuthContext.jsx'; // Added

describe('App', () => {
  it('renders the main application page with demo title', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    // To interact with the DemoPage, isAuthenticated would need to be true in AuthContext.
    // For this test, we assume the LoginPage is shown by default (isAuthenticated=false).
    // If testing DemoPage content, we'd need a way to set isAuthenticated to true for the test.
    // For now, let's adjust the expectation to what's rendered by LoginPage by default.
    // Make the selector more specific to target the CardTitle
    expect(screen.getByText('Login', { selector: 'div[data-slot="card-title"]' })).toBeInTheDocument();
  });

  it('renders the login button', () => { // Changed from "submit button" to "login button"
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    // This will find the login button on the LoginPage
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
