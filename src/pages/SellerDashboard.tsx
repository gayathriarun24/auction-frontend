import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { AuctionItem } from '../types';

const SellerDashboard: React.FC = () => {
  const [myInventory, setMyInventory] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [auctionType, setAuctionType] = useState<'traditional' | 'reverse' | 'sealed'>('traditional');
  const [startingPrice, setStartingPrice] = useState('');
  const [endTime, setEndTime] = useState('');

  const [selectedProductBids, setSelectedProductBids] = useState<any[]>([]);

  const fetchBids = async (id: string) => {
    try {
      const res = await api.get(`/products/${id}/bids`);
      setSelectedProductBids(res.data);
      setIsBidModalOpen(true); 
    } catch (err) {
      alert("Could not load bids.");
    }
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products/seller/dashboard');
      setMyInventory(res.data);
    } catch (err) {
      setError('Could not retrieve inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleCreateAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, { title, description, image, category, auctionType, startingPrice: Number(startingPrice), endTime });
      } else {
        await api.post('/products', { title, description, image, category, auctionType, startingPrice: Number(startingPrice), endTime });
      }
      setTitle(''); setDescription(''); setImage(''); setStartingPrice(''); setEndTime(''); setEditingId(null);
      setIsAuctionModalOpen(false);
      fetchInventory();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save listing.');
    }
  };

  const handleEditClick = (item: AuctionItem) => {
    setEditingId(item._id);
    setTitle(item.title);
    setDescription(item.description);
    setImage(item.image);
    setCategory(item.category);
    setAuctionType(item.auctionType);
    setStartingPrice(item.startingPrice.toString());

    if (item.endTime) {
      const date = new Date(item.endTime);
      const formattedDate = date.toISOString().slice(0, 16);
      setEndTime(formattedDate);
    } else {
      setEndTime('');
    }
    setIsAuctionModalOpen(true);
  };

  const handleDeleteAuction = async (id: string) => {
    if (!window.confirm('Confirm deletion?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchInventory();
    } catch (err: any) {
      alert('Deletion denied.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImage('');
    setCategory('Electronics');
    setAuctionType('traditional');
    setStartingPrice('');
    setEndTime('');
    setEditingId(null);
  };

  const handleFinalizeAuction = async (id: string) => {
    if (!window.confirm('Are you sure you want to close this auction and declare a winner?')) return;
    try {
      await api.post(`/products/${id}/finalize`);
      fetchInventory();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to finalize.');
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-[#D1D2D4] min-h-screen">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-2xl font-black text-[#616657]">Seller Dashboard</h1>
          <p className="text-[#909483] text-sm mt-1">Manage your active stock and listings.</p>
        </div>
        <button
          onClick={() => { setIsAuctionModalOpen(true); resetForm(); }}
          className="text-[#B25C40] font-bold px-6 py-3 rounded-xl transition-all"
          style={{
            backgroundColor: '#D1D2D4',
            boxShadow: '6px 6px 12px #a8a9ab, -6px -6px 12px #fafffd'
          }}
        >
          + CREATE NEW AUCTION
        </button>
      </div>

      {/* Auction Modal */}

      {isAuctionModalOpen && (
        <div className="fixed inset-0 bg-[#D1D2D4]/80 flex items-center justify-center z-50 p-5">
          <div className="p-4 rounded-[30px] w-full max-w-md shadow-[20px_20px_60px_#a8a9ab,-20px_-20px_60px_#fafffd] bg-[#D1D2D4] flex flex-col max-h-[90vh]">

            <h2 className="text-lg font-bold mb-6 text-[#616657] shrink-0">
              {editingId ? 'Edit Auction' : 'Launch New Auction'}
            </h2>

            <form onSubmit={handleCreateAuction} className="space-y-4 text-xs overflow-y-auto pr-2 custom-scrollbar flex-1">

              {/* Title Field */}
              <div>
                <label className="block text-[10px] font-bold text-[#909483] uppercase ml-1 mb-1">Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#D1D2D4] rounded-xl p-3 text-[#616657] shadow-[inset_4px_4px_8px_#a8a9ab,inset_-4px_-4px_8px_#fafffd] outline-none" placeholder="Enter title" />
              </div>

              {/* Description Textarea */}
              <div>
                <label className="block text-[10px] font-bold text-[#909483] uppercase ml-1 mb-1">Description</label>
                <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                  className="w-full bg-[#D1D2D4] rounded-xl p-3 text-[#616657] shadow-[inset_4px_4px_8px_#a8a9ab,inset_-4px_-4px_8px_#fafffd] outline-none resize-none" placeholder="Enter description" />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-[10px] font-bold text-[#909483] uppercase ml-1 mb-1">Image URL</label>
                <input type="text" required value={image} onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-[#D1D2D4] rounded-xl p-3 text-[#616657] shadow-[inset_4px_4px_8px_#a8a9ab,inset_-4px_-4px_8px_#fafffd] outline-none" placeholder="Enter image link" />
              </div>

              {/* Starting Price */}
              <div>
                <label className="block text-[10px] font-bold text-[#909483] uppercase ml-1 mb-1">Starting Price</label>
                <input type="number" required value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)}
                  className="w-full bg-[#D1D2D4] rounded-xl p-3 text-[#616657] shadow-[inset_4px_4px_8px_#a8a9ab,inset_-4px_-4px_8px_#fafffd] outline-none" placeholder="Enter amount" />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[10px] font-bold text-[#909483] uppercase ml-1 mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#D1D2D4] rounded-xl p-3 text-[#616657] shadow-[inset_4px_4px_8px_#a8a9ab,inset_-4px_-4px_8px_#fafffd]">
                  {['Electronics', 'Home decor', 'Automobiles', 'Furnitures', 'Freelance', 'Construction'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Auction Type */}
              <div>
                <label className="block text-[10px] font-bold text-[#909483] uppercase ml-1 mb-1">Auction Type</label>
                <select value={auctionType} onChange={(e) => setAuctionType(e.target.value as any)} className="w-full bg-[#D1D2D4] rounded-xl p-3 text-[#616657] shadow-[inset_4px_4px_8px_#a8a9ab,inset_-4px_-4px_8px_#fafffd]">
                  <option value="traditional">Traditional</option>
                  <option value="reverse">Reverse</option>
                  <option value="sealed">Sealed</option>
                </select>
              </div>

              {/* End Time */}
              <div>
                <label className="block text-[10px] font-bold text-[#909483] uppercase ml-1 mb-1">End Date & Time</label>
                <input type="datetime-local" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full bg-[#D1D2D4] rounded-xl p-3 text-[#616657] shadow-[inset_4px_4px_8px_#a8a9ab,inset_-4px_-4px_8px_#fafffd]" />
              </div>


              <div className="flex gap-4 mt-6 sticky bottom-0 bg-[#D1D2D4] pt-2 mb-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#B25C40] text-white py-3 rounded-xl font-bold transition-all shadow-[4px_4px_8px_#a8a9ab,-4px_-4px_8px_#fafffd] hover:shadow-[inset_4px_4px_8px_#a8a9ab,inset_-4px_-4px_8px_#fafffd] active:shadow-[inset_6px_6px_12px_#a8a9ab,inset_-6px_-6px_12px_#fafffd]"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => { setIsAuctionModalOpen(false); resetForm(); }}
                  className="flex-1 text-[#616657] py-3 rounded-xl font-bold bg-[#D1D2D4] shadow-[4px_4px_8px_#a8a9ab,-4px_-4px_8px_#fafffd] hover:shadow-[inset_4px_4px_8px_#a8a9ab,inset_-4px_-4px_8px_#fafffd] active:shadow-[inset_6px_6px_12px_#a8a9ab,inset_-6px_-6px_12px_#fafffd]"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
      {/* Bid Modal */}
      {isBidModalOpen && (
        <div className="fixed inset-0 bg-[#D1D2D4]/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#D1D2D4] p-8 rounded-[30px] w-full max-w-sm shadow-[20px_20px_60px_#a8a9ab,-20px_-20px_60px_#fafffd]">
            <h2 className="text-lg font-bold mb-6 text-[#616657]">Bid Activity Log</h2>
            <div className="max-h-60 overflow-y-auto space-y-3">
              {selectedProductBids.length > 0 ? selectedProductBids.map((bid: any) => (
                <div key={bid._id} className="flex justify-between p-3 rounded-xl shadow-[inset_2px_2px_4px_#a8a9ab,inset_-2px_-2px_4px_#fafffd] text-sm text-[#616657]">
                  <span className="font-medium">{bid.buyerId?.name || 'Anonymous'}</span>
                  <span className="font-bold text-[#B25C40]">${bid.bidAmount}</span>
                </div>
              )) : <p className="text-[#909483] text-sm text-center">No bids placed yet.</p>}
            </div>

            <button
              onClick={() => setIsBidModalOpen(false)}
              className="mt-6 w-full py-3 rounded-xl bg-[#B25C40] text-white transition-all duration-300 
             shadow-[4px_4px_8px_#a8a9ab,-4px_-4px_8px_#fafffd] 
             hover:shadow-[inset_4px_4px_8px_#8d4a34,inset_-4px_-4px_8px_#d7704c]"
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* Inventory List */}
      <div className="space-y-6">
        {loading ? <p className="text-[#909483]">Syncing...</p> : myInventory.map((item) => (
          <div key={item._id} className="flex items-center justify-between p-6 rounded-[20px] bg-[#D1D2D4]" style={{ boxShadow: '8px 8px 16px #a8a9ab, -8px -8px 16px #fafffd' }}>
            <div className="flex items-center gap-6">
              <img src={item.image} alt="" className="w-16 h-14 object-cover rounded-xl shadow-[inset_4px_4px_8px_#a8a9ab,inset_-4px_-4px_8px_#fafffd]" />
              <div>
                <h3 className="font-bold text-[#616657]">{item.title}</h3>
                <span className="text-[#909483] text-[10px] uppercase font-bold">{item.auctionType} • Status: <strong className={item.status === 'active' ? 'text-[#B25C40]' : 'text-[#C19386]'}>{item.status}</strong></span>
              </div>
            </div>
            <div className="flex gap-4">

              <div className="flex gap-4">
                <button onClick={() => fetchBids(item._id)} className="text-[#B25C40] underline text-xs font-bold">View Bids</button>

                {/* NEW CONDITIONAL LOGIC */}
                {item.status === 'completed' ? (
                  <a
                    href={`/item/${item._id}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#616657] shadow-[4px_4px_8px_#a8a9ab,-4px_-4px_8px_#fafffd]"
                  >
                    View
                  </a>
                ) : (
                  <button
                    onClick={() => handleEditClick(item)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#616657] shadow-[4px_4px_8px_#a8a9ab,-4px_-4px_8px_#fafffd]"
                  >
                    Edit
                  </button>
                )}

                <button onClick={() => handleDeleteAuction(item._id)} className="px-4 py-2 rounded-xl text-xs font-bold text-[#C19386] shadow-[4px_4px_8px_#a8a9ab,-4px_-4px_8px_#fafffd]">Remove</button>

                {item.status === 'completed' ? (
                  <span className="text-xs font-bold text-[#616657] px-4 py-2 rounded-xl shadow-[inset_3px_3px_6px_#a8a9ab,inset_-3px_-3px_6px_#fafffd]">
                    Winner: {item.currentHighestBidder?.name || 'Identified'}
                  </span>
                ) : (
                  <button onClick={() => handleFinalizeAuction(item._id)} className="text-[#B25C40] text-xs font-bold px-4 py-2 rounded-xl shadow-[4px_4px_8px_#a8a9ab,-4px_-4px_8px_#fafffd] transition-all">Finalize</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


};

export default SellerDashboard;