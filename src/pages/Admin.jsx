import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaHotel, FaCalendarCheck, FaRupeeSign, FaClock, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt } from 'react-icons/fa';
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

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  useEffect(() => {
    if (!user || user.role !== 'admin') { toast.error('Admin access required'); navigate('/'); return; }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [s, b, u] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/bookings'),
        API.get('/admin/users'),
      ]);
      setStats(s.data);
      if (Array.isArray(b.data)) setBookings(b.data);
      if (Array.isArray(u.data)) setUsers(u.data);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    confirmed: { icon: <FaCheckCircle />, text: 'Confirmed', cls: 'bg-emerald-50 text-emerald-600' },
    pending: { icon: <FaClock />, text: 'Pending', cls: 'bg-amber-50 text-amber-600' },
    cancelled: { icon: <FaTimesCircle />, text: 'Cancelled', cls: 'bg-red-50 text-red-500' },
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen max-w-6xl mx-auto px-4 py-8">
        <div className="h-8 w-1/3 skeleton mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
        </div>
      </div>
    );
  }

  // Build revenue bar chart data
  const maxRevenue = stats?.totalRevenue || 1;
  const barData = [
    { label: 'Confirmed', value: stats?.confirmedBookings || 0, color: 'bg-emerald-500' },
    { label: 'Pending', value: stats?.pendingBookings || 0, color: 'bg-amber-500' },
    { label: 'Cancelled', value: stats?.cancelledBookings || 0, color: 'bg-red-400' },
  ];
  const maxBar = Math.max(...barData.map(d => d.value), 1);

  return (
    <div className="page-enter pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md shadow-amber-200">
            <HiShieldCheck className="text-white text-xl" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Manage your Quickstay platform</p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: <FaHotel />, label: 'Hotels', value: stats.totalHotels, color: 'bg-blue-50 text-blue-600', shadow: 'shadow-blue-100' },
              { icon: <FaUsers />, label: 'Users', value: stats.totalUsers, color: 'bg-purple-50 text-purple-600', shadow: 'shadow-purple-100' },
              { icon: <FaCalendarCheck />, label: 'Bookings', value: stats.totalBookings, color: 'bg-emerald-50 text-emerald-600', shadow: 'shadow-emerald-100' },
              { icon: <FaRupeeSign />, label: 'Revenue', value: formatPrice(stats.totalRevenue), color: 'bg-amber-50 text-amber-600', shadow: 'shadow-amber-100' },
            ].map((stat, i) => (
              <div key={i} className="card-static p-5 group hover:shadow-lg transition-all">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div className="font-display font-bold text-2xl text-gray-900">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Chart */}
        {stats && (
          <div className="card-static p-5 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Booking Analytics</h3>
            <div className="flex items-end gap-6 h-40">
              {barData.map((bar, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <span className="text-sm font-bold text-gray-900 mb-1">{bar.value}</span>
                  <div className="w-full max-w-[60px] rounded-t-lg relative" style={{ height: `${Math.max((bar.value / maxBar) * 100, 8)}%` }}>
                    <div className={`w-full h-full ${bar.color} rounded-t-lg transition-all duration-500`} />
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
          {['bookings', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
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
              <div className="card-static p-8 text-center text-gray-400">No bookings yet</div>
            ) : (
              bookings.map((bk) => {
                const status = statusConfig[bk.status] || statusConfig.pending;
                return (
                  <div key={bk._id} className="card-static p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:shadow-md transition-shadow">
                    <div className="w-full sm:w-24 h-16 rounded-lg overflow-hidden shrink-0">
                      <img src={bk.hotel?.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm">{bk.hotel?.name}</div>
                      <div className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                        <FaMapMarkerAlt className="text-blue-400" style={{fontSize: '9px'}} /> {bk.hotel?.location}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        {bk.user?.name} · {formatDate(bk.checkIn)} → {formatDate(bk.checkOut)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-gray-900 text-sm">{formatPrice(bk.totalPrice)}</span>
                      <span className={`badge text-xs ${status.cls} flex items-center gap-1`}>
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
          <div className="card-static overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-4 text-gray-500 font-medium text-xs uppercase">Name</th>
                    <th className="text-left p-4 text-gray-500 font-medium text-xs uppercase">Email</th>
                    <th className="text-left p-4 text-gray-500 font-medium text-xs uppercase">Role</th>
                    <th className="text-left p-4 text-gray-500 font-medium text-xs uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{u.name}</td>
                      <td className="p-4 text-gray-500">{u.email}</td>
                      <td className="p-4">
                        <span className={`badge text-xs ${u.role === 'admin' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
