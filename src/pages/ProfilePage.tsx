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
import { themeColors } from "../theme";
import { DemoUser, ThemeMode } from "../types";

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
  themeMode = "light",
  onToggleTheme,
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
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
  onSelectDemoUser: (demoUser: DemoUser) => void;
  onMyListings: () => void;
  onSaved: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  const colors = themeColors[themeMode];

  const name =
    currentDemoUser?.displayName ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Campus Student";

  const email =
    currentDemoUser?.email || user?.email || "student@campus.edu";

  const campus = currentDemoUser?.campus || "North Campus";
  const major = currentDemoUser?.major || "Computer Science B.S.";
  const gradYear = currentDemoUser?.gradYear || "Class of '26";
  const rating = currentDemoUser?.rating || 4.9;
  const meetupsCount = currentDemoUser?.meetupsCount || 15;
  const photo = currentDemoUser?.photoURL || user?.photoURL;

  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { backgroundColor: colors.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <PageTitle title="Student Profile" subtitle="Your campus marketplace hub" />

      {/* Hero Profile Card */}
      <View
        style={[
          styles.heroCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.heroHeader}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatar,
                { backgroundColor: colors.primaryLight, borderColor: colors.primary },
              ]}
            >
              <Text style={[styles.initials, { color: colors.primary }]}>
                {initials}
              </Text>
            </View>
          )}

          <View style={styles.heroText}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                {name}
              </Text>
            </View>
            <Text style={[styles.subText, { color: colors.muted }]}>
              🎓 {major} · {gradYear}
            </Text>
            <Text style={[styles.emailText, { color: colors.muted }]}>{email}</Text>
            <View style={styles.badgeRow}>
              <View
                style={[styles.verifiedBadge, { backgroundColor: colors.primaryLight }]}
              >
                <Text style={[styles.verifiedText, { color: colors.primary }]}>
                  ✓ Verified Student
                </Text>
              </View>
              <View
                style={[styles.ratingBadge, { backgroundColor: colors.cardSecondary }]}
              >
                <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                  ⭐️ {rating} ({meetupsCount} meetups)
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Dashboard Statistics */}
        <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
          <Pressable style={styles.statBox} onPress={onMyListings}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {listingCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Active</Text>
          </Pressable>

          <Pressable style={styles.statBox} onPress={onMyListings}>
            <Text style={[styles.statValue, { color: colors.danger }]}>
              {soldCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Sold</Text>
          </Pressable>

          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.accent }]}>
              ${totalEarnings}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Earned</Text>
          </View>

          <Pressable style={styles.statBox} onPress={onSaved}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {savedCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Saved</Text>
          </Pressable>
        </View>
      </View>

      {/* Demo Presentation Profile Switcher */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Demo Team Switcher
          </Text>
          <Text
            style={[
              styles.demoTag,
              { backgroundColor: colors.primaryLight, color: colors.primary },
            ]}
          >
            5-Member Assignment Mode
          </Text>
        </View>
        <Text style={[styles.sectionDescription, { color: colors.muted }]}>
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
                  {
                    backgroundColor: colors.cardSecondary,
                    borderColor: colors.border,
                  },
                  isSelected && {
                    backgroundColor: colors.primaryLight,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => onSelectDemoUser(dUser)}
              >
                {dUser.photoURL ? (
                  <Image source={{ uri: dUser.photoURL }} style={styles.miniAvatar} />
                ) : (
                  <View
                    style={[
                      styles.miniAvatar,
                      { backgroundColor: colors.primaryLight },
                    ]}
                  >
                    <Text
                      style={[styles.miniInitials, { color: colors.primary }]}
                    >
                      {dUser.displayName[0]}
                    </Text>
                  </View>
                )}
                <View style={styles.demoUserInfo}>
                  <Text
                    style={[
                      styles.demoUserName,
                      { color: colors.textSecondary },
                      isSelected && { color: colors.primary, fontWeight: "800" },
                    ]}
                  >
                    {dUser.displayName}
                  </Text>
                  <Text style={[styles.demoUserCampus, { color: colors.muted }]}>
                    {dUser.major} · {dUser.campus}
                  </Text>
                </View>
                {isSelected && (
                  <Text style={[styles.checkMark, { color: colors.primary }]}>
                    ✓ Active
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Account Settings & Navigation */}
      <View
        style={[
          styles.menu,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Row
          label="My listings"
          value={`${listingCount} active · ${soldCount} sold`}
          onPress={onMyListings}
          colors={colors}
        />
        <Row
          label="Saved items"
          value={String(savedCount)}
          onPress={onSaved}
          colors={colors}
        />
        <Row
          label="Campus meetup zone"
          value={campus}
          colors={colors}
        />
        {onToggleTheme && (
          <Row
            label="Appearance"
            value={themeMode === "dark" ? "Dark Mode 🌙" : "Light Mode ☀️"}
            onPress={onToggleTheme}
            colors={colors}
          />
        )}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {user && profileReady ? (
        <Text style={[styles.success, { color: colors.primary }]}>
          Profile synced to Firebase
        </Text>
      ) : null}

      {/* Auth Action */}
      {user ? (
        <Pressable
          style={[styles.outline, { borderColor: colors.border }]}
          onPress={onSignOut}
        >
          <Text style={[styles.outlineText, { color: colors.primary }]}>
            Sign out of Firebase
          </Text>
        </Pressable>
      ) : (
        <Pressable
          style={[styles.primary, { backgroundColor: colors.primary }]}
          onPress={onSignIn}
        >
          <Text style={styles.primaryText}>Sign in with Google</Text>
        </Pressable>
      )}

      <Text style={[styles.backend, { color: colors.muted }]}>
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
  colors,
}: {
  label: string;
  value: string;
  onPress?: () => void;
  colors: any;
}) {
  return (
    <Pressable
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={onPress}
    >
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <Text style={[styles.muted, { color: colors.muted }]}>{value} ›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 110 },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 16,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  initials: { fontSize: 24, fontWeight: "800" },
  heroText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  subText: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 2,
  },
  emailText: { fontSize: 11, marginBottom: 8 },
  badgeRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  verifiedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: "700",
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
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
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  sectionCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
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
  },
  demoTag: {
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sectionDescription: {
    fontSize: 12,
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
    borderWidth: 1,
    gap: 10,
  },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  miniInitials: {
    fontSize: 14,
    fontWeight: "800",
  },
  demoUserInfo: {
    flex: 1,
  },
  demoUserName: {
    fontSize: 13,
    fontWeight: "700",
  },
  demoUserCampus: {
    fontSize: 10,
  },
  checkMark: {
    fontSize: 12,
    fontWeight: "800",
  },
  menu: {
    borderRadius: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  row: {
    height: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  label: { fontWeight: "700", fontSize: 13 },
  muted: { fontSize: 12 },
  primary: {
    height: 48,
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  outlineText: { fontWeight: "800", fontSize: 14 },
  success: { fontSize: 12, fontWeight: "700", marginTop: 12, textAlign: "center" },
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
    fontSize: 11,
    marginTop: 18,
  },
});
