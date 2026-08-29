import { useState, useEffect } from 'react';
import { Star, Search, ThumbsUp, Check, X, Trash2, Filter } from 'lucide-react';
import adminApi from '../../services/adminApi';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const FILTERS = [
  { value: 'all', label: 'All Reviews' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      const res = await adminApi.get(`/reviews?${params}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await adminApi.put(`/reviews/${id}`, { status });
      fetchReviews();
    } catch (err) {
      console.error('Failed to update review:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await adminApi.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < rating ? 'text-gold fill-gold' : 'text-gray-300'
        }`}
      />
    ));
  };

  const filteredReviews = (search
    ? reviews.filter(
        (r) =>
          r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          r.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
          r.comment?.toLowerCase().includes(search.toLowerCase())
      )
    : reviews).filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;
  const rejectedCount = reviews.filter((r) => r.status === 'rejected').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Reviews</h1>
        <div className="flex gap-4 text-sm">
          <span className="text-yellow-700">Pending: {pendingCount}</span>
          <span className="text-green-700">Approved: {approvedCount}</span>
          <span className="text-red-700">Rejected: {rejectedCount}</span>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, product, or comment..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
        >
          {FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-3 font-medium">Customer</th>
                  <th className="text-left p-3 font-medium">Product</th>
                  <th className="text-center p-3 font-medium">Rating</th>
                  <th className="text-left p-3 font-medium">Comment</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  <th className="text-center p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No reviews found
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((review) => (
                    <tr key={review._id} className="border-b last:border-0">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600">
                              {review.user?.name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{review.user?.name || 'Anonymous'}</p>
                            <p className="text-xs text-gray-500">{review.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {review.product?.thumbnail && (
                            <img src={review.product.thumbnail} alt="" className="w-6 h-6 rounded object-cover" />
                          )}
                          {review.product?.name || 'Unknown Product'}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {renderStars(review.rating || 0)}
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="text-gray-700 max-w-xs truncate">
                          {review.comment || review.title || 'No comment'}
                        </p>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${STATUS_COLORS[review.status] || 'bg-gray-100 text-gray-800'}`}
                        >
                          {review.status}
                        </span>
                        {review.isVerifiedPurchase && (
                          <span className="ml-1 text-xs text-blue-600" title="Verified purchase">
                            ✓
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-1">
                          {review.status !== 'approved' && (
                            <button
                              onClick={() => updateStatus(review._id, 'approved')}
                              disabled={updatingId === review._id}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {review.status !== 'rejected' && (
                            <button
                              onClick={() => updateStatus(review._id, 'rejected')}
                              disabled={updatingId === review._id}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteReview(review._id)}
                            className="p-1 text-gray-600 hover:text-red-700 hover:bg-gray-100 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
