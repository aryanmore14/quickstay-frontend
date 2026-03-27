import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHotel, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter pt-20 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <FaHotel className="text-white text-xl" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-1">Log in to your Quickstay account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1.5 block">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-1.5 block">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
