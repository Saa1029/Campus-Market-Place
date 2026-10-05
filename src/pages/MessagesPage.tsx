import { useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { EmptyState } from "../components/EmptyState";
import { PageTitle } from "../components/PageTitle";
import { Conversation, Listing, Message } from "../types";

export function MessagesPage({
  conversations,
  messages,
  currentUserId,
  currentUserName,
  activeConversationId,
  onSelectConversation,
  onBackToList,
  onSendMessage,
  onBrowse,
  onOpenListing,
}: {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  currentUserId: string;
  currentUserName: string;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onBackToList: () => void;
  onSendMessage: (
    conversationId: string,
    text: string,
    senderId: string,
    senderName: string,
  ) => void;
  onBrowse: () => void;
  onOpenListing?: (listingId: string) => void;
}) {
  const [inputText, setInputText] = useState("");
  // Simulator toggle to easily show two-way conversation in demo video
  const [demoSenderRole, setDemoSenderRole] = useState<"current" | "other">(
    "current",
  );

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const activeMessages = activeConv ? messages[activeConv.id] || [] : [];

  const handleSend = () => {
    if (!inputText.trim() || !activeConv) return;

    let senderId = currentUserId;
    let senderName = currentUserName;

    // If demo simulator role is set to 'other'
    if (demoSenderRole === "other") {
      const isCurrentBuyer = activeConv.buyerId === currentUserId;
      senderId = isCurrentBuyer ? activeConv.sellerId : activeConv.buyerId;
      senderName = isCurrentBuyer ? activeConv.sellerName : activeConv.buyerName;
    }

    onSendMessage(activeConv.id, inputText.trim(), senderId, senderName);
    setInputText("");
  };

  const quickReplies = [
    "Is this still available?",
    "Can you meet at the library today?",
    "Would you accept a little less?",
    "Sounds great, let's meet!",
  ];

  // 1. CHAT THREAD VIEW (Single Conversation)
  if (activeConv) {
    const isCurrentBuyer = activeConv.buyerId === currentUserId;
    const otherPartyName = isCurrentBuyer
      ? activeConv.sellerName
      : activeConv.buyerName;

    const senderDisplayName =
      demoSenderRole === "current" ? currentUserName : otherPartyName;

    return (
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <Pressable style={styles.backBtn} onPress={onBackToList}>
            <Text style={styles.backBtnText}>‹ Back</Text>
          </Pressable>

          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatPartnerName} numberOfLines={1}>
              {otherPartyName}
            </Text>
            <Text style={styles.chatSubtitle}>Campus Marketplace Chat</Text>
          </View>
        </View>

        {/* Listing Context Banner */}
        <View style={styles.listingBanner}>
          <Image
            source={{ uri: activeConv.listingImage }}
            style={styles.listingBannerImage}
          />
          <View style={styles.listingBannerText}>
            <Text style={styles.listingBannerTitle} numberOfLines={1}>
              {activeConv.listingTitle}
            </Text>
            <Text style={styles.listingBannerPrice}>
              ${activeConv.listingPrice}
            </Text>
          </View>
          {onOpenListing && (
            <Pressable
              style={styles.viewListingBtn}
              onPress={() => onOpenListing(activeConv.listingId)}
            >
              <Text style={styles.viewListingBtnText}>View Item</Text>
            </Pressable>
          )}
        </View>

        {/* Demo Video Switcher Bar */}
        <View style={styles.demoBar}>
          <Text style={styles.demoBarLabel}>Demo Simulator: Typing as</Text>
          <View style={styles.demoToggle}>
            <Pressable
              style={[
                styles.demoTogglePill,
                demoSenderRole === "current" && styles.demoTogglePillActive,
              ]}
              onPress={() => setDemoSenderRole("current")}
            >
              <Text
                style={[
                  styles.demoToggleText,
                  demoSenderRole === "current" && styles.demoToggleTextActive,
                ]}
              >
                You ({currentUserName.split(" ")[0]})
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.demoTogglePill,
                demoSenderRole === "other" && styles.demoTogglePillActive,
              ]}
              onPress={() => setDemoSenderRole("other")}
            >
              <Text
                style={[
                  styles.demoToggleText,
                  demoSenderRole === "other" && styles.demoToggleTextActive,
                ]}
              >
                {otherPartyName.split(" ")[0]}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Messages List */}
        <ScrollView
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        >
          {activeMessages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageBubbleWrapper,
                  isMe ? styles.myMessageWrapper : styles.otherMessageWrapper,
                ]}
              >
                {!isMe && (
                  <Text style={styles.messageSender}>{msg.senderName}</Text>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    isMe ? styles.myBubble : styles.otherBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isMe ? styles.myMessageText : styles.otherMessageText,
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
                <Text style={styles.messageTime}>{msg.timestamp}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Quick Suggestion Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRepliesRow}
        >
          {quickReplies.map((reply, idx) => (
            <Pressable
              key={idx}
              style={styles.quickReplyChip}
              onPress={() => setInputText(reply)}
            >
              <Text style={styles.quickReplyText}>{reply}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={`Message as ${senderDisplayName.split(" ")[0]}...`}
            placeholderTextColor="#87918C"
            style={styles.chatInput}
          />
          <Pressable
            disabled={!inputText.trim()}
            style={[
              styles.sendBtn,
              !inputText.trim() && styles.sendBtnDisabled,
            ]}
            onPress={handleSend}
          >
            <Text style={styles.sendBtnText}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // 2. CONVERSATIONS LIST VIEW
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <PageTitle
        title="Messages"
        subtitle="Chat with campus buyers and sellers directly"
      />

      <FlatList
        data={conversations}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.threadsList}
        ListEmptyComponent={
          <EmptyState
            title="Your inbox is quiet"
            message="When you message a seller or receive inquiries, your conversations will show up here."
            action="Browse listings"
            onAction={onBrowse}
          />
        }
        renderItem={({ item }) => {
          const isBuyer = item.buyerId === currentUserId;
          const partnerName = isBuyer ? item.sellerName : item.buyerName;

          return (
            <Pressable
              style={styles.threadCard}
              onPress={() => onSelectConversation(item.id)}
            >
              <Image
                source={{ uri: item.listingImage }}
                style={styles.threadImage}
              />
              <View style={styles.threadBody}>
                <View style={styles.threadTopRow}>
                  <Text style={styles.partnerName} numberOfLines={1}>
                    {partnerName}
                  </Text>
                  <Text style={styles.threadTime}>{item.lastMessageTime}</Text>
                </View>

                <Text style={styles.threadListingTitle} numberOfLines={1}>
                  Regarding: {item.listingTitle} (${item.listingPrice})
                </Text>

                <Text style={styles.lastMessageText} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 110 },
  threadsList: { gap: 12 },
  threadCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E9ECE6",
    gap: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  threadImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#E5ECE5",
  },
  threadBody: {
    flex: 1,
  },
  threadTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  partnerName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#173C34",
  },
  threadTime: {
    fontSize: 11,
    color: "#87918C",
  },
  threadListingTitle: {
    fontSize: 11,
    color: "#1F5D4C",
    fontWeight: "700",
    marginBottom: 4,
  },
  lastMessageText: {
    fontSize: 13,
    color: "#54665D",
  },
  // Chat View Styles
  chatContainer: {
    flex: 1,
    backgroundColor: "#F8F8F4",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingTop: 36,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EBE5",
  },
  backBtn: {
    paddingVertical: 6,
    paddingRight: 12,
  },
  backBtnText: {
    color: "#1F5D4C",
    fontSize: 16,
    fontWeight: "800",
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatPartnerName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#173C34",
  },
  chatSubtitle: {
    fontSize: 11,
    color: "#87918C",
  },
  listingBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EBE5",
    gap: 12,
  },
  listingBannerImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#E5ECE5",
  },
  listingBannerText: {
    flex: 1,
  },
  listingBannerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1B3A33",
  },
  listingBannerPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1C7057",
  },
  viewListingBtn: {
    backgroundColor: "#ECEFE9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  viewListingBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#21443A",
  },
  demoBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E7EFEA",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#D1E2D6",
  },
  demoBarLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1F5D4C",
  },
  demoToggle: {
    flexDirection: "row",
    gap: 6,
  },
  demoTogglePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  demoTogglePillActive: {
    backgroundColor: "#1F5D4C",
  },
  demoToggleText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4A5A52",
  },
  demoToggleTextActive: {
    color: "#FFF",
    fontWeight: "700",
  },
  messagesList: {
    padding: 16,
    gap: 12,
    paddingBottom: 20,
  },
  messageBubbleWrapper: {
    maxWidth: "80%",
    marginBottom: 4,
  },
  myMessageWrapper: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  otherMessageWrapper: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  messageSender: {
    fontSize: 10,
    fontWeight: "700",
    color: "#65766D",
    marginBottom: 2,
    marginLeft: 6,
  },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myBubble: {
    backgroundColor: "#1F5D4C",
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E7DF",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 19,
  },
  myMessageText: {
    color: "#FFF",
  },
  otherMessageText: {
    color: "#173C34",
  },
  messageTime: {
    fontSize: 9,
    color: "#99A39D",
    marginTop: 3,
    marginHorizontal: 6,
  },
  quickRepliesRow: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#EEF1EC",
  },
  quickReplyChip: {
    backgroundColor: "#F2F5F0",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E0E5DD",
  },
  quickReplyText: {
    fontSize: 11,
    color: "#4A5A52",
    fontWeight: "600",
  },
  inputBar: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEF1EC",
    gap: 8,
    alignItems: "center",
  },
  chatInput: {
    flex: 1,
    height: 42,
    backgroundColor: "#F7F9F6",
    borderWidth: 1,
    borderColor: "#E0E5DD",
    borderRadius: 21,
    paddingHorizontal: 16,
    fontSize: 13,
    color: "#173C34",
  },
  sendBtn: {
    backgroundColor: "#1F5D4C",
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendBtnText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 13,
  },
});
