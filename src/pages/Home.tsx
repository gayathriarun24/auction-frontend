import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import type { AuctionItem } from '../types';

const Home: React.FC = () => {
  const [products, setProducts] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New State for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');


  const [page, setPage] = useState(1);
  const limit = 12; // Your requested limit


  useEffect(() => {
    const fetchMarketplaceProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products?page=${page}&limit=${limit}`);
        setProducts(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Database connection error:', err);
        setError('Could not connect to the live auction engine.');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketplaceProducts();
  }, [page]);

  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrevious = () => setPage(prev => (prev > 1 ? prev - 1 : 1));
  // Filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);


  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-[#D1D2D4] min-h-screen">

      <div className="mb-12">
        <span className="text-[10px] font-bold text-[#B25C40] uppercase tracking-widest block mb-2">
          Live Marketplace
        </span>
        <h1 className="text-4xl font-black text-[#616657] tracking-tight">
          Browse Auction Items
        </h1>
        <p className="text-[#909483] mt-2 text-sm max-w-md">
          Explore active listings, participate in real-time auctions, and secure your deals across multiple categories.
        </p>

        {/* Filter Bar */}
        <div className="flex gap-4 mt-6">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="grow p-4 bg-[#D1D2D4] rounded-2xl text-sm outline-none text-[#616657] shadow-[inset_4px_4px_8px_#a8a9ab,inset_-4px_-4px_8px_#fafffd]"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-4 bg-[#D1D2D4] rounded-2xl text-sm outline-none text-[#909483] shadow-[inset_4px_4px_8px_#a8a9ab,inset_-4px_-4px_8px_#fafffd]"
          >
            <option value="All">All Categories</option>
            <option value="Automobiles">Automobiles</option>
            <option value="Electronics">Electronics</option>
            <option value="Real Estate">Home decors</option>
            <option value="Furnitures">Furnitures</option>
            <option value="Freelance">Freelance</option>
            <option value="Construction">Construction</option>
          
            <option value="Industrial">Industrial</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-8 h-8 border-2 border-[#B25C40] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#909483]">Loading marketplace items...</p>
        </div>
      )}

      {error && (
        <div className="bg-[#D1D2D4] border border-[#C19386] rounded-2xl p-6 text-sm text-[#B25C40] text-center max-w-xl mx-auto shadow-[inset_4px_4px_8px_#a8a9ab,inset_-4px_-4px_8px_#fafffd]">
          <strong>System Warning:</strong> {error}
        </div>
      )}

      <>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 rounded-3xl bg-[#D1D2D4]" style={{ boxShadow: '8px 8px 16px #a8a9ab, -8px -8px 16px #fafffd' }}>
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-[#616657] mb-1">No Matching Items</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts
              .slice((page - 1) * limit, page * limit)
              .map((product) => (
                <ProductCard key={product._id} item={product} />
              ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-6 mt-16">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className="px-6 py-3 rounded-xl font-bold text-[#616657] disabled:opacity-30 transition-all shadow-[4px_4px_8px_#a8a9ab,-4px_-4px_8px_#fafffd]"
          >
            Prev
          </button>

          <span className="font-black text-[#616657]">Page {page}</span>

          <button
            onClick={handleNext}
            disabled={page * limit >= filteredProducts.length}
            className="px-6 py-3 bg-[#B25C40] text-white rounded-xl font-bold disabled:opacity-30 transition-all shadow-[4px_4px_8px_#a8a9ab,-4px_-4px_8px_#fafffd]"
          >
            Next
          </button>
        </div>
      </>
    </div>


  );
};

export default Home;
