import { useState, useEffect, useCallback } from "react";
import { Star, Trash2 } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { api } from "../utils/api";

interface Review {
  _id: string;
  userId: {
    _id: string;
    username: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsSectionProps {
  movieId: number;
}

const ReviewsSection = ({ movieId }: ReviewsSectionProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  // const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const data = await api.getReviews(movieId);
      setReviews(data.reviews);
      setAverageRating(parseFloat(data.averageRating) || 0);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  }, [movieId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      await api.createReview(movieId, rating, comment);
      setComment("");
      fetchReviews();
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      await api.deleteReview(movieId);
      fetchReviews();
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  const userReview = reviews.find((r) => r.userId._id === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Reviews</h2>
        {averageRating > 0 && (
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="text-lg font-semibold">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-400">({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      {user && !userReview && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-md rounded-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-gray-300 mb-2">Your Rating</label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRating(num)}
                  className={`w-10 h-10 rounded ${
                    rating >= num
                      ? "bg-yellow-400 text-black"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Your Review (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              rows={4}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your thoughts..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-400">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold">{review.userId.username}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                {user && user.id === review.userId._id && (
                  <button
                    onClick={handleDelete}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              {review.comment && (
                <p className="text-gray-300 mt-2">{review.comment}</p>
              )}
              <p className="text-gray-400 text-sm mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
