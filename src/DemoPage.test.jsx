import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DemoPage } from './DemoPage';
import { AuthContext } from '@/context/AuthContext.jsx';
import { SettingsContext } from '@/context/SettingsContext.jsx'; // Added
import { Toaster } from '@/components/ui/sonner';

// Updated Test Helper for Rendering with Mock AuthContext and SettingsContext
const renderWithMockProviders = (
  ui,
  { authProviderProps, settingsProviderProps, ...renderOptions }
) => {
  return render(
    <AuthContext.Provider {...authProviderProps}>
      <SettingsContext.Provider {...settingsProviderProps}>
        {ui}
        <Toaster />
      </SettingsContext.Provider>
    </AuthContext.Provider>,
    renderOptions
  );
};

// Default mock settings for tests not focusing on settings changes
const defaultMockSettings = {
  detailMessage: "Default test message",
  isSpecialFeatureEnabled: false,
  updateDetailMessage: vi.fn(),
  toggleSpecialFeature: vi.fn(),
};

describe('DemoPage - Viewer Role', () => {
  const viewerUser = { username: 'testviewer', role: 'viewer', name: 'Test Viewer' };
  const authProviderProps = {
    value: {
      currentUser: viewerUser,
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    },
  };
  const settingsProviderProps = { value: defaultMockSettings };


  it('renders viewer-specific message and disabled fields', () => {
    renderWithMockProviders(<DemoPage />, { authProviderProps, settingsProviderProps });
    expect(screen.getByText(/Read-only Mode: Viewing component demonstration./i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeDisabled();
    expect(screen.getByRole('combobox', { name: /Framework/i })).toBeDisabled();
    expect(screen.getByLabelText(/Feedback/i)).toBeDisabled();
    expect(screen.getByLabelText(/Feedback/i).value).toBe(''); // Viewer has no pre-filled feedback
    expect(screen.getByRole('button', { name: /Submit Feedback/i })).toBeDisabled();
    expect(screen.queryByRole('button', { name: /Admin Panel/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });
});

describe('DemoPage - Editor Role - Basic View', () => {
  const editorUser = { username: 'testeditor', role: 'editor', name: 'Test Editor' };
  const authProviderProps = {
    value: {
      currentUser: editorUser,
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    },
  };
  const settingsProviderProps = { value: defaultMockSettings };


  it('renders editor-specific message, enabled fields, and pre-filled feedback', () => {
    renderWithMockProviders(<DemoPage />, { authProviderProps, settingsProviderProps });
    expect(screen.getByText(/Content Editor Mode: You can submit new feedback entries./i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeEnabled();
    expect(screen.getByRole('combobox', { name: /Framework/i })).toBeEnabled();
    expect(screen.getByLabelText(/Feedback/i)).toBeEnabled();
    expect(screen.getByLabelText(/Feedback/i).value).toBe("The system is generally working well, but the new UI theme could use some adjustments for contrast.");
    expect(screen.getByRole('button', { name: /Submit Feedback/i })).toBeEnabled();
    expect(screen.queryByRole('button', { name: /Admin Panel/i })).not.toBeInTheDocument(); // Editor is not admin
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });
});

describe('DemoPage - Admin Role - Basic View', () => {
  const adminUser = { username: 'testadmin', role: 'admin', name: 'Test Admin' };
  const authProviderProps = {
    value: {
      currentUser: adminUser,
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    },
  };
  const settingsProviderProps = { value: defaultMockSettings };

  it('renders admin-specific message, enabled fields, pre-filled feedback, and Admin Panel button', () => {
    renderWithMockProviders(<DemoPage />, { authProviderProps, settingsProviderProps });
    expect(screen.getByText(/System Status: All systems nominal. Full admin control enabled./i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeEnabled();
    expect(screen.getByRole('combobox', { name: /Framework/i })).toBeEnabled();
    expect(screen.getByLabelText(/Feedback/i)).toBeEnabled();
    expect(screen.getByLabelText(/Feedback/i).value).toBe("The system is generally working well, but the new UI theme could use some adjustments for contrast.");
    expect(screen.getByRole('button', { name: /Submit Feedback/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /Enable Special Feature/i })).toBeInTheDocument(); // Initial text
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });
});

describe('DemoPage - Editor Workflow - Settings', () => {
  const editorUser = { username: 'testeditor', role: 'editor', name: 'Test Editor' };
  const mockUpdateDetailMessage = vi.fn();
  const authProviderProps = {
    value: { currentUser: editorUser, isAuthenticated: true, logout: vi.fn() },
  };
  const settingsProviderProps = {
    value: {
      ...defaultMockSettings, // Use defaults for other settings
      detailMessage: "Initial detail message for editor test",
      updateDetailMessage: mockUpdateDetailMessage,
    },
  };

  it('allows editor to update detail message', async () => {
    renderWithMockProviders(<DemoPage />, { authProviderProps, settingsProviderProps });

    // Check initial message
    expect(screen.getByText("Initial detail message for editor test")).toBeInTheDocument();

    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: /Edit Detail Message/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Edit Detail Message', { selector: 'h2[data-slot="dialog-title"]' })).toBeInTheDocument();


    // Edit message in dialog input
    const dialogInput = screen.getByPlaceholderText(/Enter new detail message/i);
    fireEvent.change(dialogInput, { target: { value: "Updated by editor" } });
    expect(dialogInput.value).toBe("Updated by editor");

    // Save changes
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    // Verify updateDetailMessage was called
    expect(mockUpdateDetailMessage).toHaveBeenCalledWith("Updated by editor");
  });
});

describe('DemoPage - Admin Workflow - Settings', () => {
  const adminUser = { username: 'testadmin', role: 'admin', name: 'Test Admin' };
  const mockToggleSpecialFeature = vi.fn();

  const authProviderProps = {
    value: { currentUser: adminUser, isAuthenticated: true, logout: vi.fn() },
  };
  
  // Test with feature initially disabled
  const settingsProviderPropsDisabled = {
    value: {
      ...defaultMockSettings,
      isSpecialFeatureEnabled: false,
      toggleSpecialFeature: mockToggleSpecialFeature,
    },
  };

  it('allows admin to enable special feature', async () => {
    renderWithMockProviders(<DemoPage />, { authProviderProps, settingsProviderProps: settingsProviderPropsDisabled });

    const toggleButton = screen.getByRole('button', { name: /Enable Special Feature/i });
    expect(toggleButton).toBeInTheDocument();
    expect(screen.queryByText(/🎉 Special Feature is Now Active! 🎉/i)).not.toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(mockToggleSpecialFeature).toHaveBeenCalledTimes(1);
  });

  // Test with feature initially enabled to check "Disable" functionality
   const settingsProviderPropsEnabled = {
    value: {
      ...defaultMockSettings,
      isSpecialFeatureEnabled: true, // Feature initially enabled
      toggleSpecialFeature: mockToggleSpecialFeature,
    },
  };

  it('allows admin to disable special feature and button text updates', async () => {
    // Reset mock for this specific test if needed, or ensure it's fresh.
    mockToggleSpecialFeature.mockClear(); 
    renderWithMockProviders(<DemoPage />, { authProviderProps, settingsProviderProps: settingsProviderPropsEnabled });
    
    const toggleButton = screen.getByRole('button', { name: /Disable Special Feature/i });
    expect(toggleButton).toBeInTheDocument();
    expect(screen.getByText(/🎉 Special Feature is Now Active! 🎉/i)).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(mockToggleSpecialFeature).toHaveBeenCalledTimes(1);
  });
});
