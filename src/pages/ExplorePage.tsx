import { useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ListingCard } from "../components/ListingCard";
import { campuses, categories } from "../data";
import { Listing, SortOption } from "../types";

export function ExplorePage({
  items,
  query,
  category,
  campusFilter,
  minPrice,
  maxPrice,
  sortBy,
  hideSold,
  savedIds,
  currentUserAvatar,
  currentUserName,
  onQueryChange,
  onCategoryChange,
  onCampusChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortByChange,
  onToggleHideSold,
  onResetFilters,
  onSave,
  onOpen,
  onProfile,
}: {
  items: Listing[];
  query: string;
  category: string;
  campusFilter: string;
  minPrice: string;
  maxPrice: string;
  sortBy: SortOption;
  hideSold: boolean;
  savedIds: string[];
  currentUserAvatar?: string | null;
  currentUserName?: string;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCampusChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onSortByChange: (value: SortOption) => void;
  onToggleHideSold: () => void;
  onResetFilters: () => void;
  onSave: (id: string) => void;
  onOpen: (item: Listing) => void;
  onProfile: () => void;
}) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const hasActiveFilters =
    category !== "All items" ||
    campusFilter !== "All campuses" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    sortBy !== "newest" ||
    hideSold;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>CAMPUS MARKETPLACE</Text>
          <Text style={styles.heading}>
            Find your next{"\n"}favorite thing.
          </Text>
        </View>
        <Pressable style={styles.avatar} onPress={onProfile}>
          <Text style={styles.avatarText}>
            {currentUserName ? currentUserName[0].toUpperCase() : "👤"}
          </Text>
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.search}>
        <Text style={styles.icon}>⌕</Text>
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search textbooks, tech, desks..."
          placeholderTextColor="#87918C"
          style={styles.input}
        />
        {query.length > 0 && (
          <Pressable onPress={() => onQueryChange("")} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Filter and Sort Toggle Bar */}
      <View style={styles.filterBar}>
        <Pressable
          style={[
            styles.filterToggleBtn,
            (showFilterPanel || hasActiveFilters) && styles.filterToggleActive,
          ]}
          onPress={() => setShowFilterPanel(!showFilterPanel)}
        >
          <Text
            style={[
              styles.filterToggleText,
              (showFilterPanel || hasActiveFilters) && styles.filterToggleTextActive,
            ]}
          >
            ⚙ Filters & Sort {hasActiveFilters ? "•" : ""}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.soldToggleBtn, hideSold && styles.soldToggleBtnActive]}
          onPress={onToggleHideSold}
        >
          <Text style={[styles.soldToggleText, hideSold && styles.soldToggleTextActive]}>
            {hideSold ? "✓ Available only" : "All items (inc. Sold)"}
          </Text>
        </Pressable>
      </View>

      {/* Expandable Filter & Sort Drawer */}
      {showFilterPanel && (
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Filters & Sort</Text>
            {hasActiveFilters && (
              <Pressable onPress={onResetFilters}>
                <Text style={styles.resetText}>Reset all</Text>
              </Pressable>
            )}
          </View>

          {/* Sort By */}
          <Text style={styles.sublabel}>Sort by:</Text>
          <View style={styles.optionRow}>
            {[
              { id: "newest", label: "Newest" },
              { id: "price-asc", label: "Price: Low to High" },
              { id: "price-desc", label: "Price: High to Low" },
            ].map((opt) => (
              <Pressable
                key={opt.id}
                style={[
                  styles.optionPill,
                  sortBy === opt.id && styles.activeOptionPill,
                ]}
                onPress={() => onSortByChange(opt.id as SortOption)}
              >
                <Text
                  style={[
                    styles.optionText,
                    sortBy === opt.id && styles.activeOptionText,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Price Range */}
          <Text style={styles.sublabel}>Price Range ($ USD):</Text>
          <View style={styles.priceRow}>
            <View style={styles.priceInputWrap}>
              <Text style={styles.currencyPrefix}>$</Text>
              <TextInput
                value={minPrice}
                onChangeText={onMinPriceChange}
                placeholder="Min"
                placeholderTextColor="#87918C"
                keyboardType="numeric"
                style={styles.priceInput}
              />
            </View>
            <Text style={styles.priceTo}>to</Text>
            <View style={styles.priceInputWrap}>
              <Text style={styles.currencyPrefix}>$</Text>
              <TextInput
                value={maxPrice}
                onChangeText={onMaxPriceChange}
                placeholder="Max"
                placeholderTextColor="#87918C"
                keyboardType="numeric"
                style={styles.priceInput}
              />
            </View>
          </View>

          {/* Quick Price Buttons */}
          <View style={styles.quickPriceRow}>
            {[
              { label: "Under $25", max: "25" },
              { label: "Under $50", max: "50" },
              { label: "Under $100", max: "100" },
            ].map((qp) => (
              <Pressable
                key={qp.label}
                style={[
                  styles.quickPriceBtn,
                  maxPrice === qp.max && styles.quickPriceBtnActive,
                ]}
                onPress={() => {
                  onMinPriceChange("");
                  onMaxPriceChange(qp.max);
                }}
              >
                <Text
                  style={[
                    styles.quickPriceText,
                    maxPrice === qp.max && styles.quickPriceTextActive,
                  ]}
                >
                  {qp.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Campus Filter */}
          <Text style={styles.sublabel}>Campus Meetup Location:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionRow}
          >
            {["All campuses", ...campuses].map((camp) => (
              <Pressable
                key={camp}
                style={[
                  styles.optionPill,
                  campusFilter === camp && styles.activeOptionPill,
                ]}
                onPress={() => onCampusChange(camp)}
              >
                <Text
                  style={[
                    styles.optionText,
                    campusFilter === camp && styles.activeOptionText,
                  ]}
                >
                  {camp}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Categories Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
      >
        {categories.map((value) => (
          <Pressable
            key={value}
            onPress={() => onCategoryChange(value)}
            style={[
              styles.category,
              category === value && styles.activeCategory,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                category === value && styles.activeText,
              ]}
            >
              {value}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Section Header with Item Count */}
      <View style={styles.section}>
        <View>
          <Text style={styles.sectionTitle}>Browse listings</Text>
          <Text style={styles.muted}>
            {hasActiveFilters ? "Filtered campus items" : "All campus items"}
          </Text>
        </View>
        <Text style={styles.seeAll}>
          {items.length} {items.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersRow}>
          {category !== "All items" && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>{category}</Text>
              <Pressable onPress={() => onCategoryChange("All items")}>
                <Text style={styles.filterChipClose}>×</Text>
              </Pressable>
            </View>
          )}
          {campusFilter !== "All campuses" && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>{campusFilter}</Text>
              <Pressable onPress={() => onCampusChange("All campuses")}>
                <Text style={styles.filterChipClose}>×</Text>
              </Pressable>
            </View>
          )}
          {maxPrice !== "" && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>≤ ${maxPrice}</Text>
              <Pressable onPress={() => onMaxPriceChange("")}>
                <Text style={styles.filterChipClose}>×</Text>
              </Pressable>
            </View>
          )}
          {minPrice !== "" && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>≥ ${minPrice}</Text>
              <Pressable onPress={() => onMinPriceChange("")}>
                <Text style={styles.filterChipClose}>×</Text>
              </Pressable>
            </View>
          )}
          {hideSold && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>Available Only</Text>
              <Pressable onPress={onToggleHideSold}>
                <Text style={styles.filterChipClose}>×</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      {/* Grid of Listings */}
      <FlatList
        data={items}
        scrollEnabled={false}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No matching listings</Text>
            <Text style={styles.emptyText}>
              We couldn't find anything matching your filters or search term.
            </Text>
            {hasActiveFilters && (
              <Pressable style={styles.resetBtn} onPress={onResetFilters}>
                <Text style={styles.resetBtnText}>Clear all filters</Text>
              </Pressable>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            saved={savedIds.includes(item.id)}
            onSave={() => onSave(item.id)}
            onOpen={() => onOpen(item)}
          />
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 110 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 28,
    paddingBottom: 24,
  },
  eyebrow: {
    color: "#65766D",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  heading: {
    color: "#173C34",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#D6E5D7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#B4CDB7",
  },
  avatarText: { color: "#225347", fontWeight: "800", fontSize: 16 },
  search: {
    height: 52,
    backgroundColor: "#FFF",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E6E9E2",
    marginBottom: 12,
  },
  icon: { color: "#49635A", fontSize: 24, marginRight: 8 },
  input: { flex: 1, color: "#173C34", fontSize: 14 },
  clearBtn: {
    padding: 6,
  },
  clearBtnText: {
    color: "#87918C",
    fontSize: 14,
    fontWeight: "700",
  },
  filterBar: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  filterToggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E5DD",
  },
  filterToggleActive: {
    backgroundColor: "#E4EDE6",
    borderColor: "#23775D",
  },
  filterToggleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4A5A52",
  },
  filterToggleTextActive: {
    color: "#1F5D4C",
  },
  soldToggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E5DD",
  },
  soldToggleBtnActive: {
    backgroundColor: "#E8F0EC",
    borderColor: "#1F5D4C",
  },
  soldToggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#65766D",
  },
  soldToggleTextActive: {
    color: "#1F5D4C",
    fontWeight: "700",
  },
  drawer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E5DD",
    marginBottom: 16,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  drawerTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#173C34",
  },
  resetText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#C3535B",
  },
  sublabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4A5A52",
    marginTop: 10,
    marginBottom: 6,
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#F2F5F0",
    borderWidth: 1,
    borderColor: "#E2E7DE",
  },
  activeOptionPill: {
    backgroundColor: "#1F5D4C",
    borderColor: "#1F5D4C",
  },
  optionText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4A5A52",
  },
  activeOptionText: {
    color: "#FFF",
    fontWeight: "700",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  priceInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F9F6",
    borderWidth: 1,
    borderColor: "#E0E5DD",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  currencyPrefix: {
    fontSize: 14,
    fontWeight: "700",
    color: "#65766D",
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    fontSize: 13,
    color: "#173C34",
  },
  priceTo: {
    fontSize: 12,
    fontWeight: "600",
    color: "#87918C",
  },
  quickPriceRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  quickPriceBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#F5F7F3",
    borderWidth: 1,
    borderColor: "#E2E7DE",
  },
  quickPriceBtnActive: {
    backgroundColor: "#E4EDE6",
    borderColor: "#23775D",
  },
  quickPriceText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#54665D",
  },
  quickPriceTextActive: {
    color: "#1F5D4C",
    fontWeight: "700",
  },
  categories: { gap: 8, paddingBottom: 14 },
  category: {
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#ECEFE9",
  },
  activeCategory: { backgroundColor: "#1F5D4C" },
  categoryText: { color: "#64736C", fontSize: 12, fontWeight: "700" },
  activeText: { color: "#FFF" },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#173C34",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  muted: { color: "#87918C", fontSize: 12 },
  seeAll: { color: "#23775D", fontWeight: "700", fontSize: 12 },
  activeFiltersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E4EDE6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1F5D4C",
  },
  filterChipClose: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F5D4C",
    lineHeight: 14,
  },
  grid: { gap: 14 },
  columns: { gap: 14 },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#173C34",
    marginBottom: 6,
  },
  emptyText: {
    textAlign: "center",
    color: "#87918C",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  resetBtn: {
    backgroundColor: "#1F5D4C",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
