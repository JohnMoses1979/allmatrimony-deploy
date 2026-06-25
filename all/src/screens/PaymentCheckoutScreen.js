import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

import Header from "../components/Header";
import { COLORS } from "../constants/colors";
import { useMatrimony } from "../context/MatrimonyContext";

const formatPrice = (amount = 0) => `Rs. ${(amount / 100).toFixed(0)}`;

const planRank = {
  FREE: 0,
  SILVER: 1,
  GOLD: 2,
};

const fallbackCheckoutPlans = {
  SILVER: {
    name: "Silver",
    amount: 99900,
    description: "Unlock complete bride and groom profile details.",
  },
  GOLD: {
    name: "Gold",
    amount: 199900,
    description: "Unlock full profiles plus direct chat after accepted interests.",
  },
};

function FeatureRow({ text }) {
  return (
    <View style={styles.featureRow}>
      <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
      <Text style={styles.featureRowText}>{text}</Text>
    </View>
  );
}

export default function PaymentCheckoutScreen({ navigation, route }) {
  const {
    currentUser,
    myProfile,
    loadPremiumPlans,
    createPremiumOrder,
    verifyPremiumPayment,
    appTheme,
    language,
  } = useMatrimony();

  const isTelugu = language === "te";
  const t = (english, telugu) => (isTelugu ? telugu : english);

  const planCode = String(route?.params?.planCode || "SILVER").toUpperCase();
  const fallbackPlan = route?.params?.plan || fallbackCheckoutPlans[planCode] || null;
  const ownerId = String(route?.params?.ownerId || currentUser?.id || "");
  const activePlan = String(currentUser?.premiumPlan || myProfile?.premiumPlan || "FREE").toUpperCase();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    t("Preparing secure Razorpay checkout...", "సురక్షిత Razorpay చెకౌట్ సిద్ధం చేస్తున్నాం...")
  );
  const [webScriptReady, setWebScriptReady] = useState(Platform.OS !== "web");

  const markCompleted = (completedPlan = planCode) => {
    const completedFallbackPlan =
      fallbackPlan || fallbackCheckoutPlans[completedPlan] || fallbackCheckoutPlans[planCode];

    setOrderData({
      planCode: completedPlan,
      fallbackPlan: completedFallbackPlan,
      planName: completedFallbackPlan?.name || completedPlan,
      amount:
        completedFallbackPlan?.amount ||
        fallbackCheckoutPlans[completedPlan]?.amount ||
        fallbackCheckoutPlans[planCode]?.amount ||
        0,
      description:
        completedFallbackPlan?.description ||
        fallbackCheckoutPlans[completedPlan]?.description ||
        t(
          `${completedPlan} membership is already active.`,
          `${completedPlan} మెంబర్‌షిప్ ఇప్పటికే యాక్టివ్‌గా ఉంది.`
        ),
    });
    setCompleted(true);
    setStatusMessage(
      t(
        `${completedPlan} membership is already active.`,
        `${completedPlan} మెంబర్‌షిప్ ఇప్పటికే యాక్టివ్‌గా ఉంది.`
      )
    );
    setLoading(false);
  };

  useEffect(() => {
    let active = true;

    const bootstrapOrder = async () => {
      setCompleted(false);

      if (!currentUser?.id || String(ownerId) !== String(currentUser.id)) {
        setLoading(false);
        setStatusMessage(
          t(
            "Premium checkout is only available for your own logged-in account.",
            "ప్రీమియం చెకౌట్ మీ స్వంత లాగిన్ ఖాతాకు మాత్రమే అందుబాటులో ఉంటుంది."
          )
        );
        Alert.alert(
          t("Not Allowed", "అనుమతి లేదు"),
          t(
            "You can only buy premium for the account that is currently logged in.",
            "ప్రస్తుతం లాగిన్ అయిన ఖాతాకు మాత్రమే మీరు ప్రీమియం కొనుగోలు చేయగలరు."
          ),
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
        return;
      }

      setLoading(true);
      setStatusMessage(t("Preparing secure Razorpay checkout...", "సురక్షిత Razorpay చెకౌట్ సిద్ధం చేస్తున్నాం..."));

      if ((planRank[activePlan] ?? 0) >= (planRank[planCode] ?? 0)) {
        markCompleted(planCode);
        return;
      }

      const latestPlans = await loadPremiumPlans?.();

      if (!active) {
        return;
      }

      const latestPlan = String(latestPlans?.currentPlan || activePlan).toUpperCase();

      if (latestPlans?.success && (planRank[latestPlan] ?? 0) >= (planRank[planCode] ?? 0)) {
        markCompleted(planCode);
        return;
      }

      const result = await createPremiumOrder?.(planCode);

      if (!active) {
        return;
      }

      if (result?.success) {
        setOrderData({
          ...(result.data || {}),
          planCode,
          fallbackPlan,
        });
      } else {
        setStatusMessage(
          result?.message || t("Unable to create payment order.", "చెల్లింపు ఆర్డర్ సృష్టించలేకపోయాం.")
        );
      }

      setLoading(false);
    };

    bootstrapOrder();

    return () => {
      active = false;
    };
  }, [
    activePlan,
    planCode,
    currentUser?.id,
    ownerId,
    loadPremiumPlans,
    createPremiumOrder,
    fallbackPlan,
    navigation,
    t,
  ]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      return undefined;
    }

    if (typeof document === "undefined") {
      setWebScriptReady(false);
      return undefined;
    }

    const existingScript = document.querySelector('script[data-razorpay-checkout="true"]');

    if (existingScript && window?.Razorpay) {
      setWebScriptReady(true);
      return undefined;
    }

    const script = existingScript || document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpayCheckout = "true";

    const handleLoad = () => setWebScriptReady(true);
    const handleError = () => {
      setWebScriptReady(false);
      setStatusMessage(
        t(
          "Unable to load Razorpay checkout in browser.",
          "బ్రౌజర్‌లో Razorpay చెకౌట్ లోడ్ చేయలేకపోయాం."
        )
      );
    };

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    if (!existingScript) {
      document.body.appendChild(script);
    }

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, [isTelugu]);

  const checkoutHtml = useMemo(() => {
    if (!orderData?.orderId || !orderData?.keyId) {
      return "";
    }

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "All Matrimony",
      description: orderData.description || `${planCode} membership upgrade`,
      order_id: orderData.orderId,
      prefill: orderData.prefill || {},
      theme: {
        color: COLORS.primary,
      },
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
          <style>
            body {
              margin: 0;
              font-family: Arial, sans-serif;
              background: linear-gradient(180deg, #f8f3ff 0%, #ffffff 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              color: #1f1433;
            }
            .card {
              width: 88%;
              max-width: 440px;
              background: #ffffff;
              border-radius: 24px;
              padding: 24px;
              box-shadow: 0 18px 40px rgba(76, 29, 149, 0.16);
            }
            .badge {
              display: inline-block;
              background: #efe4ff;
              color: #7c3aed;
              font-weight: 700;
              border-radius: 999px;
              padding: 8px 12px;
              margin-bottom: 16px;
            }
            h1 {
              margin: 0 0 8px 0;
              font-size: 26px;
            }
            p {
              margin: 0;
              color: #746887;
              line-height: 1.5;
            }
            .price {
              margin: 18px 0;
              font-size: 32px;
              font-weight: 900;
              color: #4c1d95;
            }
            button {
              width: 100%;
              height: 54px;
              border: none;
              border-radius: 16px;
              background: linear-gradient(90deg, #4c1d95 0%, #7c3aed 100%);
              color: white;
              font-size: 18px;
              font-weight: 800;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">${t("Secure Razorpay Checkout", "సురక్షిత Razorpay చెకౌట్")}</div>
            <h1>${orderData.planName || planCode} ${t("Plan", "ప్లాన్")}</h1>
            <p>${orderData.description || ""}</p>
            <div class="price">${formatPrice(orderData.amount)}</div>
            <button id="pay-button">${t("Pay Securely", "సురక్షితంగా చెల్లించండి")}</button>
          </div>
          <script>
            const options = ${JSON.stringify(options)};
            options.handler = function (response) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: "success",
                payload: response
              }));
            };
            options.modal = {
              ondismiss: function () {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: "dismiss"
                }));
              }
            };
            const razorpay = new Razorpay(options);
            razorpay.on("payment.failed", function (response) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: "failure",
                payload: response.error || {}
              }));
            });
            document.getElementById("pay-button").addEventListener("click", function (event) {
              event.preventDefault();
              razorpay.open();
            });
            setTimeout(function () {
              document.getElementById("pay-button").click();
            }, 600);
          </script>
        </body>
      </html>
    `;
  }, [orderData, planCode, isTelugu]);

  const handleWebMessage = async (event) => {
    let message = null;

    try {
      message = JSON.parse(event?.nativeEvent?.data || "{}");
    } catch (error) {
      setStatusMessage(t("Payment response could not be parsed.", "చెల్లింపు ప్రతిస్పందనను చదవలేకపోయాము."));
      return;
    }

    if (message?.type === "dismiss") {
      setStatusMessage(
        t("Payment popup was closed before completion.", "చెల్లింపు పూర్తయ్యే ముందు పాప్‌అప్ మూసివేయబడింది.")
      );
      return;
    }

    if (message?.type === "failure") {
      setStatusMessage(message?.payload?.description || t("Payment failed. Please try again.", "చెల్లింపు విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి."));
      return;
    }

    if (message?.type !== "success") {
      return;
    }

    setVerifying(true);
    setStatusMessage(
      t(
        "Verifying payment securely with backend...",
        "బ్యాక్‌ఎండ్ ద్వారా చెల్లింపును సురక్షితంగా ధృవీకరిస్తున్నాం..."
      )
    );

    const result = await verifyPremiumPayment?.({
      planCode,
      razorpayOrderId: orderData.orderId,
      razorpayPaymentId: message?.payload?.razorpay_payment_id,
      razorpaySignature: message?.payload?.razorpay_signature,
    });

    setVerifying(false);

    if (result?.success) {
      setCompleted(true);
      setStatusMessage(
        t(
          `${planCode} membership is active on your account.`,
          `${planCode} మెంబర్‌షిప్ మీ ఖాతాలో యాక్టివ్‌గా ఉంది.`
        )
      );
      return;
    }

    setStatusMessage(result?.message || t("Payment verification failed.", "చెల్లింపు ధృవీకరణ విఫలమైంది."));
  };

  const handleWebCheckout = () => {
    if (Platform.OS !== "web") {
      return;
    }

    if (!orderData?.orderId) {
      setStatusMessage(t("Payment order is not ready yet.", "చెల్లింపు ఆర్డర్ ఇంకా సిద్ధంగా లేదు."));
      return;
    }

    if (typeof window === "undefined" || typeof window.Razorpay !== "function") {
      setStatusMessage(
        t(
          "Razorpay checkout is still loading. Please try again.",
          "Razorpay చెకౌట్ ఇంకా లోడ్ అవుతోంది. దయచేసి మళ్లీ ప్రయత్నించండి."
        )
      );
      return;
    }

    const razorpay = new window.Razorpay({
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "All Matrimony",
      description: orderData.description || `${planCode} membership upgrade`,
      order_id: orderData.orderId,
      prefill: orderData.prefill || {},
      theme: {
        color: COLORS.primary,
      },
      modal: {
        ondismiss: () => {
          setStatusMessage(
            t(
              "Payment popup was closed before completion.",
              "చెల్లింపు పూర్తయ్యే ముందు పాప్‌అప్ మూసివేయబడింది."
            )
          );
        },
      },
      handler: (response) =>
        handleWebMessage({
          nativeEvent: {
            data: JSON.stringify({
              type: "success",
              payload: response,
            }),
          },
        }),
    });

    razorpay.on("payment.failed", (response) => {
      handleWebMessage({
        nativeEvent: {
          data: JSON.stringify({
            type: "failure",
            payload: response?.error || {},
          }),
        },
      });
    });

    razorpay.open();
  };

  const checkoutButtonLabel = verifying
    ? t("Verifying payment...", "చెల్లింపును ధృవీకరిస్తున్నాం...")
    : webScriptReady
    ? t("Pay With Razorpay", "Razorpay తో చెల్లించండి")
    : t("Loading Razorpay...", "Razorpay లోడ్ అవుతోంది...");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: appTheme?.bg || COLORS.bg }]}>
      <Header
        title={t("Secure Payment", "సురక్షిత చెల్లింపు")}
        subtitle={
          orderData
            ? `${planCode} ${t("membership checkout", "మెంబర్‌షిప్ చెకౌట్")}`
            : t(
                "Choose the membership plan you want to activate.",
                "మీరు యాక్టివేట్ చేయాలనుకునే మెంబర్‌షిప్ ప్లాన్‌ను ఎంచుకోండి."
              )
        }
        navigation={navigation}
        showBack={true}
        showNotification={false}
        backTo="Premium"
      />

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryIcon}>
            <Ionicons name="card-outline" size={22} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>
              {orderData?.planName || fallbackPlan?.name || planCode} {t("Upgrade", "అప్‌గ్రేడ్")}
            </Text>
            <Text style={styles.summaryText}>
              {orderData?.description || fallbackPlan?.description || t("Secure payment powered by Razorpay.", "Razorpay ద్వారా సురక్షిత చెల్లింపు.")}
            </Text>
          </View>
          <Text style={styles.summaryAmount}>{formatPrice(orderData?.amount || fallbackPlan?.amount || 0)}</Text>
        </View>

        <View style={styles.noteRow}>
          <Ionicons name="shield-checkmark-outline" size={17} color={COLORS.secondary} />
          <Text style={styles.noteText}>
            {t(
              "Backend creates the order first and verifies the signature before your plan is activated.",
              "బ్యాక్‌ఎండ్ ముందుగా ఆర్డర్ సృష్టించి, సంతకం ధృవీకరించిన తర్వాతే మీ ప్లాన్ యాక్టివ్ అవుతుంది."
            )}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>
      ) : !orderData?.orderId ? (
        <View style={styles.centerBox}>
          <Ionicons name="alert-circle-outline" size={34} color={COLORS.danger} />
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>
      ) : Platform.OS === "web" || completed ? (
        <View style={styles.webCard}>
          <View style={styles.browserPreview}>
            <View style={styles.browserDots}>
              <View style={[styles.browserDot, { backgroundColor: "#F87171" }]} />
              <View style={[styles.browserDot, { backgroundColor: "#FBBF24" }]} />
              <View style={[styles.browserDot, { backgroundColor: "#34D399" }]} />
            </View>
            <Text style={styles.browserUrl}>checkout.razorpay.com</Text>
          </View>

          <View style={styles.checkoutHero}>
            <Text style={styles.checkoutBadge}>{t("Live Secure Checkout", "సురక్షిత ప్రత్యక్ష చెకౌట్")}</Text>
            <Text style={styles.checkoutTitle}>
              {orderData?.planName || fallbackPlan?.name || planCode} {t("Membership", "మెంబర్‌షిప్")}
            </Text>
            <Text style={styles.checkoutDescription}>
              {orderData?.description || fallbackPlan?.description || t("Secure payment powered by Razorpay.", "Razorpay ద్వారా సురక్షిత చెల్లింపు.")}
            </Text>
            <Text style={styles.checkoutAmount}>{formatPrice(orderData?.amount || fallbackPlan?.amount || 0)}</Text>
          </View>

          <View style={styles.featureList}>
            <FeatureRow text={t("Backend-created Razorpay order", "బ్యాక్‌ఎండ్‌లో సృష్టించిన Razorpay ఆర్డర్")} />
            <FeatureRow text={t("Server-side payment signature verification", "సర్వర్ వైపు చెల్లింపు సిగ్నేచర్ ధృవీకరణ")} />
            <FeatureRow
              text={
                completed
                  ? t(
                      `${planCode} access is active on your account`,
                      `${planCode} యాక్సెస్ మీ ఖాతాలో యాక్టివ్‌గా ఉంది`
                    )
                  : t(
                      "Access activates after successful payment.",
                      "విజయవంతమైన చెల్లింపు తర్వాత యాక్సెస్ యాక్టివ్ అవుతుంది."
                    )
              }
            />
          </View>

          {completed ? (
            <TouchableOpacity
              style={[styles.webCheckoutBtn, styles.completedBtn]}
              onPress={() => navigation.replace("Premium", { ownerId })}
            >
              <Ionicons name="checkmark-circle" size={19} color={COLORS.white} />
              <Text style={styles.webCheckoutBtnText}>{t("Completed", "పూర్తయింది")}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.webCheckoutBtn, (!webScriptReady || verifying) && styles.webCheckoutBtnDisabled]}
              onPress={handleWebCheckout}
              disabled={!webScriptReady || verifying}
            >
              <Ionicons name="lock-closed" size={18} color={COLORS.white} />
              <Text style={styles.webCheckoutBtnText}>{checkoutButtonLabel}</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.webviewWrap}>
          <WebView
            originWhitelist={["*"]}
            source={{ html: checkoutHtml }}
            onMessage={handleWebMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.centerBox}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.statusText}>
                  {t("Opening Razorpay checkout...", "Razorpay చెకౌట్ తెరవబడుతోంది...")}
                </Text>
              </View>
            )}
          />
        </View>
      )}

      {verifying ? (
        <View style={styles.verifyingBar}>
          <ActivityIndicator size="small" color={COLORS.white} />
          <Text style={styles.verifyingText}>{t("Verifying payment...", "చెల్లింపును ధృవీకరిస్తున్నాం...")}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  summaryCard: {
    margin: 16,
    marginBottom: 10,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.softOrange,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
  },
  summaryText: {
    color: COLORS.muted,
    fontWeight: "700",
    marginTop: 4,
  },
  summaryAmount: {
    color: COLORS.primaryDark,
    fontWeight: "900",
  },
  noteRow: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    gap: 8,
  },
  noteText: {
    flex: 1,
    color: COLORS.muted,
    fontWeight: "700",
    lineHeight: 19,
  },
  webviewWrap: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  webCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },
  browserPreview: {
    backgroundColor: "#FFF8ED",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  browserDots: {
    flexDirection: "row",
    gap: 6,
  },
  browserDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  browserUrl: {
    color: COLORS.muted,
    fontWeight: "700",
  },
  checkoutHero: {
    padding: 20,
    backgroundColor: "#FCFAFF",
  },
  checkoutBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EFE4FF",
    color: COLORS.primary,
    fontWeight: "900",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  checkoutTitle: {
    marginTop: 14,
    color: COLORS.text,
    fontSize: 25,
    fontWeight: "900",
  },
  checkoutDescription: {
    marginTop: 8,
    color: COLORS.muted,
    fontWeight: "700",
    lineHeight: 21,
  },
  checkoutAmount: {
    marginTop: 18,
    color: COLORS.primaryDark,
    fontSize: 32,
    fontWeight: "900",
  },
  featureList: {
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureRowText: {
    flex: 1,
    color: COLORS.text,
    fontWeight: "700",
    lineHeight: 20,
  },
  webCheckoutBtn: {
    margin: 20,
    marginTop: 22,
    height: 54,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  webCheckoutBtnDisabled: {
    backgroundColor: "#9CA3AF",
  },
  completedBtn: {
    backgroundColor: COLORS.success,
  },
  webCheckoutBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "900",
  },
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  statusText: {
    color: COLORS.text,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 22,
  },
  verifyingBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primaryDark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  verifyingText: {
    color: COLORS.white,
    fontWeight: "900",
  },
});



