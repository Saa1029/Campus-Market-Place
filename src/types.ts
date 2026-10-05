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

export type ThemeMode = "light" | "dark";

export type Offer = {
  id: string;
  amount: number;
  originalPrice: number;
  status: "pending" | "accepted" | "declined";
  buyerId: string;
  buyerName: string;
  createdAt: string;
};

export type Listing = {
  id: string;
  title: string;
  price: number;
  category: string;
  seller: string;
  sellerId?: string;
  sellerMajor?: string;
  sellerGradYear?: string;
  sellerRating?: number;
  meetupsCount?: number;
  campus: string;
  condition: string;
  image: string;
  description?: string;
  isSold?: boolean;
  isReported?: boolean;
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
  type?: "text" | "offer" | "system";
  offer?: Offer;
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
  activeOffer?: Offer;
};

export type DemoUser = {
  uid: string;
  displayName: string;
  email: string;
  campus: string;
  photoURL?: string | null;
  major?: string;
  gradYear?: string;
  rating?: number;
  meetupsCount?: number;
};

export type ReportReason =
  | "Prohibited campus item"
  | "Suspicious seller or scam"
  | "Misleading or inaccurate description"
  | "Inappropriate or offensive content"
  | "Other safety concern";
