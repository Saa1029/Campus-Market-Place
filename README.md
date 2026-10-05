# Campus Marketplace 🎓🛒

A mobile and web marketplace application built with **React Native**, **Expo SDK 57**, and **TypeScript**, specifically designed for college and university campuses. Students can buy and sell textbooks, dorm furniture, electronics, and school supplies safely within their campus community.

---

## 👥 Group Members & Contribution Breakdown

| Member | Assigned Role | Feature Implemented | Key Files Modified |
| :--- | :--- | :--- | :--- |
| **Member 1 (Student A)** | Lead / Listing Manager | **Feature 2: Rich Listing Creation & Form Validation** | `src/components/SellModal.tsx`, `src/App.tsx` |
| **Member 2 (Student B)** | Search & Discovery Lead | **Feature 1: Multi-field Search, Price Range & Sorting** | `src/pages/ExplorePage.tsx`, `src/types.ts` |
| **Member 3 (Student C)** | Inventory & Status Manager | **Feature 3: Listing Status ("Mark as Sold") & Delete** | `src/components/ListingCard.tsx`, `src/pages/MyListingsPage.tsx` |
| **Member 4 (Student D)** | Real-time Comms Lead | **Feature 4: Interactive Buyer/Seller In-App Chat** | `src/pages/MessagesPage.tsx`, `src/data.ts` |
| **Member 5 (Student E)** | UI/UX & Integration Lead | **Feature 5: Student Dashboard, Team Switcher & UI Polish**| `src/pages/ProfilePage.tsx`, `README.md`, `src/App.tsx` |

---

## 🚀 Key Features Implemented

### 1. Multi-Field Search, Price Range Filtering & Sorting (Member 2)
- **Deep Search**: Filters across item title, description, category, and campus location in real time.
- **Price Range Filter**: Numerical `Min $` and `Max $` inputs with quick preset chips (`Under $25`, `Under $50`, `Under $100`).
- **Sorting Options**: Sort listings dynamically by *Newest*, *Price: Low to High*, or *Price: High to Low*.
- **Campus Location Filter**: Filter items by specific campus zones (`North Campus`, `West Village`, `East Quad`, `Central Campus`).
- **Filter Management**: Active filter pills with instant dismiss tags and a "Reset All" action.

### 2. Rich Listing Creation & Client-side Validation (Member 1)
- **Comprehensive Fields**: Title, price, category selector, item condition (`New`, `Like new`, `Good condition`, `Fair condition`), campus meetup location, and detailed description.
- **Photo Presets & URL Support**: 6 one-tap photo presets for textbooks, laptops, desks, tech, and apparel, plus custom image URL support.
- **Input Validation**: Real-time error alerts for missing titles, negative/zero prices, and empty photos.
- **Zero-Friction Publishing**: Instant local state publication with seamless Firebase Cloud Firestore synchronization.

### 3. Listing Status Management ("Mark as Sold" & Delete) (Member 3)
- **"Mark as Sold" Toggle**: Sellers can easily mark items as Sold or Relist them as Available from the Listing Detail view or the "My Listings" tab.
- **Visual "SOLD" Badges**: Bold red status overlays and dimmed card previews to visually differentiate sold items.
- **"Hide Sold" Filter**: Buyers can toggle between viewing all items or hiding sold listings on the Explore tab.
- **Owner Deletion**: Safe deletion confirmation modal to remove outdated listings.

### 4. Interactive In-App Buyer/Seller Messaging (Member 4)
- **Active Chat Threads**: Tapping "Message Seller" from any listing automatically initializes or opens an item-specific chat thread.
- **Live Conversation View**: Chat bubbles for incoming and outgoing messages with sender labels, timestamps, and quick reply suggestion chips.
- **Video Demo Role Switcher**: Built-in 1-tap simulator toggle ("Simulate typing as Buyer ↔ Seller") allowing students to demonstrate a two-way dialogue on a single screen without multiple device logins.
- **Nav Badges**: Real-time conversation count badge on the bottom navigation bar.

### 5. Student Dashboard & Team Demo Switcher (Member 5)
- **Student Profile Dashboard**: Live metrics displaying Active listings, Sold listings, Total Campus Earnings ($), and Saved items.
- **5-Member Team Switcher**: Instant profile switcher on the Profile tab to alternate between Student 1 (Seller), Student 2 (Buyer), Student 3, Student 4, and Student 5 during presentations.
- **Campus Trust Badges**: "Verified Student" account pill and preferred campus meetup zone.
- **Safe Fallback**: Complete offline/demo mode so the application functions flawlessly without requiring external Firebase credentials.

---

## 🛠️ Technology Stack

- **Framework**: [React Native](https://reactnative.dev/) (v0.86.2) via [Expo SDK 57](https://expo.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Platform Targets**: Web (React Native for Web), Android, iOS
- **Backend / Auth**: [Firebase](https://firebase.google.com/) (Cloud Firestore & Firebase Authentication) with automatic local state fallback for offline presentation
- **Styling**: Native StyleSheet design system with a clean, modern campus color palette (`#1F5D4C` Forest Green, `#F8F8F4` Warm Cream)

---

## 💻 How to Run Locally

### Prerequisites
- **Node.js**: v22.13 or newer
- **npm**: v10 or newer

### Installation & Launch

1. **Clone the repository:**
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   cd campus-marketplace-master
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run on Web (Recommended for quick testing and screen recording):**
   ```bash
   npm run web
   ```
   Open `http://localhost:8081` in your browser.

4. **Run on Mobile (Expo Go):**
   ```bash
   npm start
   ```
   Scan the terminal QR code with the **Expo Go** app on iOS or Android.

---

## 📹 Video Demonstration Script (5 to 8 Minutes)

| Time | Section | Speaker | Action & Talking Points |
| :--- | :--- | :--- | :--- |
| **0:00 - 1:00** | **1. Introduction** | All Members | Introduce team members, roles, project name, and problem (reducing waste, affordable textbooks, safe campus meetups). |
| **1:00 - 2:00** | **2. Technical Overview** | Member 5 | Briefly explain architecture: React Native, Expo 57, TypeScript, state management, and GitHub branch strategy. |
| **2:00 - 3:15** | **3. Listing Creation & Validation** | Member 1 | **Demo Action:** Tap `+ Sell`. Try submitting empty form to showcase validation errors. Fill in "Calculus 9th Edition", price `$35`, condition, and photo. Hit "Publish". Show the listing appear on Explore. |
| **3:15 - 4:15** | **4. Search, Price Filter & Sorting** | Member 2 | **Demo Action:** Type "Calculus" in the search bar. Open "Filters & Sort". Set Max Price to `$50`, sort by *Price: Low to High*. Point out the active filter chips and item count. |
| **4:15 - 5:15** | **5. Messaging & Chat Exchange** | Member 4 | **Demo Action:** Student B taps the item, favorites it (heart count updates), and taps `Message Seller`. Send inquiry: *"Is this available at the library today?"* Use the simulator toggle to reply as Student A: *"Yes, let's meet at 3 PM!"* |
| **5:15 - 6:00** | **6. Mark as Sold & Dashboard** | Member 3 | **Demo Action:** Student A goes to "My Items" or Item Detail, taps `Mark as Sold`. Show the bold red **SOLD** badge appear. Show total campus earnings increase on Profile dashboard. |
| **6:00 - 7:00** | **7. GitHub Collaboration** | Member 5 | **Demo Action:** Screen-share GitHub repository. Show closed Pull Requests, commit history by each member, and clean documentation. |
| **7:00 - 7:30** | **8. Conclusion** | All Members | Summarize key learnings, challenges resolved (e.g. mobile responsiveness, offline demo capability), and concluding remarks. |

---

## 🌿 Git Collaboration & Branching Strategy

Our team adhered to standard Git and GitHub workflows:
- `main`: Protected production branch containing stable releases.
- `feature/listing-creation`: Member 1 (Listing creation modal & validation)
- `feature/search-filters`: Member 2 (Search, price range filter & sorting)
- `feature/mark-as-sold`: Member 3 (Item status management & owner controls)
- `feature/messaging`: Member 4 (In-app buyer/seller chat threads)
- `feature/dashboard-profile`: Member 5 (Dashboard metrics, team switcher, & UI polish)
