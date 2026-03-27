import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaStar, FaMapMarkerAlt, FaShieldAlt, FaHeadset, FaCreditCard, FaClock, FaUsers, FaFire, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import API from '../api';
import HotelCard from '../components/HotelCard';
import { useAuth } from '../context/AuthContext';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80';
const handleImgError = (e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; };

const AREAS = [
  { name: 'Colaba', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80' },
  { name: 'Juhu', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' },
  { name: 'Bandra', img: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=400&q=80' },
  { name: 'Andheri', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80' },
  { name: 'Nariman Point', img: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400&q=80' },
  { name: 'Powai', img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80' },
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [dealHotels, setDealHotels] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data } = await API.get('/hotels');
        if (Array.isArray(data)) {
          setFeaturedHotels(data.slice(0, 6));
          setDealHotels(data.filter(h => h.discount > 0).slice(0, 4));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();

    // Recently viewed from localStorage
    try {
      const recent = JSON.parse(localStorage.getItem('recentHotels') || '[]');
      setRecentlyViewed(recent.slice(0, 4));
    } catch (e) {}
  }, []);

  // Fetch recommendations for logged-in users
  useEffect(() => {
    if (user) {
      API.get('/recommend').then(res => {
        if (Array.isArray(res.data)) setRecommended(res.data.slice(0, 4));
      }).catch(() => {});
    }
  }, [user]);

  // Auto-suggestions
  useEffect(() => {
    if (searchQuery.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const { data } = await API.get(`/recommend/search?q=${encodeURIComponent(searchQuery)}`);
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (e) { setSuggestions([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/hotels?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80" alt="Luxury hotel" className="w-full h-full object-cover" onError={handleImgError} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div className="max-w-2xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">🏨 Mumbai's #1 Hotel Platform</span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4">
              Find Your Perfect<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Stay in Mumbai</span>
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-lg">Discover 25+ handpicked hotels — from luxury palaces to cozy budget stays.</p>

            {/* Smart Search */}
            <div ref={searchRef} className="relative max-w-lg">
              <form onSubmit={handleSearch} className="flex bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="flex items-center flex-1 px-4">
                  <FaSearch className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search hotels, areas..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full py-4 text-gray-700 outline-none text-sm"
                  />
                </div>
                <button type="submit" className="btn-primary !rounded-none !rounded-r-2xl px-6 !shadow-none">Search</button>
              </form>

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                >
                  {suggestions.map((s) => (
                    <Link
                      key={s._id}
                      to={`/booking/${s._id}`}
                      onClick={() => setShowSuggestions(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <img src={s.image || FALLBACK_IMG} alt="" className="w-12 h-9 rounded-lg object-cover" onError={handleImgError} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.location} · {formatPrice(s.price)}/night</p>
                      </div>
                      <FaStar className="text-amber-400 text-xs" />
                      <span className="text-xs font-medium text-gray-600">{s.rating}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-8">
              {[{ num: '25+', label: 'Hotels' }, { num: '13', label: 'Areas' }, { num: '₹1K-15K', label: 'Price Range' }].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                  <div className="text-white font-bold text-xl">{stat.num}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Deal of the Day */}
        {dealHotels.length > 0 && (
          <section className="py-14">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center"><FaFire className="text-red-500" /></div>
              <div>
                <h2 className="font-display font-bold text-2xl" style={{color: 'var(--text-primary)'}}>Deal of the Day</h2>
                <p className="text-sm" style={{color: 'var(--text-muted)'}}>Limited time offers — book before they're gone!</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {dealHotels.map((hotel, i) => (
                <HotelCard key={hotel._id} hotel={hotel} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Explore Areas */}
        <section className="py-14">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2" style={{color: 'var(--text-primary)'}}>Explore Mumbai Areas</h2>
            <p style={{color: 'var(--text-muted)'}}>Popular neighborhoods with the best hotels</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {AREAS.map((area, i) => (
              <motion.div key={area.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/hotels?location=${area.name}`} className="group relative aspect-[3/4] rounded-2xl overflow-hidden block">
                  <img src={area.img} alt={area.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={handleImgError} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3"><h3 className="text-white font-semibold text-sm">{area.name}</h3></div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recommended for You */}
        {user && recommended.length > 0 && (
          <section className="py-14">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display font-bold text-2xl" style={{color: 'var(--text-primary)'}}>✨ Recommended for You</h2>
                <p className="text-sm" style={{color: 'var(--text-muted)'}}>Based on your booking history</p>
              </div>
              <Link to="/hotels" className="btn-outline text-sm hidden sm:inline-flex items-center gap-1">View all <FaChevronRight className="text-xs" /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommended.map((hotel, i) => <HotelCard key={hotel._id} hotel={hotel} index={i} />)}
            </div>
          </section>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section className="py-14">
            <h2 className="font-display font-bold text-2xl mb-6" style={{color: 'var(--text-primary)'}}>
              <FaClock className="inline text-blue-500 mr-2" />Recently Viewed
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyViewed.map((h) => (
                <Link key={h._id} to={`/booking/${h._id}`} className="card overflow-hidden group">
                  <div className="aspect-[3/2] overflow-hidden">
                    <img src={h.image || FALLBACK_IMG} alt={h.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" onError={handleImgError} />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate" style={{color: 'var(--text-primary)'}}>{h.name}</p>
                    <p className="text-xs" style={{color: 'var(--text-muted)'}}>{h.location} · {formatPrice(h.price)}/night</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Top Rated */}
        <section className="py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl" style={{color: 'var(--text-primary)'}}>Top Rated Hotels</h2>
              <p className="text-sm" style={{color: 'var(--text-muted)'}}>Handpicked for an exceptional experience</p>
            </div>
            <Link to="/hotels" className="btn-outline hidden sm:inline-flex items-center gap-1 text-sm">View all →</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="rounded-2xl overflow-hidden" style={{border: '1px solid var(--border)'}}><div className="aspect-[4/3] skeleton" /><div className="p-4 space-y-3"><div className="h-5 w-3/4 skeleton" /><div className="h-4 w-1/2 skeleton" /></div></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredHotels.map((hotel, i) => <HotelCard key={hotel._id} hotel={hotel} index={i} />)}
            </div>
          )}
        </section>

        {/* Trust Elements */}
        <section className="py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { icon: <FaShieldAlt />, title: 'Secure Payment', desc: 'Razorpay protected checkout', color: 'bg-blue-50 text-blue-600' },
              { icon: <FaHeadset />, title: '24/7 Support', desc: 'Round-the-clock assistance', color: 'bg-green-50 text-green-600' },
              { icon: <FaCreditCard />, title: 'Best Prices', desc: 'Guaranteed lowest rates', color: 'bg-purple-50 text-purple-600' },
              { icon: <FaUsers />, title: '10,000+ Guests', desc: 'Trusted by travelers', color: 'bg-amber-50 text-amber-600' },
            ].map((feat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="card-static p-5 text-center group hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 ${feat.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>{feat.icon}</div>
                  <h3 className="font-semibold mb-1" style={{color: 'var(--text-primary)'}}>{feat.title}</h3>
                  <p className="text-sm" style={{color: 'var(--text-muted)'}}>{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
