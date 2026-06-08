import React from 'react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  title = 'No Items Found',
  description = 'Sorry, we couldn\'t find what you are looking for. Try a different search or filter.',
  icon,
  actionLabel,
  actionPath,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-md mx-auto animate-fade-in">
      <div className="p-5 bg-primary-50 dark:bg-primary-500/10 rounded-full text-primary-500 mb-6 ring-8 ring-primary-500/5">
        {icon || (
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        )}
      </div>
      <h3 className="text-xl font-display font-bold text-dark-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-dark-500 dark:text-dark-400 mb-8 leading-relaxed">
        {description}
      </p>
      {actionPath ? (
        <Link to={actionPath} className="btn-primary">
          {actionLabel || 'Go Home'}
        </Link>
      ) : (
        onAction && (
          <button onClick={onAction} className="btn-primary">
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
