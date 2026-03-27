import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaHotel, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Dynamic background slideshow
  useEffect(() => {
    const interval = setInterval(() => setBgIndex(i => (i + 1) % BG_IMAGES.length), 5000);
    return () => clearInterval(interval);
  }, []);

  // Personalized greeting
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning ☀️';
    if (hour < 18) return 'Good afternoon 🌤️';
    return 'Good evening 🌙';
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 👋');
      navigate('/');
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) { toast.error('Enter your email'); return; }
    setForgotLoading(true);
    try {
      const { data } = await (await import('../api')).default.post('/auth/forgot-password', { email: forgotEmail });
      toast.success(data.message || 'Reset link sent!');
      setShowForgot(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setForgotLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Dynamic Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {BG_IMAGES.map((img, i) => (
          <motion.img key={i} src={img} alt="" className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }} animate={{ opacity: i === bgIndex ? 1 : 0 }} transition={{ duration: 1.2 }} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-blue-900/50 to-purple-900/70" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"><FaHotel className="text-lg" /></div>
            <span className="font-display font-bold text-xl">Quickstay</span>
          </div>
          <div>
            <h2 className="font-display font-bold text-4xl leading-tight mb-4">Discover your<br />perfect stay in<br />Mumbai</h2>
            <p className="text-white/70 text-lg">25+ handpicked hotels · Verified reviews · Best prices guaranteed</p>
          </div>
          <div className="flex gap-2">
            {BG_IMAGES.map((_, i) => <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === bgIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} />)}
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12" style={{ background: 'var(--bg-primary)' }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"><FaHotel className="text-white" /></div>
              <span className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Quickstay</span>
            </div>
            <h1 className="font-display font-bold text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>{greeting}</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Log in to your Quickstay account to continue</p>
          </div>

          {/* Forgot Password Modal */}
          {showForgot && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-static p-5 mb-6">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Reset your password</h3>
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="Enter your email" className="input-field text-sm" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowForgot(false)} className="btn-outline flex-1 !py-2.5 text-sm">Cancel</button>
                  <button type="submit" disabled={forgotLoading} className="btn-primary flex-1 !py-2.5 text-sm">{forgotLoading ? 'Sending...' : 'Send Reset Link'}</button>
                </div>
              </form>
            </motion.div>
          )}

          <div className="card-static p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="input-field pl-10" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Password</label>
                  <button type="button" onClick={() => setShowForgot(true)} className="text-xs text-blue-600 hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }} />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="input-field pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">{loading ? 'Logging in...' : 'Log in'}</button>
            </form>
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>Don't have an account? <Link to="/register" className="text-blue-600 hover:underline font-medium">Sign up</Link></p>
            <div className="relative flex items-center"><div className="flex-1 h-px" style={{ background: 'var(--border)' }}></div><span className="px-3 text-xs" style={{ color: 'var(--text-muted)' }}>or</span><div className="flex-1 h-px" style={{ background: 'var(--border)' }}></div></div>
            <Link to="/hotels" className="btn-outline w-full flex items-center justify-center gap-2 text-sm">Continue as Guest <FaArrowRight className="text-xs" /></Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
