import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaFire } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TAG_STYLES = {
  'Luxury': 'tag-luxury',
  'Trending': 'tag-trending',
  'Best Value': 'tag-best-value',
  'Beach': 'tag-beach',
  'Eco-Friendly': 'tag-eco',
};

const HotelCard = ({ hotel, index = 0 }) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const saveToRecent = () => {
    try {
      const recent = JSON.parse(localStorage.getItem('recentHotels') || '[]');
      const filtered = recent.filter(h => h._id !== hotel._id);
      filtered.unshift({ _id: hotel._id, name: hotel.name, image: hotel.image, price: hotel.price, location: hotel.location, rating: hotel.rating });
      localStorage.setItem('recentHotels', JSON.stringify(filtered.slice(0, 6)));
    } catch (e) {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/booking/${hotel._id}`} className="group block" onClick={saveToRecent}>
        <div className="card overflow-hidden">
          <div className="relative overflow-hidden aspect-[4/3]">
            <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />

            {/* Rating badge */}
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
              <FaStar className="text-amber-400 text-xs" />
              <span className="text-sm font-semibold text-gray-800">{hotel.rating}</span>
            </div>

            {/* Discount badge */}
            {hotel.discount > 0 && (
              <div className="absolute top-3 left-3 discount-badge">
                {hotel.discount}% OFF
              </div>
            )}

            {/* Tags */}
            {hotel.tags?.length > 0 && (
              <div className="absolute bottom-3 left-3 flex gap-1.5">
                {hotel.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className={`badge text-[10px] ${TAG_STYLES[tag] || 'tag-default'} backdrop-blur-sm`}>
                    {tag === 'Trending' && <FaFire className="mr-0.5" />}
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors" style={{color: 'var(--text-primary)'}}>
              {hotel.name}
            </h3>
            <p className="text-sm flex items-center gap-1 mb-2" style={{color: 'var(--text-muted)'}}>
              <FaMapMarkerAlt className="text-blue-500 text-xs" />
              {hotel.location}, Mumbai
            </p>

            {/* Amenities */}
            <div className="flex flex-wrap gap-1 mb-3">
              {hotel.amenities?.slice(0, 3).map((a, i) => (
                <span key={i} className="badge text-[11px]" style={{background: 'var(--accent-light)', color: 'var(--accent)'}}>
                  {a}
                </span>
              ))}
              {hotel.amenities?.length > 3 && (
                <span className="badge text-[11px]" style={{background: 'var(--bg-secondary)', color: 'var(--text-muted)'}}>+{hotel.amenities.length - 3}</span>
              )}
            </div>

            {/* Booking count */}
            {hotel.bookingCount > 10 && (
              <p className="text-[11px] mb-2 font-medium text-rose-500 pulse-soft">
                🔥 Booked {hotel.bookingCount} times
              </p>
            )}

            {/* Price */}
            <div className="flex items-center justify-between pt-3" style={{borderTop: '1px solid var(--border)'}}>
              <div>
                {hotel.discount > 0 && hotel.originalPrice && (
                  <span className="text-xs line-through mr-1.5" style={{color: 'var(--text-muted)'}}>{formatPrice(hotel.originalPrice)}</span>
                )}
                <span className="text-lg font-bold" style={{color: 'var(--text-primary)'}}>{formatPrice(hotel.price)}</span>
                <span className="text-sm ml-0.5" style={{color: 'var(--text-muted)'}}>/ night</span>
              </div>
              <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">View →</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default HotelCard;
