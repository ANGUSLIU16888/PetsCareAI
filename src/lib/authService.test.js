import { describe, it, expect, vi } from 'vitest';
import { login, logout } from './authService';

// Optional: Mock setTimeout to make tests run faster, though not strictly necessary.
// If tests become slow, this can be enabled. For now, we'll rely on the actual setTimeout.
// vi.useFakeTimers();

describe('authService', () => {
  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const result = await login('admin', 'password123');
      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        username: 'admin',
        role: 'admin',
        name: 'Administrator' // Assuming 'name' is part of the user object returned
      });
      expect(result.token).toBe('fake-jwt-token-for-admin');
    });

    it('should login successfully as editor', async () => {
      const result = await login('editor', 'password123');
      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        username: 'editor',
        role: 'editor',
        name: 'Content Editor'
      });
      expect(result.token).toBe('fake-jwt-token-for-editor');
    });

    it('should login successfully as viewer', async () => {
      const result = await login('viewer', 'password123');
      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        username: 'viewer',
        role: 'viewer',
        name: 'Regular Viewer'
      });
      expect(result.token).toBe('fake-jwt-token-for-viewer');
    });

    it('should fail login with incorrect username', async () => {
      const result = await login('wronguser', 'password123');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid username or password');
      expect(result.user).toBeUndefined(); // Ensure no user data is returned on failure
      expect(result.token).toBeUndefined(); // Ensure no token is returned on failure
    });

    it('should fail login with incorrect password', async () => {
      const result = await login('admin', 'wrongpassword');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid username or password');
      expect(result.user).toBeUndefined();
      expect(result.token).toBeUndefined();
    });

    it('should fail login with empty username', async () => {
      const result = await login('', 'password123');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid username or password');
    });

    it('should fail login with empty password', async () => {
      const result = await login('admin', '');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid username or password');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      // If using vi.useFakeTimers(), you might need vi.runAllTimers() here or handle it appropriately.
      const result = await logout();
      expect(result.success).toBe(true);
      expect(result.message).toBe('Logged out successfully');
    });
  });
});
