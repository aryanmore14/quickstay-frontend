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
          <p className="text-slate-400 text-lg">Hotel not found.</p>
          <button onClick={() => navigate('/hotels')} className="mt-4 text-blue-400 hover:text-blue-300 font-medium">
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
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <HiArrowLeft /> Back
        </button>

        {/* Hero Image */}
        <div className="relative h-[300px] sm:h-[420px] rounded-2xl overflow-hidden mb-8">
          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">{hotel.name}</h1>
                <div className="flex items-center gap-2 mt-2 text-slate-400">
                  <FaMapMarkerAlt className="text-blue-400" />
                  {hotel.location}, Mumbai
                </div>
              </div>
              <div className="flex items-center gap-1 bg-yellow-500/90 text-dark-900 px-3 py-1.5 rounded-full text-sm font-bold shrink-0">
                <FaStar className="text-xs" /> {hotel.rating}
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed mb-8">{hotel.description}</p>

            {/* Amenities */}
            <div>
              <h2 className="font-display font-semibold text-xl text-white mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity) => {
                  const IconComponent = amenityIcons[amenity] || FaConciergeBell;
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 glass px-4 py-3 rounded-xl text-sm"
                    >
                      <IconComponent className="text-blue-400 shrink-0" />
                      <span className="text-slate-300">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-24">
              <div className="mb-6">
                <div className="text-slate-400 text-sm mb-1">Price per night</div>
                <div className="font-display font-bold text-3xl text-white">
                  {formatPrice(hotel.price)}
                  <span className="text-slate-400 text-base font-normal"> / night</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Location</span>
                  <span className="text-white">{hotel.location}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Rating</span>
                  <span className="text-yellow-400 flex items-center gap-1">
                    <FaStar className="text-xs" /> {hotel.rating} / 5
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Amenities</span>
                  <span className="text-white">{hotel.amenities.length} available</span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/25"
              >
                Book Now
              </button>

              {!user && (
                <p className="text-center text-slate-500 text-xs mt-3">
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
