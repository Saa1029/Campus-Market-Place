import { StatusBar } from "expo-status-bar";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { OfferModal } from "./components/OfferModal";
import { ReportModal } from "./components/ReportModal";
import { SellModal } from "./components/SellModal";
import {
  categoryIcons,
  demoUsers,
  seedConversations,
  seedListings,
  seedMessages,
} from "./data";
import { auth, db, firebaseConfigured } from "./firebase";
import { ExplorePage } from "./pages/ExplorePage";
import { MessagesPage } from "./pages/MessagesPage";
import { MyListingsPage } from "./pages/MyListingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SavedPage } from "./pages/SavedPage";
import { themeColors } from "./theme";
import {
  Conversation,
  DemoUser,
  Listing,
  Message,
  Offer,
  SortOption,
  Tab,
  ThemeMode,
} from "./types";

async function registerUser(user: User) {
  if (!db) return;
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      displayName:
        user.displayName || user.email?.split("@")[0] || "Campus student",
      email: user.email || "",
      photoURL: user.photoURL || null,
      campus: "North Campus",
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>("Explore");
  const [items, setItems] = useState<Listing[]>(seedListings);

  // Theme state (Dark / Light mode)
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const colors = themeColors[themeMode];

  // Search & Filter state (Feature 1)
  const [queryText, setQueryText] = useState("");
  const [category, setCategory] = useState("All items");
  const [campusFilter, setCampusFilter] = useState("All campuses");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [hideSold, setHideSold] = useState(false);

  // User & Demo Team Switcher state (Feature 5)
  const [currentDemoUser, setCurrentDemoUser] = useState<DemoUser>(demoUsers[0]);
  const [user, setUser] = useState<User | null>(auth?.currentUser || null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const [profileReady, setProfileReady] = useState(false);

  // Listing creation, detail, offer & report state
  const [sellOpen, setSellOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>(["1"]);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Messaging state (Feature 4)
  const [conversations, setConversations] = useState<Conversation[]>(
    seedConversations,
  );
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(seedMessages);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  // Firebase auth sync
  useEffect(() => {
    const firebaseAuth = auth;
    if (!firebaseAuth) return;
    const handleUser = (nextUser: User | null) => {
      setUser(nextUser);
      if (nextUser) {
        registerUser(nextUser)
          .then(() => setProfileReady(true))
          .catch((error) =>
            setAuthError(
              error instanceof Error
                ? error.message
                : "Could not create profile.",
            ),
          );
      } else {
        setProfileReady(false);
      }
    };
    let unsubscribe: () => void = () => undefined;
    setPersistence(firebaseAuth, browserLocalPersistence)
      .then(() => {
        unsubscribe = onAuthStateChanged(firebaseAuth, handleUser);
        return getRedirectResult(firebaseAuth);
      })
      .then((result) => {
        if (result?.user) handleUser(result.user);
      })
      .catch((error) =>
        setAuthError(
          error instanceof Error
            ? error.message
            : "Google sign-in could not be completed.",
        ),
      );
    return () => unsubscribe();
  }, []);

  // Firebase Firestore real-time sync (if configured)
  useEffect(() => {
    if (!db) return;
    const listingsQuery = query(
      collection(db, "listings"),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(
      listingsQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteItems = snapshot.docs.map(
            (entry) => ({ id: entry.id, ...entry.data() }) as Listing,
          );
          setItems(remoteItems);
        }
      },
      (err) => console.log("Firestore offline/fallback active:", err.message),
    );
  }, []);

  // Filtered & Sorted items calculation
  const filteredItems = useMemo(() => {
    let result = items.filter((item) => {
      if (category !== "All items" && item.category !== category) return false;
      if (campusFilter !== "All campuses" && item.campus !== campusFilter)
        return false;
      if (hideSold && item.isSold) return false;

      const numPrice = item.price;
      if (minPrice !== "" && numPrice < Number(minPrice)) return false;
      if (maxPrice !== "" && numPrice > Number(maxPrice)) return false;

      if (queryText.trim() !== "") {
        const q = queryText.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(q);
        const inDesc = item.description?.toLowerCase().includes(q) || false;
        const inCat = item.category.toLowerCase().includes(q);
        const inCampus = item.campus.toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inCat && !inCampus) return false;
      }
      return true;
    });

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else {
      result = [...result].sort((a, b) => {
        const tA = typeof a.createdAt === "number" ? a.createdAt : 0;
        const tB = typeof b.createdAt === "number" ? b.createdAt : 0;
        return tB - tA;
      });
    }

    return result;
  }, [
    items,
    category,
    campusFilter,
    hideSold,
    minPrice,
    maxPrice,
    queryText,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setQueryText("");
    setCategory("All items");
    setCampusFilter("All campuses");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    setHideSold(false);
  };

  const handleToggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Active user identity for demo / Firebase
  const activeUserId = user ? user.uid : currentDemoUser.uid;
  const activeUserName = user
    ? user.displayName || user.email || "Campus Student"
    : currentDemoUser.displayName;

  // My Listings calculations
  const myListings = useMemo(() => {
    return items.filter(
      (item) => item.sellerId === activeUserId || item.seller === activeUserName,
    );
  }, [items, activeUserId, activeUserName]);

  const soldCount = useMemo(
    () => myListings.filter((i) => i.isSold).length,
    [myListings],
  );

  const totalEarnings = useMemo(
    () =>
      myListings
        .filter((i) => i.isSold)
        .reduce((sum, item) => sum + item.price, 0),
    [myListings],
  );

  // Toggle Favorite
  const toggleSaved = (id: string) => {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((val) => val !== id)
        : [...current, id],
    );
  };

  // Toggle Sold Status
  const handleToggleSold = (listingId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === listingId ? { ...item, isSold: !item.isSold } : item,
      ),
    );
    if (selected && selected.id === listingId) {
      setSelected((prev) => (prev ? { ...prev, isSold: !prev.isSold } : null));
    }
  };

  // Delete Listing
  const handleDeleteListing = (listingId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== listingId));
    setSavedIds((prev) => prev.filter((id) => id !== listingId));
    if (selected?.id === listingId) {
      setSelected(null);
    }
  };

  // Publish Listing
  const handlePublish = async (listingData: {
    title: string;
    price: string;
    category: string;
    condition: string;
    campus: string;
    image: string;
    description: string;
  }) => {
    const newListing: Listing = {
      id: `list-${Date.now()}`,
      title: listingData.title,
      price: Number(listingData.price),
      category: listingData.category,
      condition: listingData.condition,
      campus: listingData.campus,
      image: listingData.image,
      description: listingData.description,
      seller: activeUserName,
      sellerId: activeUserId,
      sellerMajor: currentDemoUser.major?.split(" ")[0] || "Student",
      sellerGradYear: currentDemoUser.gradYear?.replace("Class of ", "") || "'26",
      sellerRating: 5.0,
      meetupsCount: 1,
      isSold: false,
      createdAt: Date.now(),
    };

    setItems((prev) => [newListing, ...prev]);

    if (db) {
      try {
        await addDoc(collection(db, "listings"), {
          ...newListing,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn("Firestore sync skipped:", err);
      }
    }

    setSellOpen(false);
    setTab("Explore");
  };

  // Contact Seller
  const handleContactSeller = (listing: Listing) => {
    let conv = conversations.find(
      (c) => c.listingId === listing.id && c.buyerId === activeUserId,
    );

    if (!conv) {
      const newConvId = `conv-${Date.now()}`;
      conv = {
        id: newConvId,
        listingId: listing.id,
        listingTitle: listing.title,
        listingPrice: listing.price,
        listingImage: listing.image,
        buyerId: activeUserId,
        buyerName: activeUserName,
        sellerId: listing.sellerId || "student-seller",
        sellerName: listing.seller,
        lastMessage: "Is this still available?",
        lastMessageTime: "Just now",
        unreadCount: 0,
      };

      setConversations((prev) => [conv!, ...prev]);
      setMessages((prev) => ({
        ...prev,
        [newConvId]: [
          {
            id: `msg-${Date.now()}`,
            conversationId: newConvId,
            senderId: activeUserId,
            senderName: activeUserName,
            text: `Hi ${listing.seller}! Is your "${listing.title}" still available?`,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            type: "text",
          },
        ],
      }));
    }

    setSelected(null);
    setActiveConversationId(conv.id);
    setTab("Messages");
  };

  // Submit Offer
  const handleSubmitOffer = (amount: number) => {
    if (!selected) return;

    const targetListing = selected;
    let conv = conversations.find(
      (c) => c.listingId === targetListing.id && c.buyerId === activeUserId,
    );

    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      amount,
      originalPrice: targetListing.price,
      status: "pending",
      buyerId: activeUserId,
      buyerName: activeUserName,
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const convId = conv ? conv.id : `conv-${Date.now()}`;

    if (!conv) {
      conv = {
        id: convId,
        listingId: targetListing.id,
        listingTitle: targetListing.title,
        listingPrice: targetListing.price,
        listingImage: targetListing.image,
        buyerId: activeUserId,
        buyerName: activeUserName,
        sellerId: targetListing.sellerId || "student-seller",
        sellerName: targetListing.seller,
        lastMessage: `Offered $${amount}`,
        lastMessageTime: "Just now",
        activeOffer: newOffer,
      };
      setConversations((prev) => [conv!, ...prev]);
    } else {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                lastMessage: `Offered $${amount}`,
                lastMessageTime: "Just now",
                activeOffer: newOffer,
              }
            : c,
        ),
      );
    }

    const offerMsg: Message = {
      id: `msg-offer-${Date.now()}`,
      conversationId: convId,
      senderId: activeUserId,
      senderName: activeUserName,
      text: `${activeUserName} offered $${amount} for ${targetListing.title}`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "offer",
      offer: newOffer,
    };

    setMessages((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), offerMsg],
    }));

    setSelected(null);
    setActiveConversationId(convId);
    setTab("Messages");
  };

  // Respond to Offer (Accept / Decline)
  const handleRespondOffer = (
    convId: string,
    offerId: string,
    accepted: boolean,
  ) => {
    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Update messages offer status
    setMessages((prev) => {
      const list = prev[convId] || [];
      const updated = list.map((m) =>
        m.offer && m.offer.id === offerId
          ? {
              ...m,
              offer: {
                ...m.offer,
                status: (accepted ? "accepted" : "declined") as
                  | "accepted"
                  | "declined",
              },
            }
          : m,
      );

      const statusMsg: Message = {
        id: `msg-status-${Date.now()}`,
        conversationId: convId,
        senderId: activeUserId,
        senderName: activeUserName,
        text: accepted
          ? `✓ Offer accepted! Let's arrange a campus meetup spot.`
          : `Offer was declined.`,
        timestamp: timeStr,
        type: "text",
      };

      return { ...prev, [convId]: [...updated, statusMsg] };
    });

    // Update conversation state
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId && c.activeOffer
          ? {
              ...c,
              activeOffer: {
                ...c.activeOffer,
                status: (accepted ? "accepted" : "declined") as
                  | "accepted"
                  | "declined",
              },
              lastMessage: accepted
                ? `Offer of $${c.activeOffer.amount} accepted!`
                : `Offer declined.`,
              lastMessageTime: "Just now",
            }
          : c,
      ),
    );
  };

  // Send a message inside chat
  const handleSendMessage = (
    convId: string,
    text: string,
    senderId: string,
    senderName: string,
  ) => {
    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMsg: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      conversationId: convId,
      senderId,
      senderName,
      text,
      timestamp: timeStr,
      type: "text",
    };

    setMessages((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              lastMessage: text,
              lastMessageTime: "Just now",
            }
          : c,
      ),
    );
  };

  // Submit Safety Report
  const handleSubmitReport = (reason: string, details: string) => {
    if (!selected) return;
    setItems((prev) =>
      prev.map((i) => (i.id === selected.id ? { ...i, isReported: true } : i)),
    );
  };

  const signInWithGoogle = async () => {
    if (!auth) return;
    setAuthError("");
    try {
      await setPersistence(auth, browserLocalPersistence);
      if (Platform.OS === "web") {
        const result = await signInWithPopup(auth, new GoogleAuthProvider());
        await registerUser(result.user);
        setUser(result.user);
        setProfileReady(true);
        setAuthOpen(false);
      } else {
        await signInAnonymously(auth);
        setAuthOpen(false);
      }
    } catch (error) {
      const code =
        error instanceof Error ? error.message : "Google sign-in failed.";
      if (
        Platform.OS === "web" &&
        /popup|cancelled-popup-request/i.test(code)
      ) {
        await signInWithRedirect(auth, new GoogleAuthProvider());
        return;
      }
      setAuthError(code);
      Alert.alert("Google sign-in failed", code);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style={themeMode === "dark" ? "light" : "dark"} />

      {/* Main Pages */}
      {tab === "Explore" && (
        <ExplorePage
          items={filteredItems}
          query={queryText}
          category={category}
          campusFilter={campusFilter}
          minPrice={minPrice}
          maxPrice={maxPrice}
          sortBy={sortBy}
          hideSold={hideSold}
          savedIds={savedIds}
          currentUserName={activeUserName}
          currentUserAvatar={currentDemoUser.photoURL}
          themeMode={themeMode}
          onToggleTheme={handleToggleTheme}
          onQueryChange={setQueryText}
          onCategoryChange={setCategory}
          onCampusChange={setCampusFilter}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onSortByChange={setSortBy}
          onToggleHideSold={() => setHideSold(!hideSold)}
          onResetFilters={handleResetFilters}
          onSave={toggleSaved}
          onOpen={setSelected}
          onProfile={() => setTab("Profile")}
        />
      )}

      {tab === "Saved" && (
        <SavedPage
          items={items.filter((item) => savedIds.includes(item.id))}
          onSave={toggleSaved}
          onOpen={setSelected}
        />
      )}

      {tab === "Messages" && (
        <MessagesPage
          conversations={conversations}
          messages={messages}
          currentUserId={activeUserId}
          currentUserName={activeUserName}
          activeConversationId={activeConversationId}
          onSelectConversation={(id) => setActiveConversationId(id)}
          onBackToList={() => setActiveConversationId(null)}
          onSendMessage={handleSendMessage}
          onRespondOffer={handleRespondOffer}
          onBrowse={() => setTab("Explore")}
          onOpenListing={(listingId) => {
            const itm = items.find((i) => i.id === listingId);
            if (itm) setSelected(itm);
          }}
        />
      )}

      {tab === "MyListings" && (
        <MyListingsPage
          items={myListings}
          onOpen={setSelected}
          onSell={() => setSellOpen(true)}
          onToggleSold={handleToggleSold}
          onDeleteListing={handleDeleteListing}
        />
      )}

      {tab === "Profile" && (
        <ProfilePage
          user={user}
          currentDemoUser={currentDemoUser}
          savedCount={savedIds.length}
          listingCount={myListings.filter((i) => !i.isSold).length}
          soldCount={soldCount}
          totalEarnings={totalEarnings}
          firebaseConfigured={firebaseConfigured}
          profileReady={profileReady}
          error={authError}
          themeMode={themeMode}
          onToggleTheme={handleToggleTheme}
          onSelectDemoUser={(dUser) => setCurrentDemoUser(dUser)}
          onMyListings={() => setTab("MyListings")}
          onSaved={() => setTab("Saved")}
          onSignIn={() => setAuthOpen(true)}
          onSignOut={() => auth && signOut(auth)}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav
        tab={tab}
        savedCount={savedIds.length}
        messageCount={conversations.length}
        themeMode={themeMode}
        onChange={setTab}
        onSell={() => setSellOpen(true)}
      />

      {/* Listing Detail Modal */}
      <ListingModal
        item={selected}
        currentUserId={activeUserId}
        themeMode={themeMode}
        onClose={() => setSelected(null)}
        onContact={() => selected && handleContactSeller(selected)}
        onMakeOffer={() => setOfferModalOpen(true)}
        onReport={() => setReportModalOpen(true)}
        onToggleSold={() => selected && handleToggleSold(selected.id)}
        onDelete={() => selected && handleDeleteListing(selected.id)}
      />

      {/* Make an Offer Modal */}
      <OfferModal
        visible={offerModalOpen}
        listing={selected}
        onClose={() => setOfferModalOpen(false)}
        onSubmitOffer={handleSubmitOffer}
      />

      {/* Report Listing Safety Modal */}
      <ReportModal
        visible={reportModalOpen}
        listing={selected}
        onClose={() => setReportModalOpen(false)}
        onSubmitReport={handleSubmitReport}
      />

      {/* Sell Modal */}
      <SellModal
        visible={sellOpen}
        onClose={() => setSellOpen(false)}
        onSubmit={handlePublish}
      />

      {/* Auth Modal */}
      <AuthModal
        visible={authOpen}
        onClose={() => setAuthOpen(false)}
        onSignIn={signInWithGoogle}
        error={authError}
      />
    </SafeAreaView>
  );
}

function BottomNav({
  tab,
  savedCount,
  messageCount,
  themeMode,
  onChange,
  onSell,
}: {
  tab: Tab;
  savedCount: number;
  messageCount: number;
  themeMode: ThemeMode;
  onChange: (tab: Tab) => void;
  onSell: () => void;
}) {
  const colors = themeColors[themeMode];

  return (
    <View
      style={[
        styles.nav,
        { backgroundColor: colors.navBg, borderTopColor: colors.navBorder },
      ]}
    >
      <NavItem
        label="Explore"
        icon="⌂"
        active={tab === "Explore"}
        themeMode={themeMode}
        onPress={() => onChange("Explore")}
      />
      <NavItem
        label="Saved"
        icon="♡"
        active={tab === "Saved"}
        badge={savedCount > 0 ? savedCount : undefined}
        themeMode={themeMode}
        onPress={() => onChange("Saved")}
      />
      <NavItem
        label="Messages"
        icon="💬"
        active={tab === "Messages"}
        badge={messageCount > 0 ? messageCount : undefined}
        themeMode={themeMode}
        onPress={() => onChange("Messages")}
      />
      <NavItem
        label="My Items"
        icon="🏷"
        active={tab === "MyListings"}
        themeMode={themeMode}
        onPress={() => onChange("MyListings")}
      />
      <Pressable
        style={[styles.sellButton, { backgroundColor: colors.primary }]}
        onPress={onSell}
      >
        <Text style={styles.sellPlus}>＋</Text>
        <Text style={styles.sellText}>Sell</Text>
      </Pressable>
    </View>
  );
}

function NavItem({
  label,
  icon,
  active,
  badge,
  themeMode,
  onPress,
}: {
  label: string;
  icon: string;
  active: boolean;
  badge?: number;
  themeMode: ThemeMode;
  onPress: () => void;
}) {
  const colors = themeColors[themeMode];

  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <View>
        <Text
          style={[
            styles.navIcon,
            { color: colors.muted },
            active && { color: colors.primary },
          ]}
        >
          {icon}
        </Text>
        {badge ? (
          <View style={[styles.badge, { backgroundColor: colors.danger }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text
        style={[
          styles.navLabel,
          { color: colors.muted },
          active && { color: colors.primary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ListingModal({
  item,
  currentUserId,
  themeMode,
  onClose,
  onContact,
  onMakeOffer,
  onReport,
  onToggleSold,
  onDelete,
}: {
  item: Listing | null;
  currentUserId: string;
  themeMode: ThemeMode;
  onClose: () => void;
  onContact: () => void;
  onMakeOffer: () => void;
  onReport: () => void;
  onToggleSold: () => void;
  onDelete: () => void;
}) {
  if (!item) return null;

  const colors = themeColors[themeMode];
  const isOwner = item.sellerId === currentUserId;
  const isSold = Boolean(item.isSold);
  const icon = categoryIcons[item.category] || "🏷️";

  return (
    <Modal
      visible={item !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.detail, { backgroundColor: colors.card }]}>
          <Image source={{ uri: item.image }} style={styles.detailImage} />
          <Pressable style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>

          <ScrollView style={styles.detailBody} showsVerticalScrollIndicator={false}>
            {/* Category and Condition Badges */}
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.detailCategoryPill,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.detailCategory}>
                  {icon} {item.category.toUpperCase()}
                </Text>
              </View>
              <View
                style={[
                  styles.conditionPill,
                  { backgroundColor: colors.cardSecondary },
                ]}
              >
                <Text style={[styles.conditionText, { color: colors.primary }]}>
                  {item.condition}
                </Text>
              </View>
              <View
                style={[
                  styles.campusPill,
                  { backgroundColor: colors.cardSecondary },
                ]}
              >
                <Text
                  style={[styles.campusText, { color: colors.textSecondary }]}
                >
                  📍 {item.campus}
                </Text>
              </View>
            </View>

            {/* Sold Banner if Item is Sold */}
            {isSold && (
              <View
                style={[
                  styles.soldBanner,
                  {
                    backgroundColor: colors.dangerLight,
                    borderColor: colors.danger,
                  },
                ]}
              >
                <Text style={[styles.soldBannerTitle, { color: colors.danger }]}>
                  ⚠️ ITEM MARKED AS SOLD
                </Text>
                <Text style={[styles.soldBannerDesc, { color: colors.danger }]}>
                  This item has already found a buyer on campus.
                </Text>
              </View>
            )}

            <Text
              style={[
                styles.detailTitle,
                { color: colors.text },
                isSold && styles.titleSold,
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                styles.detailPrice,
                { color: colors.accent },
                isSold && styles.priceSold,
              ]}
            >
              ${item.price}
            </Text>

            {/* Seller Student Profile Card */}
            <View
              style={[
                styles.sellerProfileBox,
                {
                  backgroundColor: colors.cardSecondary,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.sellerHeader}>
                <View>
                  <Text style={[styles.sellerName, { color: colors.text }]}>
                    {item.seller}
                  </Text>
                  <Text style={[styles.sellerMajor, { color: colors.muted }]}>
                    🎓 {item.sellerMajor || "Student"} · Class of{" "}
                    {item.sellerGradYear || "'26"}
                  </Text>
                </View>
                {item.sellerRating ? (
                  <View style={styles.sellerRatingBox}>
                    <Text style={styles.sellerRatingValue}>
                      ⭐️ {item.sellerRating}
                    </Text>
                    <Text style={styles.sellerMeetups}>
                      {item.meetupsCount || 10} meetups
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            <Text style={[styles.descHeading, { color: colors.text }]}>
              Description & Campus Meetup
            </Text>
            <Text
              style={[styles.description, { color: colors.textSecondary }]}
            >
              {item.description}
            </Text>

            {/* Owner Management Controls */}
            {isOwner && (
              <View
                style={[
                  styles.ownerControls,
                  {
                    backgroundColor: colors.cardSecondary,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.ownerHeading, { color: colors.primary }]}>
                  Seller Management
                </Text>
                <View style={styles.ownerButtonsRow}>
                  <Pressable
                    style={[
                      styles.ownerBtn,
                      isSold ? styles.relistBtn : styles.markSoldBtn,
                    ]}
                    onPress={onToggleSold}
                  >
                    <Text
                      style={[
                        styles.ownerBtnText,
                        isSold ? styles.relistBtnText : styles.markSoldBtnText,
                      ]}
                    >
                      {isSold ? "Relist as Available" : "✓ Mark as Sold"}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[styles.ownerBtn, styles.deleteModalBtn]}
                    onPress={onDelete}
                  >
                    <Text style={styles.deleteModalBtnText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Buyer Contact & Make an Offer Buttons */}
            {!isOwner && (
              <View style={styles.buyerActionWrap}>
                <View style={styles.actionButtonsRow}>
                  <Pressable
                    disabled={isSold}
                    style={[
                      styles.primary,
                      { backgroundColor: colors.primary, flex: 1 },
                      isSold && styles.primaryDisabled,
                    ]}
                    onPress={onContact}
                  >
                    <Text style={styles.primaryText}>
                      {isSold ? "Item Sold" : `💬 Message Seller`}
                    </Text>
                  </Pressable>

                  {!isSold && (
                    <Pressable
                      style={[
                        styles.offerBtn,
                        { borderColor: colors.primary },
                      ]}
                      onPress={onMakeOffer}
                    >
                      <Text
                        style={[styles.offerBtnText, { color: colors.primary }]}
                      >
                        🤝 Offer
                      </Text>
                    </Pressable>
                  )}
                </View>

                {/* Report Listing Link */}
                <Pressable style={styles.reportRow} onPress={onReport}>
                  <Text style={styles.reportText}>
                    🚩 Flag or Report this listing
                  </Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function AuthModal({
  visible,
  onClose,
  onSignIn,
  error,
}: {
  visible: boolean;
  onClose: () => void;
  onSignIn: () => Promise<void>;
  error: string;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.auth}>
          <Text style={styles.formTitle}>Campus Marketplace</Text>
          <Text style={styles.authMessage}>
            Connect with your campus student account to sync real-time Cloud
            Firestore data.
          </Text>
          {error ? <Text style={styles.authError}>{error}</Text> : null}
          <Pressable style={styles.googleButton} onPress={onSignIn}>
            <Text style={styles.googleMark}>G</Text>
            <Text style={styles.outlineText}>Continue with Google</Text>
          </Pressable>
          <Pressable style={styles.outline} onPress={onClose}>
            <Text style={styles.outlineText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F4" },
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 82,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 10,
    paddingHorizontal: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
  },
  navIcon: {
    fontSize: 20,
    textAlign: "center",
  },
  navLabel: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: "700",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -10,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
  },
  sellButton: {
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 4,
  },
  sellPlus: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },
  sellText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  detail: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
    overflow: "hidden",
  },
  detailImage: {
    width: "100%",
    height: 250,
    backgroundColor: "#E5ECE5",
  },
  close: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  closeText: {
    color: "#FFF",
    fontSize: 22,
    lineHeight: 24,
  },
  detailBody: {
    padding: 20,
    paddingBottom: 40,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  detailCategoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  detailCategory: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  conditionPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  conditionText: {
    fontSize: 10,
    fontWeight: "700",
  },
  campusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  campusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  soldBanner: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  soldBannerTitle: {
    fontWeight: "800",
    fontSize: 12,
    marginBottom: 2,
  },
  soldBannerDesc: {
    fontSize: 11,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },
  titleSold: {
    color: "#87918C",
    textDecorationLine: "line-through",
  },
  detailPrice: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },
  priceSold: {
    color: "#87918C",
    textDecorationLine: "line-through",
  },
  sellerProfileBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  sellerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "800",
  },
  sellerMajor: {
    fontSize: 11,
    marginTop: 2,
  },
  sellerRatingBox: {
    alignItems: "flex-end",
  },
  sellerRatingValue: {
    fontSize: 12,
    fontWeight: "800",
    color: "#2E594B",
  },
  sellerMeetups: {
    fontSize: 10,
    color: "#87918C",
  },
  descHeading: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  ownerControls: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },
  ownerHeading: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  ownerButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },
  ownerBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  ownerBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  markSoldBtn: {
    backgroundColor: "#E4EDE6",
  },
  markSoldBtnText: {
    color: "#1F5D4C",
  },
  relistBtn: {
    backgroundColor: "#ECEFE9",
  },
  relistBtnText: {
    color: "#4A5A52",
  },
  deleteModalBtn: {
    flex: 0.5,
    backgroundColor: "#FDF0F1",
  },
  deleteModalBtnText: {
    color: "#C3535B",
    fontWeight: "700",
  },
  buyerActionWrap: {
    marginBottom: 20,
    gap: 10,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },
  offerBtn: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  offerBtnText: {
    fontWeight: "800",
    fontSize: 14,
  },
  reportRow: {
    alignItems: "center",
    paddingVertical: 4,
  },
  reportText: {
    fontSize: 11,
    color: "#87918C",
    fontWeight: "600",
  },
  primary: {
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryDisabled: {
    backgroundColor: "#A8B4AD",
  },
  primaryText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "800",
  },
  auth: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    alignSelf: "center",
    width: "90%",
    maxWidth: 400,
    marginBottom: 60,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#173C34",
    marginBottom: 8,
  },
  authMessage: {
    fontSize: 13,
    color: "#65766D",
    lineHeight: 18,
    marginBottom: 16,
  },
  authError: {
    color: "#B64950",
    backgroundColor: "#FDF0F1",
    padding: 8,
    borderRadius: 8,
    fontSize: 11,
    marginBottom: 12,
  },
  googleButton: {
    flexDirection: "row",
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BCD0C3",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  googleMark: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1F5D4C",
  },
  outline: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  outlineText: {
    color: "#1F5D4C",
    fontSize: 13,
    fontWeight: "700",
  },
});
