import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserManagementPage } from './UserManagementPage';
import { AuthContext } from '@/context/AuthContext.jsx';
import { SettingsContext } from '@/context/SettingsContext.jsx';
import { Toaster } from '@/components/ui/sonner';

// Mock the authService to control initial users, using alias
vi.mock('@/lib/authService.js', async (importOriginal) => {
  const actual = await importOriginal(); // Get actual module
  return {
    ...actual, // Spread actual module to keep other exports if any
    mockUsers: [ // Override only mockUsers
      { id: 'user1', username: 'testadmin', password: 'pw', role: 'hospital_system_admin', name: 'Test Admin User' },
      { id: 'user2', username: 'testdoctor', password: 'pw', role: 'doctor', name: 'Test Doctor User' } // Corrected: ensured comma if more were added, but this is fine as last.
    ]
  };
});

// Mock scrollIntoView for JSDOM, as Radix Select might use it
if (typeof window !== 'undefined' && typeof Element !== 'undefined') {
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = vi.fn();
  }
}

const renderUserManagementPage = (authContextValue) => {
  const settingsContextValue = { // Default/mock settings, not directly used by this page but helper expects it
    detailMessage: "",
    isSpecialFeatureEnabled: false,
    updateDetailMessage: vi.fn(),
    toggleSpecialFeature: vi.fn(),
  };

  return render(
    <AuthContext.Provider value={authContextValue}>
      <SettingsContext.Provider value={settingsContextValue}>
        <UserManagementPage />
        <Toaster />
      </SettingsContext.Provider>
    </AuthContext.Provider>
  );
};

describe('UserManagementPage', () => {
  const mockLogout = vi.fn();
  const adminUser = { username: 'hospitalsysadmin1', role: 'hospital_system_admin', name: 'Linus Admin' };
  const authContextValue = {
    currentUser: adminUser,
    isAuthenticated: true,
    logout: mockLogout,
    isLoading: false, 
    login: vi.fn(),
  };

  beforeEach(() => {
    mockLogout.mockClear();
  });

  it('renders initial users and UI elements', () => {
    renderUserManagementPage(authContextValue);

    expect(screen.getByText('Hospital System Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
    
    expect(screen.getByText('testadmin')).toBeInTheDocument();
    expect(screen.getByText('Test Admin User')).toBeInTheDocument();
    expect(screen.getByText('testdoctor')).toBeInTheDocument();
    expect(screen.getByText('Test Doctor User')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Add New User/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  it('"Add New User" dialog functionality (bypassing Role Select)', async () => {
    renderUserManagementPage(authContextValue);

    fireEvent.click(screen.getByRole('button', { name: /Add New User/i }));
    expect(await screen.findByText('Add New User', { selector: 'h2[data-slot="dialog-title"]' })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'newuser1' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'newpass123' } });
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'New User FullName' } });

    // Bypassing Role Select interaction.
    // The component UserManagementPage.jsx was modified to default role to 'viewer' if empty.
    
    fireEvent.click(screen.getByRole('button', { name: /Save User/i }));

    expect(await screen.findByText('newuser1')).toBeInTheDocument();
    expect(screen.getByText('New User FullName')).toBeInTheDocument();
    const newUserRow = screen.getByText('newuser1').closest('tr');
    expect(newUserRow).toHaveTextContent(/Viewer/i); // Default role is 'viewer'

    expect(await screen.findByText(/User newuser1 added successfully for this session!/i)).toBeInTheDocument();
  }, 15000); 

  it('Logout button calls logout function', () => {
    renderUserManagementPage(authContextValue);
    fireEvent.click(screen.getByRole('button', { name: /Logout/i }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
