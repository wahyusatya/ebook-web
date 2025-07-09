import { EncryptStorage } from "encrypt-storage";

const SECRET_KEY = import.meta.env.VITE_REACT_APP_SECRET_KEY_STORE;
if (!SECRET_KEY) {
    throw new Error(
        "Missing SECRET_KEY environment variable. Please set it in .env",
    );
}
const storage = new EncryptStorage(SECRET_KEY);
const token_auth = "token_auth";
const user_auth = "user_auth"; // New key for user data

export const jwtStorage = {
    async storeToken(token) {
        try {
            storage.setItem(token_auth, token);
        } catch (error) {
            console.error("Error storing token:", error);
            throw error; // Re-throw error for handling
        }
    },

    async retrieveToken() {
        try {
            const token = await storage.getItem(token_auth);
            return token;
        } catch (error) {
            console.error("Error retrieving token:", error);
            return null;
        }
    },

    async removeItem() {
        try {
            storage.removeItem(token_auth);
            storage.removeItem(user_auth); // Also remove user data
        } catch (error) {
            console.error("Error removing token/user data:", error);
            // No re-throw, as removal should ideally always succeed or fail silently
        }
    },

    // New functions for user data
    async storeUser(userData) {
        try {
            storage.setItem(user_auth, userData);
        } catch (error) {
            console.error("Error storing user data:", error);
            throw error;
        }
    },

    async retrieveUser() {
        try {
            const user = await storage.getItem(user_auth);
            return user;
        } catch (error) {
            console.error("Error retrieving user data:", error);
            return null;
        }
    },
};

// Optional: Wrap in an immediately invoked function expression (IIFE)
// to avoid exposing the secret key in module scope
(function () {
    Object.freeze(jwtStorage); // Prevent further modification
})();