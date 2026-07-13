import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; 
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [contactInfo, setContactInfo] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(contactInfo)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, contactInfo, role);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#D1D2D4]">
    
    <div 
      className="max-w-md w-full p-8 rounded-[30px]"
      style={{
        backgroundColor: '#D1D2D4',
        boxShadow: '15px 15px 30px #a8a9ab, -15px -15px 30px #fafffd'
      }}
    >
      <div className="text-center mb-8">
        <span className="text-[10px] font-bold text-[#B25C40] uppercase tracking-widest">Auction.X</span>
        <h2 className="text-2xl font-black text-[#616657] tracking-tight mt-1">Register Account</h2>
      </div>

      {error && (
        <div className="bg-[#D1D2D4] border border-[#C19386] text-[#B25C40] text-xs p-3 rounded-xl mb-4 shadow-inner">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {[
          { label: 'Full Name', val: name, set: setName, type: 'text', placeholder: 'John Doe' },
          { label: 'Email Address', val: email, set: setEmail, type: 'email', placeholder: 'john@example.com' },
          { label: 'Phone Number', val: contactInfo, set: setContactInfo, type: 'text', placeholder: '9876543210' }
        ].map((field, i) => (
          <div key={i}>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#909483] mb-2 ml-1">{field.label}</label>
            <input 
              type={field.type} required value={field.val} onChange={(e) => field.set(e.target.value)}
              className="w-full bg-[#D1D2D4] rounded-xl px-4 py-3 text-xs text-[#616657] outline-none transition-all shadow-[inset_5px_5px_10px_#a8a9ab,inset_-5px_-5px_10px_#fafffd] focus:shadow-[inset_2px_2px_5px_#a8a9ab,inset_-2px_-2px_5px_#fafffd]"
              placeholder={field.placeholder}
            />
          </div>
        ))}

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#909483] mb-2 ml-1">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#D1D2D4] rounded-xl px-4 py-3 text-xs text-[#616657] outline-none transition-all shadow-[inset_5px_5px_10px_#a8a9ab,inset_-5px_-5px_10px_#fafffd] focus:shadow-[inset_2px_2px_5px_#a8a9ab,inset_-2px_-2px_5px_#fafffd] pr-10"
              placeholder="•••••••• "
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[#909483] hover:text-[#616657]">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#909483] mb-2 ml-1">Role</label>
          <div className="grid grid-cols-2 gap-4">
            {['buyer', 'seller'].map((r) => (
              <button
                key={r} type="button" onClick={() => setRole(r as 'buyer' | 'seller')}
                className={`py-3 rounded-xl text-xs font-bold transition-all ${
                  role === r 
                  ? 'bg-[#D1D2D4] text-[#B25C40] shadow-[inset_3px_3px_6px_#a8a9ab,inset_-3px_-3px_6px_#fafffd]' 
                  : 'text-[#909483] shadow-[3px_3px_6px_#a8a9ab,-3px_-3px_6px_#fafffd]'
                }`}
              >
                {r === 'buyer' ? 'Bidder' : 'Seller'}
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full bg-[#B25C40] text-white text-xs font-bold py-4 rounded-xl transition-all shadow-[5px_5px_10px_#a8a9ab,-5px_-5px_10px_#fafffd] hover:shadow-[2px_2px_5px_#a8a9ab,-2px_-2px_5px_#fafffd]"
        >
          {loading ? 'Processing...' : 'REGISTER'}
        </button>
      </form>

      <p className="text-center text-xs text-[#909483] mt-8">
        Already have an account?{' '}
        <Link to="/login" className="text-[#B25C40] hover:underline font-bold">Log in</Link>
      </p>
    </div>
  </div>
);


};

export default Register;