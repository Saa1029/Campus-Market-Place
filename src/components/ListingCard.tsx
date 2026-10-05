import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Listing } from "../types";

export function ListingCard({
  item,
  saved,
  onSave,
  onOpen,
}: {
  item: Listing;
  saved: boolean;
  onSave: () => void;
  onOpen: () => void;
}) {
  const isSold = Boolean(item.isSold);

  return (
    <Pressable
      style={[styles.card, isSold && styles.cardSold]}
      onPress={onOpen}
    >
      <View style={styles.photo}>
        <Image
          source={{ uri: item.image }}
          style={[styles.image, isSold && styles.imageSold]}
        />
        {isSold && (
          <View style={styles.soldBadge}>
            <Text style={styles.soldBadgeText}>SOLD</Text>
          </View>
        )}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
        <Pressable
          accessibilityLabel={saved ? "Remove saved item" : "Save item"}
          style={styles.save}
          onPress={onSave}
        >
          <Text style={[styles.heart, saved && styles.red]}>
            {saved ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={[styles.title, isSold && styles.textSold]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.price, isSold && styles.priceSold]}>
            ${item.price}
          </Text>
        </View>
        <Text style={styles.muted} numberOfLines={1}>
          {item.condition} · {item.campus}
        </Text>
        <Text style={styles.tiny} numberOfLines={1}>
          Listed by {item.seller}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E9ECE6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSold: {
    opacity: 0.85,
    borderColor: "#E2E5E0",
  },
  photo: { height: 148, backgroundColor: "#E5ECE5", position: "relative" },
  image: { width: "100%", height: "100%" },
  imageSold: {
    opacity: 0.65,
  },
  soldBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#B64950",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 2,
  },
  soldBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  categoryBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(23, 60, 52, 0.85)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
  },
  save: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,.94)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  heart: { color: "#365B4C", fontSize: 18 },
  red: { color: "#C3535B" },
  body: { padding: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 5 },
  title: {
    flex: 1,
    minHeight: 34,
    color: "#1B3A33",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
  },
  textSold: {
    color: "#7A8580",
    textDecorationLine: "line-through",
  },
  price: { color: "#1C7057", fontSize: 14, fontWeight: "800" },
  priceSold: {
    color: "#8E9993",
    textDecorationLine: "line-through",
  },
  muted: { color: "#87918C", fontSize: 11, marginTop: 2 },
  tiny: { color: "#A0AAA4", fontSize: 10, marginTop: 4 },
});
