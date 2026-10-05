import { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  campuses,
  categories,
  categoryIcons,
  conditions,
  samplePhotoPresets,
} from "../data";

export function SellModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (listingData: {
    title: string;
    price: string;
    category: string;
    condition: string;
    campus: string;
    image: string;
    description: string;
  }) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Textbooks");
  const [condition, setCondition] = useState("Good condition");
  const [campus, setCampus] = useState("North Campus");
  const [image, setImage] = useState(samplePhotoPresets[0].url);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePresetSelect = (url: string) => {
    setImage(url);
  };

  const handleDeviceUpload = () => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = (event: any) => {
        const file = event.target?.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (loadEvt) => {
            if (loadEvt.target?.result) {
              setImage(loadEvt.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
      };
      fileInput.click();
    } else {
      // Fallback preset
      setImage(samplePhotoPresets[1].url);
    }
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!title.trim() || title.trim().length < 3) {
      errs.push("Item title must be at least 3 characters long.");
    }
    const numPrice = Number(price);
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      errs.push("Please enter a valid price greater than $0.");
    }
    if (!image.trim()) {
      errs.push("Please choose an image preset, upload a photo, or enter an image URL.");
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        price: price.trim(),
        category,
        condition,
        campus,
        image: image.trim(),
        description: description.trim() || "No description provided.",
      });
      // Reset form after successful submission
      setTitle("");
      setPrice("");
      setDescription("");
      setErrors([]);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <View>
              <Text style={styles.formTitle}>List an item for sale</Text>
              <Text style={styles.formSubtitle}>Campus students will see this listing</Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollBody}
            showsVerticalScrollIndicator={false}
          >
            {errors.length > 0 && (
              <View style={styles.errorBox}>
                {errors.map((err, i) => (
                  <Text key={i} style={styles.errorText}>
                    • {err}
                  </Text>
                ))}
              </View>
            )}

            {/* Title */}
            <Text style={styles.label}>
              Item title <Text style={styles.req}>*</Text>
            </Text>
            <TextInput
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.length > 0) setErrors([]);
              }}
              placeholder="e.g. Calculus 9th Edition or Dorm Desk"
              placeholderTextColor="#87918C"
              style={styles.field}
            />

            {/* Price */}
            <Text style={styles.label}>
              Price ($ USD) <Text style={styles.req}>*</Text>
            </Text>
            <TextInput
              value={price}
              onChangeText={(text) => {
                setPrice(text);
                if (errors.length > 0) setErrors([]);
              }}
              keyboardType="numeric"
              placeholder="e.g. 35"
              placeholderTextColor="#87918C"
              style={styles.field}
            />

            {/* Category */}
            <Text style={styles.label}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {categories
                .filter((c) => c !== "All items")
                .map((cat) => (
                  <Pressable
                    key={cat}
                    style={[
                      styles.chip,
                      category === cat && styles.activeChip,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        category === cat && styles.activeChipText,
                      ]}
                    >
                      {categoryIcons[cat] || "🏷️"} {cat}
                    </Text>
                  </Pressable>
                ))}
            </ScrollView>

            {/* Condition */}
            <Text style={styles.label}>Condition</Text>
            <View style={styles.wrapRow}>
              {conditions.map((cond) => (
                <Pressable
                  key={cond}
                  style={[
                    styles.chip,
                    condition === cond && styles.activeChip,
                  ]}
                  onPress={() => setCondition(cond)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      condition === cond && styles.activeChipText,
                    ]}
                  >
                    {cond}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Campus Meetup Location */}
            <Text style={styles.label}>Campus Pickup / Meetup</Text>
            <View style={styles.wrapRow}>
              {campuses.map((camp) => (
                <Pressable
                  key={camp}
                  style={[styles.chip, campus === camp && styles.activeChip]}
                  onPress={() => setCampus(camp)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      campus === camp && styles.activeChipText,
                    ]}
                  >
                    📍 {camp}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Photo Upload & Presets */}
            <Text style={styles.label}>Item photo</Text>
            
            {/* Upload Button */}
            <View style={styles.uploadRow}>
              <Pressable style={styles.uploadBtn} onPress={handleDeviceUpload}>
                <Text style={styles.uploadBtnIcon}>📁</Text>
                <Text style={styles.uploadBtnText}>Upload from Computer / Device</Text>
              </Pressable>
            </View>

            <Text style={styles.hint}>Or select a quick sample preset photo:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.presetRow}
            >
              {samplePhotoPresets.map((preset) => (
                <Pressable
                  key={preset.label}
                  style={[
                    styles.presetCard,
                    image === preset.url && styles.activePresetCard,
                  ]}
                  onPress={() => handlePresetSelect(preset.url)}
                >
                  <Image source={{ uri: preset.url }} style={styles.presetImage} />
                  <Text style={styles.presetLabel}>{preset.label}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Image Preview */}
            {image ? (
              <View style={styles.previewBox}>
                <Text style={styles.previewLabel}>Selected Photo Preview:</Text>
                <Image source={{ uri: image }} style={styles.previewThumb} />
              </View>
            ) : null}

            <TextInput
              value={image}
              onChangeText={setImage}
              placeholder="Or paste an image URL (https://...)"
              placeholderTextColor="#87918C"
              style={[styles.field, { marginTop: 8 }]}
            />

            {/* Description */}
            <Text style={styles.label}>Description & Meetup Details</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe condition, course number, meeting spot..."
              placeholderTextColor="#87918C"
              multiline
              numberOfLines={3}
              style={[styles.field, styles.multilineField]}
            />

            {/* Submit Button */}
            <Pressable
              disabled={isSubmitting}
              style={[styles.primary, isSubmitting && styles.disabled]}
              onPress={handleSubmit}
            >
              <Text style={styles.primaryText}>
                {isSubmitting ? "Publishing..." : "Publish Listing"}
              </Text>
            </Pressable>
          </ScrollView>
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
  formCard: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1EC",
    paddingBottom: 14,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#173C34",
  },
  formSubtitle: {
    fontSize: 12,
    color: "#87918C",
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F0F3EF",
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 22,
    color: "#4A5A52",
    lineHeight: 24,
  },
  scrollBody: {
    paddingBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#21443A",
    marginTop: 14,
    marginBottom: 6,
  },
  req: {
    color: "#C3535B",
  },
  hint: {
    fontSize: 11,
    color: "#87918C",
    marginBottom: 6,
    marginTop: 8,
  },
  uploadRow: {
    marginBottom: 6,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E4EDE6",
    borderWidth: 1,
    borderColor: "#B4CDB7",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  uploadBtnIcon: {
    fontSize: 16,
  },
  uploadBtnText: {
    color: "#1F5D4C",
    fontSize: 13,
    fontWeight: "800",
  },
  previewBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F9F6",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E5DD",
    marginTop: 8,
    gap: 12,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#54665D",
  },
  previewThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#E5ECE5",
  },
  field: {
    backgroundColor: "#F7F9F6",
    borderWidth: 1,
    borderColor: "#E1E6DE",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#173C34",
  },
  multilineField: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  wrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: "#EFF2EC",
    borderWidth: 1,
    borderColor: "#E3E7DF",
  },
  activeChip: {
    backgroundColor: "#1F5D4C",
    borderColor: "#1F5D4C",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A5A52",
  },
  activeChipText: {
    color: "#FFF",
    fontWeight: "700",
  },
  presetRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 4,
  },
  presetCard: {
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 10,
    padding: 2,
  },
  activePresetCard: {
    borderColor: "#1F5D4C",
  },
  presetImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#E5ECE5",
  },
  presetLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4A5A52",
    marginTop: 4,
  },
  primary: {
    backgroundColor: "#1F5D4C",
    borderRadius: 14,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  primaryText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "800",
  },
  disabled: {
    opacity: 0.6,
  },
  errorBox: {
    backgroundColor: "#FDF0F1",
    borderWidth: 1,
    borderColor: "#F5C2C7",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  errorText: {
    color: "#B64950",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
});
