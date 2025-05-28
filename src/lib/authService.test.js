import { describe, it, expect, vi } from 'vitest';
import { login, logout } from './authService';

// Optional: Mock setTimeout to make tests run faster, though not strictly necessary.
// If tests become slow, this can be enabled. For now, we'll rely on the actual setTimeout.
// vi.useFakeTimers();

describe('authService', () => {
  describe('login', () => {
    it('should login successfully as pet_owner', async () => {
      const result = await login('petowner1', 'password123');
      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        username: 'petowner1',
        role: 'pet_owner',
        name: 'Charlie Brown'
      });
      expect(result.token).toBe('fake-jwt-token-for-petowner1');
    });

    it('should login successfully as doctor', async () => {
      const result = await login('doctor1', 'password123');
      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        username: 'doctor1',
        role: 'doctor',
        name: 'Dr. Lucy Van Pelt'
      });
      expect(result.token).toBe('fake-jwt-token-for-doctor1');
    });

    it('should login successfully as hospital_system_admin', async () => {
      const result = await login('hospitalsysadmin1', 'password123');
      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        username: 'hospitalsysadmin1',
        role: 'hospital_system_admin',
        name: 'Linus Admin'
      });
      expect(result.token).toBe('fake-jwt-token-for-hospitalsysadmin1');
    });

    it('should fail login with incorrect username', async () => {
      const result = await login('wronguser', 'password123');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid username or password');
      expect(result.user).toBeUndefined(); // Ensure no user data is returned on failure
      expect(result.token).toBeUndefined(); // Ensure no token is returned on failure
    });

    it('should fail login with incorrect password', async () => {
      // Using one of the new valid usernames to test incorrect password
      const result = await login('petowner1', 'wrongpassword'); 
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
      // Using one of the new valid usernames to test empty password
      const result = await login('doctor1', ''); 
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
