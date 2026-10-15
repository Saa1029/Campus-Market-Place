# Campus Marketplace 🎓🛒

A mobile and web marketplace application built with **React Native**, **Expo SDK 57**, and **TypeScript**, specifically designed for college and university campuses. Students can buy, negotiate, and sell textbooks, dorm furniture, electronics, and school supplies safely within their campus community.

---

## 👥 Group Members & Contribution Breakdown

| Member | Assigned Role | Feature Implemented | Key Files Modified |
| :--- | :--- | :--- | :--- |
| **Member 1 (Piratheep)** | Lead / Listing Manager | **Feature 2: Rich Listing Creation & Device Image Upload** | `src/components/SellModal.tsx`, `src/App.tsx` |
| **Member 2 (Mufazzir)** | Search & Discovery Lead | **Feature 1: Multi-field Search, Price Range & Sorting** | `src/pages/ExplorePage.tsx`, `src/types.ts` |
| **Member 3 (Chamodya)** | Inventory & Status Manager | **Feature 3: Listing Status ("Mark as Sold") & Owner Controls** | `src/components/ListingCard.tsx`, `src/pages/MyListingsPage.tsx` |
| **Member 4 (Poojani)** | Real-time Comms Lead | **Feature 4: Interactive Chat & "Make an Offer" Negotiation** | `src/pages/MessagesPage.tsx`, `src/components/OfferModal.tsx` |
| **Member 5 (Saad)** | UI/UX & Integration Lead | **Feature 5: Student Trust, Safety Reporting & Dark Mode** | `src/components/ReportModal.tsx`, `src/pages/ProfilePage.tsx`, `src/theme.ts` |

---

## 🚀 Key Features Implemented

### 1. Multi-Field Search, Price Range Filtering & Sorting (Member 2)
- **Deep Search**: Filters across item title, description, category, and campus location in real time.
- **Price Range Filter**: Numerical `Min $` and `Max $` inputs with quick preset chips (`Under $25`, `Under $50`, `Under $100`).
- **Sorting Options**: Sort listings dynamically by *Newest*, *Price: Low to High*, or *Price: High to Low*.
- **Campus Location Filter**: Filter items by specific campus zones (`North Campus`, `West Village`, `East Quad`, `Central Campus`).
- **Filter Management**: Active filter pills with instant dismiss tags and a "Reset All" action.

### 2. Rich Listing Creation & Local Device Photo Upload (Member 1)
- **Comprehensive Fields**: Title, price, category selector (with icons), item condition (`New`, `Like new`, `Good condition`, `Fair condition`), campus meetup location, and detailed description.
- **Device Photo Upload & Presets**: Upload images directly from your computer/device or choose from 6 one-tap photo presets (textbooks, laptops, desks, tech, apparel, lamps).
- **Client-Side Validation**: Real-time error alerts for missing titles, negative/zero prices, and empty photos.
- **Zero-Friction Publishing**: Instant local state publication with seamless Firebase Cloud Firestore synchronization.

### 3. Listing Status Management ("Mark as Sold" & Delete) (Member 3)
- **"Mark as Sold" Toggle**: Sellers can easily mark items as Sold or Relist them as Available from the Listing Detail view or the "My Listings" tab.
- **Visual "SOLD" Badges**: Bold red status overlays and dimmed card previews to visually differentiate sold items.
- **"Hide Sold" Filter**: Buyers can toggle between viewing all items or hiding sold listings on the Explore tab.
- **Owner Deletion**: Safe deletion confirmation modal to remove outdated listings.

### 4. Interactive Chat & Price Negotiation ("Make an Offer") (Member 4)
- **"Make an Offer" System**: Buyers can submit discounted offers with one-tap discount presets (10% off, 15% off, 20% off) or custom amounts.
- **In-Chat Offer Cards**: Special interactive offer cards in the conversation thread displaying the offer amount, savings percentage, and **[Accept Offer]** / **[Decline]** buttons for the seller.
- **Active Chat Threads**: Tapping "Message Seller" from any listing automatically initializes or opens an item-specific chat thread.
- **Live Conversation View**: Chat bubbles for incoming and outgoing messages with sender labels, timestamps, and quick reply suggestion chips.
- **Video Demo Role Switcher**: Built-in 1-tap simulator toggle ("Simulate typing as Buyer ↔ Seller") allowing students to demonstrate a two-way dialogue on a single screen without multiple device logins.

### 5. Student Trust, Safety Reporting & Dark Mode (Member 5)
- **Safety & Reporting Modal**: Flag suspicious listings with category options (prohibited items, scams, offensive content) and student safety review notes.
- **Verified Student Profiles**: Displays verified student status, major (e.g. *Computer Science*), class year (*Class of '26*), and meetup rating (e.g. *⭐️ 4.9 · 19 meetups*).
- **Dark Mode / Light Mode**: Beautiful night mode toggle (☀️ / 🌙) for late-night dorm browsing with tailored contrast tokens.
- **Student Profile Dashboard**: Live metrics displaying Active listings, Sold listings, Total Campus Earnings ($), and Saved items.
- **5-Member Team Switcher**: Instant profile switcher on the Profile tab to alternate between Student 1 (Seller), Student 2 (Buyer), Student 3, Student 4, and Student 5 during presentations.

---

## 🛠️ Technology Stack

- **Framework**: [React Native](https://reactnative.dev/) (v0.86.2) via [Expo SDK 57](https://expo.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Platform Targets**: Web (React Native for Web), Android, iOS
- **Backend / Auth**: [Firebase](https://firebase.google.com/) (Cloud Firestore & Firebase Authentication) with automatic local state fallback for offline presentation
- **Styling**: Native StyleSheet design system with a clean, modern campus color palette (`#1F5D4C` Forest Green, `#F8F8F4` Warm Cream) and Dark Mode (`#111816`)

---

## 💻 How to Run Locally

### Prerequisites
- **Node.js**: v22.13 or newer
- **npm**: v10 or newer

### Installation & Launch

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Saa1029/Campus-Market-Place.git
   cd campus-marketplace-master
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run on Web (Recommended for testing and screen recording):**
   ```bash
   npm run web
   ```
   Open `http://localhost:8081` in your browser.

4. **Run on Mobile (Expo Go):**
   ```bash
   npm start
   ```
   Scan the terminal QR code with the **Expo Go** app on iOS or Android.


## 🌿 Git Collaboration & Branching Strategy

Our team adhered to standard Git and GitHub workflows:
- `main`: Protected production branch containing stable releases.
- `feature/listing-creation`: Member 1 (Listing creation modal, validation & device upload)
- `feature/search-filters`: Member 2 (Search, price range filter & sorting)
- `feature/mark-as-sold`: Member 3 (Item status management & owner controls)
- `feature/messaging-offers`: Member 4 (In-app buyer/seller chat threads & price negotiation)
- `feature/safety-darkmode`: Member 5 (Student trust, safety reporting, dark mode & dashboard)
