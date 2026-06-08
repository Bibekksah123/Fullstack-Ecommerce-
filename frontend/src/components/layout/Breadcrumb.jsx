import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs sm:text-sm font-medium" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-dark-500 hover:text-primary-500 dark:text-dark-400 dark:hover:text-primary-400 transition-colors"
          >
            <HomeIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              <ChevronRightIcon className="w-4.5 h-4.5 text-gray-300 dark:text-dark-600 flex-shrink-0 mx-1" />
              {isLast || !item.path ? (
                <span className="text-dark-900 dark:text-white font-semibold truncate max-w-[120px] sm:max-w-[200px]">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-dark-500 hover:text-primary-500 dark:text-dark-400 dark:hover:text-primary-400 transition-colors truncate max-w-[120px] sm:max-w-[200px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
