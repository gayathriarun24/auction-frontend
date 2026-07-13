import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { AuctionItem, BidLog } from '../types';

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  console.log(navigate);
  const { user } = useAuth();

  const [item, setItem] = useState<AuctionItem | null>(null);
  const [bidHistory, setBidHistory] = useState<BidLog[]>([]);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchItemAndHistory = async () => {
      try {
        setLoading(true);
        const itemRes = await api.get(`/products/${id}`);
        setItem(itemRes.data);
        try {
          const historyRes = await api.get(`/bids/product/${id}`);
          setBidHistory(historyRes.data);
        } catch (historyErr) {
          console.log("History restricted or unavailable:", historyErr);
        }
      } catch (err: any) {
        console.error(err);
        setMessage({ type: 'error', text: 'Failed to load auction item details.' });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchItemAndHistory();
  }, [id]);

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to place a bid.' });
      return;
    }
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid bid amount.' });
      return;
    }
    try {
      setActionLoading(true);
      setMessage(null);
      const response = await api.post('/bids', { productId: id, bidAmount: amount });
      setMessage({ type: 'success', text: response.data.message || 'Bid placed successfully!' });
      setBidAmount('');
      const updatedItem = await api.get(`/products/${id}`);
      setItem(updatedItem.data);
      try {
        const updatedHistory = await api.get(`/bids/product/${id}`);
        setBidHistory(updatedHistory.data);
      } catch (hErr) {}
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'An error occurred.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-32 text-gray-400">Loading auction data...</div>;

  if (!item) return <div className="max-w-xl mx-auto text-center py-20 text-gray-500">Item not found.</div>;

  const sellerName = typeof item.sellerId === 'object' && item.sellerId !== null ? item.sellerId.name : 'Verified Merchant';
  const sellerRating = typeof item.sellerId === 'object' && item.sellerId !== null ? item.sellerId.sellerRating : 5.0;

  // Helper to format the closing date
const formatClosingDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: 'numeric', hour12: true
  });
};


return (
  <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#D1D2D4] min-h-screen">
    <div className="lg:col-span-7 space-y-8">
      {/* Image Area */}
      <div className="relative aspect-video rounded-[30px] overflow-hidden" 
           style={{ boxShadow: '10px 10px 20px #a8a9ab, -10px -10px 20px #fafffd' }}>
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'; }} />
        <span className="absolute top-6 left-6 bg-[#D1D2D4] px-4 py-2 text-[10px] font-black rounded-lg text-[#B25C40] uppercase tracking-widest shadow-[3px_3px_6px_#a8a9ab,-3px_-3px_6px_#fafffd]">
          {item.auctionType} Bid
        </span>
      </div>
      
      {/* Details Card */}
      <div className="p-8 rounded-[30px]" style={{ backgroundColor: '#D1D2D4', boxShadow: '10px 10px 20px #a8a9ab, -10px -10px 20px #fafffd' }}>
        <h1 className="text-2xl font-black text-[#616657] mb-2">{item.title}</h1>
        <div className="flex items-center gap-4 text-xs text-[#909483] mb-6 pb-6 border-b border-[#a8a9ab]">
          <span>Category: <strong className="text-[#616657]">{item.category}</strong></span>
          <span>•</span>
          <span className="text-[#B25C40] font-bold">Ends: {formatClosingDate(item.endTime)}</span>
          <span>Seller: <strong className="text-[#616657]">{sellerName} (⭐ {sellerRating.toFixed(1)})</strong></span>
        </div>
        <p className="text-[#616657] text-sm leading-relaxed">{item.description}</p>
      </div>
    </div>

    <div className="lg:col-span-5 space-y-8">
      {/* Trading Interface */}
      <div className="p-8 rounded-[30px]" style={{ backgroundColor: '#D1D2D4', boxShadow: '10px 10px 20px #a8a9ab, -10px -10px 20px #fafffd' }}>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#909483] mb-6">Trading Interface</h2>
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl mb-8" style={{ boxShadow: 'inset 4px 4px 8px #a8a9ab, inset -4px -4px 8px #fafffd' }}>
          <div>
            <span className="block text-[10px] uppercase font-bold text-[#909483]">Starting Floor</span>
            <span className="text-lg font-bold text-[#616657]">${item.startingPrice.toLocaleString()}</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] uppercase font-bold text-[#909483]">{item.auctionType === 'sealed' ? 'Visibility' : 'Current Value'}</span>
            <span className="text-lg font-black text-[#B25C40]">{item.auctionType === 'sealed' ? 'Encrypted' : `$${(item.currentHighestBid || item.startingPrice).toLocaleString()}`}</span>
          </div>
        </div>
        
        {message && <div className={`p-4 text-xs rounded-xl mb-6 font-bold ${message.type === 'success' ? 'text-[#B25C40]' : 'text-[#C19386]'}`}>{message.text}</div>}
        
        {item.status !== 'active' ? (
          <div className="text-center p-4 rounded-xl text-xs text-[#909483] shadow-[inset_3px_3px_6px_#a8a9ab,inset_-3px_-3px_6px_#fafffd]">Trading disabled.</div>
        ) : (
          <form onSubmit={handlePlaceBid} className="space-y-4">
            <label className="block text-[10px] font-bold text-[#909483] uppercase ml-1">Your Offer ($)</label>
            <div className="flex gap-4">
              <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="flex-1 bg-[#D1D2D4] rounded-xl px-4 py-3 text-sm text-[#616657] outline-none shadow-[inset_4px_4px_8px_#a8a9ab,inset_-4px_-4px_8px_#fafffd]" />
              <button type="submit" disabled={actionLoading} className="bg-[#B25C40] text-white font-bold text-xs px-6 rounded-xl transition-all shadow-[4px_4px_8px_#a8a9ab,-4px_-4px_8px_#fafffd] hover:shadow-[2px_2px_4px_#a8a9ab,-2px_-2px_4px_#fafffd]">{actionLoading ? '...' : 'Place Bid'}</button>
            </div>
          </form>
        )}
      </div>

      {/* History */}
      <div className="p-8 rounded-[30px]" style={{ backgroundColor: '#D1D2D4', boxShadow: '10px 10px 20px #a8a9ab, -10px -10px 20px #fafffd' }}>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#909483] mb-6">History</h3>
        {item.auctionType === 'sealed' ? (
          <p className="text-xs text-[#C19386] p-4 rounded-xl text-center shadow-[inset_3px_3px_6px_#a8a9ab,inset_-3px_-3px_6px_#fafffd]">🔒 Logs locked to public.</p>
        ) : bidHistory.length === 0 ? (
          <p className="text-xs text-[#909483] text-center py-4">No active transactions.</p>
        ) : (
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {bidHistory.map((log) => (
              <div key={log._id} className="flex items-center justify-between p-4 rounded-xl text-xs shadow-[inset_2px_2px_4px_#a8a9ab,inset_-2px_-2px_4px_#fafffd]">
                <span className="text-[#616657] font-bold">{typeof log.buyerId === 'object' ? log.buyerId.name : 'Bidder'}</span>
                <span className="font-bold text-[#B25C40]">${log.bidAmount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

};

export default ItemDetail;