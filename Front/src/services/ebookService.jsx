import { getDataPrivate, getPrivateBlob, sendDataPrivate, editDataPrivateFormData, deleteDataPrivateJSON } from '../utils/api';

// Get all ebooks
export const getEbooks = async () => {
  try {
    const response = await getDataPrivate('/api/book/booklist');
    const booksFromApi = response['{+} Books'] || [];

    // Transform the data to match what the frontend components expect
    const transformedBooks = booksFromApi.map(book => ({
      id: book.book_id,
      title: book.book_title,
      author: book.book_author,
      description: book.description,
      genre: book.genre,
      cover_image: null, // EbookCard component has a fallback
    }));

    return transformedBooks;

  } catch (error) {
    console.error('Error fetching ebooks:', error);
    throw new Error('Gagal memuat daftar e-book');
  }
};

// Download an ebook file
export const downloadEbookFile = async (ebookId) => {
  try {
    const response = await getPrivateBlob(`/api/book/download/${ebookId}`);
    if (response.status && response.status !== 200) {
        throw new Error('File download failed');
    }
    return response;
  } catch (error) {
    console.error('Error downloading ebook file:', error);
    throw new Error('Gagal mengunduh file e-book');
  }
};

// Create new ebook (Admin only)
export const createEbook = async (formData) => {
  try {
    const response = await sendDataPrivate('/api/book/upload', formData);
    if (response.isExpiredJWT) {
      throw new Error('Token expired, please login again');
    }
    return response;
  } catch (error) {
    console.error('Error creating ebook:', error);
    throw new Error('Gagal membuat e-book baru');
  }
};

// Update ebook (Admin only)
export const updateEbook = async (id, formData) => {
  try {
    const response = await editDataPrivateFormData(`/api/book/update/${id}`, formData);
    if (response.isExpiredJWT) {
      throw new Error('Token expired, please login again');
    }
    return response;
  } catch (error) {
    console.error('Error updating ebook:', error);
    throw new Error('Gagal memperbarui e-book');
  }
};

// Delete ebook (Admin only)
export const deleteEbook = async (id) => {
  try {
    const response = await deleteDataPrivateJSON(`/api/book/delete/${id}`, null);
    if (response.isExpiredJWT) {
      throw new Error('Token expired, please login again');
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting ebook:', error);
    throw new Error('Gagal menghapus e-book');
  }
};