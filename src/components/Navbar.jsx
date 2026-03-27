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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100" style={{boxShadow: '0 1px 3px rgba(0,0,0,0.04)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-blue-200">
              <FaHotel className="text-white text-sm" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">
              Quick<span className="text-blue-600">stay</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all text-sm font-medium">
              Home
            </Link>
            <Link to="/hotels" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all text-sm font-medium">
              Hotels
            </Link>
            {user ? (
              <>
                <Link to="/my-bookings" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all text-sm font-medium">
                  My Bookings
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="px-4 py-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all text-sm font-medium">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3 ml-3 pl-3 border-l border-gray-200">
                  <span className="text-sm text-gray-500">Hi, {user.name?.split(' ')[0]}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-gray-200">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm !py-2.5 !px-5"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {isOpen ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden slide-down bg-white border-t border-gray-100">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-sm font-medium">
              Home
            </Link>
            <Link to="/hotels" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-sm font-medium">
              Hotels
            </Link>
            {user ? (
              <>
                <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-sm font-medium">
                  My Bookings
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-amber-600 hover:bg-amber-50 rounded-lg text-sm font-medium">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-sm font-medium">
                  Log in
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block text-center btn-primary mt-2">
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
