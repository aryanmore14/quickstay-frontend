import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendar, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/my-bookings' } });
      return;
    }
    const fetchBookings = async () => {
      try {
        const { data } = await API.get('/bookings/my');
        setBookings(data);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user, navigate]);

  const statusConfig = {
    confirmed: {
      icon: <FaCheckCircle />,
      text: 'Confirmed',
      className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    pending: {
      icon: <FaClock />,
      text: 'Pending',
      className: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    },
    cancelled: {
      icon: <FaTimesCircle />,
      text: 'Cancelled',
      className: 'text-red-400 bg-red-500/10 border-red-500/20',
    },
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen max-w-4xl mx-auto px-4 py-8">
        <div className="h-8 w-1/3 skeleton rounded mb-8" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 flex gap-4">
              <div className="w-32 h-24 skeleton rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-1/2 skeleton rounded" />
                <div className="h-4 w-1/3 skeleton rounded" />
                <div className="h-4 w-1/4 skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-display font-bold text-3xl text-white mb-2">My Bookings</h1>
        <p className="text-slate-400 mb-8">
          {bookings.length === 0
            ? "You haven't made any bookings yet."
            : `You have ${bookings.length} booking${bookings.length > 1 ? 's' : ''}`}
        </p>

        {bookings.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-lg mb-4">No bookings yet</p>
            <Link
              to="/hotels"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              Browse Hotels
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const status = statusConfig[booking.status] || statusConfig.pending;
              return (
                <div key={booking._id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row gap-5 hover:bg-slate-800/30 transition-colors">
                  {/* Hotel Image */}
                  <div className="w-full sm:w-40 h-32 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={booking.hotel?.image}
                      alt={booking.hotel?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display font-semibold text-lg text-white">
                          {booking.hotel?.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 text-slate-400 text-sm">
                          <FaMapMarkerAlt className="text-blue-400 text-xs" />
                          {booking.hotel?.location}, Mumbai
                        </div>
                      </div>
                      <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${status.className}`}>
                        {status.icon} {status.text}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <FaCalendar className="text-blue-400 text-xs" />
                        {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                      </span>
                      <span>{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</span>
                    </div>

                    <div className="mt-3 font-display font-bold text-blue-400">
                      {formatPrice(booking.totalPrice)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
