import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import EbookCard from '../components/EbookCard';
import { getEbooks } from '../services/ebookService';
// import { bookmarkService } from '../services/bookmarkService'; // NOTE: Disabled, no backend endpoint
import { authService } from '../services/authService';
import ErrorMessage from '../components/ErrorMessage';
import { Search } from 'lucide-react';

const Home = () => {
  const [user, setUser] = useState(null);
  const [ebooks, setEbooks] = useState([]);
  // const [bookmarkedEbooks, setBookmarkedEbooks] = useState([]); // NOTE: Disabled, no backend endpoint
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const fetchEbooks = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedEbooks = await getEbooks();
      setEbooks(fetchedEbooks || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan tak terduga saat memuat e-book.');
    } finally {
      setLoading(false);
    }
  }, []);

  /* NOTE: Disabled, no backend endpoint
  const fetchBookmarkedEbooks = useCallback(async () => {
    try {
      const fetchedBookmarks = await bookmarkService.getBookmarks();
      setBookmarkedEbooks(fetchedBookmarks || []);
    } catch (err) {
      console.error("Error fetching bookmarked ebooks:", err);
    }
  }, []);
  */

  useEffect(() => {
    fetchEbooks();
    // fetchBookmarkedEbooks(); // NOTE: Disabled, no backend endpoint
  }, [fetchEbooks]);

  const filteredEbooks = ebooks.filter(ebook =>
    (ebook.title && ebook.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (ebook.author && ebook.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (ebook.genre && ebook.genre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6">

        {/* Search Bar */}
        <div className="relative mb-8 max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari e-book berdasarkan judul, penulis, atau genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 text-gray-100 border border-gray-600 rounded-lg bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
          />
        </div>
        
        {/* All Ebooks Section */}
        <div className="mb-8">
            <h2 className="text-2xl font-semibold text-green-400 mb-4 text-center">Semua E-book</h2>
            {loading && <p className="text-center text-gray-300">Memuat e-book...</p>}
            {error && <ErrorMessage message={error} />}
            {!loading && !error && filteredEbooks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredEbooks.map(ebook => (
                <EbookCard key={ebook.id} ebook={ebook} />
                ))}
            </div>
            )}
            {!loading && !error && filteredEbooks.length === 0 && (
                <p className="text-center text-gray-400">Tidak ada e-book yang ditemukan.</p>
            )}
        </div>

        {/* Bookmarked Ebooks Section - NOTE: Disabled, no backend endpoint */}
        {/* 
        {bookmarkedEbooks.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-green-400 mb-4 text-center">E-book yang Disimpan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {bookmarkedEbooks.map(ebook => (
                <EbookCard key={ebook.id} ebook={ebook} />
              ))}
            </div>
          </div>
        )}
        */}

      </main>
    </div>
  );
};

export default Home;