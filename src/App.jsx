import React from 'react';
import { LoginPage } from './LoginPage';
import { Toaster } from "@/components/ui/sonner";
// Removed duplicate imports of React, LoginPage, Toaster
import { useAuth } from './context/AuthContext.jsx';
import { PetManagementPage } from './components/PetOwnerDashboard/PetManagementPage.jsx';
import { CaseReviewPage } from './components/DoctorDashboard/CaseReviewPage.jsx';
import { UserManagementPage } from './components/HospitalAdminDashboard/UserManagementPage.jsx'; // Added
import { Button } from "@/components/ui/button"; // Added for placeholder logout buttons

function App() {
  const { isAuthenticated, currentUser, logout } = useAuth(); // Destructure logout here

  const renderDashboard = () => {
    if (!currentUser) { 
      return <LoginPage />; 
    }

    switch (currentUser.role) {
      case 'pet_owner':
        return <PetManagementPage />;
      case 'doctor':
        return <CaseReviewPage />;
      case 'hospital_system_admin':
        return <UserManagementPage />; // Changed to render UserManagementPage
      case 'doctor_assistant':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold">Doctor Assistant Dashboard</h1>
            <p className="mt-2 text-lg">
              Welcome, {currentUser.name}! Specific dashboard for your role ({currentUser.role}) is pending implementation.
            </p>
            <Button variant="outline" onClick={logout} className="mt-4">Logout</Button>
          </div>
        );
      case 'attending_doctor':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold">Attending Doctor Dashboard</h1>
            <p className="mt-2 text-lg">
              Welcome, {currentUser.name}! Specific dashboard for your role ({currentUser.role}) is pending implementation.
            </p>
            <Button variant="outline" onClick={logout} className="mt-4">Logout</Button>
          </div>
        );
      case 'dean':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold">Dean Dashboard</h1>
            <p className="mt-2 text-lg">
              Welcome, {currentUser.name}! Specific dashboard for your role ({currentUser.role}) is pending implementation.
            </p>
            <Button variant="outline" onClick={logout} className="mt-4">Logout</Button>
          </div>
        );
      case 'manager':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold">Manager Dashboard</h1>
            <p className="mt-2 text-lg">
              Welcome, {currentUser.name}! Specific dashboard for your role ({currentUser.role}) is pending implementation.
            </p>
            <Button variant="outline" onClick={logout} className="mt-4">Logout</Button>
          </div>
        );
      case 'external_expert':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold">External Expert Dashboard</h1>
            <p className="mt-2 text-lg">
              Welcome, {currentUser.name}! Specific dashboard for your role ({currentUser.role}) is pending implementation.
            </p>
            <Button variant="outline" onClick={logout} className="mt-4">Logout</Button>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold">Generic Dashboard</h1>
            <p className="mt-2 text-lg">
              Welcome, {currentUser.name}! Role: {currentUser.role}. Specific dashboard pending.
            </p>
            <Button variant="outline" onClick={logout} className="mt-4">Logout</Button>
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
