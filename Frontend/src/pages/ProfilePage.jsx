import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login?redirect=/profile');
    } else if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setUpdating(true);

    try {
      const updateData = { name, phone, address };
      if (password) {
        updateData.password = password;
      }
      await updateProfile(updateData);
      setMessage('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading || (!user && !error)) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cafe-brown border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#080808] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/mandala-ornament.png')] scale-150" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <header className="mb-12">
          <span className="text-cafe-brown font-mono tracking-[0.4em] uppercase text-xs">
            My Account
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-[Playfair_Display] text-white mt-2">
            Personal Profile
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Card */}
          <div className="p-8 rounded-[2rem] bg-[#111] border border-white/5 flex flex-col items-center text-center h-fit">
            <div className="w-24 h-24 rounded-full bg-cafe-brown/10 border border-cafe-brown/20 flex items-center justify-center mb-6">
              <span className="text-white text-3xl font-bold">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
            <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-cafe-brown/15 text-cafe-brown border border-cafe-brown/20">
              Role: {user?.role}
            </span>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2 p-8 md:p-10 rounded-[2rem] bg-[#111] border border-white/5">
            {message && (
              <div className="mb-6 p-4 rounded-2xl bg-green-950/20 border border-green-900/30 text-green-400 text-sm text-center">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-950/20 border border-red-900/30 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-black border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cafe-brown transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-black border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cafe-brown transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                  Delivery Address
                </label>
                <textarea
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl bg-black border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cafe-brown transition-colors resize-none"
                />
              </div>

              <div className="w-full h-[1px] bg-white/5 my-2" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep same"
                    className="w-full px-5 py-3.5 rounded-2xl bg-black border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cafe-brown transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Leave blank to keep same"
                    className="w-full px-5 py-3.5 rounded-2xl bg-black border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cafe-brown transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="px-8 py-4 bg-cafe-brown hover:bg-white hover:text-black text-white font-bold rounded-2xl uppercase tracking-widest text-xs transition-all flex items-center justify-center"
              >
                {updating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Update Profile'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
