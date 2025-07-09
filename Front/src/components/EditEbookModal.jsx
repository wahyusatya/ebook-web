import React, { useState, useEffect } from 'react';
import { updateEbook } from '../services/ebookService'; // Import the new service function

const EditEbookModal = ({ showModal, setShowModal, ebook, onEbookUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: 'fiction',
    file: null, // New state for the selected file
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const genres = ['fiction', 'non-fiction', 'science', 'history', 'fantasy', 'thriller', 'romance', 'others'];

  useEffect(() => {
    if (ebook) {
      setFormData({
        title: ebook.title || '',
        author: ebook.author || '',
        description: ebook.description || '',
        genre: ebook.genre || 'fiction',
        file: null, // Reset file input when ebook changes
      });
    }
  }, [ebook]);

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.author) {
      setError('Please fill in all required fields (Title, Author).');
      return;
    }

    setIsLoading(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append('book_title', formData.title);
      dataToSend.append('book_author', formData.author);
      dataToSend.append('description', formData.description);
      dataToSend.append('genre', formData.genre);
      if (formData.file) {
        dataToSend.append('file', formData.file);
      }

      await updateEbook(ebook.id, dataToSend); // Pass ebook.id and formData
      setShowModal(false);
      onEbookUpdated();
    } catch (err) {
      setError(err.message || 'Failed to update ebook. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };

  if (!showModal || !ebook) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-md bg-gray-900/90 backdrop-blur-md rounded-xl border border-green-dark/50 p-6`}>
        <h2 className={`text-2xl font-bold text-green-light mb-6`}>
          Edit Ebook
        </h2>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-300 bg-red-900/50 rounded-lg" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium text-gray-300 mb-2`}>
              Title*
            </label>
            <input
              type="text"
              required
              placeholder="Enter ebook title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg bg-gray-700/50 text-white border-green-dark backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-medium`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-300 mb-2`}>
              Author*
            </label>
            <input
              type="text"
              required
              placeholder="Enter author's name..."
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg bg-gray-700/50 text-white border-green-dark backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-medium`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-300 mb-2`}>
              Description
            </label>
            <textarea
              placeholder="Enter ebook description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg bg-gray-700/50 text-white border-green-dark backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-medium h-20 resize-none`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-300 mb-2`}>
              Ebook File (Optional)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className={`w-full px-3 py-2 rounded-lg bg-gray-700/50 text-white border-green-dark backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-medium`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-300 mb-2`}>
              Genre
            </label>
            <select
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg bg-gray-700/50 text-white border-green-dark backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-medium`}
            >
              {genres.map(genre => (
                <option key={genre} value={genre} className={`bg-gray-800 capitalize`}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 rounded-lg bg-gray-700/50 text-white hover:bg-gray-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-medium text-white px-4 py-2 rounded-lg font-medium hover:bg-green-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Update Ebook'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEbookModal;
