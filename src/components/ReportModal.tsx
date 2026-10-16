import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Listing, ReportReason } from "../types";

const reasons: ReportReason[] = [
  "Prohibited campus item",
  "Suspicious seller or scam",
  "Misleading or inaccurate description",
  "Inappropriate or offensive content",
  "Other safety concern",
];

export function ReportModal({
  visible,
  listing,
  onClose,
  onSubmitReport,
}: {
  visible: boolean;
  listing: Listing | null;
  onClose: () => void;
  onSubmitReport: (reason: string, details: string) => void;
}) {
  const [selectedReason, setSelectedReason] = useState<ReportReason>(reasons[0]);
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!listing) return null;

  const handleSubmit = () => {
    onSubmitReport(selectedReason, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDetails("");
      onClose();
    }, 1500);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.shieldWrap}>
              <Text style={styles.shieldIcon}>🛡️</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Report Listing</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {listing.title}
              </Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          {submitted ? (
            <View style={styles.successState}>
              <Text style={styles.checkIcon}>✅</Text>
              <Text style={styles.successTitle}>Report Submitted</Text>
              <Text style={styles.successDesc}>
                Thank you for keeping our campus safe. Campus student safety
                moderators will review this within 2 hours.
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              <Text style={styles.instruction}>
                Why are you flagging this listing?
              </Text>

              <View style={styles.reasonsList}>
                {reasons.map((reason) => {
                  const isSelected = selectedReason === reason;
                  return (
                    <Pressable
                      key={reason}
                      style={[
                        styles.reasonRow,
                        isSelected && styles.reasonRowSelected,
                      ]}
                      onPress={() => setSelectedReason(reason)}
                    >
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleActive,
                        ]}
                      >
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <Text
                        style={[
                          styles.reasonText,
                          isSelected && styles.reasonTextSelected,
                        ]}
                      >
                        {reason}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.detailsLabel}>
                Additional details (optional):
              </Text>
              <TextInput
                value={details}
                onChangeText={setDetails}
                placeholder="Describe any suspicious behavior or policy violation..."
                placeholderTextColor="#87918C"
                multiline
                numberOfLines={3}
                style={styles.detailsInput}
              />

              <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>Submit Safety Report</Text>
              </Pressable>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    width: "100%",
    maxWidth: 440,
    maxHeight: "85%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1EC",
    gap: 12,
  },
  shieldWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FDF0F1",
    alignItems: "center",
    justifyContent: "center",
  },
  shieldIcon: {
    fontSize: 20,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#173C34",
  },
  subtitle: {
    fontSize: 12,
    color: "#87918C",
    marginTop: 2,
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
    padding: 18,
  },
  instruction: {
    fontSize: 13,
    fontWeight: "700",
    color: "#21443A",
    marginBottom: 12,
  },
  reasonsList: {
    gap: 8,
    marginBottom: 16,
  },
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E3E7DF",
    backgroundColor: "#F8FAF7",
    gap: 10,
  },
  reasonRowSelected: {
    borderColor: "#B64950",
    backgroundColor: "#FDF0F1",
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#A0AAA4",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleActive: {
    borderColor: "#B64950",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#B64950",
  },
  reasonText: {
    fontSize: 13,
    color: "#4A5A52",
    fontWeight: "600",
  },
  reasonTextSelected: {
    color: "#B64950",
    fontWeight: "700",
  },
  detailsLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4A5A52",
    marginBottom: 6,
  },
  detailsInput: {
    backgroundColor: "#F7F9F6",
    borderWidth: 1,
    borderColor: "#E0E5DD",
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: "#173C34",
    minHeight: 60,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: "#B64950",
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  submitBtnText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 14,
  },
  successState: {
    padding: 30,
    alignItems: "center",
  },
  checkIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#173C34",
    marginBottom: 6,
  },
  successDesc: {
    textAlign: "center",
    fontSize: 13,
    color: "#65766D",
    lineHeight: 18,
  },
});
