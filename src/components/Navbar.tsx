import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

return (
  //shadow-[0px_4px_10px_#a8a9ab]
    <nav className="bg-[#D1D2D4] sticky top-0 z-50" style={{ boxShadow: '0px 4px 10px #a8a9ab' }}> 
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between text-xs font-bold uppercase tracking-widest">
        
        <Link to="/" className="text-xl font-black text-[#616657] tracking-tighter">
          AUCTION.X
        </Link>

        <div className="flex items-center gap-8">
          {user && (
            <Link to="/" className="text-[#909483] hover:text-[#B25C40] transition-colors">Marketplace</Link>
          )}
          
          {user ? (
            <>
              <Link to="/profile" className="text-[#909483] hover:text-[#B25C40] transition-colors">Profile</Link>
              
              {user.role === 'seller' && (
                <Link to="/dashboard" className="text-[#B25C40] hover:text-[#C19386] transition-colors">Seller Panel</Link>
              )}
              
              <button 
                onClick={() => { logout(); navigate('/login'); }} 
                className="text-[#616657] hover:text-[#B25C40] transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-[#909483] hover:text-[#616657] transition-colors">Log In</Link>
           
              <Link to="/register" className="bg-[#D1D2D4] text-[#B25C40] px-4 py-2 rounded-xl transition-all shadow-[3px_3px_6px_#a8a9ab,-3px_-3px_6px_#fafffd] hover:shadow-[1px_1px_3px_#a8a9ab,-1px_-1px_3px_#fafffd]">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );

};

export default Navbar;