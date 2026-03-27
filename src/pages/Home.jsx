import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaMapMarkerAlt, FaShieldAlt, FaHeadset, FaCreditCard } from 'react-icons/fa';
import API from '../api';
import HotelCard from '../components/HotelCard';

const AREAS = [
  { name: 'Colaba', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80' },
  { name: 'Juhu', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' },
  { name: 'Bandra', img: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=400&q=80' },
  { name: 'Andheri', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80' },
  { name: 'Nariman Point', img: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400&q=80' },
  { name: 'Powai', img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80' },
];

const Home = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/hotels?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80"
            alt="Luxury hotel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
              🏨 Mumbai's #1 Hotel Platform
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4">
              Find Your Perfect
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Stay in Mumbai
              </span>
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-lg">
              Discover 25+ handpicked hotels across Mumbai — from luxury palaces to cozy budget stays.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex bg-white rounded-2xl shadow-xl overflow-hidden max-w-lg">
              <div className="flex items-center flex-1 px-4">
                <FaSearch className="text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search hotels, areas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 text-gray-700 outline-none text-sm"
                />
              </div>
              <button type="submit" className="btn-primary !rounded-none !rounded-r-2xl px-6">
                Search
              </button>
            </form>

            {/* Stats */}
            <div className="flex gap-8 mt-8">
              {[
                { num: '25+', label: 'Hotels' },
                { num: '13', label: 'Areas' },
                { num: '₹1K-15K', label: 'Price Range' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-white font-bold text-xl">{stat.num}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 mb-2">
            Explore Mumbai Areas
          </h2>
          <p className="text-gray-500">Popular neighborhoods with the best hotels</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {AREAS.map((area) => (
            <Link
              key={area.name}
              to={`/hotels?location=${area.name}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
            >
              <img src={area.img} alt={area.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white font-semibold text-sm">{area.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white rounded-3xl mx-4 sm:mx-6 lg:mx-auto mb-16" style={{boxShadow: '0 1px 3px rgba(0,0,0,0.04)'}}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 mb-1">
              Top Rated Hotels
            </h2>
            <p className="text-gray-500 text-sm">Handpicked for an exceptional experience</p>
          </div>
          <Link to="/hotels" className="btn-outline hidden sm:inline-flex items-center gap-1 text-sm">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
                <div className="aspect-[4/3] skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 skeleton" />
                  <div className="h-4 w-1/2 skeleton" />
                  <div className="h-4 w-full skeleton" />
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

        <div className="text-center mt-8 sm:hidden">
          <Link to="/hotels" className="btn-primary inline-block">
            View all hotels →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <FaShieldAlt />, title: 'Secure Booking', desc: 'Your payments are protected with Razorpay secure checkout' },
            { icon: <FaHeadset />, title: '24/7 Support', desc: 'Round-the-clock assistance for all your travel needs' },
            { icon: <FaCreditCard />, title: 'Best Prices', desc: 'Guaranteed best rates across all Mumbai hotels' },
          ].map((feat, i) => (
            <div key={i} className="card-static p-6 text-center group hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feat.title}</h3>
              <p className="text-gray-500 text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
