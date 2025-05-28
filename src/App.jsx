import React from 'react';
import { LoginPage } from './LoginPage';
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from './context/AuthContext.jsx';
import { PetManagementPage } from './components/PetOwnerDashboard/PetManagementPage.jsx';
import { CaseReviewPage } from './components/DoctorDashboard/CaseReviewPage.jsx';
// DemoPage is no longer directly used here unless it's a fallback or for a specific role not listed
// For now, we'll remove it from direct App.jsx logic if not part of the new roles.
// If DemoPage was for 'admin' or 'editor', those roles are now changed.

function App() {
  const { isAuthenticated, currentUser } = useAuth();

  const renderDashboard = () => {
    if (!currentUser) { // Should not happen if isAuthenticated is true, but good check
      return <LoginPage />; // Or a generic error/loading page
    }

    switch (currentUser.role) {
      case 'pet_owner':
        return <PetManagementPage />;
      case 'doctor':
        return <CaseReviewPage />;
      case 'hospital_system_admin':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold">Hospital System Admin Dashboard</h1>
            <p className="mt-2 text-lg">Role-specific functions to be implemented.</p>
            {/* Minimal logout for placeholder pages */}
            <button 
              onClick={() => {
                const { logout } = useAuth(); // Re-accessing here for simplicity, or pass down
                logout();
              }} 
              className="mt-4 p-2 bg-red-500 text-white rounded"
            >
              Logout (Placeholder)
            </button>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-lg">
              Welcome, {currentUser.name}! Role: {currentUser.role}. Specific dashboard pending.
            </p>
            <button 
              onClick={() => {
                const { logout } = useAuth();
                logout();
              }} 
              className="mt-4 p-2 bg-red-500 text-white rounded"
            >
              Logout (Placeholder)
            </button>
          </div>
        );
    }
  };

  return (
    <>
      <Toaster />
      {isAuthenticated ? renderDashboard() : <LoginPage />}
    </>
  );
}

export default App;
