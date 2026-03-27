import { FaHotel, FaHeart, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-dark-950/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FaHotel className="text-white text-sm" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Quick<span className="text-blue-400">stay</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Discover the best hotels across Mumbai — from luxury stays in Colaba to budget-friendly options in Andheri. Book with confidence using secure Razorpay payments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/hotels" className="text-slate-400 hover:text-blue-400 transition-colors">Browse Hotels</Link></li>
              <li><Link to="/my-bookings" className="text-slate-400 hover:text-blue-400 transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          {/* Mumbai Areas */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Popular Areas</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-slate-400">Colaba</li>
              <li className="text-slate-400">Bandra</li>
              <li className="text-slate-400">Juhu</li>
              <li className="text-slate-400">Andheri</li>
              <li className="text-slate-400">Powai</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 Quickstay. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Made with <FaHeart className="text-red-500 text-xs" /> in Mumbai
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
