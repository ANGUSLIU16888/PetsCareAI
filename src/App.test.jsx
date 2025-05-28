import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '@/context/AuthContext.jsx'; // Import useAuth to mock it

// Mock the useAuth hook
vi.mock('@/context/AuthContext.jsx');

describe('App', () => {
  it('renders LoginPage when not authenticated', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      currentUser: null,
    });
    render(<App />);
    expect(screen.getByText('Login', { selector: 'div[data-slot="card-title"]' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('renders generic Dashboard when authenticated with an unhandled role', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      currentUser: { name: 'Test User', role: 'unknown_role' },
      logout: vi.fn(), // Add mock logout if placeholder uses it
    });
    render(<App />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument(); // Main title for generic dashboard
    expect(screen.getByText(/Welcome, Test User! Role: unknown_role/i)).toBeInTheDocument();
  });

  it('renders PetManagementPage when authenticated as pet_owner', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      currentUser: { name: 'Charlie Brown', role: 'pet_owner' },
      logout: vi.fn(),
    });
    render(<App />);
    expect(screen.getByText('Pet Owner Dashboard')).toBeInTheDocument();
  });

  it('renders CaseReviewPage when authenticated as doctor', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      currentUser: { name: 'Dr. Lucy Van Pelt', role: 'doctor' },
      logout: vi.fn(),
    });
    render(<App />);
    expect(screen.getByText('Doctor Dashboard')).toBeInTheDocument();
  });

  it('renders Hospital System Admin Dashboard when authenticated as hospital_system_admin', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      currentUser: { name: 'Linus Admin', role: 'hospital_system_admin' },
      logout: vi.fn(),
    });
    render(<App />);
    expect(screen.getByText('Hospital System Admin Dashboard')).toBeInTheDocument();
  });
});
