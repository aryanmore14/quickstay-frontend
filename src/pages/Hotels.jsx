import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaFilter } from 'react-icons/fa';
import API from '../api';
import HotelCard from '../components/HotelCard';

const LOCATIONS = [
  'All',
  'Colaba',
  'Nariman Point',
  'Juhu',
  'Bandra',
  'Andheri',
  'Powai',
  'Lower Parel',
  'Dadar',
  'Fort',
  'Mumbai Central',
  'Vile Parle',
  'Navi Mumbai',
  'Madh Island',
];

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const params = selectedLocation !== 'All' ? `?location=${selectedLocation}` : '';
        const { data } = await API.get(`/hotels${params}`);
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
  }, [selectedLocation]);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    if (location === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ location });
    }
  };

  return (
    <div className="page-enter pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">
            Hotels in Mumbai
          </h1>
          <p className="text-slate-400">
            {loading ? 'Loading...' : `${hotels.length} hotels found`}
            {selectedLocation !== 'All' && ` in ${selectedLocation}`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 glass rounded-xl text-white font-medium"
          >
            <FaFilter className="text-blue-400" /> Filter by Area
          </button>

          {/* Sidebar Filters */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:w-64 shrink-0`}>
            <div className="glass rounded-2xl p-5 sticky top-24">
              <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-400" /> Mumbai Areas
              </h3>
              <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleLocationChange(loc)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedLocation === loc
                        ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
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
            ) : hotels.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400 text-lg">No hotels found in {selectedLocation}.</p>
                <button
                  onClick={() => handleLocationChange('All')}
                  className="mt-4 text-blue-400 hover:text-blue-300 font-medium"
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
