import React from 'react';

export const Skeleton = ({ className = '', variant = 'text', width, height }) => {
  const getShapeClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-2xl';
      default:
        return 'rounded-xl';
    }
  };

  return (
    <div
      className={`skeleton ${getShapeClass()} ${className}`}
      style={{
        width: width || undefined,
        height: height || (variant === 'text' ? '1rem' : undefined),
      }}
    />
  );
};

export default Skeleton;
