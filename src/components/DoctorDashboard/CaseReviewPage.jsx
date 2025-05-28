import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext.jsx';
import { toast } from 'sonner';

const mockAiSuggestion = `
**AI Diagnostic Path Suggestion:**

1.  **Complete Blood Count (CBC) & Chemistry Panel:**
    *   *Reasoning:* To assess overall health, check for signs of infection, inflammation, anemia, organ dysfunction (liver, kidneys).
2.  **Fecal Parasite Exam:**
    *   *Reasoning:* To rule out common intestinal parasites causing gastrointestinal upset.
3.  **Abdominal Radiographs (X-rays):**
    *   *Reasoning:* To check for foreign bodies, obstructions, organomegaly, or other gross abnormalities.
4.  **(Consider if no improvement) Abdominal Ultrasound:**
    *   *Reasoning:* For more detailed imaging of abdominal organs if radiographs are inconclusive or further detail is needed.

*Disclaimer: This is a mock AI suggestion.*
`;

export function CaseReviewPage() {
  const { logout } = useAuth();
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const handleGetAISuggestion = () => {
    setAiSuggestion(mockAiSuggestion);
    toast.success("AI suggestion retrieved!");
  };

  const handleLogoutClick = () => {
    logout();
    toast.success("Logged out successfully!");
    // Navigation to login page will be handled by App.jsx's conditional rendering
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 p-4">
      <header className="w-full max-w-4xl flex justify-between items-center py-4">
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <Button variant="outline" onClick={handleLogoutClick}>Logout</Button>
      </header>

      <main className="w-full max-w-4xl mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Case Review</CardTitle>
            <CardDescription>Static mock case details for Fluffy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="font-semibold">Pet Name:</span> Fluffy</p>
            <p><span className="font-semibold">Species:</span> Cat</p>
            <p><span className="font-semibold">Age:</span> 3 years</p>
            <p><span className="font-semibold">Reported Symptoms:</span> Lethargy, Loss of appetite, Occasional vomiting for 2 days.</p>
            <p><span className="font-semibold">Initial Observations:</span> Slightly dehydrated, mild abdominal tenderness.</p>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={handleGetAISuggestion}>Get AI Diagnostic Path Suggestion</Button>
        </div>

        {aiSuggestion && (
          <Card>
            <CardHeader>
              <CardTitle>AI Diagnostic Path Suggestion</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm bg-slate-50 p-4 rounded-md border">
                {aiSuggestion}
              </pre>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
