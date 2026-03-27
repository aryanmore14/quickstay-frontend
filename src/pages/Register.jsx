import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaHotel, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setBgIndex(i => (i + 1) % BG_IMAGES.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await register(name, email, password); toast.success('Welcome to Quickstay! 🎉'); navigate('/'); }
    catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Dynamic Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {BG_IMAGES.map((img, i) => (
          <motion.img key={i} src={img} alt="" className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }} animate={{ opacity: i === bgIndex ? 1 : 0 }} transition={{ duration: 1.2 }} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-blue-900/50 to-indigo-900/70" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"><FaHotel className="text-lg" /></div>
            <span className="font-display font-bold text-xl">Quickstay</span>
          </div>
          <div>
            <h2 className="font-display font-bold text-4xl leading-tight mb-4">Start your<br />journey with<br />Quickstay</h2>
            <p className="text-white/70 text-lg">Join 10,000+ travelers · Exclusive deals · Instant confirmations</p>
          </div>
          <div className="flex gap-2">
            {BG_IMAGES.map((_, i) => <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === bgIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} />)}
          </div>
        </div>
      </div>

      {/* Right — Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12" style={{ background: 'var(--bg-primary)' }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"><FaHotel className="text-white" /></div>
              <span className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Quickstay</span>
            </div>
            <h1 className="font-display font-bold text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>Create an account ✨</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Join Quickstay and start booking premium stays</p>
          </div>

          <div className="card-static p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }} />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }} />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} className="input-field pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">{loading ? 'Creating...' : 'Create Account'}</button>
            </form>
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Log in</Link></p>
            <div className="relative flex items-center"><div className="flex-1 h-px" style={{ background: 'var(--border)' }}></div><span className="px-3 text-xs" style={{ color: 'var(--text-muted)' }}>or</span><div className="flex-1 h-px" style={{ background: 'var(--border)' }}></div></div>
            <Link to="/hotels" className="btn-outline w-full flex items-center justify-center gap-2 text-sm">Continue as Guest <FaArrowRight className="text-xs" /></Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
