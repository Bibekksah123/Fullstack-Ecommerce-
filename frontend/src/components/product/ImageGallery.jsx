import { useState, useEffect } from 'react';

export const ImageGallery = ({ images = [] }) => {
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (images && images.length > 0) {
      setActiveImage(images[0]);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 dark:bg-dark-800 rounded-3xl flex items-center justify-center text-gray-400">
        No Images Available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Active viewport */}
      <div className="aspect-square rounded-3xl border border-gray-100 dark:border-dark-800 overflow-hidden bg-gray-50 dark:bg-dark-900 flex items-center justify-center group relative">
        <img
          src={activeImage || 'https://via.placeholder.com/600x600'}
          alt="Active Product View"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Thumbnails list */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1.5 no-scrollbar">
          {images.map((img, index) => {
            const isActive = img === activeImage;
            return (
              <button
                key={index}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 bg-gray-50 dark:bg-dark-900 transition-all ${isActive
                    ? 'border-primary-500 ring-2 ring-primary-500/20'
                    : 'border-transparent hover:border-gray-200 dark:hover:border-dark-700'
                  }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
