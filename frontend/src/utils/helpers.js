export const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/300?text=No+Image';
  if (imagePath.startsWith('http')) return imagePath;
  // If we have local uploads, point to backend url.
  return `${import.meta.env.VITE_API_URL || ''}/${imagePath.replace(/\\/g, '/')}`;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
