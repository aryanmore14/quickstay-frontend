import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const HotelCard = ({ hotel }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/hotels/${hotel._id}`} className="hotel-card block rounded-2xl overflow-hidden glass group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-500/90 backdrop-blur-sm text-dark-900 px-2.5 py-1 rounded-full text-xs font-bold">
          <FaStar className="text-[10px]" />
          {hotel.rating}
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 bg-dark-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg">
          <span className="text-lg font-bold text-blue-400">{formatPrice(hotel.price)}</span>
          <span className="text-slate-400 text-xs"> / night</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-1">
          {hotel.name}
        </h3>
        <div className="flex items-center gap-1 mt-1.5 text-slate-400 text-sm">
          <FaMapMarkerAlt className="text-blue-400 text-xs" />
          {hotel.location}, Mumbai
        </div>
        <p className="text-slate-500 text-sm mt-2 line-clamp-2">{hotel.description}</p>
      </div>
    </Link>
  );
};

export default HotelCard;
