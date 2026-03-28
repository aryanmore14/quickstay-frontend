import { Link } from 'react-router-dom';
import { FaHotel } from 'react-icons/fa';
import { motion } from 'framer-motion';

const NotFound = () => (
  <div className="pt-20 min-h-screen flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md"
    >
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
        <FaHotel className="text-white text-3xl" />
      </div>
      <h1 className="font-display font-bold text-6xl mb-2" style={{ color: 'var(--text-primary)' }}>404</h1>
      <h2 className="font-display font-semibold text-xl mb-3" style={{ color: 'var(--text-primary)' }}>Page not found</h2>
      <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        The page you're looking for doesn't exist or has been moved.
        <br />Let's get you back on track.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link to="/" className="btn-primary">Go Home</Link>
        <Link to="/hotels" className="btn-outline">Browse Hotels</Link>
      </div>
    </motion.div>
  </div>
);

export default NotFound;
