import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaTimesCircle, FaCheckCircle, FaClock, FaHotel } from 'react-icons/fa';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetch = async () => {
      try {
        const { data } = await API.get('/bookings/my');
        if (Array.isArray(data)) setBookings(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user, navigate]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      const { data } = await API.put(`/bookings/${bookingId}/cancel`);
      setBookings(bookings.map(b => b._id === bookingId ? data : b));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const statusConfig = {
    confirmed: { icon: <FaCheckCircle />, text: 'Confirmed', cls: 'bg-emerald-50 text-emerald-600' },
    pending: { icon: <FaClock />, text: 'Pending', cls: 'bg-amber-50 text-amber-600' },
    cancelled: { icon: <FaTimesCircle />, text: 'Cancelled', cls: 'bg-red-50 text-red-500' },
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen max-w-4xl mx-auto px-4 py-8">
        <div className="h-8 w-48 skeleton mb-6" />
        {[...Array(3)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl mb-4" />)}
      </div>
    );
  }

  return (
    <div className="page-enter pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-display font-bold text-2xl text-gray-900 mb-1">My Bookings</h1>
        <p className="text-gray-500 text-sm mb-6">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>

        {bookings.length === 0 ? (
          <div className="card-static p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaHotel className="text-gray-300 text-2xl" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No bookings yet</h3>
            <p className="text-gray-400 text-sm mb-4">Find your perfect stay in Mumbai</p>
            <Link to="/hotels" className="btn-primary inline-block">Browse Hotels</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((bk) => {
              const status = statusConfig[bk.status] || statusConfig.pending;
              return (
                <div key={bk._id} className="card-static overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-40 h-32 sm:h-auto shrink-0">
                      <img src={bk.hotel?.image} alt={bk.hotel?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">{bk.hotel?.name}</h3>
                        <p className="text-gray-400 text-xs flex items-center gap-1 mb-2">
                          <FaMapMarkerAlt className="text-blue-500" style={{fontSize: '10px'}} /> {bk.hotel?.location}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><FaCalendarAlt className="text-blue-400" /> {formatDate(bk.checkIn)} → {formatDate(bk.checkOut)}</span>
                          <span>{bk.guests} guest{bk.guests > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                        <span className="font-bold text-gray-900">{formatPrice(bk.totalPrice)}</span>
                        <span className={`badge text-xs ${status.cls} flex items-center gap-1`}>
                          {status.icon} {status.text}
                        </span>
                        {bk.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancel(bk._id)}
                            className="text-xs text-red-500 hover:text-red-600 font-medium hover:bg-red-50 px-2 py-1 rounded-lg transition-all"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
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
