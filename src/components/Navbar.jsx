import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { FaHotel } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaHotel className="text-white text-sm" />
            </div>
            <span className="font-display font-bold text-xl text-white">
              Quick<span className="text-blue-400">stay</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Home
            </Link>
            <Link to="/hotels" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Hotels
            </Link>
            {user ? (
              <>
                <Link to="/my-bookings" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                  My Bookings
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3 ml-2">
                  <span className="text-sm text-slate-400">Hi, {user.name?.split(' ')[0]}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/25"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-300 hover:text-white transition-colors"
          >
            {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass animate-slide-down border-t border-slate-700/50">
          <div className="px-4 py-4 space-y-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block text-slate-300 hover:text-white py-2">
              Home
            </Link>
            <Link to="/hotels" onClick={() => setIsOpen(false)} className="block text-slate-300 hover:text-white py-2">
              Hotels
            </Link>
            {user ? (
              <>
                <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="block text-slate-300 hover:text-white py-2">
                  My Bookings
                </Link>
                <button onClick={handleLogout} className="w-full text-left text-red-400 hover:text-red-300 py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block text-slate-300 hover:text-white py-2">
                  Log in
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block text-center text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg py-2">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
