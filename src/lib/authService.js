const mockUsers = [
  { username: 'admin', password: 'password123', role: 'admin', name: 'Administrator' },
  { username: 'editor', password: 'password123', role: 'editor', name: 'Content Editor' },
  { username: 'viewer', password: 'password123', role: 'viewer', name: 'Regular Viewer' }
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
