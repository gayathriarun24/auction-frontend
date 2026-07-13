import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { BidLog } from '../types';
const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [biddingLogs, setBiddingLogs] = useState<BidLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyHistory = async () => {
      try {
        const res = await api.get('/bids/user/history');
        setBiddingLogs(res.data);
      } catch (err) {
        console.error('Failed fetching history.', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyHistory();
  }, []);

 
  if (!user) return (
  <div className="min-h-screen flex items-center justify-center bg-[#D1D2D4]">
    {/* <div 
      className="p-12 rounded-[30px] text-sm text-[#909483] font-bold"
      style={{
        backgroundColor: '#D1D2D4',
        boxShadow: '8px 8px 16px #a8a9ab, -8px -8px 16px #fafffd'
      }}
    >
      Please sign in to view your profile.
    </div> */}
  </div>
);

  return (
  <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 bg-[#D1D2D4] min-h-screen">

    {/* Profile Header Card */}
    <div 
      className="p-8 rounded-[30px] flex flex-col md:flex-row md:items-center justify-between gap-4"
      style={{
        backgroundColor: '#D1D2D4',
        boxShadow: '15px 15px 30px #a8a9ab, -15px -15px 30px #fafffd'
      }}
    >
      <div>
        <h1 className="text-2xl font-black text-[#616657]">{user.name}</h1>
        <p className="text-sm text-[#909483] mt-1">{user.email} • {user.contactInfo}</p>
      </div>
      <span className="px-6 py-2 bg-[#D1D2D4] text-[#B25C40] rounded-full font-black uppercase text-[10px] tracking-widest"
            style={{ boxShadow: 'inset 3px 3px 6px #a8a9ab, inset -3px -3px 6px #fafffd' }}>
        {user.role} Account
      </span>
    </div>

    {/* History Logging Module */}
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-[#616657]">Auction History</h2>
        <p className="text-sm text-[#909483]">A personal ledger of your auction interactions.</p>
      </div>

      {loading ? (
        <p className="text-xs text-[#909483]">Loading history...</p>
      ) : biddingLogs.length === 0 ? (
        <div className="text-center py-12 rounded-[30px] text-sm text-[#909483] bg-[#D1D2D4]"
             style={{ boxShadow: 'inset 8px 8px 16px #a8a9ab, inset -8px -8px 16px #fafffd' }}>
          No active auction activity.
        </div>
      ) : (
        <div className="space-y-6">
          {biddingLogs.map((log) => {
            const product = typeof log.productId === 'object' && log.productId !== null ? log.productId : null;
            const isWinner = product?.status === 'completed' && product?.winnerId === user?._id;
            return (
              <div key={log._id} 
                   className="p-6 rounded-[20px] flex justify-between items-center gap-4"
                   style={{
                     backgroundColor: '#D1D2D4',
                     boxShadow: '8px 8px 16px #a8a9ab, -8px -8px 16px #fafffd'
                   }}
              >
                <div>
                  <h4 className="font-bold text-[#616657] text-sm">{product ? product.title : 'Auction Item'}</h4>
                  {isWinner ? (
                    <span className="block mt-1 text-[10px] text-[#B25C40] font-black uppercase tracking-widest">
                      🎉 You Won This Auction!
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#909483] uppercase font-bold tracking-widest block mt-1">
                      {product?.auctionType || 'Traditional'} • {new Date(log.bidTime).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-[#909483] font-bold uppercase">Your Bid</span>
                  <span className="text-[#B25C40] font-black text-sm">${log.bidAmount.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

};

export default UserProfile;