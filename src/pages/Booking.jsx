import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaWifi, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaUser, FaCheckCircle } from 'react-icons/fa';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Booking = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [booking, setBooking] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelRes, reviewsRes] = await Promise.all([
          API.get(`/hotels/${id}`),
          API.get(`/reviews/${id}`),
        ]);
        setHotel(hotelRes.data);
        if (Array.isArray(reviewsRes.data)) setReviews(reviewsRes.data);
      } catch (err) {
        toast.error('Hotel not found');
        navigate('/hotels');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const allImages = hotel ? [hotel.image, ...(hotel.images || [])] : [];

  const calcNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = calcNights();
  const totalPrice = nights * (hotel?.price || 0);

  const handleBooking = async () => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    if (!checkIn || !checkOut) { toast.error('Select dates'); return; }
    if (nights <= 0) { toast.error('Check-out must be after check-in'); return; }

    setBooking(true);
    try {
      await API.post('/bookings', { hotel: id, checkIn, checkOut, guests, totalPrice });
      toast.success('Booking confirmed!');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    if (!reviewText.trim()) { toast.error('Write a comment'); return; }
    setSubmittingReview(true);
    try {
      const { data } = await API.post('/reviews', { hotel: id, rating: reviewRating, comment: reviewText });
      setReviews([data, ...reviews]);
      setReviewText('');
      setReviewRating(5);
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen max-w-6xl mx-auto px-4 py-8">
        <div className="aspect-[2/1] skeleton rounded-2xl mb-6" />
        <div className="h-8 w-1/2 skeleton mb-4" />
        <div className="h-5 w-1/3 skeleton mb-4" />
        <div className="h-32 skeleton rounded-2xl" />
      </div>
    );
  }

  if (!hotel) return null;

  return (
    <div className="page-enter pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="relative rounded-2xl overflow-hidden mb-8 bg-gray-100">
          <div className="aspect-[2.2/1] sm:aspect-[2.5/1]">
            <img
              src={allImages[currentImg]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          </div>

          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImg((p) => (p === 0 ? allImages.length - 1 : p - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
              >
                <FaChevronLeft className="text-gray-700 text-sm" />
              </button>
              <button
                onClick={() => setCurrentImg((p) => (p === allImages.length - 1 ? 0 : p + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
              >
                <FaChevronRight className="text-gray-700 text-sm" />
              </button>

              {/* Thumbnail dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? 'bg-white w-5' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="flex gap-2 mt-3">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === currentImg ? 'border-blue-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-80'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 mb-2">{hotel.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-gray-500">
                  <FaMapMarkerAlt className="text-blue-500" /> {hotel.location}, Mumbai
                </span>
                <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-medium">
                  <FaStar className="text-amber-400" /> {hotel.rating}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-500">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="card-static p-5">
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div className="card-static p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {hotel.amenities?.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 py-1.5">
                    <FaCheckCircle className="text-green-500 text-xs" /> {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="card-static p-5">
              <h3 className="font-semibold text-gray-900 mb-4">
                Guest Reviews ({reviews.length})
              </h3>

              {/* Review Form */}
              {user && (
                <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-sm text-gray-600 mr-2">Your rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-lg"
                      >
                        <FaStar className={star <= reviewRating ? 'text-amber-400' : 'text-gray-300'} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience..."
                    rows={3}
                    className="input-field resize-none text-sm mb-3"
                  />
                  <button type="submit" disabled={submittingReview} className="btn-primary text-sm !py-2.5">
                    {submittingReview ? 'Posting...' : 'Post Review'}
                  </button>
                </form>
              )}

              {/* Review List */}
              {reviews.length === 0 ? (
                <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">
                        {review.user?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 text-sm">{review.user?.name}</span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`text-xs ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm">{review.comment}</p>
                        <span className="text-gray-400 text-xs mt-1 block">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <div className="card-static p-5 sticky top-24">
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-2xl font-bold text-gray-900">{formatPrice(hotel.price)}</span>
                <span className="text-gray-400 text-sm">/ night</span>
              </div>

              <div className="space-y-3 mb-5">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    <FaCalendarAlt className="inline mr-1" /> Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    <FaCalendarAlt className="inline mr-1" /> Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    <FaUser className="inline mr-1" /> Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="input-field text-sm"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {nights > 0 && (
                <div className="space-y-2 mb-5 p-3 bg-gray-50 rounded-xl text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>{formatPrice(hotel.price)} × {nights} night{nights > 1 ? 's' : ''}</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={booking || nights <= 0}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {booking ? 'Booking...' : nights > 0 ? `Book Now - ${formatPrice(totalPrice)}` : 'Select dates to book'}
              </button>

              {!user && (
                <p className="text-center text-gray-400 text-xs mt-3">
                  <a href="/login" className="text-blue-600 hover:underline">Login</a> to make a booking
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
