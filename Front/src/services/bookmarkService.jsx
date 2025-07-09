import { sendDataUTS, getDataUTS, deleteDataUTS } from '../utils/apiuts';
import { jwtStorage } from '../utils/jwt_storage';

// NOTE: The backend for bookmarks has not been implemented.
// This service will not work until the corresponding Flask endpoints are created.

const API_BASE_URL = "http://127.0.0.1:5000";

export const bookmarkService = {
  /*
  async addBookmark(ebookId) {
    try {
      const token = await jwtStorage.retrieveToken();
      if (!token) throw new Error("No authentication token found.");

      const headers = { 'Authorization': `Bearer ${token}` };

      const response = await sendDataUTS(
        `${API_BASE_URL}/api/bookmarks`,
        { ebook_id: ebookId },
        true, // isJson = true
        headers
      );

      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error) {
      console.error("Failed to add bookmark:", error);
      throw error;
    }
  },

  async removeBookmark(ebookId) {
    try {
      const token = await jwtStorage.retrieveToken();
      if (!token) throw new Error("No authentication token found.");

      const headers = { 'Authorization': `Bearer ${token}` };

      const response = await deleteDataUTS( // Using deleteDataUTS
        `${API_BASE_URL}/api/bookmarks/${ebookId}`, // Assuming endpoint for delete by ID
        null, // No body needed for DELETE by ID
        headers
      );

      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
      throw error;
    }
  },

  async getBookmarks() {
    try {
      const token = await jwtStorage.retrieveToken();
      if (!token) throw new Error("No authentication token found.");

      const headers = { 'Authorization': `Bearer ${token}` };

      const response = await getDataUTS(
        `${API_BASE_URL}/api/bookmarks`,
        headers
      );

      if (response.error) {
        throw new Error(response.error);
      }
      return response.data; // Assuming data is in .data property
    } catch (error) {
      console.error("Failed to get bookmarks:", error);
      throw error;
    }
  },
  */
};