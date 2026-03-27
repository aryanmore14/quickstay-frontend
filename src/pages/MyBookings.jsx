import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaTimesCircle, FaCheckCircle, FaClock, FaHotel } from 'react-icons/fa';
import { motion } from 'framer-motion';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80';
const handleImgError = (e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; };

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    (async () => {
      try { const { data } = await API.get('/bookings/my'); if (Array.isArray(data)) setBookings(data); }
      catch { toast.error('Failed to load bookings'); }
      finally { setLoading(false); }
    })();
  }, [user, navigate]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      const { data } = await API.put(`/bookings/${id}/cancel`);
      setBookings(bookings.map(b => b._id === id ? data : b));
      toast.success('Booking cancelled');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const status = { confirmed: { icon: <FaCheckCircle />, text: 'Confirmed', cls: 'bg-emerald-50 text-emerald-600' }, pending: { icon: <FaClock />, text: 'Pending', cls: 'bg-amber-50 text-amber-600' }, cancelled: { icon: <FaTimesCircle />, text: 'Cancelled', cls: 'bg-red-50 text-red-500' } };

  if (loading) return <div className="pt-20 min-h-screen max-w-4xl mx-auto px-4 py-8"><div className="h-8 w-48 skeleton mb-6" />{[...Array(3)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl mb-4" />)}</div>;

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-2xl mb-1" style={{color:'var(--text-primary)'}}>My Bookings</h1>
          <p className="text-sm mb-6" style={{color:'var(--text-muted)'}}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>
        </motion.div>

        {bookings.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-static p-12 text-center">
            <div className="text-5xl mb-4">🏨</div>
            <h3 className="font-semibold text-lg mb-1" style={{color:'var(--text-primary)'}}>No bookings yet</h3>
            <p className="text-sm mb-4" style={{color:'var(--text-muted)'}}>Find your perfect stay in Mumbai</p>
            <Link to="/hotels" className="btn-primary inline-block">Browse Hotels</Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {bookings.map((bk, i) => {
              const s = status[bk.status] || status.pending;
              return (
                <motion.div key={bk._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-static overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-40 h-32 sm:h-auto shrink-0"><img src={bk.hotel?.image || FALLBACK_IMG} alt={bk.hotel?.name} className="w-full h-full object-cover" loading="lazy" onError={handleImgError} /></div>
                    <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1" style={{color:'var(--text-primary)'}}>{bk.hotel?.name || 'Deleted Hotel'}</h3>
                        <p className="text-xs flex items-center gap-1 mb-2" style={{color:'var(--text-muted)'}}><FaMapMarkerAlt className="text-blue-500" style={{fontSize:'10px'}} /> {bk.hotel?.location || 'Unknown'}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{color:'var(--text-secondary)'}}>
                          <span className="flex items-center gap-1"><FaCalendarAlt className="text-blue-400" /> {formatDate(bk.checkIn)} → {formatDate(bk.checkOut)}</span>
                          <span>{bk.guests} guest{bk.guests > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                        <span className="font-bold" style={{color:'var(--text-primary)'}}>{formatPrice(bk.totalPrice)}</span>
                        <span className={`badge text-xs ${s.cls} flex items-center gap-1`}>{s.icon} {s.text}</span>
                        {bk.status !== 'cancelled' && <button onClick={() => handleCancel(bk._id)} className="text-xs text-red-500 hover:text-red-600 font-medium hover:bg-red-50 px-2 py-1 rounded-lg transition-all">Cancel</button>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
