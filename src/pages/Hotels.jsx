import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaFilter, FaSearch, FaSortAmountDown, FaStar, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api';
import HotelCard from '../components/HotelCard';

const LOCATIONS = ['All','Colaba','Nariman Point','Juhu','Bandra','Andheri','Powai','Lower Parel','Dadar','Fort','Mumbai Central','Vile Parle','Navi Mumbai','Madh Island'];
const SORT_OPTIONS = [{value:'rating',label:'Top Rated'},{value:'price_low',label:'Price: Low → High'},{value:'price_high',label:'Price: High → Low'},{value:'name',label:'Name (A-Z)'}];
const AMENITIES_LIST = ['Free WiFi','Pool','Spa','Restaurant','Bar','Gym','Beach Access','Airport Shuttle','Room Service','AC'];

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allHotels, setAllHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 16000]);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedLocation !== 'All') params.set('location', selectedLocation);
        if (searchQuery) params.set('search', searchQuery);
        if (sortBy) params.set('sort', sortBy);
        const { data } = await API.get(`/hotels?${params.toString()}`);
        if (Array.isArray(data)) { setAllHotels(data); setFilteredHotels(data); }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchHotels();
  }, [selectedLocation, sortBy]);

  // Client-side filters
  useEffect(() => {
    let result = allHotels;
    if (priceRange[1] < 16000) result = result.filter(h => h.price >= priceRange[0] && h.price <= priceRange[1]);
    if (minRating > 0) result = result.filter(h => h.rating >= minRating);
    if (selectedAmenities.length > 0) result = result.filter(h => selectedAmenities.every(a => h.amenities?.includes(a)));
    setFilteredHotels(result);
  }, [allHotels, priceRange, minRating, selectedAmenities]);

  const handleLocationChange = (l) => {
    setSelectedLocation(l);
    setSearchParams(l !== 'All' ? {location: l} : {});
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const fetch = async () => {
      setLoading(true);
      try {
        const p = new URLSearchParams();
        if (selectedLocation !== 'All') p.set('location', selectedLocation);
        if (searchQuery) p.set('search', searchQuery);
        p.set('sort', sortBy);
        const { data } = await API.get(`/hotels?${p.toString()}`);
        if (Array.isArray(data)) { setAllHotels(data); }
      } catch (err) {} finally { setLoading(false); }
    };
    fetch();
  };

  const toggleAmenity = (a) => {
    setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const clearFilters = () => { setPriceRange([0,16000]); setMinRating(0); setSelectedAmenities([]); setSelectedLocation('All'); setSearchQuery(''); setSearchParams({}); };

  const activeFilterCount = (priceRange[1] < 16000 ? 1 : 0) + (minRating > 0 ? 1 : 0) + selectedAmenities.length + (selectedLocation !== 'All' ? 1 : 0);

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display font-bold text-2xl sm:text-3xl mb-1" style={{color:'var(--text-primary)'}}>Hotels in Mumbai</h1>
          <p className="text-sm" style={{color:'var(--text-muted)'}}>
            {loading ? 'Loading...' : `${filteredHotels.length} hotels found`}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </motion.div>

        {/* Search & Sort Bar */}
        <div className="card-static p-3 mb-6 flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex flex-1 items-center rounded-xl px-4" style={{background:'var(--bg-secondary)'}}>
            <FaSearch className="mr-2 text-sm" style={{color:'var(--text-muted)'}} />
            <input type="text" placeholder="Search by name, area..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 py-2.5 bg-transparent outline-none text-sm" style={{color:'var(--text-primary)'}} />
            <button type="submit" className="text-blue-600 font-medium text-sm">Search</button>
          </form>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl px-3" style={{background:'var(--bg-secondary)'}}>
              <FaSortAmountDown className="mr-2 text-sm" style={{color:'var(--text-muted)'}} />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="py-2.5 bg-transparent outline-none text-sm pr-2" style={{color:'var(--text-primary)'}}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium relative" style={{background:'var(--bg-secondary)', color:'var(--text-secondary)'}}>
              <FaFilter className="text-xs" /> Filters
              {activeFilterCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center">{activeFilterCount}</span>}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Advanced Sidebar Filters */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:w-64 shrink-0`}>
            <div className="card-static p-4 sticky top-24 space-y-5 overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm" style={{color:'var(--text-primary)'}}>Filters</h3>
                {activeFilterCount > 0 && <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">Clear all</button>}
              </div>

              {/* Areas */}
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{color:'var(--text-muted)'}}>Area</h4>
                <div className="space-y-0.5 max-h-48 overflow-y-auto">
                  {LOCATIONS.map(loc => (
                    <button key={loc} onClick={() => handleLocationChange(loc)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${selectedLocation === loc ? 'font-medium text-blue-600' : ''}`}
                      style={{color: selectedLocation === loc ? undefined : 'var(--text-secondary)', background: selectedLocation === loc ? 'var(--accent-light)' : 'transparent'}}>
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Slider */}
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{color:'var(--text-muted)'}}>Price Range</h4>
                <input type="range" min="0" max="16000" step="500" value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])} className="w-full" />
                <div className="flex justify-between text-xs mt-1" style={{color:'var(--text-muted)'}}>
                  <span>₹0</span>
                  <span className="font-medium" style={{color:'var(--text-primary)'}}>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{color:'var(--text-muted)'}}>Minimum Rating</h4>
                <div className="flex flex-wrap gap-1.5">
                  {[0, 3, 3.5, 4, 4.5].map(r => (
                    <button key={r} onClick={() => setMinRating(r)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${minRating === r ? 'border-blue-500 text-blue-600' : ''}`}
                      style={{borderColor: minRating === r ? undefined : 'var(--border)', color: minRating === r ? undefined : 'var(--text-secondary)'}}>
                      {r === 0 ? 'All' : <span className="flex items-center gap-0.5"><FaStar className="text-amber-400" style={{fontSize:'9px'}} />{r}+</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenity Checkboxes */}
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{color:'var(--text-muted)'}}>Amenities</h4>
                <div className="space-y-1.5">
                  {AMENITIES_LIST.map(a => (
                    <label key={a} className="flex items-center gap-2 text-sm cursor-pointer" style={{color:'var(--text-secondary)'}}>
                      <input type="checkbox" checked={selectedAmenities.includes(a)} onChange={() => toggleAmenity(a)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      {a}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hotel Grid */}
          <div className="flex-1">
            {/* Active filters */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedLocation !== 'All' && (
                  <span className="badge text-xs flex items-center gap-1" style={{background:'var(--accent-light)', color:'var(--accent)'}}>
                    {selectedLocation} <FaTimes className="cursor-pointer" style={{fontSize:'8px'}} onClick={() => handleLocationChange('All')} />
                  </span>
                )}
                {priceRange[1] < 16000 && (
                  <span className="badge text-xs" style={{background:'var(--accent-light)', color:'var(--accent)'}}>Under {formatPrice(priceRange[1])}</span>
                )}
                {minRating > 0 && (
                  <span className="badge text-xs flex items-center gap-0.5" style={{background:'var(--accent-light)', color:'var(--accent)'}}><FaStar style={{fontSize:'9px'}} />{minRating}+</span>
                )}
                {selectedAmenities.map(a => (
                  <span key={a} className="badge text-xs flex items-center gap-1" style={{background:'var(--accent-light)', color:'var(--accent)'}}>
                    {a} <FaTimes className="cursor-pointer" style={{fontSize:'8px'}} onClick={() => toggleAmenity(a)} />
                  </span>
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => <div key={i} className="rounded-2xl overflow-hidden" style={{border:'1px solid var(--border)'}}><div className="aspect-[4/3] skeleton" /><div className="p-4 space-y-3"><div className="h-5 w-3/4 skeleton" /><div className="h-4 w-1/2 skeleton" /></div></div>)}
                </div>
              ) : filteredHotels.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-static p-12 text-center">
                  <div className="text-5xl mb-4">😕</div>
                  <h3 className="font-semibold text-lg mb-2" style={{color:'var(--text-primary)'}}>No hotels found</h3>
                  <p className="text-sm mb-4" style={{color:'var(--text-muted)'}}>Try adjusting your filters or search terms</p>
                  <button onClick={clearFilters} className="btn-primary">Clear all filters</button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredHotels.map((hotel, i) => <HotelCard key={hotel._id} hotel={hotel} index={i} />)}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
