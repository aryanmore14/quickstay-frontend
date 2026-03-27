import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaFilter, FaSearch, FaSortAmountDown } from 'react-icons/fa';
import API from '../api';
import HotelCard from '../components/HotelCard';

const LOCATIONS = [
  'All', 'Colaba', 'Nariman Point', 'Juhu', 'Bandra', 'Andheri',
  'Powai', 'Lower Parel', 'Dadar', 'Fort', 'Mumbai Central', 'Vile Parle', 'Navi Mumbai', 'Madh Island',
];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name (A-Z)' },
];

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedLocation !== 'All') params.set('location', selectedLocation);
        if (searchQuery) params.set('search', searchQuery);
        if (sortBy) params.set('sort', sortBy);

        const queryStr = params.toString() ? `?${params.toString()}` : '';
        const { data } = await API.get(`/hotels${queryStr}`);
        if (Array.isArray(data)) {
          setHotels(data);
        }
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [selectedLocation, sortBy]);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    const params = {};
    if (location !== 'All') params.location = location;
    if (searchQuery) params.search = searchQuery;
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedLocation !== 'All') params.set('location', selectedLocation);
        if (searchQuery) params.set('search', searchQuery);
        if (sortBy) params.set('sort', sortBy);
        const { data } = await API.get(`/hotels?${params.toString()}`);
        if (Array.isArray(data)) setHotels(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  };

  return (
    <div className="page-enter pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 mb-1">
            Hotels in Mumbai
          </h1>
          <p className="text-gray-500 text-sm">
            {loading ? 'Loading...' : `${hotels.length} hotels found`}
            {selectedLocation !== 'All' && ` in ${selectedLocation}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Search & Sort Bar */}
        <div className="card-static p-3 mb-6 flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex flex-1 items-center bg-gray-50 rounded-xl px-4">
            <FaSearch className="text-gray-400 mr-2 text-sm" />
            <input
              type="text"
              placeholder="Search by name, area, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 py-2.5 bg-transparent outline-none text-sm text-gray-700"
            />
            <button type="submit" className="text-blue-600 font-medium text-sm hover:text-blue-700">Search</button>
          </form>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-50 rounded-xl px-3">
              <FaSortAmountDown className="text-gray-400 mr-2 text-sm" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2.5 bg-transparent outline-none text-sm text-gray-700 pr-2"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-100"
            >
              <FaFilter className="text-xs" /> Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:w-56 shrink-0`}>
            <div className="card-static p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <FaMapMarkerAlt className="text-blue-500" /> Areas
              </h3>
              <div className="space-y-0.5 max-h-[60vh] overflow-y-auto">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleLocationChange(loc)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedLocation === loc
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hotel Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
            ) : hotels.length === 0 ? (
              <div className="text-center py-20 card-static">
                <p className="text-gray-400 text-lg mb-2">No hotels found</p>
                <p className="text-gray-400 text-sm mb-4">
                  {searchQuery ? `No results for "${searchQuery}"` : `No hotels in ${selectedLocation}`}
                </p>
                <button
                  onClick={() => { handleLocationChange('All'); setSearchQuery(''); }}
                  className="btn-primary"
                >
                  Show all hotels
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel._id} hotel={hotel} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
