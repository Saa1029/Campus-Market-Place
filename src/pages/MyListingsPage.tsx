//Chamodya
import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { EmptyState } from "../components/EmptyState";
import { PageTitle } from "../components/PageTitle";
import { Listing } from "../types";

export function MyListingsPage({
  items,
  onOpen,
  onSell,
  onToggleSold,
  onDeleteListing,
}: {
  items: Listing[];
  onOpen: (item: Listing) => void;
  onSell: () => void;
  onToggleSold: (id: string) => void;
  onDeleteListing: (id: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | "active" | "sold">("all");

  const totalCount = items.length;
  const soldCount = items.filter((i) => i.isSold).length;
  const activeCount = totalCount - soldCount;

  const filteredItems = items.filter((item) => {
    if (filter === "active") return !item.isSold;
    if (filter === "sold") return item.isSold;
    return true;
  });

  const confirmDelete = (item: Listing) => {
    Alert.alert(
      "Delete listing",
      `Are you sure you want to remove "${item.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeleteListing(item.id),
        },
      ],
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <PageTitle
        title="My listings"
        subtitle="Manage your campus marketplace items and sales"
      />

      {/* Summary Metrics */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{totalCount}</Text>
          <Text style={styles.metricLabel}>Total Listed</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricValue, { color: "#1C7057" }]}>{activeCount}</Text>
          <Text style={styles.metricLabel}>Active</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricValue, { color: "#B64950" }]}>{soldCount}</Text>
          <Text style={styles.metricLabel}>Sold</Text>
        </View>
      </View>

      {/* Action Header */}
      <View style={styles.actionHeader}>
        <View style={styles.filterTabs}>
          {(["all", "active", "sold"] as const).map((tabKey) => (
            <Pressable
              key={tabKey}
              style={[styles.filterTab, filter === tabKey && styles.activeFilterTab]}
              onPress={() => setFilter(tabKey)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === tabKey && styles.activeFilterTabText,
                ]}
              >
                {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.sellBtn} onPress={onSell}>
          <Text style={styles.sellBtnText}>+ New</Text>
        </Pressable>
      </View>

      {/* Listings List */}
      <FlatList
        data={filteredItems}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            title={
              filter === "sold"
                ? "No sold items yet"
                : filter === "active"
                ? "No active listings"
                : "No listings yet"
            }
            message="Publish an item and manage it right here."
            action="Sell an item"
            onAction={onSell}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Pressable style={styles.itemMain} onPress={() => onOpen(item)}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <View style={styles.titlePriceRow}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                </View>

                <Text style={styles.itemMeta}>
                  {item.category} · {item.campus} · {item.condition}
                </Text>

                <View style={styles.statusBadgeRow}>
                  <View
                    style={[
                      styles.statusBadge,
                      item.isSold ? styles.statusSold : styles.statusActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        item.isSold
                          ? styles.statusSoldText
                          : styles.statusActiveText,
                      ]}
                    >
                      {item.isSold ? "● SOLD" : "● ACTIVE"}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>

            {/* Owner Actions */}
            <View style={styles.cardActions}>
              <Pressable
                style={[
                  styles.actionButton,
                  item.isSold ? styles.relistBtn : styles.markSoldBtn,
                ]}
                onPress={() => onToggleSold(item.id)}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    item.isSold ? styles.relistBtnText : styles.markSoldBtnText,
                  ]}
                >
                  {item.isSold ? "Relist as Available" : "✓ Mark as Sold"}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.actionButton, styles.deleteBtn]}
                onPress={() => confirmDelete(item)}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 110 },
  metricsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9ECE6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#173C34",
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#87918C",
  },
  actionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filterTabs: {
    flexDirection: "row",
    backgroundColor: "#ECEFE9",
    borderRadius: 10,
    padding: 3,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  activeFilterTab: {
    backgroundColor: "#FFF",
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64736C",
  },
  activeFilterTabText: {
    color: "#173C34",
    fontWeight: "700",
  },
  sellBtn: {
    backgroundColor: "#1F5D4C",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  sellBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
  },
  list: {
    gap: 14,
  },
  itemCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E9ECE6",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  itemMain: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#E5ECE5",
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  titlePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 6,
  },
  itemTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#1B3A33",
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1C7057",
  },
  itemMeta: {
    fontSize: 11,
    color: "#87918C",
    marginTop: 2,
  },
  statusBadgeRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: "#E3F1EB",
  },
  statusSold: {
    backgroundColor: "#FBECEE",
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  statusActiveText: {
    color: "#1F5D4C",
  },
  statusSoldText: {
    color: "#B64950",
  },
  cardActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#EEF1EC",
    backgroundColor: "#F9FAF8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: 12,
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
  deleteBtn: {
    flex: 0.5,
    backgroundColor: "#FDF0F1",
  },
  deleteBtnText: {
    color: "#C3535B",
    fontSize: 12,
    fontWeight: "700",
  },
});
