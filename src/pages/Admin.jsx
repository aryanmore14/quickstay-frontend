import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaHotel, FaCalendarCheck, FaRupeeSign, FaClock, FaCheckCircle, FaTimesCircle, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';
import { HiShieldCheck } from 'react-icons/hi';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
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
    if (!user || user.role !== 'admin') {
      toast.error('Admin access required');
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [statsRes, bookingsRes, usersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/bookings'),
        API.get('/admin/users'),
      ]);
      setStats(statsRes.data);
      if (Array.isArray(bookingsRes.data)) setBookings(bookingsRes.data);
      if (Array.isArray(usersRes.data)) setUsers(usersRes.data);
    } catch (err) {
      console.error('Admin data fetch error:', err);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHotel = async (hotelId, hotelName) => {
    if (!window.confirm(`Delete "${hotelName}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/admin/hotels/${hotelId}`);
      toast.success('Hotel deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete hotel');
    }
  };

  const statusConfig = {
    confirmed: { icon: <FaCheckCircle />, text: 'Confirmed', className: 'text-emerald-400 bg-emerald-500/10' },
    pending: { icon: <FaClock />, text: 'Pending', className: 'text-yellow-400 bg-yellow-500/10' },
    cancelled: { icon: <FaTimesCircle />, text: 'Cancelled', className: 'text-red-400 bg-red-500/10' },
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen max-w-6xl mx-auto px-4 py-8">
        <div className="h-8 w-1/3 skeleton rounded mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <HiShieldCheck className="text-white text-xl" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm">Manage your Quickstay platform</p>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: <FaHotel />, label: 'Hotels', value: stats.totalHotels, color: 'from-blue-500 to-cyan-500' },
              { icon: <FaUsers />, label: 'Users', value: stats.totalUsers, color: 'from-purple-500 to-pink-500' },
              { icon: <FaCalendarCheck />, label: 'Bookings', value: stats.totalBookings, color: 'from-emerald-500 to-teal-500' },
              { icon: <FaRupeeSign />, label: 'Revenue', value: formatPrice(stats.totalRevenue), color: 'from-amber-500 to-orange-500' },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-5 group hover:bg-slate-800/30 transition-all">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Stats Mini */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="glass rounded-xl p-4 text-center">
              <span className="text-emerald-400 font-bold text-xl">{stats.confirmedBookings}</span>
              <p className="text-slate-400 text-xs mt-1">Confirmed</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <span className="text-yellow-400 font-bold text-xl">{stats.pendingBookings}</span>
              <p className="text-slate-400 text-xs mt-1">Pending</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <span className="text-red-400 font-bold text-xl">{stats.cancelledBookings}</span>
              <p className="text-slate-400 text-xs mt-1">Cancelled</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['bookings', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center text-slate-400">No bookings yet</div>
            ) : (
              bookings.map((booking) => {
                const status = statusConfig[booking.status] || statusConfig.pending;
                return (
                  <div key={booking._id} className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="w-full sm:w-28 h-20 rounded-lg overflow-hidden shrink-0">
                      <img src={booking.hotel?.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm">{booking.hotel?.name}</div>
                      <div className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                        <FaMapMarkerAlt className="text-blue-400" style={{fontSize: '9px'}} />
                        {booking.hotel?.location}
                      </div>
                      <div className="text-slate-500 text-xs mt-1">
                        {booking.user?.name} ({booking.user?.email})
                      </div>
                      <div className="text-slate-500 text-xs mt-0.5">
                        {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)} · {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-display font-bold text-blue-400 text-sm">{formatPrice(booking.totalPrice)}</span>
                      <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
                        {status.icon} {status.text}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left p-4 text-slate-400 font-medium">Name</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Email</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Role</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 text-white">{u.name}</td>
                    <td className="p-4 text-slate-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        u.role === 'admin' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
