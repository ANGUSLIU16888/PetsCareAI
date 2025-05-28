import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAuth } from '@/context/AuthContext.jsx';
import { toast } from 'sonner';
import { mockUsers as initialMockUsersArray } from '@/lib/authService.js'; // Corrected import path

const validRoles = [
  'pet_owner', 'doctor', 'hospital_system_admin', 
  'doctor_assistant', 'attending_doctor', 'dean', 
  'manager', 'external_expert'
];

export function UserManagementPage() {
  const { logout } = useAuth();
  const [displayedUsers, setDisplayedUsers] = useState(initialMockUsersArray);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  // New User Form State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newUserRole, setNewUserRole] = useState('');

  const resetNewUserForm = () => {
    setNewUsername('');
    setNewPassword('');
    setNewFullName('');
    setNewUserRole('');
  };

  const handleAddUser = () => {
    if (!newUsername.trim()) {
      toast.error("Username is required.");
      return;
    }
    if (!newPassword) {
      toast.error("Password is required.");
      return;
    }
    if (!newFullName.trim()) {
      toast.error("Full name is required.");
      return;
    }
    // If role is not selected in the form (e.g., in test), default to 'viewer'
    const roleToSave = newUserRole || 'viewer'; 

    const newUser = {
      id: Date.now(), // Simple unique ID for client-side mock
      username: newUsername.trim(),
      password: newPassword, // In a real app, this would be hashed
      name: newFullName.trim(),
      role: roleToSave,
    };

    setDisplayedUsers([...displayedUsers, newUser]);
    toast.success(`User ${newUser.username} added successfully for this session!`);
    setIsAddUserDialogOpen(false);
    resetNewUserForm();
  };

  const handleLogoutClick = () => {
    logout();
    toast.success("Logged out successfully!");
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 p-4">
      <header className="w-full max-w-6xl flex justify-between items-center py-4">
        <h1 className="text-3xl font-bold">Hospital System Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogoutClick}>Logout</Button>
      </header>

      <main className="w-full max-w-6xl mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">User Management</h2>
          <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new user. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newUsername" className="text-right">Username</Label>
                  <Input id="newUsername" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newPassword" className="text-right">Password</Label>
                  <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newFullName" className="text-right">Full Name</Label>
                  <Input id="newFullName" value={newFullName} onChange={(e) => setNewFullName(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newUserRole" className="text-right">Role</Label>
                  <Select value={newUserRole} onValueChange={setNewUserRole}>
                    <SelectTrigger id="newUserRole" className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {validRoles.map(role => (
                        <SelectItem key={role} value={role}>
                          {role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={resetNewUserForm}>Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddUser}>Save User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedUsers.map((user) => (
                <TableRow key={user.id || user.username}> {/* Fallback to username if id is somehow missing for initial mock */}
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {displayedUsers.length === 0 && (
          <p className="text-center text-gray-500 py-4">No users to display.</p>
        )}
      </main>
    </div>
  );
}
