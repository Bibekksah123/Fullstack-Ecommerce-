import { StarIcon as StarFilled } from '@heroicons/react/24/solid';
import { StarIcon as StarEmpty } from '@heroicons/react/24/outline';

export const StarRating = ({
  rating = 0,
  maxStars = 5,
  count,
  size = 'w-5 h-5',
  interactive = false,
  onChange,
}) => {
  const stars = Array.from({ length: maxStars }, (_, index) => index + 1);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {stars.map((star) => {
          const isFilled = star <= rating;
          const StarComponent = isFilled ? StarFilled : StarEmpty;
          return (
            <button
              key={star}
              type={interactive ? 'button' : undefined}
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(star)}
              className={`${interactive ? 'hover:scale-110 cursor-pointer active:scale-95 transition-transform' : 'cursor-default'} ${
                isFilled ? 'text-amber-400' : 'text-gray-300 dark:text-dark-600'
              }`}
            >
              <StarComponent className={size} />
            </button>
          );
        })}
      </div>
      {count !== undefined && (
        <span className="text-xs text-dark-500 dark:text-dark-400 font-medium">
          ({count})
        </span>
      )}
    </div>
  );
};

export default StarRating;
