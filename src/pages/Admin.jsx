import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaHotel, FaCalendarCheck, FaRupeeSign, FaClock, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaPlus, FaChartBar, FaList, FaBell, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaTimes, FaSearch } from 'react-icons/fa';
import { HiShieldCheck } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [hotels, setHotels] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editHotel, setEditHotel] = useState(null);
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [newHotel, setNewHotel] = useState({ name: '', location: '', price: '', rating: '4.0', image: '', description: '', amenities: '' });

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeAgo = (d) => { const m = Math.floor((Date.now() - new Date(d)) / 60000); if (m < 60) return `${m}m ago`; if (m < 1440) return `${Math.floor(m / 60)}h ago`; return `${Math.floor(m / 1440)}d ago`; };

  useEffect(() => {
    if (!user || user.role !== 'admin') { toast.error('Admin access only'); navigate('/'); return; }
    fetchAll();
  }, [user, navigate]);

  const fetchAll = async () => {
    try {
      const [s, b, u, h, n] = await Promise.all([
        API.get('/admin/stats'), API.get('/admin/bookings'), API.get('/admin/users'),
        API.get('/admin/hotels'), API.get('/admin/notifications').catch(() => ({ data: [] })),
      ]);
      setStats(s.data);
      if (Array.isArray(b.data)) setBookings(b.data);
      if (Array.isArray(u.data)) setUsers(u.data);
      if (Array.isArray(h.data)) setHotels(h.data);
      if (Array.isArray(n.data)) setNotifications(n.data);
    } catch { toast.error('Failed to load admin data'); }
    finally { setLoading(false); }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const { data } = await API.put(`/admin/bookings/${id}/status`, { status });
      setBookings(bookings.map(b => b._id === id ? data : b));
      toast.success(`Booking ${status}`);
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const toggleHotel = async (id) => {
    try {
      const { data } = await API.patch(`/admin/hotels/${id}/toggle`);
      setHotels(hotels.map(h => h._id === id ? data : h));
      toast.success(`Hotel ${data.isActive ? 'activated' : 'deactivated'}`);
    } catch (err) { toast.error('Failed'); }
  };

  const deleteHotel = async (id) => {
    if (!window.confirm('Delete this hotel permanently?')) return;
    try {
      await API.delete(`/admin/hotels/${id}`);
      setHotels(hotels.filter(h => h._id !== id));
      toast.success('Hotel deleted');
      fetchAll();
    } catch (err) { toast.error('Failed'); }
  };

  const saveEditHotel = async () => {
    try {
      const payload = { ...editHotel };
      if (typeof payload.amenities === 'string') payload.amenities = payload.amenities.split(',').map(a => a.trim()).filter(Boolean);
      const { data } = await API.put(`/admin/hotels/${editHotel._id}`, payload);
      setHotels(hotels.map(h => h._id === data._id ? data : h));
      setEditHotel(null);
      toast.success('Hotel updated');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const addHotel = async () => {
    try {
      const payload = { ...newHotel, price: Number(newHotel.price), rating: Number(newHotel.rating), amenities: newHotel.amenities.split(',').map(a => a.trim()).filter(Boolean) };
      const { data } = await API.post('/admin/hotels', payload);
      setHotels([data, ...hotels]);
      setShowAddHotel(false);
      setNewHotel({ name: '', location: '', price: '', rating: '4.0', image: '', description: '', amenities: '' });
      toast.success('Hotel added!');
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const filteredBookings = statusFilter === 'all' ? bookings : bookings.filter(b => b.status === statusFilter);
  const statusMap = { confirmed: { icon: <FaCheckCircle />, cls: 'bg-emerald-50 text-emerald-600' }, pending: { icon: <FaClock />, cls: 'bg-amber-50 text-amber-600' }, cancelled: { icon: <FaTimesCircle />, cls: 'bg-red-50 text-red-500' } };
  const TABS = [{ id: 'overview', label: 'Overview', icon: <FaChartBar /> }, { id: 'bookings', label: 'Bookings', icon: <FaList /> }, { id: 'hotels', label: 'Hotels', icon: <FaHotel /> }, { id: 'users', label: 'Users', icon: <FaUsers /> }];

  if (loading) return <div className="pt-20 min-h-screen max-w-6xl mx-auto px-4 py-8"><div className="h-8 w-1/3 skeleton mb-8" /><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">{[...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}</div></div>;

  return (
    <div className="pt-20 min-h-screen">
      {/* Edit Hotel Modal */}
      <AnimatePresence>
        {editHotel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Edit Hotel</h2>
                <button onClick={() => setEditHotel(null)} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)]"><FaTimes style={{ color: 'var(--text-muted)' }} /></button>
              </div>
              <div className="space-y-3">
                {[{ k: 'name', l: 'Name' }, { k: 'location', l: 'Location' }, { k: 'price', l: 'Price/Night', t: 'number' }, { k: 'rating', l: 'Rating', t: 'number' }, { k: 'image', l: 'Image URL' }].map(f => (
                  <div key={f.k}><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{f.l}</label><input type={f.t || 'text'} value={editHotel[f.k] || ''} onChange={e => setEditHotel({ ...editHotel, [f.k]: e.target.value })} className="input-field text-sm" /></div>
                ))}
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Description</label><textarea value={editHotel.description || ''} onChange={e => setEditHotel({ ...editHotel, description: e.target.value })} rows={3} className="input-field text-sm resize-none" /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Amenities (comma-separated)</label><input value={Array.isArray(editHotel.amenities) ? editHotel.amenities.join(', ') : editHotel.amenities || ''} onChange={e => setEditHotel({ ...editHotel, amenities: e.target.value })} className="input-field text-sm" /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Gallery Images (comma-separated URLs)</label><input value={Array.isArray(editHotel.images) ? editHotel.images.join(', ') : ''} onChange={e => setEditHotel({ ...editHotel, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="input-field text-sm" /></div>
              </div>
              <div className="flex gap-3 mt-5"><button onClick={() => setEditHotel(null)} className="btn-outline flex-1">Cancel</button><button onClick={saveEditHotel} className="btn-primary flex-1">Save Changes</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Hotel Modal */}
      <AnimatePresence>
        {showAddHotel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Add New Hotel</h2>
                <button onClick={() => setShowAddHotel(false)} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)]"><FaTimes style={{ color: 'var(--text-muted)' }} /></button>
              </div>
              <div className="space-y-3">
                {[{ k: 'name', l: 'Hotel Name', p: 'Taj Hotel Mumbai' }, { k: 'location', l: 'Location', p: 'Colaba' }, { k: 'price', l: 'Price/Night (₹)', t: 'number', p: '5000' }, { k: 'rating', l: 'Rating', t: 'number', p: '4.0' }, { k: 'image', l: 'Image URL', p: 'https://...' }].map(f => (
                  <div key={f.k}><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{f.l}</label><input type={f.t || 'text'} value={newHotel[f.k]} onChange={e => setNewHotel({ ...newHotel, [f.k]: e.target.value })} placeholder={f.p} className="input-field text-sm" /></div>
                ))}
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Description</label><textarea value={newHotel.description} onChange={e => setNewHotel({ ...newHotel, description: e.target.value })} rows={3} placeholder="A beautiful hotel..." className="input-field text-sm resize-none" /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Amenities</label><input value={newHotel.amenities} onChange={e => setNewHotel({ ...newHotel, amenities: e.target.value })} placeholder="Free WiFi, Pool, Spa" className="input-field text-sm" /></div>
              </div>
              <div className="flex gap-3 mt-5"><button onClick={() => setShowAddHotel(false)} className="btn-outline flex-1">Cancel</button><button onClick={addHotel} className="btn-primary flex-1">Add Hotel</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/20"><HiShieldCheck className="text-white text-xl" /></div>
            <div><h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1><p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage your Quickstay platform</p></div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setShowAddHotel(true)} className="btn-primary !py-2.5 !px-4 text-sm flex items-center gap-2"><FaPlus className="text-xs" /> Add Hotel</button>
          <button onClick={() => setActiveTab('overview')} className="btn-outline !py-2.5 !px-4 text-sm flex items-center gap-2"><FaChartBar className="text-xs" /> Analytics</button>
          <button onClick={() => setActiveTab('bookings')} className="btn-outline !py-2.5 !px-4 text-sm flex items-center gap-2"><FaList className="text-xs" /> Bookings</button>
        </div>

        {/* KPI Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { icon: <FaRupeeSign />, label: 'Revenue', value: formatPrice(stats.totalRevenue), color: 'bg-amber-50 text-amber-600' },
              { icon: <FaCalendarCheck />, label: 'Bookings', value: stats.totalBookings, color: 'bg-emerald-50 text-emerald-600' },
              { icon: <FaHotel />, label: 'Hotels', value: stats.totalHotels, color: 'bg-blue-50 text-blue-600' },
              { icon: <FaUsers />, label: 'Users', value: stats.totalUsers, color: 'bg-purple-50 text-purple-600' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-static p-5 group hover:shadow-lg transition-all">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                <div className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto" style={{ background: 'var(--bg-secondary)' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'shadow-sm' : ''}`}
              style={{ background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent', color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notifications */}
            <div className="lg:col-span-1 card-static p-5">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-4" style={{ color: 'var(--text-primary)' }}><FaBell className="text-amber-500" /> Recent Activity</h3>
              {notifications.length === 0 ? <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No recent activity</p> : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {notifications.map((n, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${n.type === 'booking' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}`}>
                        {n.type === 'booking' ? <FaCalendarCheck className="text-xs" /> : <FaUsers className="text-xs" />}
                      </div>
                      <div className="flex-1 min-w-0"><p className="truncate" style={{ color: 'var(--text-secondary)' }}>{n.message}</p><p className="text-xs" style={{ color: 'var(--text-muted)' }}>{timeAgo(n.time)}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bar Chart */}
            <div className="lg:col-span-2 card-static p-5">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Booking Analytics</h3>
              {stats && (() => {
                const barData = [
                  { label: 'Confirmed', value: stats.confirmedBookings || 0, color: 'bg-emerald-500' },
                  { label: 'Pending', value: stats.pendingBookings || 0, color: 'bg-amber-500' },
                  { label: 'Cancelled', value: stats.cancelledBookings || 0, color: 'bg-red-400' },
                ];
                const maxBar = Math.max(...barData.map(d => d.value), 1);
                return (
                  <div className="flex items-end gap-8 h-40">
                    {barData.map((bar, i) => (
                      <div key={i} className="flex flex-col items-center flex-1">
                        <span className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{bar.value}</span>
                        <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max((bar.value / maxBar) * 100, 8)}%` }} transition={{ duration: 0.8, delay: i * 0.2 }} className={`w-full max-w-[60px] ${bar.color} rounded-t-lg`} />
                        <span className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{bar.label}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {['all', 'pending', 'confirmed', 'cancelled'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border capitalize ${statusFilter === s ? 'border-blue-500 text-blue-600' : ''}`}
                  style={{ borderColor: statusFilter === s ? undefined : 'var(--border)', color: statusFilter === s ? undefined : 'var(--text-secondary)' }}>
                  {s} {s !== 'all' ? `(${bookings.filter(b => b.status === s).length})` : `(${bookings.length})`}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {filteredBookings.length === 0 ? <div className="card-static p-8 text-center" style={{ color: 'var(--text-muted)' }}>No bookings found</div> :
                filteredBookings.map((bk, i) => {
                  const s = statusMap[bk.status] || statusMap.pending;
                  return (
                    <motion.div key={bk._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="card-static p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:shadow-md transition-shadow">
                      <div className="w-full sm:w-24 h-16 rounded-lg overflow-hidden shrink-0"><img src={bk.hotel?.image || FALLBACK_IMG} alt="" className="w-full h-full object-cover" loading="lazy" onError={handleImgError} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{bk.hotel?.name || 'Deleted Hotel'}</div>
                        <div className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-muted)' }}><FaMapMarkerAlt className="text-blue-400" style={{ fontSize: '9px' }} /> {bk.hotel?.location || 'Unknown'}</div>
                        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{bk.user?.name} · {formatDate(bk.checkIn)} → {formatDate(bk.checkOut)}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{formatPrice(bk.totalPrice)}</span>
                        <span className={`badge text-xs ${s.cls} flex items-center gap-1`}>{s.icon} {bk.status}</span>
                        {bk.status === 'pending' && (
                          <>
                            <button onClick={() => updateBookingStatus(bk._id, 'confirmed')} className="px-2.5 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">Confirm</button>
                            <button onClick={() => updateBookingStatus(bk._id, 'cancelled')} className="px-2.5 py-1 text-xs font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Cancel</button>
                          </>
                        )}
                        {bk.status === 'confirmed' && (
                          <button onClick={() => updateBookingStatus(bk._id, 'cancelled')} className="px-2.5 py-1 text-xs font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Cancel</button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        )}

        {/* HOTELS TAB */}
        {activeTab === 'hotels' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{hotels.length} hotels</span>
              <button onClick={() => setShowAddHotel(true)} className="btn-primary !py-2 !px-4 text-sm flex items-center gap-2"><FaPlus className="text-xs" /> Add Hotel</button>
            </div>
            <div className="space-y-3">
              {hotels.map((h, i) => (
                <motion.div key={h._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className={`card-static p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:shadow-md transition-shadow ${!h.isActive ? 'opacity-60' : ''}`}>
                  <div className="w-full sm:w-24 h-16 rounded-lg overflow-hidden shrink-0"><img src={h.image || FALLBACK_IMG} alt="" className="w-full h-full object-cover" loading="lazy" onError={handleImgError} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{h.name}</span>
                      {!h.isActive && <span className="badge text-[10px] bg-red-50 text-red-500">Inactive</span>}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{h.location} · {formatPrice(h.price)}/night · ⭐ {h.rating}</div>
                    {h.amenities?.length > 0 && <div className="text-xs mt-1 truncate" style={{ color: 'var(--text-muted)' }}>{h.amenities.join(', ')}</div>}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => setEditHotel({ ...h, amenities: h.amenities || [] })} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Edit"><FaEdit className="text-sm" /></button>
                    <button onClick={() => toggleHotel(h._id)} className="p-2 rounded-lg hover:bg-amber-50 transition-colors" title={h.isActive ? 'Deactivate' : 'Activate'}>
                      {h.isActive ? <FaToggleOn className="text-lg text-emerald-500" /> : <FaToggleOff className="text-lg text-gray-400" />}
                    </button>
                    <button onClick={() => deleteHotel(h._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors" title="Delete"><FaTrash className="text-sm" /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="card-static overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Name', 'Email', 'Role', 'Joined'].map(h => <th key={h} className="text-left p-4 font-medium text-xs uppercase" style={{ color: 'var(--text-muted)' }}>{h}</th>)}
                </tr></thead>
                <tbody>{users.map(u => (
                  <tr key={u._id} className="hover:opacity-80 transition-opacity" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="p-4 font-medium" style={{ color: 'var(--text-primary)' }}>{u.name}</td>
                    <td className="p-4" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td className="p-4"><span className={`badge text-xs ${u.role === 'admin' ? 'bg-amber-50 text-amber-600' : 'tag-default'}`}>{u.role}</span></td>
                    <td className="p-4" style={{ color: 'var(--text-muted)' }}>{formatDate(u.createdAt)}</td>
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
