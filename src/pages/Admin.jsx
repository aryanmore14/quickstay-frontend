import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaHotel, FaCalendarCheck, FaRupeeSign, FaClock, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { HiShieldCheck } from 'react-icons/hi';
import { motion } from 'framer-motion';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80';
const handleImgError = (e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; };

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  useEffect(() => {
    if (!user || user.role !== 'admin') { toast.error('Admin access only'); navigate('/'); return; }
    (async () => {
      try {
        const [s, b, u] = await Promise.all([API.get('/admin/stats'), API.get('/admin/bookings'), API.get('/admin/users')]);
        setStats(s.data);
        if (Array.isArray(b.data)) setBookings(b.data);
        if (Array.isArray(u.data)) setUsers(u.data);
      } catch { toast.error('Failed to load admin data'); }
      finally { setLoading(false); }
    })();
  }, [user, navigate]);

  const status = { confirmed: { icon: <FaCheckCircle />, text: 'Confirmed', cls: 'bg-emerald-50 text-emerald-600' }, pending: { icon: <FaClock />, text: 'Pending', cls: 'bg-amber-50 text-amber-600' }, cancelled: { icon: <FaTimesCircle />, text: 'Cancelled', cls: 'bg-red-50 text-red-500' } };

  if (loading) return <div className="pt-20 min-h-screen max-w-6xl mx-auto px-4 py-8"><div className="h-8 w-1/3 skeleton mb-8" /><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">{[...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}</div></div>;

  const barData = [
    { label: 'Confirmed', value: stats?.confirmedBookings || 0, color: 'bg-emerald-500' },
    { label: 'Pending', value: stats?.pendingBookings || 0, color: 'bg-amber-500' },
    { label: 'Cancelled', value: stats?.cancelledBookings || 0, color: 'bg-red-400' },
  ];
  const maxBar = Math.max(...barData.map(d => d.value), 1);

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/20"><HiShieldCheck className="text-white text-xl" /></div>
          <div>
            <h1 className="font-display font-bold text-2xl" style={{color:'var(--text-primary)'}}>Admin Dashboard</h1>
            <p className="text-sm" style={{color:'var(--text-muted)'}}>Manage your Quickstay platform</p>
          </div>
        </motion.div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: <FaHotel />, label: 'Hotels', value: stats.totalHotels, color: 'bg-blue-50 text-blue-600' },
              { icon: <FaUsers />, label: 'Users', value: stats.totalUsers, color: 'bg-purple-50 text-purple-600' },
              { icon: <FaCalendarCheck />, label: 'Bookings', value: stats.totalBookings, color: 'bg-emerald-50 text-emerald-600' },
              { icon: <FaRupeeSign />, label: 'Revenue', value: formatPrice(stats.totalRevenue), color: 'bg-amber-50 text-amber-600' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-static p-5 group hover:shadow-lg transition-all">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                <div className="font-display font-bold text-2xl" style={{color:'var(--text-primary)'}}>{stat.value}</div>
                <div className="text-sm" style={{color:'var(--text-muted)'}}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        {stats && (
          <div className="card-static p-5 mb-8">
            <h3 className="font-semibold mb-4" style={{color:'var(--text-primary)'}}>Booking Analytics</h3>
            <div className="flex items-end gap-6 h-40">
              {barData.map((bar, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <span className="text-sm font-bold mb-1" style={{color:'var(--text-primary)'}}>{bar.value}</span>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max((bar.value / maxBar) * 100, 8)}%` }} transition={{ duration: 0.8, delay: i * 0.2 }} className="w-full max-w-[60px] rounded-t-lg">
                    <div className={`w-full h-full ${bar.color} rounded-t-lg`} />
                  </motion.div>
                  <span className="text-xs mt-2" style={{color:'var(--text-muted)'}}>{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-1 mb-6 p-1 w-fit rounded-xl" style={{background:'var(--bg-secondary)'}}>
          {['bookings', 'users'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? 'shadow-sm' : ''}`}
              style={{background: activeTab === tab ? 'var(--bg-card)' : 'transparent', color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)'}}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {bookings.length === 0 ? <div className="card-static p-8 text-center" style={{color:'var(--text-muted)'}}>No bookings yet</div> :
              bookings.map((bk, i) => {
                const s = status[bk.status] || status.pending;
                return (
                  <motion.div key={bk._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="card-static p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:shadow-md transition-shadow">
                    <div className="w-full sm:w-24 h-16 rounded-lg overflow-hidden shrink-0"><img src={bk.hotel?.image || FALLBACK_IMG} alt="" className="w-full h-full object-cover" loading="lazy" onError={handleImgError} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm" style={{color:'var(--text-primary)'}}>{bk.hotel?.name}</div>
                      <div className="text-xs flex items-center gap-1 mt-0.5" style={{color:'var(--text-muted)'}}><FaMapMarkerAlt className="text-blue-400" style={{fontSize:'9px'}} /> {bk.hotel?.location}</div>
                      <div className="text-xs mt-1" style={{color:'var(--text-muted)'}}>{bk.user?.name} · {formatDate(bk.checkIn)} → {formatDate(bk.checkOut)}</div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-sm" style={{color:'var(--text-primary)'}}>{formatPrice(bk.totalPrice)}</span>
                      <span className={`badge text-xs ${s.cls} flex items-center gap-1`}>{s.icon} {s.text}</span>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card-static overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr style={{borderBottom:'1px solid var(--border)'}}>
                  {['Name','Email','Role','Joined'].map(h => <th key={h} className="text-left p-4 font-medium text-xs uppercase" style={{color:'var(--text-muted)'}}>{h}</th>)}
                </tr></thead>
                <tbody>{users.map(u => (
                  <tr key={u._id} className="hover:opacity-80 transition-opacity" style={{borderBottom:'1px solid var(--border)'}}>
                    <td className="p-4 font-medium" style={{color:'var(--text-primary)'}}>{u.name}</td>
                    <td className="p-4" style={{color:'var(--text-secondary)'}}>{u.email}</td>
                    <td className="p-4"><span className={`badge text-xs ${u.role === 'admin' ? 'bg-amber-50 text-amber-600' : 'tag-default'}`}>{u.role}</span></td>
                    <td className="p-4" style={{color:'var(--text-muted)'}}>{formatDate(u.createdAt)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
