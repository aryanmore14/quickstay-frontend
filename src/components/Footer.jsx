import { Link } from 'react-router-dom';
import { FaHotel, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
                <FaHotel className="text-white text-xs" />
              </div>
              <span className="font-display font-bold text-lg text-gray-900">
                Quick<span className="text-blue-600">stay</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Discover the best hotels in Mumbai. Book your perfect stay at the best prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-gray-500 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/hotels" className="block text-sm text-gray-500 hover:text-blue-600 transition-colors">Hotels</Link>
              <Link to="/my-bookings" className="block text-sm text-gray-500 hover:text-blue-600 transition-colors">My Bookings</Link>
            </div>
          </div>

          {/* Areas */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Popular Areas</h4>
            <div className="space-y-2">
              {['Colaba', 'Juhu', 'Bandra', 'Andheri', 'Nariman Point'].map(area => (
                <Link key={area} to={`/hotels?location=${area}`} className="block text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  {area}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Contact</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /> Mumbai, India</p>
              <p className="flex items-center gap-2"><FaEnvelope className="text-blue-500" /> hello@quickstay.in</p>
              <p className="flex items-center gap-2"><FaPhone className="text-blue-500" /> +91 98765 43210</p>
            </div>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-8 h-8 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-400 rounded-lg flex items-center justify-center transition-all text-sm">
                <FaInstagram />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-400 rounded-lg flex items-center justify-center transition-all text-sm">
                <FaTwitter />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-400 rounded-lg flex items-center justify-center transition-all text-sm">
                <FaFacebook />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Quickstay. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
