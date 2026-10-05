export type Condition =
  | "New"
  | "Like new"
  | "Good condition"
  | "Fair condition";

export type Campus =
  | "North Campus"
  | "West Village"
  | "East Quad"
  | "Central Campus";

export type Listing = {
  id: string;
  title: string;
  price: number;
  category: string;
  seller: string;
  sellerId?: string;
  campus: string;
  condition: string;
  image: string;
  description?: string;
  isSold?: boolean;
  createdAt?: string | number;
};

export type Tab = "Explore" | "Saved" | "Messages" | "Profile" | "MyListings";

export type SortOption = "newest" | "price-asc" | "price-desc";

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
};

export type Conversation = {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
};

export type DemoUser = {
  uid: string;
  displayName: string;
  email: string;
  campus: string;
  photoURL?: string | null;
};
