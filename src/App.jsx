import React from 'react'; // useState removed
import { DemoPage } from './DemoPage';
import { LoginPage } from './LoginPage';
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from './context/AuthContext.jsx'; // Added

function App() {
  const { isAuthenticated } = useAuth(); // Get isAuthenticated from context

  return (
    <>
      <Toaster />
      {isAuthenticated ? <DemoPage /> : <LoginPage />}
    </>
  );
}

export default App;
