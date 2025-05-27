import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext.jsx';
import { useSettings } from '@/context/SettingsContext.jsx';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export function DemoPage() {
  const { currentUser, logout } = useAuth();
  const {
    detailMessage,
    updateDetailMessage,
    isSpecialFeatureEnabled,
    toggleSpecialFeature,
  } = useSettings();

  const isViewer = currentUser?.role === 'viewer';
  const isAdmin = currentUser?.role === 'admin';
  const isEditor = currentUser?.role === 'editor';

  const [feedbackText, setFeedbackText] = useState('');
  const [editableMessage, setEditableMessage] = useState(detailMessage);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (currentUser?.role === 'editor' || currentUser?.role === 'admin') {
      setFeedbackText("The system is generally working well, but the new UI theme could use some adjustments for contrast.");
    } else {
      setFeedbackText("");
    }
  }, [currentUser?.role]);

  useEffect(() => {
    if (!isEditDialogOpen) {
      setEditableMessage(detailMessage);
    }
  }, [detailMessage, isEditDialogOpen]); // Keep dialog input in sync if context changes


  let roleMessage = '';
  if (isAdmin) {
    roleMessage = 'System Status: All systems nominal. Full admin control enabled.';
  } else if (isEditor) {
    roleMessage = 'Content Editor Mode: You can submit new feedback entries.';
  } else if (isViewer) {
    roleMessage = 'Read-only Mode: Viewing component demonstration.';
  }

  const handleSubmit = () => {
    toast("Submitted!", {
      description: "Your feedback has been recorded: " + feedbackText,
    });
  };

  const handleLogoutClick = () => {
    logout();
    toast.success("Logged out successfully!");
  };

  const handleSaveChangesToDetailMessage = () => {
    updateDetailMessage(editableMessage);
    toast.success("Detail message updated!");
    setIsEditDialogOpen(false);
  };
  
  const handleAdminPanelClick = () => {
    toggleSpecialFeature();
    toast.info(`Special Feature ${!isSpecialFeatureEnabled ? 'Enabled' : 'Disabled'}`);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>ShadCN Component Demo</CardTitle>
          <CardDescription>
            Showcasing a few installed components.
            {currentUser && (
              <p className="mt-2 text-sm text-gray-600">
                Welcome, {currentUser.name} ({currentUser.role})
              </p>
            )}
            {roleMessage && <p className="text-sm text-muted-foreground mt-1 italic">{roleMessage}</p>}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 p-3 bg-slate-50 rounded-md border">
            <Label className="font-semibold">Detail Message from Settings:</Label>
            <p className="text-sm text-gray-700">{detailMessage}</p>
            {(isEditor || isAdmin) && (
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto" onClick={() => { setEditableMessage(detailMessage); setIsEditDialogOpen(true); }}>Edit Detail Message</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Detail Message</DialogTitle>
                    <DialogDescription>
                      Update the shared detail message visible on this page.
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    value={editableMessage}
                    onChange={(e) => setEditableMessage(e.target.value)}
                    placeholder="Enter new detail message"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSaveChangesToDetailMessage}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {isSpecialFeatureEnabled && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
              🎉 Special Feature is Now Active! 🎉
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" disabled={isViewer} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="framework">Framework</Label>
            <Select disabled={isViewer}>
              <SelectTrigger id="framework">
                <SelectValue placeholder="Select a framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="vue">Vue</SelectItem>
                <SelectItem value="svelte">Svelte</SelectItem>
                <SelectItem value="angular">Angular</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Enter your feedback"
              disabled={isViewer}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button onClick={handleSubmit} disabled={isViewer}>Submit Feedback</Button>
          <div className="flex space-x-2">
            {isAdmin && (
              <Button variant="outline" onClick={handleAdminPanelClick}>
                {isSpecialFeatureEnabled ? 'Disable Special Feature' : 'Enable Special Feature'}
              </Button>
            )}
            <Button variant="outline" onClick={handleLogoutClick}>Logout</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
