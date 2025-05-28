import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '@/context/AuthContext.jsx'; // Import useAuth to mock it

// Mock the useAuth hook
vi.mock('@/context/AuthContext.jsx');
// Mock authService for the specific test that renders UserManagementPage
vi.mock('@/lib/authService.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual, // Ensure other exports from authService are maintained if any
    mockUsers: [ // Provide a minimal mock for UserManagementPage rendering within App.test.jsx
      { id: 'app-test-user', username: 'apptestuser', role: 'any', name: 'App Test User' }
    ],
  };
});

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
    expect(screen.getByText('Generic Dashboard')).toBeInTheDocument(); // Corrected title
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

  it('renders Doctor Assistant Dashboard when authenticated as doctor_assistant', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      currentUser: { name: 'Nurse Joy', role: 'doctor_assistant' },
      logout: vi.fn(),
    });
    render(<App />);
    expect(screen.getByText('Doctor Assistant Dashboard')).toBeInTheDocument();
  });

  it('renders Attending Doctor Dashboard when authenticated as attending_doctor', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      currentUser: { name: 'Dr. Gregory House', role: 'attending_doctor' },
      logout: vi.fn(),
    });
    render(<App />);
    expect(screen.getByText('Attending Doctor Dashboard')).toBeInTheDocument();
  });

  it('renders Dean Dashboard when authenticated as dean', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      currentUser: { name: 'Dean Lisa Cuddy', role: 'dean' },
      logout: vi.fn(),
    });
    render(<App />);
    expect(screen.getByText('Dean Dashboard')).toBeInTheDocument();
  });

  it('renders Manager Dashboard when authenticated as manager', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      currentUser: { name: 'Michael Scott', role: 'manager' },
      logout: vi.fn(),
    });
    render(<App />);
    expect(screen.getByText('Manager Dashboard')).toBeInTheDocument();
  });

  it('renders External Expert Dashboard when authenticated as external_expert', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      currentUser: { name: 'Prof. Albus Dumbledore', role: 'external_expert' },
      logout: vi.fn(),
    });
    render(<App />);
    expect(screen.getByText('External Expert Dashboard')).toBeInTheDocument();
  });
});
