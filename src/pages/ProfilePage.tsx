import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { User } from "firebase/auth";
import { PageTitle } from "../components/PageTitle";
import { demoUsers } from "../data";
import { DemoUser } from "../types";

export function ProfilePage({
  user,
  currentDemoUser,
  savedCount,
  listingCount,
  soldCount,
  totalEarnings,
  firebaseConfigured,
  profileReady,
  error,
  onSelectDemoUser,
  onMyListings,
  onSaved,
  onSignIn,
  onSignOut,
}: {
  user: User | null;
  currentDemoUser: DemoUser | null;
  savedCount: number;
  listingCount: number;
  soldCount: number;
  totalEarnings: number;
  firebaseConfigured: boolean;
  profileReady: boolean;
  error: string;
  onSelectDemoUser: (demoUser: DemoUser) => void;
  onMyListings: () => void;
  onSaved: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  const name =
    currentDemoUser?.displayName ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Campus Student";

  const email =
    currentDemoUser?.email || user?.email || "student@campus.edu";

  const campus = currentDemoUser?.campus || "North Campus";
  const photo = currentDemoUser?.photoURL || user?.photoURL;

  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <PageTitle title="Student Profile" subtitle="Your campus marketplace hub" />

      {/* Hero Profile Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.initials}>{initials}</Text>
            </View>
          )}

          <View style={styles.heroText}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {name}
              </Text>
            </View>
            <Text style={styles.emailText}>{email}</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified Student · {campus}</Text>
            </View>
          </View>
        </View>

        {/* Dashboard Statistics */}
        <View style={styles.statsRow}>
          <Pressable style={styles.statBox} onPress={onMyListings}>
            <Text style={styles.statValue}>{listingCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </Pressable>

          <Pressable style={styles.statBox} onPress={onMyListings}>
            <Text style={[styles.statValue, { color: "#B64950" }]}>{soldCount}</Text>
            <Text style={styles.statLabel}>Sold</Text>
          </Pressable>

          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: "#1C7057" }]}>${totalEarnings}</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>

          <Pressable style={styles.statBox} onPress={onSaved}>
            <Text style={styles.statValue}>{savedCount}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </Pressable>
        </View>
      </View>

      {/* Demo Presentation Profile Switcher */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Demo Team Switcher</Text>
          <Text style={styles.demoTag}>5-Member Assignment Mode</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Switch active team member profile for video recording demonstration:
        </Text>

        <View style={styles.demoUsersList}>
          {demoUsers.map((dUser) => {
            const isSelected = currentDemoUser?.uid === dUser.uid;
            return (
              <Pressable
                key={dUser.uid}
                style={[
                  styles.demoUserRow,
                  isSelected && styles.demoUserRowSelected,
                ]}
                onPress={() => onSelectDemoUser(dUser)}
              >
                {dUser.photoURL ? (
                  <Image source={{ uri: dUser.photoURL }} style={styles.miniAvatar} />
                ) : (
                  <View style={styles.miniAvatar}>
                    <Text style={styles.miniInitials}>{dUser.displayName[0]}</Text>
                  </View>
                )}
                <View style={styles.demoUserInfo}>
                  <Text
                    style={[
                      styles.demoUserName,
                      isSelected && styles.demoUserNameSelected,
                    ]}
                  >
                    {dUser.displayName}
                  </Text>
                  <Text style={styles.demoUserCampus}>{dUser.campus}</Text>
                </View>
                {isSelected && <Text style={styles.checkMark}>✓ Active</Text>}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Account Settings & Navigation */}
      <View style={styles.menu}>
        <Row
          label="My listings"
          value={`${listingCount} active · ${soldCount} sold`}
          onPress={onMyListings}
        />
        <Row label="Saved items" value={String(savedCount)} onPress={onSaved} />
        <Row label="Campus meetup zone" value={campus} />
        <Row label="Student safety guidelines" value="Read tips" />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {user && profileReady ? (
        <Text style={styles.success}>Profile synced to Firebase</Text>
      ) : null}

      {/* Auth Action */}
      {user ? (
        <Pressable style={styles.outline} onPress={onSignOut}>
          <Text style={styles.outlineText}>Sign out of Firebase</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.primary} onPress={onSignIn}>
          <Text style={styles.primaryText}>Sign in with Google</Text>
        </Pressable>
      )}

      <Text style={styles.backend}>
        {firebaseConfigured
          ? "Connected to Cloud Firestore & Firebase Auth"
          : "Local Demo Mode Active · Zero setup required for presentation demo"}
      </Text>
    </ScrollView>
  );
}

function Row({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.muted}>{value} ›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 110 },
  heroCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E9ECE6",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#D6E5D7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#B4CDB7",
  },
  initials: { fontSize: 24, color: "#225347", fontWeight: "800" },
  heroText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    color: "#173C34",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  emailText: { color: "#87918C", fontSize: 12, marginBottom: 6 },
  verifiedBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E4EDE6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedText: {
    color: "#1F5D4C",
    fontSize: 10,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#EEF1EC",
    paddingTop: 12,
    gap: 8,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#173C34",
  },
  statLabel: {
    fontSize: 11,
    color: "#87918C",
    fontWeight: "600",
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E9ECE6",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#173C34",
  },
  demoTag: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1F5D4C",
    backgroundColor: "#E4EDE6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sectionDescription: {
    fontSize: 12,
    color: "#87918C",
    marginBottom: 12,
  },
  demoUsersList: {
    gap: 8,
  },
  demoUserRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#F8FAF7",
    borderWidth: 1,
    borderColor: "#E4E8E1",
    gap: 10,
  },
  demoUserRowSelected: {
    backgroundColor: "#E8F0EC",
    borderColor: "#1F5D4C",
  },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D6E5D7",
    alignItems: "center",
    justifyContent: "center",
  },
  miniInitials: {
    fontSize: 14,
    fontWeight: "800",
    color: "#225347",
  },
  demoUserInfo: {
    flex: 1,
  },
  demoUserName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#24483D",
  },
  demoUserNameSelected: {
    color: "#1F5D4C",
    fontWeight: "800",
  },
  demoUserCampus: {
    fontSize: 10,
    color: "#87918C",
  },
  checkMark: {
    color: "#1F5D4C",
    fontSize: 12,
    fontWeight: "800",
  },
  menu: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#E9ECE6",
    marginBottom: 16,
  },
  row: {
    height: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1EC",
  },
  label: { color: "#24483D", fontWeight: "700", fontSize: 13 },
  muted: { color: "#87918C", fontSize: 12 },
  primary: {
    height: 48,
    backgroundColor: "#1F5D4C",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  primaryText: { color: "#FFF", fontWeight: "800", fontSize: 14 },
  outline: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BCD0C3",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  outlineText: { color: "#1F5D4C", fontWeight: "800", fontSize: 14 },
  success: { color: "#23775D", fontSize: 12, fontWeight: "700", marginTop: 12, textAlign: "center" },
  error: {
    color: "#B64950",
    backgroundColor: "#FBECEE",
    borderRadius: 10,
    padding: 10,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 12,
  },
  backend: {
    textAlign: "center",
    color: "#9BA59F",
    fontSize: 11,
    marginTop: 18,
  },
});
