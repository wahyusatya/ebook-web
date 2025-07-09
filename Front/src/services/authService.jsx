import { sendDataUTS, getDataUTS } from '../utils/apiuts'; // Assuming apiuts provides these
import { jwtStorage } from '../utils/jwt_storage';



export const authService = {
  async login(email, password) {
    try {
      const response = await sendDataUTS(
        `/api/auth/login`,
        { email, password },
        true // isJson = true
      );

      if (response.error) { // Assuming API returns { error: "message" } on failure
        throw new Error(response.error);
      }
      if (response.message) { // Check for specific messages from backend
        if (response.message === 'Invalid credentials!') {
          throw new Error('Invalid email or password.');
        }
      }
      if (response.isExpiredJWT) { // This will be set by api.jsx for 401s
        throw new Error("Email or Password is Invalid!");
      }

      // Assuming response contains { token: "...", user: { id, username, email, role } }
      const { token, user } = response;
      if (token && user) {
        await jwtStorage.storeToken(token);
        await jwtStorage.storeUser(user);
        
        // Determine redirection path based on user role
        if (user.role === 'admin') {
          return '/admin';
        } else {
          return '/';
        }

      } else {
        throw new Error("Invalid login response: missing token or user data.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  async signup(username, email, password) {
    try {
      const response = await sendDataUTS(
        `/api/auth/register`,
        { email, password, username }, // Ensure username is sent if backend expects it
        true // isJson = true
      );

      if (response.error) {
        throw new Error(response.error);
      }

      // Backend returns {'message': 'User registered successfully!'}
      if (response.message === 'User registered successfully!') {
        // Registration successful, but no token/user returned.
        // User needs to log in separately.
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || "Unknown signup response.");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  },

  async logout() {
    try {
      await jwtStorage.removeItem(); // Clears both token and user data
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      return await jwtStorage.retrieveUser();
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  },

  async isAuthenticated() {
    try {
      const token = await jwtStorage.retrieveToken();
      return !!token; // Returns true if token exists, false otherwise
    } catch (error) {
      console.error("Failed to check authentication status:", error);
      return false;
    }
  },

  async isAdmin() {
    try {
      const user = await jwtStorage.retrieveUser();
      // Assuming 'admin' is the role for administrators
      return user && user.role === 'admin';
    } catch (error) {
      console.error("Failed to check admin status:", error);
      return false;
    }
  },
};