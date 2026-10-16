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
import { campuses, categories, categoryIcons } from "../data";
import { themeColors } from "../theme";
import { Listing, SortOption, ThemeMode } from "../types";

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
  themeMode = "light",
  onToggleTheme,
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
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
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
  const colors = themeColors[themeMode];

  const hasActiveFilters =
    category !== "All items" ||
    campusFilter !== "All campuses" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    sortBy !== "newest" ||
    hideSold;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { backgroundColor: colors.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.eyebrow, { color: colors.muted }]}>
            CAMPUS MARKETPLACE
          </Text>
          <Text style={[styles.heading, { color: colors.text }]}>
            Find your next{"\n"}favorite thing.
          </Text>
        </View>

        <View style={styles.headerActions}>
          {onToggleTheme && (
            <Pressable
              style={[
                styles.themeBtn,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={onToggleTheme}
            >
              <Text style={styles.themeBtnIcon}>
                {themeMode === "dark" ? "☀️" : "🌙"}
              </Text>
            </Pressable>
          )}

          <Pressable
            style={[
              styles.avatar,
              { backgroundColor: colors.primaryLight, borderColor: colors.primary },
            ]}
            onPress={onProfile}
          >
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {currentUserName ? currentUserName[0].toUpperCase() : "👤"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Campus Trust Banner */}
      <View
        style={[
          styles.trustBanner,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={styles.trustShield}>🛡️</Text>
        <Text style={[styles.trustText, { color: colors.textSecondary }]}>
          Verified Student Network · Safe meetups at campus libraries & quads
        </Text>
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.search,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.icon, { color: colors.muted }]}>⌕</Text>
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search textbooks, tech, desks..."
          placeholderTextColor={colors.muted}
          style={[styles.input, { color: colors.text }]}
        />
        {query.length > 0 && (
          <Pressable onPress={() => onQueryChange("")} style={styles.clearBtn}>
            <Text style={[styles.clearBtnText, { color: colors.muted }]}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Filter and Sort Toggle Bar */}
      <View style={styles.filterBar}>
        <Pressable
          style={[
            styles.filterToggleBtn,
            { backgroundColor: colors.card, borderColor: colors.border },
            (showFilterPanel || hasActiveFilters) && {
              backgroundColor: colors.primaryLight,
              borderColor: colors.primary,
            },
          ]}
          onPress={() => setShowFilterPanel(!showFilterPanel)}
        >
          <Text
            style={[
              styles.filterToggleText,
              { color: colors.textSecondary },
              (showFilterPanel || hasActiveFilters) && {
                color: colors.primary,
                fontWeight: "800",
              },
            ]}
          >
            ⚙ Filters & Sort {hasActiveFilters ? "•" : ""}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.soldToggleBtn,
            { backgroundColor: colors.card, borderColor: colors.border },
            hideSold && {
              backgroundColor: colors.primaryLight,
              borderColor: colors.primary,
            },
          ]}
          onPress={onToggleHideSold}
        >
          <Text
            style={[
              styles.soldToggleText,
              { color: colors.muted },
              hideSold && { color: colors.primary, fontWeight: "700" },
            ]}
          >
            {hideSold ? "✓ Available only" : "All items (inc. Sold)"}
          </Text>
        </Pressable>
      </View>

      {/* Expandable Filter & Sort Drawer */}
      {showFilterPanel && (
        <View
          style={[
            styles.drawer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.drawerHeader}>
            <Text style={[styles.drawerTitle, { color: colors.text }]}>
              Filters & Sort
            </Text>
            {hasActiveFilters && (
              <Pressable onPress={onResetFilters}>
                <Text style={styles.resetText}>Reset all</Text>
              </Pressable>
            )}
          </View>

          {/* Sort By */}
          <Text style={[styles.sublabel, { color: colors.textSecondary }]}>
            Sort by:
          </Text>
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
                  { backgroundColor: colors.cardSecondary, borderColor: colors.border },
                  sortBy === opt.id && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => onSortByChange(opt.id as SortOption)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: colors.textSecondary },
                    sortBy === opt.id && { color: "#FFF", fontWeight: "700" },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Price Range */}
          <Text style={[styles.sublabel, { color: colors.textSecondary }]}>
            Price Range ($ USD):
          </Text>
          <View style={styles.priceRow}>
            <View
              style={[
                styles.priceInputWrap,
                { backgroundColor: colors.inputBg, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.currencyPrefix, { color: colors.muted }]}>
                $
              </Text>
              <TextInput
                value={minPrice}
                onChangeText={onMinPriceChange}
                placeholder="Min"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                style={[styles.priceInput, { color: colors.text }]}
              />
            </View>
            <Text style={[styles.priceTo, { color: colors.muted }]}>to</Text>
            <View
              style={[
                styles.priceInputWrap,
                { backgroundColor: colors.inputBg, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.currencyPrefix, { color: colors.muted }]}>
                $
              </Text>
              <TextInput
                value={maxPrice}
                onChangeText={onMaxPriceChange}
                placeholder="Max"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                style={[styles.priceInput, { color: colors.text }]}
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
                  { backgroundColor: colors.cardSecondary, borderColor: colors.border },
                  maxPrice === qp.max && {
                    backgroundColor: colors.primaryLight,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => {
                  onMinPriceChange("");
                  onMaxPriceChange(qp.max);
                }}
              >
                <Text
                  style={[
                    styles.quickPriceText,
                    { color: colors.textSecondary },
                    maxPrice === qp.max && {
                      color: colors.primary,
                      fontWeight: "700",
                    },
                  ]}
                >
                  {qp.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Campus Filter */}
          <Text style={[styles.sublabel, { color: colors.textSecondary }]}>
            Campus Meetup Location:
          </Text>
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
                  { backgroundColor: colors.cardSecondary, borderColor: colors.border },
                  campusFilter === camp && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => onCampusChange(camp)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: colors.textSecondary },
                    campusFilter === camp && { color: "#FFF", fontWeight: "700" },
                  ]}
                >
                  {camp}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Categories Scroll with Emojis */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
      >
        {categories.map((value) => {
          const icon = categoryIcons[value] || "🏷️";
          const isActive = category === value;
          return (
            <Pressable
              key={value}
              onPress={() => onCategoryChange(value)}
              style={[
                styles.category,
                { backgroundColor: colors.cardSecondary, borderColor: colors.border },
                isActive && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: colors.textSecondary },
                  isActive && { color: "#FFF", fontWeight: "700" },
                ]}
              >
                {icon} {value}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Section Header with Item Count */}
      <View style={styles.section}>
        <View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Browse listings
          </Text>
          <Text style={[styles.muted, { color: colors.muted }]}>
            {hasActiveFilters ? "Filtered campus items" : "All campus items"}
          </Text>
        </View>
        <Text style={[styles.seeAll, { color: colors.primary }]}>
          {items.length} {items.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersRow}>
          {category !== "All items" && (
            <View
              style={[styles.filterChip, { backgroundColor: colors.primaryLight }]}
            >
              <Text style={[styles.filterChipText, { color: colors.primary }]}>
                {category}
              </Text>
              <Pressable onPress={() => onCategoryChange("All items")}>
                <Text style={[styles.filterChipClose, { color: colors.primary }]}>
                  ×
                </Text>
              </Pressable>
            </View>
          )}
          {campusFilter !== "All campuses" && (
            <View
              style={[styles.filterChip, { backgroundColor: colors.primaryLight }]}
            >
              <Text style={[styles.filterChipText, { color: colors.primary }]}>
                {campusFilter}
              </Text>
              <Pressable onPress={() => onCampusChange("All campuses")}>
                <Text style={[styles.filterChipClose, { color: colors.primary }]}>
                  ×
                </Text>
              </Pressable>
            </View>
          )}
          {maxPrice !== "" && (
            <View
              style={[styles.filterChip, { backgroundColor: colors.primaryLight }]}
            >
              <Text style={[styles.filterChipText, { color: colors.primary }]}>
                ≤ ${maxPrice}
              </Text>
              <Pressable onPress={() => onMaxPriceChange("")}>
                <Text style={[styles.filterChipClose, { color: colors.primary }]}>
                  ×
                </Text>
              </Pressable>
            </View>
          )}
          {minPrice !== "" && (
            <View
              style={[styles.filterChip, { backgroundColor: colors.primaryLight }]}
            >
              <Text style={[styles.filterChipText, { color: colors.primary }]}>
                ≥ ${minPrice}
              </Text>
              <Pressable onPress={() => onMinPriceChange("")}>
                <Text style={[styles.filterChipClose, { color: colors.primary }]}>
                  ×
                </Text>
              </Pressable>
            </View>
          )}
          {hideSold && (
            <View
              style={[styles.filterChip, { backgroundColor: colors.primaryLight }]}
            >
              <Text style={[styles.filterChipText, { color: colors.primary }]}>
                Available Only
              </Text>
              <Pressable onPress={onToggleHideSold}>
                <Text style={[styles.filterChipClose, { color: colors.primary }]}>
                  ×
                </Text>
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
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No matching listings
            </Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              We couldn't find anything matching your filters or search term.
            </Text>
            {hasActiveFilters && (
              <Pressable
                style={[styles.resetBtn, { backgroundColor: colors.primary }]}
                onPress={onResetFilters}
              >
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
    alignItems: "flex-start",
    paddingTop: 28,
    paddingBottom: 14,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  themeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  themeBtnIcon: {
    fontSize: 16,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  heading: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  avatarText: { fontWeight: "800", fontSize: 16 },
  trustBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    marginBottom: 14,
    gap: 8,
  },
  trustShield: {
    fontSize: 14,
  },
  trustText: {
    fontSize: 11,
    fontWeight: "600",
    flex: 1,
  },
  search: {
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderWidth: 1,
    marginBottom: 12,
  },
  icon: { fontSize: 24, marginRight: 8 },
  input: { flex: 1, fontSize: 14 },
  clearBtn: {
    padding: 6,
  },
  clearBtnText: {
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
    borderWidth: 1,
  },
  filterToggleText: {
    fontSize: 12,
    fontWeight: "700",
  },
  soldToggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  soldToggleText: {
    fontSize: 12,
    fontWeight: "600",
  },
  drawer: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
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
  },
  resetText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#C3535B",
  },
  sublabel: {
    fontSize: 12,
    fontWeight: "700",
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
    borderWidth: 1,
  },
  optionText: {
    fontSize: 11,
    fontWeight: "600",
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
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  currencyPrefix: {
    fontSize: 14,
    fontWeight: "700",
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    fontSize: 13,
  },
  priceTo: {
    fontSize: 12,
    fontWeight: "600",
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
    borderWidth: 1,
  },
  quickPriceText: {
    fontSize: 11,
    fontWeight: "600",
  },
  categories: { gap: 8, paddingBottom: 14 },
  category: {
    height: 38,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: { fontSize: 12, fontWeight: "700" },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 2,
  },
  muted: { fontSize: 12 },
  seeAll: { fontWeight: "700", fontSize: 12 },
  activeFiltersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: "700",
  },
  filterChipClose: {
    fontSize: 14,
    fontWeight: "800",
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
    marginBottom: 6,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  resetBtn: {
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
