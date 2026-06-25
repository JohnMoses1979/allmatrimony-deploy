import React from "react";
import { Alert, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Header from "../components/Header";
import Text from "../components/AutoText";
import { COLORS } from "../constants/colors";
import { useMatrimony } from "../context/MatrimonyContext";

const formatAmount = (amount = 0) => `Rs. ${(Number(amount || 0) / 100).toFixed(0)}`;

export default function ServiceBookingSuccessScreen({ navigation, route }) {
  const { appTheme } = useMatrimony();
  const service = route?.params?.service || null;
  const bookingDetails = route?.params?.bookingDetails || {};
  const selectedPackage = route?.params?.selectedPackage || null;
  const paymentAmount = route?.params?.paymentAmount || 0;
  const bookingId = route?.params?.bookingId || null;
  const transactionId = route?.params?.transactionId || "";
  const invoice = route?.params?.invoice || {};
  const invoiceNumber = invoice?.number || (bookingId ? `INV-${String(bookingId).padStart(6, "0")}` : "");
  const { downloadInvoice } = useMatrimony();

  const handleDownloadInvoice = async () => {
    try {
      await downloadInvoice?.(
        {
          id: bookingId,
          invoiceNumber,
          invoiceDate: invoice?.date || new Date().toISOString(),
          invoiceAmount: paymentAmount,
          invoiceStatus: invoice?.status || "PAID",
          invoiceReference: invoice?.reference || transactionId || "",
          paymentStatus: "PAID",
          paymentMethod: invoice?.paymentMode || "Razorpay",
          paymentAmount,
          paymentCurrency: "INR",
          razorpayPaymentId: transactionId,
          razorpayOrderId: route?.params?.orderId || "",
          customerName: route?.params?.customerName || "",
          customerPhone: route?.params?.customerPhone || "",
          customerEmail: route?.params?.customerEmail || "",
          customerLocation: route?.params?.customerLocation || "",
          serviceTitle: service?.title || "Service booking",
          vendorName: service?.vendorName || "",
          vendorPhone: service?.vendorPhone || "",
          bookingDate: bookingDetails?.bookingDate || "",
          bookingEndDate: bookingDetails?.bookingEndDate || "",
          bookingTime: bookingDetails?.bookingTime || "",
          service: {
            title: service?.title || "Service booking",
            vendorName: service?.vendorName || "",
            vendorPhone: service?.vendorPhone || "",
          },
        },
        {
          invoiceTitle: "Service Booking Invoice",
          appName: "All Matrimony",
          notes: "Payment confirmation invoice",
        }
      );
    } catch (error) {
      Alert.alert("Download failed", error?.message || "Unable to open the invoice PDF.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: appTheme?.bg || COLORS.bg }]}>
      <Header
        title="Payment Successful"
        subtitle={service?.title || "Service booking"}
        navigation={navigation}
        showBack={true}
        showNotification={false}
        backTo="ServiceDetails"
      />

      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark-circle" size={72} color={COLORS.success} />
        </View>
        <Text style={styles.title}>Payment successful</Text>
        <Text style={styles.subtitle}>
          Your booking payment was received and sent to the vendor for approval.
        </Text>

        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Paid Amount</Text>
          <Text style={styles.amountValue}>{formatAmount(paymentAmount)}</Text>
        </View>

        {!!service?.title && <InfoRow label="Service" value={service.title} />}
        {!!selectedPackage?.name && (
          <InfoRow
            label="Package"
            value={`${selectedPackage.name}${selectedPackage.price ? ` - ${selectedPackage.price}` : ""}`}
          />
        )}
        {!!invoiceNumber && <InfoRow label="Invoice No." value={invoiceNumber} />}
        {!!bookingDetails?.bookingDate && (
          <InfoRow
            label="Schedule"
            value={`${bookingDetails.bookingDate}${
              bookingDetails.bookingEndDate ? ` to ${bookingDetails.bookingEndDate}` : ""
            }${bookingDetails.bookingTime ? `, ${bookingDetails.bookingTime}` : ""}`}
          />
        )}
        {!!bookingId && <InfoRow label="Booking ID" value={String(bookingId)} />}
        {!!transactionId && <InfoRow label="Transaction ID" value={transactionId} />}

        <TouchableOpacity style={styles.secondaryBtn} onPress={handleDownloadInvoice}>
          <Ionicons name="download-outline" size={18} color={COLORS.primary} />
          <Text style={styles.secondaryBtnText}>Download Invoice PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryBtnText}>Return to Service Page</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  card: {
    flex: 1,
    margin: 16,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  iconWrap: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: COLORS.softGreen,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  title: { color: COLORS.text, fontSize: 26, fontWeight: "900", marginTop: 18 },
  subtitle: {
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
    fontWeight: "600",
  },
  amountBox: {
    width: "100%",
    marginTop: 22,
    borderRadius: 22,
    padding: 18,
    backgroundColor: "#F8F3FF",
    borderWidth: 1,
    borderColor: "#E6D8FF",
    alignItems: "center",
  },
  amountLabel: { color: COLORS.muted, fontWeight: "700" },
  amountValue: { color: COLORS.primary, fontSize: 30, fontWeight: "900", marginTop: 6 },
  infoRow: {
    width: "100%",
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: COLORS.bg,
  },
  infoLabel: { color: COLORS.muted, fontSize: 12, fontWeight: "700" },
  infoValue: { color: COLORS.text, fontWeight: "800", marginTop: 4, lineHeight: 20 },
  secondaryBtn: {
    width: "100%",
    marginTop: 16,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#F8F3FF",
    borderWidth: 1,
    borderColor: "#E6D8FF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  secondaryBtnText: { color: COLORS.primary, fontWeight: "900", fontSize: 16 },
  primaryBtn: {
    width: "100%",
    marginTop: "auto",
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: COLORS.white, fontWeight: "900", fontSize: 16 },
});
