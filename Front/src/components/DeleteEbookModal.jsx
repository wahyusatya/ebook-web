import React, { useState } from 'react';
import { deleteEbook } from '../services/ebookService'; // Import the new service function

const DeleteEbookModal = ({
    showModal,
    setShowModal,
    ebook,
    loading,
    onEbookDeleted, // Changed from getPlaylists
    setError
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [showDoubleConfirmation, setShowDoubleConfirmation] = useState(false);

    if (!showModal || !ebook) return null;

    const ebookId = ebook.id;

    const handleDeleteClick = () => {
        setShowDoubleConfirmation(true);
    };

    const cancelDoubleConfirmation = () => {
        setShowDoubleConfirmation(false);
    };

    const onDelete = async () => {
        if (!ebookId) {
            console.error('No valid ID found in ebook object:', ebook);
            setError && setError('Ebook ID is missing.');
            return;
        }

        setSubmitting(true);
        setError && setError('');
        setShowDoubleConfirmation(false); // Close double confirmation

        try {
            console.log('Attempting to delete ebook with ID:', ebookId);

            await deleteEbook(ebookId); // Use the deleteEbook service function

            console.log('Ebook deleted successfully');
            onEbookDeleted && onEbookDeleted(); // Call the callback to refresh ebook list
            setShowModal(false);
        } catch (err) {
            console.error('Delete error:', err);
            setError && setError(err.message || 'Failed to delete ebook');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {/* Modal Delete Pertama */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className={`w-full max-w-sm rounded-xl p-6 shadow-lg bg-gray-900 text-white border border-green-dark/50`}>
                    <div className="text-center">
                        {/* Icon Warning */}
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 mb-4">
                            <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 0 00-1-1h-4a1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        
                        <h2 className="text-xl font-bold text-green-light mb-4">Delete Ebook</h2>

                        <p className="mb-6 text-sm text-gray-300">
                            Are you sure you want to delete <span className="font-semibold text-red-400">
                                "{ebook.title || 'this ebook'}"
                            </span>?
                        </p>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className={'flex-1 px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-white transition-colors'}
                                disabled={submitting || loading}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteClick}
                                className={"flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 hover:shadow-[0_0_20px_3px_rgba(239,68,68,0.5)] transition-all disabled:opacity-50"}
                                disabled={submitting || loading}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* TAMBAHAN: Modal Double Confirmation */}
            {showDoubleConfirmation && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className={`w-full max-w-sm rounded-xl p-6 shadow-lg border-2 border-red-500 bg-gray-900 text-white`}>
                        <div className="text-center">
                            {/* Icon Warning Lebih Mencolok */}
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-600 mb-4">
                                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            
                            <h3 className="text-lg font-bold text-red-500 mb-2">⚠️ Final Warning</h3>
                            
                            <p className="mb-4 text-sm text-gray-300">
                                This action <span className="font-bold text-red-500">CANNOT BE UNDONE</span>!
                            </p>
                            
                            <p className="mb-6 text-sm text-gray-300">
                                Ebook <span className="font-semibold text-green-light">
                                    "{ebook.title}"
                                </span> will be permanently deleted.
                            </p>

                            <div className="flex space-x-3">
                                <button
                                    onClick={cancelDoubleConfirmation}
                                    className={`flex-1 px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-white transition-colors`}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={onDelete}
                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 hover:shadow-[0_0_20px_3px_rgba(239,68,68,0.5)] transition-all disabled:opacity-50"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteEbookModal;