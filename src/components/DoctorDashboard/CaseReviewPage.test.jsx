import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CaseReviewPage } from './CaseReviewPage';
import { AuthContext } from '@/context/AuthContext.jsx';
import { SettingsContext } from '@/context/SettingsContext.jsx';
import { Toaster } from '@/components/ui/sonner';

// Mock scrollIntoView for JSDOM
if (typeof window !== 'undefined' && typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

const renderCaseReviewPage = (authContextValue) => {
  const settingsContextValue = {
    detailMessage: "",
    isSpecialFeatureEnabled: false,
    updateDetailMessage: vi.fn(),
    toggleSpecialFeature: vi.fn(),
  };
  return render(
    <AuthContext.Provider value={authContextValue}>
      <SettingsContext.Provider value={settingsContextValue}>
        <CaseReviewPage />
        <Toaster />
      </SettingsContext.Provider>
    </AuthContext.Provider>
  );
};

describe('CaseReviewPage', () => {
  const mockLogout = vi.fn();
  const doctorUser = { username: 'doctor1', role: 'doctor', name: 'Dr. Lucy Van Pelt' };
  const authContextValue = {
    currentUser: doctorUser,
    isAuthenticated: true,
    logout: mockLogout,
    isLoading: false, 
    login: vi.fn(),
  };

  beforeEach(() => { 
    mockLogout.mockClear();
  });

  it('renders initial case details and UI elements', () => {
    renderCaseReviewPage(authContextValue);
    expect(screen.getByText('Doctor Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Current Case Review')).toBeInTheDocument();
    
    const petNameLabel = screen.getByText(/Pet Name:/i);
    expect(petNameLabel).toBeInTheDocument();
    expect(petNameLabel.closest('p')).toHaveTextContent(/Fluffy/i);

    expect(screen.getByRole('button', { name: /Get AI Diagnostic Path Suggestion/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    expect(screen.queryByText('AI Diagnostic Path Suggestion', { selector: 'div[data-slot="card-title"]'})).not.toBeInTheDocument();
  });

  it('AI Suggestion functionality', async () => {
    renderCaseReviewPage(authContextValue);
    fireEvent.click(screen.getByRole('button', { name: /Get AI Diagnostic Path Suggestion/i }));
    expect(await screen.findByText('AI Diagnostic Path Suggestion', { selector: 'div[data-slot="card-title"]'})).toBeInTheDocument();
    expect(screen.getByText(/Complete Blood Count \(CBC\) & Chemistry Panel/i)).toBeInTheDocument();
    expect(await screen.findByText(/AI suggestion retrieved!/i)).toBeInTheDocument();
  });

  it('Logout button calls logout function', () => {
    renderCaseReviewPage(authContextValue);
    fireEvent.click(screen.getByRole('button', { name: /Logout/i }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
