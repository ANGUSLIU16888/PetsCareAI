const mockUsers = [
  { username: 'petowner1', password: 'password123', role: 'pet_owner', name: 'Charlie Brown' },
  { username: 'doctor1', password: 'password123', role: 'doctor', name: 'Dr. Lucy Van Pelt' },
  { username: 'hospitalsysadmin1', password: 'password123', role: 'hospital_system_admin', name: 'Linus Admin' }
];

export const login = async (username, password) => {
  return new Promise((resolve) => { // Changed to not use reject for login failures
    setTimeout(() => {
      const user = mockUsers.find(u => u.username === username && u.password === password);
      if (user) {
        resolve({
          success: true,
          user: { username: user.username, role: user.role, name: user.name },
          token: `fake-jwt-token-for-${user.username}` // Example token
        });
      } else {
        // Resolve with success: false as per common practice for login attempts
        resolve({ success: false, message: 'Invalid username or password' });
      }
    }, 500); // Simulate network delay
  });
};

export const logout = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Logged out successfully' });
    }, 200); // Simulate network delay
  });
};
