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
    <Link to={`/booking/${hotel._id}`} className="group block">
      <div className="card overflow-hidden">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <FaStar className="text-amber-400 text-xs" />
            <span className="text-sm font-semibold text-gray-800">{hotel.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
            {hotel.name}
          </h3>
          <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
            <FaMapMarkerAlt className="text-blue-500 text-xs" />
            {hotel.location}, Mumbai
          </p>
          <p className="text-gray-400 text-xs line-clamp-2 mb-3 leading-relaxed">
            {hotel.description}
          </p>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1 mb-3">
            {hotel.amenities?.slice(0, 3).map((a, i) => (
              <span key={i} className="badge bg-blue-50 text-blue-600 text-[11px]">
                {a}
              </span>
            ))}
            {hotel.amenities?.length > 3 && (
              <span className="badge bg-gray-50 text-gray-400 text-[11px]">
                +{hotel.amenities.length - 3}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <span className="text-lg font-bold text-gray-900">{formatPrice(hotel.price)}</span>
              <span className="text-gray-400 text-sm ml-0.5">/ night</span>
            </div>
            <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
              View details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
