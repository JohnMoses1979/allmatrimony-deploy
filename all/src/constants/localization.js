const SERVICE_TITLE_MAP = {
  en: {
    "Royal Function Hall": "Royal Function Hall",
    "Church Wedding Hall": "Church Wedding Hall",
    "Dream Wedding Photography": "Dream Wedding Photography",
    "Wedding Photography": "Wedding Photography",
    "Traditional Wedding Cooking": "Traditional Wedding Cooking",
    "Christian Catering": "Christian Catering",
    "Bridal Glow Makeup": "Bridal Glow Makeup",
    "Bridal Makeup": "Bridal Makeup",
    "Elegant Wedding Decor": "Elegant Wedding Decor",
    "Church Decoration": "Church Decoration",
    "Elite Event Planners": "Elite Event Planners",
    "Melody Wedding Arkestra": "Melody Wedding Arkestra",
    "Wedding Orchestra": "Wedding Orchestra",
    "Grand Arkestra Night": "Grand Arkestra Night",
    "Royal Wedding Cooking Team": "Royal Wedding Cooking Team",
    "Wedding Cleaning Support": "Wedding Cleaning Support",
    "Cleaning Services": "Cleaning Services",
    "Premium Event Cleaning Team": "Premium Event Cleaning Team",
    "Sri Lakshmi Function Hall": "Sri Lakshmi Function Hall",
    "Bride Luxury Car Service": "Bride Luxury Car Service",
    "Wedding Cars": "Wedding Cars",
    "Pastor Booking": "Pastor Booking",
    "Honeymoon Planning": "Honeymoon Planning",
    "Sound & Lighting": "Sound & Lighting",
    "Wedding Cake": "Wedding Cake",
    "Invitation Card Design & Printing": "Invitation Card Design & Printing",
    "Groom Premium Car Service": "Groom Premium Car Service",
    "Wedding Service": "Wedding Service",
  },
  te: {
    "Royal Function Hall": "రాయల్ ఫంక్షన్ హాల్",
    "Church Wedding Hall": "చర్చ్ వెడ్డింగ్ హాల్",
    "Dream Wedding Photography": "డ్రీమ్ వెడ్డింగ్ ఫోటోగ్రఫీ",
    "Wedding Photography": "వెడ్డింగ్ ఫోటోగ్రఫీ",
    "Traditional Wedding Cooking": "సాంప్రదాయ పెళ్లి వంట",
    "Christian Catering": "క్రిస్టియన్ క్యాటరింగ్",
    "Bridal Glow Makeup": "బ్రైడల్ గ్లో మేకప్",
    "Bridal Makeup": "బ్రైడల్ మేకప్",
    "Elegant Wedding Decor": "అందమైన పెళ్లి అలంకరణ",
    "Church Decoration": "చర్చ్ డెకరేషన్",
    "Elite Event Planners": "ఎలైట్ ఈవెంట్ ప్లానర్స్",
    "Melody Wedding Arkestra": "మెలొడి వెడ్డింగ్ ఆర్కెస్ట్రా",
    "Wedding Orchestra": "వెడ్డింగ్ ఆర్కెస్ట్రా",
    "Grand Arkestra Night": "గ్రాండ్ ఆర్కెస్ట్రా నైట్",
    "Royal Wedding Cooking Team": "రాయల్ వెడ్డింగ్ కుకింగ్ టీమ్",
    "Wedding Cleaning Support": "వెడ్డింగ్ క్లీనింగ్ సపోర్ట్",
    "Cleaning Services": "క్లీనింగ్ సర్వీసులు",
    "Premium Event Cleaning Team": "ప్రీమియం ఈవెంట్ క్లీనింగ్ టీమ్",
    "Sri Lakshmi Function Hall": "శ్రీ లక్ష్మి ఫంక్షన్ హాల్",
    "Bride Luxury Car Service": "వధువు లగ్జరీ కార్ సర్వీస్",
    "Wedding Cars": "వెడ్డింగ్ కార్స్",
    "Pastor Booking": "పాస్టర్ బుకింగ్",
    "Honeymoon Planning": "హనీమూన్ ప్లానింగ్",
    "Sound & Lighting": "సౌండ్ & లైటింగ్",
    "Wedding Cake": "వెడ్డింగ్ కేక్",
    "Invitation Card Design & Printing": "ఆహ్వాన పత్రిక డిజైన్ & ప్రింటింగ్",
    "Groom Premium Car Service": "వరుడు ప్రీమియం కార్ సర్వీస్",
    "Wedding Service": "వెడ్డింగ్ సర్వీస్",
  },
};

const SERVICE_CATEGORY_MAP = {
  en: {
    All: "All",
    "Function Hall": "Function Hall",
    Photography: "Photography",
    "Church Wedding Hall": "Church Wedding Hall",
    "Wedding Photography": "Wedding Photography",
    "Christian Catering": "Christian Catering",
    "Bridal Makeup": "Bridal Makeup",
    "Church Decoration": "Church Decoration",
    "Wedding Orchestra": "Wedding Orchestra",
    "Pastor Booking": "Pastor Booking",
    "Wedding Cars": "Wedding Cars",
    "Honeymoon Planning": "Honeymoon Planning",
    "Cleaning Services": "Cleaning Services",
    "Sound & Lighting": "Sound & Lighting",
    "Wedding Cake": "Wedding Cake",
    "Invitation Card Design & Printing": "Invitation Card Design & Printing",
    Catering: "Catering",
    Cooking: "Cooking",
    Makeup: "Makeup",
    Decoration: "Decoration",
    "Event Planner": "Event Planner",
    Arkestra: "Arkestra",
    "Bride And Groom Car Services": "Bride/Groom Car",
    "Bride/Groom Car": "Bride/Groom Car",
    Cleaning: "Cleaning",
  },
  te: {
    All: "అన్ని",
    "Function Hall": "ఫంక్షన్ హాల్",
    Photography: "ఫోటోగ్రఫీ",
    "Church Wedding Hall": "చర్చ్ వెడ్డింగ్ హాల్",
    "Wedding Photography": "వెడ్డింగ్ ఫోటోగ్రఫీ",
    "Christian Catering": "క్రిస్టియన్ క్యాటరింగ్",
    "Bridal Makeup": "బ్రైడల్ మేకప్",
    "Church Decoration": "చర్చ్ డెకరేషన్",
    "Wedding Orchestra": "వెడ్డింగ్ ఆర్కెస్ట్రా",
    "Pastor Booking": "పాస్టర్ బుకింగ్",
    "Wedding Cars": "వెడ్డింగ్ కార్స్",
    "Honeymoon Planning": "హనీమూన్ ప్లానింగ్",
    "Cleaning Services": "క్లీనింగ్ సర్వీసులు",
    "Sound & Lighting": "సౌండ్ & లైటింగ్",
    "Wedding Cake": "వెడ్డింగ్ కేక్",
    "Invitation Card Design & Printing": "ఆహ్వాన పత్రిక డిజైన్ & ప్రింటింగ్",
    Catering: "క్యాటరింగ్",
    Cooking: "కుకింగ్",
    Makeup: "మేకప్",
    Decoration: "డెకరేషన్",
    "Event Planner": "ఈవెంట్ ప్లానర్",
    Arkestra: "ఆర్కెస్ట్రా",
    "Bride And Groom Car Services": "వధువు/వరుడు కార్ సర్వీస్",
    "Bride/Groom Car": "వధువు/వరుడు కార్",
    Cleaning: "క్లీనింగ్",
  },
};

const GENDER_MAP = {
  en: {
    Bride: "Bride",
    Groom: "Groom",
    All: "All",
    Male: "Male",
    Female: "Female",
  },
  te: {
    Bride: "వధువు",
    Groom: "వరుడు",
    All: "అన్ని",
    Male: "పురుషుడు",
    Female: "స్త్రీ",
  },
};

const COMMON_MAP = {
  en: {
    years: "yrs",
    vip: "VIP",
    datePrefix: "Date:",
    to: "to",
  },
  te: {
    years: "yrs",
    vip: "VIP",
    datePrefix: "తేదీ:",
    to: "వరకు",
  },
};

const normalizeLanguage = (language) => (language === "te" ? "te" : "en");

export const createTextHelper = (language) => (en, te) =>
  normalizeLanguage(language) === "te" ? te : en;

const translateFromMap = (language, value, map) => {
  const normalizedLanguage = normalizeLanguage(language);
  const normalizedValue = value == null ? "" : String(value);
  return map[normalizedLanguage]?.[normalizedValue] || normalizedValue;
};

export const getCommonLabel = (language, key) =>
  COMMON_MAP[normalizeLanguage(language)]?.[key] || "";

export const getYearsLabel = () => "yrs";

export const getVipLabel = (language) => getCommonLabel(language, "vip") || "VIP";

export const translateGender = (language, value) => translateFromMap(language, value, GENDER_MAP);

export const translateServiceCategory = (language, value) =>
  translateFromMap(language, value, SERVICE_CATEGORY_MAP);

export const translateServiceTitle = (language, value) =>
  translateFromMap(language, value, SERVICE_TITLE_MAP);

export const formatAgeLabel = (language, age) => `${age} ${getYearsLabel(language)}`;

export const formatAgeRangeLabel = (language, minAge, maxAge) => {
  const years = getYearsLabel(language);
  const minValue = minAge || "18";
  const maxValue = maxAge || "60";
  return `${minValue}-${maxValue} ${years}`;
};

export const formatServiceStatusMessage = (language, status, serviceTitle) => {
  const normalizedLanguage = normalizeLanguage(language);
  const normalizedStatus = String(status || "").toUpperCase();
  const title = translateServiceTitle(language, serviceTitle || "Wedding Service");

  if (normalizedStatus === "APPROVED") {
    return normalizedLanguage === "te"
      ? `మీ ${title} బుకింగ్ అభ్యర్థన ఆమోదించబడింది. వెండర్ త్వరలో మీతో సంప్రదిస్తారు.`
      : `Your ${title} booking request is approved. Vendor will contact you soon.`;
  }

  if (normalizedStatus === "REJECTED") {
    return normalizedLanguage === "te"
      ? `మీ ${title} బుకింగ్ అభ్యర్థన తిరస్కరించబడింది. వివరాల కోసం సపోర్ట్‌ను సంప్రదించండి.`
      : `Your ${title} booking request is rejected. Please contact support for details.`;
  }

  if (normalizedStatus === "PENDING") {
    return normalizedLanguage === "te"
      ? `మీ ${title} బుకింగ్ అభ్యర్థన ఆమోదం కోసం అడ్మిన్‌కు పంపబడింది.`
      : `Your ${title} booking request has been sent to admin for approval.`;
  }

  return "";
};
export const getServiceCopy = (language) => {
  const normalizedLanguage = normalizeLanguage(language);
  const statusLabel = (status) => {
    const normalizedStatus = String(status || "").toUpperCase();

    if (normalizedLanguage === "te") {
      if (normalizedStatus === "APPROVED") return "ఆమోదించబడింది";
      if (normalizedStatus === "REJECTED") return "తిరస్కరించబడింది";
      if (normalizedStatus === "PENDING") return "పెండింగ్";
      return String(status || "");
    }

    if (normalizedStatus === "APPROVED") return "Approved";
    if (normalizedStatus === "REJECTED") return "Rejected";
    if (normalizedStatus === "PENDING") return "Pending";
    return String(status || "");
  };

  return {
    requestSentTitle:
      normalizedLanguage === "te" ? "సర్వీస్ అభ్యర్థన పంపబడింది" : "Service Request Sent",
    newBookingTitle:
      normalizedLanguage === "te"
        ? "కొత్త వెడ్డింగ్ సర్వీస్ బుకింగ్"
        : "New Wedding Service Booking",
    serviceBookingTitle:
      normalizedLanguage === "te" ? "సర్వీస్ బుకింగ్" : "Service Booking",
    registerFirst:
      normalizedLanguage === "te"
        ? "ముందుగా మీ సర్వీస్ బుకింగ్ వివరాలను నమోదు చేయండి."
        : "Please register your service booking details first.",
    requestSent:
      normalizedLanguage === "te"
        ? "వెడ్డింగ్ సర్వీస్ అభ్యర్థన అడ్మిన్‌కు పంపబడింది."
        : "Wedding service request sent to admin.",
    requestFailed:
      normalizedLanguage === "te"
        ? "వెడ్డింగ్ సర్వీస్ అభ్యర్థన విఫలమైంది."
        : "Wedding service request failed.",
    registrationCompletedSent:
      normalizedLanguage === "te"
        ? "నమోదు పూర్తయింది మరియు బుకింగ్ అభ్యర్థన పంపబడింది."
        : "Registration completed and booking request sent.",
    registrationCompletedFailed:
      normalizedLanguage === "te"
        ? "బుకింగ్ అభ్యర్థనను నమోదు చేసి పంపడం సాధ్యపడలేదు."
        : "Unable to register and send booking request.",
    requestNotFound:
      normalizedLanguage === "te" ? "సర్వీస్ అభ్యర్థన కనబడలేదు." : "Service request not found.",
    bookingStatus: (status) =>
      normalizedLanguage === "te"
        ? `సర్వీస్ బుకింగ్ ${statusLabel(status)}.`
        : `Service booking ${statusLabel(status)}.`,
  };
};
