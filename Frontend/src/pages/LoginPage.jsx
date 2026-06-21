import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      setError(err.message || 'Failed to sign in. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#080808] flex items-center justify-center relative overflow-hidden">
      {/* Background Mandala overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/mandala-ornament.png')] scale-150" />
      
      <div className="w-full max-w-md p-8 md:p-10 rounded-[2.5rem] bg-[#111] border border-white/5 shadow-2xl relative z-10 mx-4">
        <div className="text-center mb-8">
          <span className="text-cafe-brown font-mono tracking-[0.4em] uppercase text-[10px] block">
            Welcome Back
          </span>
          <h2 className="text-4xl font-bold font-[Playfair_Display] text-white mt-2">
            Sign In
          </h2>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-900/20 border border-red-900/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cafe-brown transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cafe-brown transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-cafe-brown hover:bg-white hover:text-black text-white font-bold rounded-2xl uppercase tracking-widest text-xs transition-all flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link
            to={`/signup?redirect=${encodeURIComponent(redirect)}`}
            className="text-cafe-brown hover:text-white font-semibold transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
