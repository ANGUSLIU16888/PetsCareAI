import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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

const initialPets = [
  { id: 1, name: 'Snoopy', species: 'Dog', breed: 'Beagle', sex: 'Male', birthday: '2015-10-04' },
  { id: 2, name: 'Garfield', species: 'Cat', breed: 'Tabby', sex: 'Male', birthday: '2018-06-19' },
];

export function PetManagementPage() {
  const { logout, currentUser } = useAuth();
  const [pets, setPets] = useState(initialPets);
  const [isAddPetDialogOpen, setIsAddPetDialogOpen] = useState(false);

  // New Pet Form State
  const [newPetName, setNewPetName] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState('');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetSex, setNewPetSex] = useState('');
  const [newPetBirthday, setNewPetBirthday] = useState('');

  const resetNewPetForm = () => {
    setNewPetName('');
    setNewPetSpecies('');
    setNewPetBreed('');
    setNewPetSex('');
    setNewPetBirthday('');
  };

  const handleAddPet = () => {
    if (!newPetName.trim()) {
      toast.error("Pet name is required.");
      return;
    }
    // Species and Sex will default if not selected by the user (or test)
    const speciesToSave = newPetSpecies || 'Unknown';
    const sexToSave = newPetSex || 'Unknown';
    
    // Add more validations as needed (e.g., for birthday format)

    const newPet = {
      id: Date.now(), // Simple unique ID
      name: newPetName.trim(),
      species: speciesToSave,
      breed: newPetBreed.trim(),
      sex: sexToSave,
      birthday: newPetBirthday,
    };

    setPets([...pets, newPet]);
    toast.success(`${newPet.name} added successfully!`);
    setIsAddPetDialogOpen(false);
    resetNewPetForm();
  };

  const handleLogoutClick = () => {
    logout();
    toast.success("Logged out successfully!");
    // Navigation to login page will be handled by App.jsx's conditional rendering
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 p-4">
      <header className="w-full max-w-4xl flex justify-between items-center py-4">
        <h1 className="text-3xl font-bold">Pet Owner Dashboard</h1>
        <Button variant="outline" onClick={handleLogoutClick}>Logout</Button>
      </header>

      <main className="w-full max-w-4xl mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">My Pets</h2>
          <Dialog open={isAddPetDialogOpen} onOpenChange={setIsAddPetDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Pet</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Pet</DialogTitle>
                <DialogDescription>
                  Fill in the details for your new pet.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newPetName" className="text-right">Name</Label>
                  <Input id="newPetName" value={newPetName} onChange={(e) => setNewPetName(e.target.value)} className="col-span-3" placeholder="Pet's name" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newPetSpecies" className="text-right">Species</Label>
                  <Select value={newPetSpecies} onValueChange={setNewPetSpecies}>
                    <SelectTrigger id="newPetSpecies" className="col-span-3">
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dog">Dog</SelectItem>
                      <SelectItem value="Cat">Cat</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newPetBreed" className="text-right">Breed</Label>
                  <Input id="newPetBreed" value={newPetBreed} onChange={(e) => setNewPetBreed(e.target.value)} className="col-span-3" placeholder="e.g., Beagle, Tabby" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newPetSex" className="text-right">Sex</Label>
                  <Select value={newPetSex} onValueChange={setNewPetSex}>
                    <SelectTrigger id="newPetSex" className="col-span-3">
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newPetBirthday" className="text-right">Birthday</Label>
                  <Input id="newPetBirthday" type="date" value={newPetBirthday} onChange={(e) => setNewPetBirthday(e.target.value)} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={resetNewPetForm}>Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddPet}>Save Pet</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {pets.length === 0 ? (
          <p className="text-center text-gray-500">You haven't added any pets yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <Card key={pet.id}>
                <CardHeader>
                  <CardTitle>{pet.name}</CardTitle>
                  <CardDescription>{pet.species} - {pet.breed}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p><span className="font-semibold">Sex:</span> {pet.sex}</p>
                  <p><span className="font-semibold">Birthday:</span> {pet.birthday}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
