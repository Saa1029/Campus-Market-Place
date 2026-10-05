import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Listing } from "../types";

export function OfferModal({
  visible,
  listing,
  onClose,
  onSubmitOffer,
}: {
  visible: boolean;
  listing: Listing | null;
  onClose: () => void;
  onSubmitOffer: (amount: number) => void;
}) {
  const [offerText, setOfferText] = useState("");
  const [error, setError] = useState("");

  if (!listing) return null;

  const originalPrice = listing.price;
  const numOffer = Number(offerText);
  const discountPresets = [
    { label: "10% off", val: Math.round(originalPrice * 0.9) },
    { label: "15% off", val: Math.round(originalPrice * 0.85) },
    { label: "20% off", val: Math.round(originalPrice * 0.8) },
  ];

  const handleSend = () => {
    if (!offerText || isNaN(numOffer) || numOffer <= 0) {
      setError("Please enter a valid offer amount.");
      return;
    }
    if (numOffer >= originalPrice) {
      setError("Offer should be lower than the asking price.");
      return;
    }
    onSubmitOffer(numOffer);
    setOfferText("");
    setError("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Make an Offer 🤝</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {listing.title}
              </Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          <View style={styles.body}>
            <View style={styles.priceRow}>
              <View>
                <Text style={styles.priceLabel}>Asking Price</Text>
                <Text style={styles.askingPrice}>${originalPrice}</Text>
              </View>
              {numOffer > 0 && numOffer < originalPrice && (
                <View style={styles.savingsBox}>
                  <Text style={styles.savingsText}>
                    Save ${originalPrice - numOffer} (
                    {Math.round(((originalPrice - numOffer) / originalPrice) * 100)}% off)
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.fieldLabel}>Quick discount presets:</Text>
            <View style={styles.presetRow}>
              {discountPresets.map((preset) => (
                <Pressable
                  key={preset.label}
                  style={[
                    styles.presetBtn,
                    numOffer === preset.val && styles.presetBtnActive,
                  ]}
                  onPress={() => {
                    setOfferText(String(preset.val));
                    setError("");
                  }}
                >
                  <Text
                    style={[
                      styles.presetBtnText,
                      numOffer === preset.val && styles.presetBtnTextActive,
                    ]}
                  >
                    ${preset.val} ({preset.label})
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Or enter your custom offer:</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.currencyPrefix}>$</Text>
              <TextInput
                value={offerText}
                onChangeText={(text) => {
                  setOfferText(text);
                  if (error) setError("");
                }}
                keyboardType="numeric"
                placeholder={String(Math.round(originalPrice * 0.85))}
                placeholderTextColor="#87918C"
                style={styles.input}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={styles.hint}>
              Campus etiquette: Reasonable offers near the asking price are
              most likely to be accepted by fellow students.
            </Text>

            <Pressable style={styles.submitBtn} onPress={handleSend}>
              <Text style={styles.submitBtnText}>Send Offer to Seller</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1EC",
    paddingBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#173C34",
  },
  subtitle: {
    fontSize: 12,
    color: "#87918C",
    marginTop: 2,
    maxWidth: 280,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F3EF",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 20,
    color: "#4A5A52",
    lineHeight: 22,
  },
  body: {
    gap: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F7F9F6",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E7DF",
  },
  priceLabel: {
    fontSize: 11,
    color: "#87918C",
    fontWeight: "600",
  },
  askingPrice: {
    fontSize: 22,
    fontWeight: "900",
    color: "#173C34",
  },
  savingsBox: {
    backgroundColor: "#E4EDE6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  savingsText: {
    color: "#1F5D4C",
    fontWeight: "800",
    fontSize: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4A5A52",
    marginTop: 4,
  },
  presetRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  presetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F2F5F0",
    borderWidth: 1,
    borderColor: "#E0E5DD",
  },
  presetBtnActive: {
    backgroundColor: "#1F5D4C",
    borderColor: "#1F5D4C",
  },
  presetBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4A5A52",
  },
  presetBtnTextActive: {
    color: "#FFF",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F9F6",
    borderWidth: 1,
    borderColor: "#E0E5DD",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: "800",
    color: "#65766D",
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#173C34",
  },
  errorText: {
    color: "#B64950",
    fontSize: 12,
    fontWeight: "600",
  },
  hint: {
    fontSize: 11,
    color: "#87918C",
    lineHeight: 16,
    fontStyle: "italic",
  },
  submitBtn: {
    backgroundColor: "#1F5D4C",
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitBtnText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 14,
  },
});
