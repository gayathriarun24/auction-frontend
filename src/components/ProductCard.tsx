import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import your auth hook
import type { AuctionItem } from '../types';

interface ProductCardProps {
  item: AuctionItem;
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const { user } = useAuth(); // Access user role from context


  const renderBadge = () => {
    switch (item.auctionType) {
      case 'sealed':
        return <span className="bg-[#D1D2D4] text-[#C19386] shadow-[inset_2px_2px_4px_#a8a9ab,inset_-2px_-2px_4px_#fafffd] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg">🔒 Sealed</span>;
      case 'reverse':
        return <span className="bg-[#D1D2D4] text-[#909483] shadow-[inset_2px_2px_4px_#a8a9ab,inset_-2px_-2px_4px_#fafffd] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg">🔄 Reverse</span>;
      default:
        return <span className="bg-[#D1D2D4] text-[#B25C40] shadow-[inset_2px_2px_4px_#a8a9ab,inset_-2px_-2px_4px_#fafffd] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg">⚡ Traditional</span>;
    }
  };

  const sellerRating = typeof item.sellerId === 'object' && item.sellerId !== null
    ? item.sellerId.sellerRating
    : 5.0;


  return (
    <div className="group block bg-[#D1D2D4] rounded-[20px] overflow-hidden transition-all duration-300"
      style={{ boxShadow: '8px 8px 16px #a8a9ab, -8px -8px 16px #fafffd' }}>

      <Link to={`/item/${item._id}`}>
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=600&q=80'; }}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 z-10">{renderBadge()}</div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-bold text-[#616657] tracking-tight text-lg group-hover:text-[#B25C40] transition-colors line-clamp-1">
              {item.title}
            </h3>
            <div className="flex items-center gap-1 bg-[#D1D2D4] px-2 py-0.5 rounded-lg text-[11px] text-[#909483] shrink-0 shadow-[inset_2px_2px_4px_#a8a9ab,inset_-2px_-2px_4px_#fafffd]">
              ⭐ {sellerRating.toFixed(1)}
            </div>
          </div>

          <p className="text-[#909483] text-xs tracking-normal line-clamp-2 mb-5 min-h-[32px]">
            {item.description}
          </p>

          <div className="bg-[#D1D2D4] p-3 rounded-xl flex items-center justify-between mb-4 shadow-[inset_4px_4px_8px_#a8a9ab,inset_-4px_-4px_8px_#fafffd]">
          
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#909483]">
                {item.auctionType === 'reverse' ? 'Target Limit' : 'Starting Floor'}
              </span>
              <span className="text-sm font-semibold text-[#616657]">
                ${item.startingPrice.toLocaleString()}
              </span>
            </div>

        
            <div className="text-right">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#909483]">
                {item.auctionType === 'sealed' ? 'Visibility' : 'Current Value'}
              </span>
              {item.auctionType === 'sealed' ? (
                <span className="text-xs font-medium text-[#C19386] tracking-wide">Encrypted</span>
              ) : (
                <span className="text-sm font-black text-[#B25C40]">
                  ${(item.currentHighestBid || item.startingPrice).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5">
        <Link
          to={`/item/${item._id}`}
          className="block w-full text-center bg-[#B25C40] text-white 
          text-xs font-bold py-3 rounded-xl transition-all 
          shadow-[4px_4px_8px_#a8a9ab,-4px_-4px_8px_#fafffd]
           hover:bg-[#a0523a] active:shadow-[inset_4px_4px_8px_#8f4a35]"
           >
         {user?.role === 'seller' ? 'View' : 'Enter Trading Floor'}
        </Link>
      </div>
    </div>
  );

};

export default ProductCard;