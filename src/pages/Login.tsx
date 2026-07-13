import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#D1D2D4]">
   
    <div 
      className="max-w-md w-full p-8 rounded-[30px]"
      style={{
        backgroundColor: '#D1D2D4',
        boxShadow: '15px 15px 30px #a8a9ab, -15px -15px 30px #fafffd'
      }}
    >
      <div className="text-center mb-8">
        <span className="text-[10px] font-bold text-[#B25C40] uppercase tracking-widest">Secure Gateway</span>
        <h2 className="text-2xl font-black text-[#616657] tracking-tight mt-1">Trading Floor Login</h2>
      </div>

      {error && (
        <div className="bg-[#D1D2D4] border border-[#C19386] text-[#B25C40] text-xs p-3 rounded-xl mb-4 shadow-inner">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#909483] mb-2 ml-1">Email Address</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#D1D2D4] rounded-xl px-4 py-3 text-xs text-[#616657] outline-none transition-all shadow-[inset_5px_5px_10px_#a8a9ab,inset_-5px_-5px_10px_#fafffd] focus:shadow-[inset_2px_2px_5px_#a8a9ab,inset_-2px_-2px_5px_#fafffd]"
            placeholder="name@domain.com"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#909483] mb-2 ml-1">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#D1D2D4] rounded-xl px-4 py-3 text-xs text-[#616657] outline-none transition-all shadow-[inset_5px_5px_10px_#a8a9ab,inset_-5px_-5px_10px_#fafffd] focus:shadow-[inset_2px_2px_5px_#a8a9ab,inset_-2px_-2px_5px_#fafffd] pr-10"
              placeholder="••••••••"
            />
            <button 
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-[#909483] hover:text-[#616657]"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#B25C40] hover:bg-[#C19386] text-white text-xs font-bold py-4 rounded-xl transition-all shadow-[5px_5px_10px_#a8a9ab,-5px_-5px_10px_#fafffd] hover:shadow-[2px_2px_5px_#a8a9ab,-2px_-2px_5px_#fafffd]"
        >
          {loading ? 'Verifying...' : 'Log In'}
        </button>
      </form>

      <p className="text-center text-xs text-[#909483] mt-8">
        New to the exchange?{' '}
        <Link to="/register" className="text-[#B25C40] hover:underline font-bold">Click here to Register</Link>
      </p>
    </div>
  </div>
);


};


export default Login;