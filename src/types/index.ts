export interface AuctionItem {
  _id: string;
  sellerId: string | { name: string; sellerRating: number; contactInfo?: string };
  title: string;
  description: string;
  image: string; // Synced with productSchema 'image'
  category: string;
  auctionType: 'traditional' | 'reverse' | 'sealed';
  startingPrice: number; // Synced with productSchema 'startingPrice'
  currentHighestBid: number;
  currentHighestBidder?: any;
  status: 'active' | 'unsold' | 'completed';
  endTime: string;
  createdAt?: string;
}

export interface BidLog {
  _id: string;
  productId: string | { 
    title: string; 
    image: string; 
    auctionType: string; 
    status: string;
    winnerId?: string; 
  };
  buyerId: string | { name: string; email: string };
  bidAmount: number;
  bidTime: string;
}

