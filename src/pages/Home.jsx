import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaShieldAlt, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import API from '../api';
import HotelCard from '../components/HotelCard';

const AREAS = ['Colaba', 'Bandra', 'Juhu', 'Andheri', 'Powai', 'Lower Parel', 'Navi Mumbai', 'Dadar'];

const Home = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/hotels');
        if (Array.isArray(data)) {
          setFeaturedHotels(data.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&q=80"
            alt="Mumbai Skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950/70 via-dark-950/60 to-dark-950" />
        </div>

        {/* Floating blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-blue-300 mb-6 animate-fade-in">
            <FaMapMarkerAlt /> Mumbai's #1 Hotel Booking Platform
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl mb-6 animate-slide-up">
            Find Your Perfect
            <span className="block gradient-text">Stay in Mumbai</span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            From luxury suites in Colaba to backpacker hostels in Andheri — discover 25+ handpicked hotels with instant booking and secure payments.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/hotels"
              className="btn-glow px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold text-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-xl shadow-blue-500/25 flex items-center gap-2"
            >
              Browse Hotels <HiArrowRight />
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 glass rounded-xl text-white font-semibold text-lg hover:bg-slate-700/50 transition-all flex items-center gap-2"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '25+', label: 'Mumbai Hotels' },
            { number: '₹1,000', label: 'Starting Price' },
            { number: '4.5★', label: 'Avg Rating' },
            { number: '100%', label: 'Secure Payments' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display font-bold text-3xl gradient-text">{stat.number}</div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Areas */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">Explore Mumbai Areas</h2>
          <p className="text-slate-400 max-w-lg mx-auto">Browse hotels by popular neighborhoods across the city</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {AREAS.map((area) => (
            <Link
              key={area}
              to={`/hotels?location=${area}`}
              className="glass p-5 rounded-xl text-center hover:bg-slate-700/50 transition-all group"
            >
              <FaMapMarkerAlt className="text-blue-400 text-xl mx-auto mb-2 group-hover:scale-125 transition-transform" />
              <span className="font-medium text-white text-sm">{area}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">Featured Hotels</h2>
            <p className="text-slate-400">Top-rated stays handpicked for you</p>
          </div>
          <Link to="/hotels" className="hidden sm:flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors">
            View all <HiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden glass">
                <div className="h-52 skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 skeleton rounded" />
                  <div className="h-4 w-1/2 skeleton rounded" />
                  <div className="h-4 w-full skeleton rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        )}

        <div className="sm:hidden mt-8 text-center">
          <Link to="/hotels" className="inline-flex items-center gap-2 text-blue-400 font-medium">
            View all hotels <HiArrowRight />
          </Link>
        </div>
      </section>

      {/* Why Quickstay */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">Why Quickstay?</h2>
          <p className="text-slate-400 max-w-lg mx-auto">Book with confidence — here's what sets us apart</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <FaSearch className="text-2xl" />, title: 'Easy Search', desc: 'Filter by area, price, and rating to find your ideal Mumbai hotel.' },
            { icon: <FaCreditCard className="text-2xl" />, title: 'Secure Payments', desc: 'Pay safely with Razorpay — UPI, cards, and net banking accepted.' },
            { icon: <FaShieldAlt className="text-2xl" />, title: 'Verified Hotels', desc: 'Every hotel is handpicked and verified for quality and hygiene.' },
          ].map((feature, i) => (
            <div key={i} className="glass p-8 rounded-2xl text-center group hover:bg-slate-700/30 transition-all">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-lg text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
