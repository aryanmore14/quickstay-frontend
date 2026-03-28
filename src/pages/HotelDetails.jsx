import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaWifi, FaSwimmingPool, FaDumbbell, FaUtensils, FaParking, FaCocktail, FaSpa, FaConciergeBell, FaShuttleVan, FaChild, FaLeaf, FaBuilding, FaUmbrellaBeach, FaLock, FaTv, FaCoffee, FaMountain } from 'react-icons/fa';
import { HiArrowLeft } from 'react-icons/hi';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const amenityIcons = {
  'Free WiFi': FaWifi,
  'Pool': FaSwimmingPool,
  'Gym': FaDumbbell,
  'Restaurant': FaUtensils,
  'Parking': FaParking,
  'Bar': FaCocktail,
  'Spa': FaSpa,
  'Room Service': FaConciergeBell,
  'Airport Shuttle': FaShuttleVan,
  'Kids Club': FaChild,
  'Kids Area': FaChild,
  'Eco-Friendly': FaLeaf,
  'Business Center': FaBuilding,
  'Beach Access': FaUmbrellaBeach,
  'Beach View': FaUmbrellaBeach,
  'Lockers': FaLock,
  'TV': FaTv,
  'AC': FaCoffee,
  'Rooftop': FaMountain,
  'Rooftop Lounge': FaMountain,
  'Sea View': FaUmbrellaBeach,
  'Valet Parking': FaParking,
  'Concierge': FaConciergeBell,
  'Butler Service': FaConciergeBell,
  'Limousine': FaShuttleVan,
  'Laundry': FaConciergeBell,
  'Travel Desk': FaBuilding,
  'Tour Desk': FaBuilding,
  'Tour Packages': FaBuilding,
  'Common Kitchen': FaUtensils,
  'Common Area': FaBuilding,
  'Lounge': FaCocktail,
  '24hr Front Desk': FaConciergeBell,
  'Banquet Hall': FaBuilding,
  'Meeting Room': FaBuilding,
  'Adventure Sports': FaUmbrellaBeach,
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80';
const handleImgError = (e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; };

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const { data } = await API.get(`/hotels/${id}`);
        setHotel(data);
      } catch (err) {
        console.error('Failed to fetch hotel:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  const handleBookNow = () => {
    if (!user) {
      navigate('/login', { state: { from: `/hotels/${id}` } });
    } else {
      navigate(`/booking/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen max-w-5xl mx-auto px-4 py-8">
        <div className="h-[400px] skeleton rounded-2xl mb-8" />
        <div className="h-8 w-1/2 skeleton rounded mb-4" />
        <div className="h-5 w-1/3 skeleton rounded mb-6" />
        <div className="h-4 w-full skeleton rounded mb-2" />
        <div className="h-4 w-3/4 skeleton rounded" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg" style={{color: 'var(--text-muted)'}}>Hotel not found.</p>
          <button onClick={() => navigate('/hotels')} className="mt-4 text-blue-600 hover:text-blue-500 font-medium">
            Browse hotels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter pt-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 transition-colors hover:text-blue-600"
          style={{color: 'var(--text-muted)'}}
        >
          <HiArrowLeft /> Back
        </button>

        {/* Hero Image */}
        <div className="relative h-[300px] sm:h-[420px] rounded-2xl overflow-hidden mb-8">
          <img src={hotel.image || FALLBACK_IMG} alt={hotel.name} className="w-full h-full object-cover" onError={handleImgError} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="font-display font-bold text-3xl sm:text-4xl" style={{color: 'var(--text-primary)'}}>{hotel.name}</h1>
                <div className="flex items-center gap-2 mt-2" style={{color: 'var(--text-muted)'}}>
                  <FaMapMarkerAlt className="text-blue-500" />
                  {hotel.location}, Mumbai
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-bold shrink-0">
                <FaStar className="text-xs text-amber-400" /> {hotel.rating}
              </div>
            </div>

            <p className="leading-relaxed mb-8" style={{color: 'var(--text-secondary)'}}>{hotel.description}</p>

            {/* Amenities */}
            <div>
              <h2 className="font-display font-semibold text-xl mb-4" style={{color: 'var(--text-primary)'}}>Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity) => {
                  const IconComponent = amenityIcons[amenity] || FaConciergeBell;
                  return (
                    <div
                      key={amenity}
                      className="card-static flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
                    >
                      <IconComponent className="text-blue-500 shrink-0" />
                      <span style={{color: 'var(--text-secondary)'}}>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="card-static rounded-2xl p-6 sticky top-24">
              <div className="mb-6">
                <div className="text-sm mb-1" style={{color: 'var(--text-muted)'}}>Price per night</div>
                <div className="font-display font-bold text-3xl" style={{color: 'var(--text-primary)'}}>
                  {formatPrice(hotel.price)}
                  <span className="text-base font-normal ml-1" style={{color: 'var(--text-muted)'}}> / night</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between" style={{color: 'var(--text-secondary)'}}>
                  <span>Location</span>
                  <span style={{color: 'var(--text-primary)'}}>{hotel.location}</span>
                </div>
                <div className="flex justify-between" style={{color: 'var(--text-secondary)'}}>
                  <span>Rating</span>
                  <span className="text-amber-500 flex items-center gap-1">
                    <FaStar className="text-xs" /> {hotel.rating} / 5
                  </span>
                </div>
                <div className="flex justify-between" style={{color: 'var(--text-secondary)'}}>
                  <span>Amenities</span>
                  <span style={{color: 'var(--text-primary)'}}>{hotel.amenities.length} available</span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="btn-primary w-full"
              >
                Book Now
              </button>

              {!user && (
                <p className="text-center text-xs mt-3" style={{color: 'var(--text-muted)'}}>
                  You'll need to log in to book
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
