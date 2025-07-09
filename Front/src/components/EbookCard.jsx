import React, { useState } from 'react';
import { MoreVertical, Edit, Trash2, DownloadCloud, Loader, Book } from 'lucide-react';
import { downloadEbookFile } from '../services/ebookService';

const EbookCard = ({ ebook, onEdit, onDelete, isAdminView }) => {
  const { id, title, author, cover_image, genre } = ebook;
  const [showMenu, setShowMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation(); // Prevent other click events
    setIsDownloading(true);
    try {
      const blob = await downloadEbookFile(id);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileExtension = blob.type.split('/')[1] || 'pdf';
      link.setAttribute('download', `${title.replace(/ /g, '_')}.${fileExtension}`);
      
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Gagal mengunduh file. File tidak tersedia atau terjadi kesalahan.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative group w-full bg-gray-800 rounded-xl border border-green-dark overflow-hidden hover:shadow-lg hover:shadow-green-medium/30 transition-all duration-300">
      <div className="relative">
        {imageError || !cover_image ? (
          <div className="w-full h-64 flex items-center justify-center bg-gray-700">
            <Book className="w-24 h-24 text-green-light" />
          </div>
        ) : (
          <img
            src={cover_image}
            alt={`Cover for ${title}`}
            className="w-full h-64 object-cover"
            onError={() => setImageError(true)}
          />
        )}

        {/* Download overlay for all logged-in users */}
        <div 
          onClick={handleDownload} 
          className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
        >
          <div className="bg-green-medium/30 backdrop-blur-sm rounded-full p-3">
            {isDownloading ? (
              <Loader className="w-6 h-6 text-white animate-spin" />
            ) : (
              <DownloadCloud className="w-6 h-6 text-white" />
            )}
          </div>
        </div>

        {/* Admin-only menu for Edit/Delete */}
        {isAdminView && (
          <div className="absolute top-2 right-2">
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="bg-black/50 backdrop-blur-sm rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute top-full right-0 mt-1 w-32 bg-gray-900/90 backdrop-blur-md rounded-lg shadow-lg border border-green-dark/50 py-2 z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(ebook); setShowMenu(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-green-light hover:bg-green-dark/50 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(ebook); setShowMenu(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/20 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </button>
              </div>
            )}
          </div>
        )}

        {genre && (
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-1 text-xs font-medium bg-green-medium/80 text-white rounded-full capitalize">
              {genre}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-white line-clamp-2 mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-1">
          by {author}
        </p>
      </div>
    </div>
  );
};

export default EbookCard;