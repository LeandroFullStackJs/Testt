import React, { useState } from 'react';
import { Star } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface ReviewFormProps {
  onSubmit: (review: {
    rating: number;
    comment: string;
  }) => void;
  isLoading?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isLoading }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Calificación
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                size={24}
                className={`${
                  star <= rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comentario
        </label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        disabled={rating === 0}
      >
        Enviar Reseña
      </Button>
    </form>
  );
};

export default ReviewForm; 