import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaHotel } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await login(email, password); toast.success('Welcome back!'); navigate('/'); }
    catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20"><FaHotel className="text-white text-xl" /></div>
          <h1 className="font-display font-bold text-2xl mb-1" style={{color:'var(--text-primary)'}}>Welcome back</h1>
          <p className="text-sm" style={{color:'var(--text-muted)'}}>Log in to your Quickstay account</p>
        </div>
        <div className="card-static p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium mb-1.5" style={{color:'var(--text-secondary)'}}>Email</label><div className="relative"><FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{color:'var(--text-muted)'}} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="input-field pl-10" /></div></div>
            <div><label className="block text-sm font-medium mb-1.5" style={{color:'var(--text-secondary)'}}>Password</label><div className="relative"><FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{color:'var(--text-muted)'}} /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="input-field pl-10" /></div></div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">{loading ? 'Logging in...' : 'Log in'}</button>
          </form>
        </div>
        <p className="text-center text-sm mt-4" style={{color:'var(--text-muted)'}}>Don't have an account? <Link to="/register" className="text-blue-600 hover:underline font-medium">Sign up</Link></p>
      </motion.div>
    </div>
  );
};

export default Login;
