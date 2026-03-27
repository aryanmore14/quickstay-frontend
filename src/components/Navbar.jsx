import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMenu, HiOutlineX, HiMoon, HiSun } from 'react-icons/hi';
import { FaHotel } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setIsOpen(false); };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}
      style={{ backgroundColor: 'var(--nav-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-blue-500/20">
              <FaHotel className="text-white text-sm" />
            </div>
            <span className="font-display font-bold text-xl" style={{color: 'var(--text-primary)'}}>
              Quick<span className="text-blue-600">stay</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {[{to:'/', label:'Home'}, {to:'/hotels', label:'Hotels'}].map(l => (
              <Link key={l.to} to={l.to} className="px-4 py-2 rounded-lg transition-all text-sm font-medium hover:bg-[var(--bg-secondary)]" style={{color: 'var(--text-secondary)'}}>{l.label}</Link>
            ))}
            {user && (
              <>
                <Link to="/my-bookings" className="px-4 py-2 rounded-lg transition-all text-sm font-medium hover:bg-[var(--bg-secondary)]" style={{color: 'var(--text-secondary)'}}>My Bookings</Link>
                {user.role === 'admin' && <Link to="/admin" className="px-4 py-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all text-sm font-medium">Admin</Link>}
              </>
            )}

            {/* Dark Mode Toggle */}
            <button onClick={() => setDark(!dark)} className="ml-2 w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-[var(--bg-secondary)]" style={{color: 'var(--text-secondary)'}} title={dark ? 'Light mode' : 'Dark mode'}>
              {dark ? <HiSun size={18} /> : <HiMoon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3 ml-2 pl-3" style={{borderLeft: '1px solid var(--border)'}}>
                <span className="text-sm" style={{color: 'var(--text-muted)'}}>Hi, {user.name?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-all">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2 pl-3" style={{borderLeft: '1px solid var(--border)'}}>
                <Link to="/login" className="px-4 py-2 text-sm font-medium rounded-lg transition-all hover:bg-[var(--bg-secondary)]" style={{color: 'var(--text-secondary)'}}>Log in</Link>
                <Link to="/register" className="btn-primary text-sm !py-2.5 !px-5">Sign up</Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setDark(!dark)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{color: 'var(--text-secondary)'}}>
              {dark ? <HiSun size={18} /> : <HiMoon size={18} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg transition-colors" style={{color: 'var(--text-secondary)'}}>
              {isOpen ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" style={{backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)'}}>
          <div className="px-4 py-3 space-y-1">
            {[{to:'/', l:'Home'}, {to:'/hotels', l:'Hotels'}].map(x => (
              <Link key={x.to} to={x.to} onClick={() => setIsOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium" style={{color:'var(--text-secondary)'}}>{x.l}</Link>
            ))}
            {user ? (
              <>
                <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium" style={{color:'var(--text-secondary)'}}>My Bookings</Link>
                {user.role === 'admin' && <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-amber-500 rounded-lg text-sm font-medium">Admin Dashboard</Link>}
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-red-500 rounded-lg text-sm font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium" style={{color:'var(--text-secondary)'}}>Log in</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block text-center btn-primary mt-2">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
