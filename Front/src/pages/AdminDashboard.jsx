import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import EbookCard from '../components/EbookCard';
import { getEbooks } from '../services/ebookService';
import ErrorMessage from '../components/ErrorMessage';
import { Plus } from 'lucide-react';
import AddEbookModal from '../components/AddEbookModal';
import EditEbookModal from '../components/EditEbookModal';
import DeleteEbookModal from '../components/DeleteEbookModal';

const AdminDashboard = () => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState(null);

  const fetchEbooks = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedEbooks = await getEbooks();
      setEbooks(fetchedEbooks || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan tak terduga.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEbooks();
  }, [fetchEbooks]);

  const handleEbookChange = () => {
    fetchEbooks();
  };

  const handleEditClick = (ebook) => {
    setSelectedEbook(ebook);
    setShowEditModal(true);
  };

  const handleDeleteClick = (ebook) => {
    setSelectedEbook(ebook);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-light">Admin Dashboard</h1>
            <p className="text-gray-300 mt-1">Kelola daftar E-book di sini.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-medium text-white px-4 py-2 rounded-lg font-medium hover:bg-green-dark transition-all flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah E-book Baru</span>
          </button>
        </div>

        <div className="mb-8">
            {loading && <p className="text-center text-gray-300">Memuat e-book...</p>}
            {error && <ErrorMessage message={error} />}
            {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {ebooks.map(ebook => (
                  <EbookCard
                    key={ebook.id}
                    ebook={ebook}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    isAdminView={true}
                  />
                ))}
            </div>
            )}
            {!loading && !error && ebooks.length === 0 && (
                <p className="text-center text-gray-400">Belum ada e-book.</p>
            )}
        </div>

        {/* Add Ebook Modal */}
        <AddEbookModal
          showModal={showAddModal}
          setShowModal={setShowAddModal}
          onEbookAdded={handleEbookChange}
          darkMode={true}
        />

        {/* Edit Ebook Modal */}
        {showEditModal && selectedEbook && (
          <EditEbookModal
            showModal={showEditModal}
            setShowModal={setShowEditModal}
            ebook={selectedEbook}
            onEbookUpdated={handleEbookChange}
            darkMode={true}
          />
        )}

        {/* Delete Ebook Modal */}
        {showDeleteModal && selectedEbook && (
          <DeleteEbookModal
            showModal={showDeleteModal}
            setShowModal={setShowDeleteModal}
            ebook={selectedEbook}
            onEbookDeleted={handleEbookChange}
            darkMode={true}
            setError={setError}
          />
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;