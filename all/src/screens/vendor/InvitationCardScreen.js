import React, {useMemo, useState} from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
  Modal,
  Pressable,
} from "react-native";
import Text from '../../components/VendorText';

const invitationCards = [
  {
    id: "1",
    image: require("../../../assets/royal.webp"),
    title: "Royal Gold Invitation",
    description: "Traditional royal design with gold foil printing and velvet finish.",
  },
  {
    id: "2",
    image: require("../../../assets/Images/decor.avif"),
    title: "Modern Minimalist",
    description: "Soft pastel colors with premium matte texture and fine typography.",
  },
  {
    id: "3",
    image: require("../../../assets/Images/weddingphotography.avif"),
    title: "Floral Theme Card",
    description: "Fresh floral patterns with glossy finish for elegant weddings.",
  },
  {
    id: "4",
    image: require("../../../assets/Images/functionhall.avif"),
    title: "Traditional South Indian",
    description: "Temple-inspired borders, turmeric-yellow base, classic fonts.",
  },
  {
    id: "5",
    image: require("../../../assets/Images/bridecar.avif"),
    title: "Box Invitation Kit",
    description: "Customized box with sweets, gifts & premium invitation card.",
  },
  {
    id: "6",
    image: require("../../../assets/Images/groomcar.avif"),
    title: "Laser Cut Invitation",
    description: "Elegant metallic laser-cut designs with shimmer finishing.",
  },
];

const services = [
  "Digital Printing (HD Quality)",
  "Offset & Gold Foil Printing",
  "Matt / Gloss / Velvet Laminated Cards",
  "Laser Cutting & Emboss Effects",
  "Custom Logo & Name Designing",
  "QR Code + Google Map Printing",
  "Bulk Printing with Delivery",
];

export default function InvitationCardScreen({ navigation, route }) {
  const { width } = useWindowDimensions();
  const service = route?.params?.service || null;
  const bookingDetails = route?.params?.bookingDetails || {};
  const customerDetails = route?.params?.customerDetails || null;

  const [selectedCard, setSelectedCard] = useState(null);

  const isTabletOrWeb = width >= 700;
  const cardWidth = isTabletOrWeb ? "31%" : "100%";

  const selectedCardName = useMemo(
    () => selectedCard?.title || service?.title || "Invitation Card Design",
    [selectedCard?.title, service?.title]
  );

  const handleOpenPreview = (card) => {
    setSelectedCard(card);
  };

  const handleConfirmSelection = () => {
    if (!service || !selectedCard) {
      return;
    }

    navigation.navigate("ServiceBookingPayment", {
      service,
      bookingDetails: {
        ...bookingDetails,
        invitationCardId: selectedCard.id,
        invitationCardTitle: selectedCard.title,
      },
      customerDetails,
    });
  };

  const handleBack = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Invitation Card Design & Printing</Text>
        </View>

        <Text style={styles.title}>Premium Wedding Invitation Designs</Text>
        <Text style={styles.subtitle}>Tap a card to preview it, then select the design for payment.</Text>

        <View style={styles.container}>
          {invitationCards.map((item) => {
            const isSelected = selectedCard?.id === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.88}
                style={[styles.card, { width: cardWidth }, isSelected && styles.cardSelected]}
                onPress={() => handleOpenPreview(item)}
              >
                <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
                <View style={styles.cardMetaRow}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {isSelected && <Text style={styles.selectedBadge}>Selected</Text>}
                </View>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>Our Invitation Card Printing Services</Text>
          {services.map((serviceItem, index) => (
            <Text key={index} style={styles.serviceText}>
              • {serviceItem}
            </Text>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.bookBtn, (!service || !selectedCard) && styles.bookBtnDisabled]}
          activeOpacity={0.85}
          onPress={handleConfirmSelection}
          disabled={!service || !selectedCard}
        >
          <Text style={styles.bookBtnText}>
            {selectedCard ? `Continue with ${selectedCardName}` : "Select a Design First"}
          </Text>
        </TouchableOpacity>

        <View style={styles.contactBox}>
          <Text style={styles.contactTitle}>Contact For Invitations</Text>

          <TouchableOpacity onPress={() => Linking.openURL("tel:+919876543210")}>
            <Text style={styles.contactText}>📞 +91 98765 43210</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL("mailto:blissinvites@example.com")}>
            <Text style={styles.contactText}>📧 blissinvites@example.com</Text>
          </TouchableOpacity>

          <Text style={styles.contactMessage}>
            We design beautiful invitations that match your love story 💙✨
          </Text>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>⬅ Back</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={!!selectedCard} transparent animationType="fade" onRequestClose={() => setSelectedCard(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedCard(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            {selectedCard && (
              <>
                <Image source={selectedCard.image} style={styles.modalImage} resizeMode="cover" />
                <Text style={styles.modalTitle}>{selectedCard.title}</Text>
                <Text style={styles.modalDescription}>{selectedCard.description}</Text>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalSecondaryBtn} onPress={() => setSelectedCard(null)}>
                    <Text style={styles.modalSecondaryText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalPrimaryBtn} onPress={handleConfirmSelection}>
                    <Text style={styles.modalPrimaryText}>Select & Pay</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#e9f6ff" },
  content: { paddingBottom: 30 },
  header: {
    backgroundColor: "#c7e9ff",
    paddingVertical: 15,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8ed0ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 8,
  },
  headerText: { fontSize: 28, fontWeight: "700", color: "#004e92", textAlign: "center" },
  title: { textAlign: "center", fontSize: 30, color: "#003c78", marginTop: 20, fontWeight: "700", paddingHorizontal: 15 },
  subtitle: { textAlign: "center", color: "#2d527a", marginTop: 8, paddingHorizontal: 20, fontSize: 14, fontWeight: "600" },
  container: { width: "90%", alignSelf: "center", flexDirection: "row", flexWrap: "wrap", gap: 25, marginTop: 20, justifyContent: "center" },
  card: { backgroundColor: "#ffffff", padding: 15, borderRadius: 12, shadowColor: "#9ddcff", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 15, elevation: 7, borderWidth: 2, borderColor: "transparent" },
  cardSelected: { borderColor: "#00509d", transform: [{ scale: 1.01 }] },
  cardImage: { width: "100%", height: 210, borderRadius: 10, backgroundColor: "#d9f1ff" },
  cardMetaRow: { marginTop: 10, marginBottom: 5, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  cardTitle: { flex: 1, color: "#00509d", fontSize: 20, fontWeight: "700" },
  selectedBadge: { color: "#00509d", fontSize: 12, fontWeight: "800", backgroundColor: "#dff0ff", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  cardDescription: { color: "#333333", fontSize: 14, lineHeight: 20 },
  highlightBox: { width: "90%", alignSelf: "center", marginTop: 25, backgroundColor: "#d9f1ff", padding: 20, borderRadius: 12, shadowColor: "#87d1ff", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 15, elevation: 7 },
  highlightTitle: { color: "#004a84", fontSize: 24, fontWeight: "700", marginBottom: 10 },
  serviceText: { lineHeight: 28, fontSize: 15, color: "#333333" },
  bookBtn: { width: "90%", alignSelf: "center", marginTop: 18, backgroundColor: "#00509d", paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  bookBtnDisabled: { opacity: 0.6 },
  bookBtnText: { color: "#fff", fontSize: 16, fontWeight: "700", textAlign: "center" },
  contactBox: { width: "90%", alignSelf: "center", marginTop: 25, backgroundColor: "#cfeaff", padding: 20, borderRadius: 12, alignItems: "center", shadowColor: "#79c9ff", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 15, elevation: 7 },
  contactTitle: { color: "#003a70", fontSize: 24, fontWeight: "700", marginBottom: 10, textAlign: "center" },
  contactText: { color: "#333333", fontSize: 16, marginVertical: 4, textAlign: "center" },
  contactMessage: { color: "#333333", fontSize: 16, marginTop: 8, textAlign: "center", lineHeight: 23 },
  backButton: { width: "90%", alignSelf: "center", marginTop: 22, backgroundColor: "#004e92", paddingVertical: 15, borderRadius: 12, alignItems: "center" },
  backButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.72)", justifyContent: "center", alignItems: "center", padding: 18 },
  modalCard: { width: "100%", maxWidth: 560, backgroundColor: "#fff", borderRadius: 20, padding: 16 },
  modalImage: { width: "100%", height: 320, borderRadius: 16, backgroundColor: "#d9f1ff" },
  modalTitle: { marginTop: 14, color: "#004a84", fontSize: 24, fontWeight: "800" },
  modalDescription: { color: "#333", fontSize: 15, lineHeight: 22, marginTop: 8 },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 18 },
  modalSecondaryBtn: { flex: 1, minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: "#00509d", justifyContent: "center", alignItems: "center" },
  modalSecondaryText: { color: "#00509d", fontSize: 15, fontWeight: "800" },
  modalPrimaryBtn: { flex: 1, minHeight: 48, borderRadius: 14, backgroundColor: "#00509d", justifyContent: "center", alignItems: "center" },
  modalPrimaryText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});
