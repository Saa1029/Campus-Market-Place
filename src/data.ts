import { Conversation, DemoUser, Listing, Message } from "./types";

export const categories = [
  "All items",
  "Textbooks",
  "Furniture",
  "Tech",
  "Fashion",
  "School Supplies",
];

export const campuses = [
  "North Campus",
  "West Village",
  "East Quad",
  "Central Campus",
];

export const conditions = [
  "New",
  "Like new",
  "Good condition",
  "Fair condition",
];

export const samplePhotoPresets = [
  {
    label: "Textbook",
    url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
  },
  {
    label: "Study Desk",
    url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800",
  },
  {
    label: "Headphones",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
  },
  {
    label: "Laptop",
    url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
  },
  {
    label: "Jacket",
    url: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800",
  },
  {
    label: "Desk Lamp",
    url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
  },
];

export const demoUsers: DemoUser[] = [
  {
    uid: "student-maya",
    displayName: "Maya R. (Student 1 - Seller)",
    email: "maya.r@campus.edu",
    campus: "North Campus",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
  },
  {
    uid: "student-alex",
    displayName: "Alex P. (Student 2 - Buyer)",
    email: "alex.p@campus.edu",
    campus: "East Quad",
    photoURL: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200",
  },
  {
    uid: "student-jordan",
    displayName: "Jordan K. (Student 3)",
    email: "jordan.k@campus.edu",
    campus: "West Village",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  },
  {
    uid: "student-sam",
    displayName: "Sam T. (Student 4)",
    email: "sam.t@campus.edu",
    campus: "Central Campus",
    photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200",
  },
  {
    uid: "student-taylor",
    displayName: "Taylor C. (Student 5)",
    email: "taylor.c@campus.edu",
    campus: "North Campus",
    photoURL: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200",
  },
];

export const seedListings: Listing[] = [
  {
    id: "1",
    title: "Calculus: Early Transcendentals (9th Edition)",
    price: 35,
    category: "Textbooks",
    seller: "Maya R. (Student 1 - Seller)",
    sellerId: "student-maya",
    campus: "North Campus",
    condition: "Like new",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
    description: "Required for MATH 115 & 116. No highlighting or marks inside. Can meet at the Duderstadt Center.",
    isSold: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: "2",
    title: "Solid Walnut Study Desk & Chair",
    price: 80,
    category: "Furniture",
    seller: "Jordan K. (Student 3)",
    sellerId: "student-jordan",
    campus: "West Village",
    condition: "Good condition",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800",
    description: "Spacious desk with side drawers and comfortable ergonomic mesh chair. Fits easily in dorm rooms.",
    isSold: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: "3",
    title: "Sony Wireless Noise-Cancelling Headphones",
    price: 120,
    category: "Tech",
    seller: "Alex P. (Student 2 - Buyer)",
    sellerId: "student-alex",
    campus: "East Quad",
    condition: "Like new",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    description: "Includes original hardshell travel case, 3.5mm audio jack, and USB-C fast charging cable.",
    isSold: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: "4",
    title: "Vintage Wool Campus Varsity Jacket (Size M)",
    price: 45,
    category: "Fashion",
    seller: "Sam T. (Student 4)",
    sellerId: "student-sam",
    campus: "North Campus",
    condition: "Good condition",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800",
    description: "Classic retro campus style jacket. Thick wool body with faux leather sleeves. Super warm for winter.",
    isSold: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
  },
  {
    id: "5",
    title: "Apple iPad Air 64GB with Apple Pencil",
    price: 290,
    category: "Tech",
    seller: "Taylor C. (Student 5)",
    sellerId: "student-taylor",
    campus: "North Campus",
    condition: "Like new",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
    description: "Perfect for taking digital notes in lectures. Paper-like screen protector pre-installed.",
    isSold: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
  },
  {
    id: "6",
    title: "Organic Chemistry Molecular Model Kit",
    price: 20,
    category: "School Supplies",
    seller: "Maya R. (Student 1 - Seller)",
    sellerId: "student-maya",
    campus: "North Campus",
    condition: "New",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
    description: "Essential for CHEM 210. 240 piece chemistry structure set, complete with box and instructions.",
    isSold: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
];

export const seedConversations: Conversation[] = [
  {
    id: "conv-1",
    listingId: "1",
    listingTitle: "Calculus: Early Transcendentals (9th Edition)",
    listingPrice: 35,
    listingImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
    buyerId: "student-alex",
    buyerName: "Alex P. (Student 2 - Buyer)",
    sellerId: "student-maya",
    sellerName: "Maya R. (Student 1 - Seller)",
    lastMessage: "Sounds great! See you at 3:00 PM at Duderstadt Center.",
    lastMessageTime: "10 mins ago",
    unreadCount: 1,
  },
];

export const seedMessages: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "msg-1",
      conversationId: "conv-1",
      senderId: "student-alex",
      senderName: "Alex P. (Student 2 - Buyer)",
      text: "Hi Maya! Is your Calculus textbook still available?",
      timestamp: "10:15 AM",
    },
    {
      id: "msg-2",
      conversationId: "conv-1",
      senderId: "student-maya",
      senderName: "Maya R. (Student 1 - Seller)",
      text: "Yes, it is! I have it with me on North Campus today.",
      timestamp: "10:18 AM",
    },
    {
      id: "msg-3",
      conversationId: "conv-1",
      senderId: "student-alex",
      senderName: "Alex P. (Student 2 - Buyer)",
      text: "Awesome, would you be able to meet at 3:00 PM at Duderstadt Center?",
      timestamp: "10:20 AM",
    },
    {
      id: "msg-4",
      conversationId: "conv-1",
      senderId: "student-maya",
      senderName: "Maya R. (Student 1 - Seller)",
      text: "Sounds great! See you at 3:00 PM at Duderstadt Center.",
      timestamp: "10:22 AM",
    },
  ],
};
