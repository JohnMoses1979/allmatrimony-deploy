import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Asset } from "expo-asset";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import Header from "../components/Header";
import Text from "../components/AutoText";
import TextInput from "../components/AutoTranslateTextInput";
import InlineMessage from "../components/InlineMessage";
import PrimaryButton from "../components/PrimaryButton";
import { API_BASE_URL, toApiAssetUrl } from "../config/api";
import { COLORS } from "../constants/colors";
import { createTextHelper } from "../constants/localization";
import { getStrings } from "../constants/i18n";
import { useMatrimony } from "../context/MatrimonyContext";

const genderOptions = ["Bride", "Groom"];
const profileCreatedForOptions = [
  "Self",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Relative",
  "Friend",
];
const maritalOptions = ["Never Married", "Divorced", "Widowed"];

const RELIGION_OPTIONS = [
  "Hindu",
  "Christian",
  "Muslim",
  "Sikh",
  "Jain",
  "Buddhist",
  "Parsi",
  "Jewish",
  "Other",
];

const COMMUNITY_OPTIONS_BY_RELIGION = {
  Hindu: [
    "Brahmin",
    "Kshatriya",
    "Vaishya",
    "Yadava",
    "Reddy",
    "Kamma",
    "Kapu",
    "Velama",
    "Naidu",
    "Chettiar",
    "Vokkaliga",
    "Lingayat",
    "Nair",
    "Ezhava",
    "Maratha",
    "Rajput",
    "Jat",
    "Agarwal",
    "Bania",
    "Scheduled Caste (SC)",
    "Scheduled Tribe (ST)",
    "Other Backward Class (OBC)",
    "Others",
  ],
  Christian: [
    "Roman Catholic",
    "CSI",
    "CNI",
    "Pentecostal",
    "Baptist",
    "Methodist",
    "Lutheran",
    "Orthodox",
    "Jacobite",
    "Seventh-day Adventist",
    "Evangelical",
    "Born Again",
    "Independent Church",
    "Others",
  ],
  Muslim: [
    "Sunni",
    "Shia",
    "Bohra",
    "Sufi",
    "Ahmadiyya",
    "Mappila",
    "Pathan",
    "Syed",
    "Sheikh",
    "Ansari",
    "Others",
  ],
  Sikh: [
    "Jat Sikh",
    "Ramgarhia",
    "Arora",
    "Khatri",
    "Lubana",
    "Mazhabi Sikh",
    "Others",
  ],
  Jain: ["Digambar", "Shwetambar", "Sthanakvasi", "Terapanthi", "Others"],
  Buddhist: ["Others"],
  Parsi: ["Others"],
  Jewish: ["Others"],
  Other: ["Others"],
};

const CASTE_OPTIONS_BY_RELIGION_AND_COMMUNITY = {
  Hindu: {
    Brahmin: ["Niyogi", "Vaidiki", "Smartha", "Madhwa", "Iyer", "Iyengar", "Havyaka", "Chitpavan", "Gaur", "Saraswat"],
    Reddy: ["Panta Reddy", "Motati Reddy", "Pakanati Reddy", "Pedakanti Reddy", "Goudati Reddy"],
    Kamma: ["Chowdary", "Illuvellani", "Gampa", "Kakatiya Kamma"],
    Kapu: ["Balija", "Telaga", "Ontari", "Turpu Kapu", "Munnuru Kapu"],
    Naidu: ["Balija Naidu", "Gavara Naidu", "Kamma Naidu"],
    Yadava: ["Golla", "Konar", "Ahir", "Krishnaut"],
    Chettiar: ["Others"],
    Vokkaliga: ["Others"],
    Lingayat: ["Others"],
    Nair: ["Others"],
    Ezhava: ["Others"],
    Maratha: ["Others"],
    Rajput: ["Others"],
    Jat: ["Others"],
    Agarwal: ["Others"],
    Bania: ["Others"],
    "Scheduled Caste (SC)": ["Others"],
    "Scheduled Tribe (ST)": ["Others"],
    "Other Backward Class (OBC)": ["Others"],
    Others: ["Others"],
    Kshatriya: ["Others"],
    Vaishya: ["Others"],
  },
  Christian: {
    "Roman Catholic": ["Latin Catholic", "Syrian Catholic", "Anglo-Indian Catholic"],
    CSI: ["Telugu CSI", "Tamil CSI", "Malayalam CSI"],
    CNI: ["Others"],
    Pentecostal: ["Others"],
    Baptist: ["Others"],
    Methodist: ["Others"],
    Lutheran: ["Others"],
    Orthodox: ["Others"],
    Jacobite: ["Others"],
    "Seventh-day Adventist": ["Others"],
    Evangelical: ["Others"],
    "Born Again": ["Others"],
    "Independent Church": ["Others"],
    Others: ["Others"],
  },
  Muslim: {
    Sunni: ["Hanafi", "Shafi", "Maliki", "Hanbali"],
    Shia: ["Others"],
    Bohra: ["Others"],
    Sufi: ["Others"],
    Ahmadiyya: ["Others"],
    Mappila: ["Others"],
    Pathan: ["Others"],
    Syed: ["Others"],
    Sheikh: ["Others"],
    Ansari: ["Others"],
    Others: ["Others"],
  },
  Sikh: {
    "Jat Sikh": ["Others"],
    Ramgarhia: ["Others"],
    Arora: ["Others"],
    Khatri: ["Others"],
    Lubana: ["Others"],
    "Mazhabi Sikh": ["Others"],
    Others: ["Others"],
  },
  Jain: {
    Digambar: ["Others"],
    Shwetambar: ["Others"],
    Sthanakvasi: ["Others"],
    Terapanthi: ["Others"],
    Others: ["Others"],
  },
  Buddhist: {
    Others: ["Others"],
  },
  Parsi: {
    Others: ["Others"],
  },
  Jewish: {
    Others: ["Others"],
  },
  Other: {
    Others: ["Others"],
  },
};

const ALL_COMMUNITY_OPTIONS = [
  "Brahmin",
  "Kshatriya",
  "Vaishya",
  "Yadava",
  "Reddy",
  "Kamma",
  "Kapu",
  "Velama",
  "Naidu",
  "Chettiar",
  "Vokkaliga",
  "Lingayat",
  "Nair",
  "Ezhava",
  "Maratha",
  "Rajput",
  "Jat",
  "Agarwal",
  "Bania",
  "Scheduled Caste (SC)",
  "Scheduled Tribe (ST)",
  "Other Backward Class (OBC)",
  "Roman Catholic",
  "CSI",
  "CNI",
  "Pentecostal",
  "Baptist",
  "Methodist",
  "Lutheran",
  "Orthodox",
  "Jacobite",
  "Seventh-day Adventist",
  "Evangelical",
  "Born Again",
  "Independent Church",
  "Sunni",
  "Shia",
  "Bohra",
  "Sufi",
  "Ahmadiyya",
  "Mappila",
  "Pathan",
  "Syed",
  "Sheikh",
  "Ansari",
  "Jat Sikh",
  "Ramgarhia",
  "Arora",
  "Khatri",
  "Lubana",
  "Mazhabi Sikh",
  "Digambar",
  "Shwetambar",
  "Sthanakvasi",
  "Terapanthi",
  "Others",
];

const PREFERRED_COMMUNITY_OPTIONS = ["Any", "Same community", ...ALL_COMMUNITY_OPTIONS];

const getCommunityOptionsForReligion = (religion = "") => {
  const options = COMMUNITY_OPTIONS_BY_RELIGION[religion];

  if (options && options.length > 0) {
    return options;
  }

  return ALL_COMMUNITY_OPTIONS;
};

const getCasteOptionsForSelection = (religion = "", community = "") => {
  const religionMap = CASTE_OPTIONS_BY_RELIGION_AND_COMMUNITY[religion];
  const options = religionMap?.[community];

  if (options && options.length > 0) {
    return options;
  }

  if (community) {
    return ["Others"];
  }

  return [];
};

const DEFAULT_PROFILE_IMAGE = Asset.fromModule(
  require("../../assets/Images/all-hero.png")
).uri;

const IMAGE_MEDIA_TYPES = ["images"];
const DOB_YEAR_RANGE = 80;

const pad2 = (value) => String(value).padStart(2, "0");

const parseDobString = (value) => {
  if (!value) return null;

  const text = String(value).trim();
  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const date = new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const slashMatch = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const date = new Date(Number(slashMatch[3]), Number(slashMatch[2]) - 1, Number(slashMatch[1]));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const fallback = new Date(text);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

const formatDobString = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
};

const buildCalendarDays = (monthDate) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstDay; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  return cells;
};

const formatMonthTitle = (date) =>
  date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

export default function ProfileCreateEditScreen({ navigation }) {
  const { myProfile, saveMyProfile, language } = useMatrimony();
  const t = getStrings(language).profileEdit;
  const tr = createTextHelper(language);
  const [openDropdown, setOpenDropdown] = useState("");
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [dobMonth, setDobMonth] = useState(() => parseDobString(myProfile?.dob) || new Date());

  const [submitMessage, setSubmitMessage] = useState("");
  const [submitMessageType, setSubmitMessageType] = useState("info");
  const [showSuccessOk, setShowSuccessOk] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [form, setForm] = useState({
    name: myProfile?.name || "",
    profileCreatedFor: myProfile?.profileCreatedFor || "Self",
    gender: myProfile?.gender || "Groom",
    age: myProfile?.age || "",
    dob: myProfile?.dob || "",
    phone: myProfile?.phone || "",
    email: myProfile?.email || "",
    community: myProfile?.community || "",
    religion: myProfile?.religion || "",
    caste: myProfile?.caste || "",
    location: myProfile?.location || "",
    education: myProfile?.education || "",
    job: myProfile?.job || "",
    income: myProfile?.income || "",
    height: myProfile?.height || "",
    maritalStatus: myProfile?.maritalStatus || "Never Married",
    familyType: myProfile?.familyType || "",
    fatherName: myProfile?.fatherName || "",
    motherName: myProfile?.motherName || "",
    siblings: myProfile?.siblings || "",
    about: myProfile?.about || "",
    partnerAge: myProfile?.partnerAge || "",
    partnerCommunity: myProfile?.partnerCommunity || "",
    partnerLocation: myProfile?.partnerLocation || "",
    partnerEducation: myProfile?.partnerEducation || "",
    habits: myProfile?.habits || "",
    image: toApiAssetUrl(myProfile?.image || DEFAULT_PROFILE_IMAGE),
  });

  const communityOptions = useMemo(
    () => getCommunityOptionsForReligion(form.religion),
    [form.religion]
  );
  const casteOptions = useMemo(
    () => getCasteOptionsForSelection(form.religion, form.community),
    [form.religion, form.community]
  );

  useEffect(() => {
    const parsedDob = parseDobString(form.dob) || parseDobString(myProfile?.dob) || new Date();
    setDobMonth(parsedDob);
  }, [form.dob, myProfile?.dob]);

  const updateField = (key, value) => {
    if (submitMessage) {
      setSubmitMessage("");
    }

    if (showSuccessOk) {
      setShowSuccessOk(false);
    }

    setForm((prev) => {
      const next = {
        ...prev,
        [key]: value,
      };

      if (key === "religion") {
        next.community = "";
        next.caste = "";
      }

      if (key === "community") {
        next.caste = "";
      }

      return next;
    });
  };

  const handleSuccessAcknowledge = () => {
    setShowSuccessOk(false);

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("MainTabs");
  };

  const uploadProfileImage = async (asset) => {
    if (!asset?.uri) {
      return null;
    }

    setIsUploadingImage(true);
    setSubmitMessageType("info");
    setSubmitMessage("Uploading profile image...");
    setShowSuccessOk(false);

    try {
      const formData = new FormData();
      const fallbackName = `profile-${Date.now()}.jpg`;

      if (Platform.OS === "web" && asset.file) {
        formData.append("file", asset.file, asset.file.name || fallbackName);
      } else {
        formData.append("file", {
          uri: asset.uri,
          name: asset.fileName || fallbackName,
          type: asset.mimeType || "image/jpeg",
        });
      }

      const response = await fetch(`${API_BASE_URL}/api/uploads/profile-image`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      const uploadedImagePath = data?.data?.imagePath || data?.data?.imageUrl;

      if (!response.ok || data.success === false || !uploadedImagePath) {
        throw new Error(data.message || "Image upload failed.");
      }

      updateField("image", toApiAssetUrl(uploadedImagePath));
      setSubmitMessageType("success");
      setSubmitMessage("Profile image uploaded successfully.");
      return uploadedImagePath;
    } catch (error) {
      setSubmitMessageType("error");
      setSubmitMessage(error.message || tr("Unable to upload image.", "చిత్రాన్ని అప్‌లోడ్ చేయలేకపోయాం."));

      if (Platform.OS !== "web") {
        Alert.alert(tr("Upload Failed", "అప్‌లోడ్ విఫలమైంది"), error.message || tr("Unable to upload image.", "చిత్రాన్ని అప్‌లోడ్ చేయలేకపోయాం."));
      }

      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Camera symbol click chesthe real camera open avtundi
  const openProfileCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          tr("Camera Permission Required", "కెమెరా అనుమతి అవసరం"),
          tr("Please allow camera permission to take profile photo.", "ప్రొఫైల్ ఫోటో తీయడానికి కెమెరా అనుమతి ఇవ్వండి.")
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: IMAGE_MEDIA_TYPES,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        cameraType: ImagePicker.CameraType.front,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadProfileImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert(tr("Camera Error", "కెమెరా లోపం"), tr("Unable to open camera. Please try again.", "కెమెరాను తెరవలేకపోయాం. దయచేసి మళ్లీ ప్రయత్నించండి."));
    }
  };

  // Choose button click chesthe gallery open avtundi
  const pickProfileImage = async () => {
    try {
      if (Platform.OS !== "web") {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            tr("Gallery Permission Required", "గ్యాలరీ అనుమతి అవసరం"),
            tr("Please allow gallery permission to select profile photo.", "ప్రొఫైల్ ఫోటో ఎంచుకోవడానికి గ్యాలరీ అనుమతి ఇవ్వండి.")
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: IMAGE_MEDIA_TYPES,
        allowsEditing: Platform.OS !== "web",
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadProfileImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert(tr("Image Error", "చిత్ర లోపం"), tr("Unable to select image. Please try again.", "చిత్రాన్ని ఎంచుకోలేకపోయాం. దయచేసి మళ్లీ ప్రయత్నించండి."));
    }
  };

  const removeProfileImage = () => {
    updateField("image", DEFAULT_PROFILE_IMAGE);
  };

  const validate = () => {
    if (!form.name.trim()) {
      setSubmitMessageType("error");
      setSubmitMessage("Please enter full name.");
      return false;
    }

    if (!form.profileCreatedFor.trim()) {
      setSubmitMessageType("error");
      setSubmitMessage("Please select profile created for.");
      return false;
    }

    if (!form.phone.trim()) {
      setSubmitMessageType("error");
      setSubmitMessage("Please enter phone number.");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setSubmitMessageType("error");
      setSubmitMessage("Please enter a valid 10-digit phone number.");
      return false;
    }

    if (!form.age.trim()) {
      setSubmitMessageType("error");
      setSubmitMessage("Please enter age.");
      return false;
    }

    if (!form.community.trim()) {
      setSubmitMessageType("error");
      setSubmitMessage("Please select community.");
      return false;
    }

    if (!form.location.trim()) {
      setSubmitMessageType("error");
      setSubmitMessage("Please enter location.");
      return false;
    }

    if (!form.about.trim()) {
      setSubmitMessageType("error");
      setSubmitMessage("Please write about profile.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    if (isUploadingImage) {
      setSubmitMessageType("info");
      setSubmitMessage("Please wait until the image upload finishes.");
      return;
    }

    setSubmitMessage("");
    setShowSuccessOk(false);
    const result = await saveMyProfile(form);

    if (!result?.success) {
      const message = result?.message || tr("Unable to save profile.", "ప్రొఫైల్ సేవ్ చేయలేకపోయాం.");
      setSubmitMessageType("error");
      setSubmitMessage(message);

      if (Platform.OS !== "web") {
        Alert.alert("Save Failed", message);
      }

      return;
    }

    const successMessage =
      "Profile submitted successfully. Waiting for admin approval.";

    setSubmitMessageType("success");
    setSubmitMessage(successMessage);
    setShowSuccessOk(true);

    if (Platform.OS !== "web") {
      Alert.alert("Success", successMessage, [
        {
          text: "OK",
          onPress: handleSuccessAcknowledge,
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={t.headerTitle}
        subtitle={t.headerSubtitle}
        navigation={navigation}
        showBack={true}
        showNotification={false}
        backTo="MainTabs"
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <InlineMessage type={submitMessageType} text={submitMessage} />

          {/* PROFILE PHOTO CARD */}
          <View style={styles.photoCard}>
            <View style={styles.imageBox}>
              <Image source={{ uri: form.image }} style={styles.avatar} />

              {/* Only this camera symbol opens real camera */}
              <TouchableOpacity
                style={styles.cameraBtn}
                onPress={openProfileCamera}
                activeOpacity={0.85}
              >
                <Ionicons name="camera" size={19} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.photoInfo}>
              <Text style={styles.photoTitle}>{tr("Profile Photo", "ప్రొఫైల్ ఫోటో")}</Text>
              <Text style={styles.photoText}>
                {tr("Tap camera icon to take photo. Use Choose to select from gallery.", "ఫోటో తీయడానికి కెమెరా ఐకాన్‌ను నొక్కండి. గ్యాలరీ నుండి ఎంచుకోవడానికి Choose వాడండి.")}
              </Text>

              <View style={styles.photoActions}>
                <TouchableOpacity
                  style={[
                    styles.chooseBtn,
                    isUploadingImage && styles.disabledAction,
                  ]}
                  onPress={pickProfileImage}
                  activeOpacity={0.85}
                  disabled={isUploadingImage}
                >
                  <Ionicons
                    name="image-outline"
                    size={17}
                    color={COLORS.maroon || COLORS.primary}
                  />
                  <Text style={styles.chooseBtnText}>{tr("Choose", "ఎంచుకోండి")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.removeBtn,
                    isUploadingImage && styles.disabledAction,
                  ]}
                  onPress={removeProfileImage}
                  activeOpacity={0.85}
                  disabled={isUploadingImage}
                >
                  <Ionicons
                    name="trash-outline"
                    size={17}
                    color={COLORS.danger}
                  />
                  <Text style={styles.removeBtnText}>{tr("Remove", "తొలగించు")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>{tr("Basic Details", "ప్రాథమిక వివరాలు")}</Text>

          <FormInput
            label={tr("Full Name", "పూర్తి పేరు")}
            placeholder={tr("Enter full name", "పూర్తి పేరు నమోదు చేయండి")}
            value={form.name}
            onChangeText={(text) => updateField("name", text)}
          />

          <Text style={styles.label}>{tr("Profile Created For", "ప్రొఫైల్ ఎవరి కోసం")}</Text>
          <View style={styles.optionWrap}>
            {profileCreatedForOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.smallChip,
                  form.profileCreatedFor === item && styles.activeChip,
                ]}
                onPress={() => updateField("profileCreatedFor", item)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.smallChipText,
                    form.profileCreatedFor === item && styles.activeChipText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{tr("Gender", "లింగం")}</Text>
          <View style={styles.optionRow}>
            {genderOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.optionBtn,
                  form.gender === item && styles.activeOption,
                ]}
                onPress={() => updateField("gender", item)}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={item === "Bride" ? "female" : "male"}
                  size={18}
                  color={form.gender === item ? COLORS.white : COLORS.primary}
                />
                <Text
                  style={[
                    styles.optionText,
                    form.gender === item && styles.activeOptionText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.twoCol}>
            <FormInput
              label={tr("Age", "వయసు")}
              placeholder="25"
              value={String(form.age)}
              keyboardType="number-pad"
              onChangeText={(text) => updateField("age", text)}
              containerStyle={styles.flexOne}
            />

            <FormInput
              label={tr("Height", "ఎత్తు")}
              placeholder="5'7"
              value={form.height}
              onChangeText={(text) => updateField("height", text)}
              containerStyle={styles.flexOne}
            />
          </View>

                    <Text style={styles.label}>{tr("Date of Birth", "పుట్టిన తేదీ")}</Text>
          <TouchableOpacity
            style={styles.dobTrigger}
            activeOpacity={0.85}
            onPress={() => {
              setDobMonth(parseDobString(form.dob) || new Date());
              setShowDobPicker(true);
            }}
          >
            <Ionicons name="calendar-outline" size={20} color={COLORS.muted} />
            <Text style={[styles.dobValue, !form.dob && styles.dobPlaceholder]} numberOfLines={1}>
              {form.dob || "DD/MM/YYYY"}
            </Text>
            <Ionicons name="chevron-down-outline" size={18} color={COLORS.muted} />
          </TouchableOpacity>

          <FormInput
            label={tr("Phone Number", "ఫోన్ నంబర్")}
            placeholder={tr("Enter phone number", "ఫోన్ నంబర్ నమోదు చేయండి")}
            value={form.phone}
            keyboardType="phone-pad"
            maxLength={10}
            onChangeText={(text) =>
              updateField("phone", text.replace(/\D/g, "").slice(0, 10))
            }
          />

          <FormInput
            label={tr("Email", "ఇమెయిల్")}
            placeholder="Enter email"
            value={form.email}
            keyboardType="email-address"
            onChangeText={(text) => updateField("email", text)}
          />

          <Text style={styles.sectionTitle}>{tr("Community Details", "మతం / కమ్యూనిటీ వివరాలు")}</Text>

          <DropdownField
            label={tr("Religion", "మతం")}
            placeholder={tr("Select religion", "మతం ఎంచుకోండి")}
            value={form.religion}
            options={RELIGION_OPTIONS}
            icon="book-outline"
            isOpen={openDropdown === "religion"}
            onToggle={() => setOpenDropdown((current) => (current === "religion" ? "" : "religion"))}
            onSelect={(value) => {
              updateField("religion", value);
              setOpenDropdown("");
            }}
          />

          <DropdownField
            label={tr("Community", "కమ్యూనిటీ")}
            placeholder={form.religion ? tr("Select community", "కమ్యూనిటీ ఎంచుకోండి") : tr("Select religion first", "ముందు మతం ఎంచుకోండి")}
            value={form.community}
            options={communityOptions}
            icon="people-outline"
            disabled={!form.religion}
            isOpen={openDropdown === "community"}
            onToggle={() => setOpenDropdown((current) => (current === "community" ? "" : "community"))}
            onSelect={(value) => {
              updateField("community", value);
              setOpenDropdown("");
            }}
          />

          <DropdownField
            label={tr("Caste / Sub Community", "కులం / ఉప-కమ్యూనిటీ")}
            placeholder={form.community ? tr("Select caste / sub community", "కులం / ఉప-కమ్యూనిటీ ఎంచుకోండి") : tr("Select community first", "ముందు కమ్యూనిటీ ఎంచుకోండి")}
            value={form.caste}
            options={casteOptions}
            icon="git-branch-outline"
            disabled={!form.community}
            isOpen={openDropdown === "caste"}
            onToggle={() => setOpenDropdown((current) => (current === "caste" ? "" : "caste"))}
            onSelect={(value) => {
              updateField("caste", value);
              setOpenDropdown("");
            }}
          />

          <FormInput
            label={tr("Location", "స్థానం")}
            placeholder={tr("City, State", "నగరం, రాష్ట్రం")}
            value={form.location}
            onChangeText={(text) => updateField("location", text)}
          />

          <Text style={styles.sectionTitle}>{tr("About Profile", "ప్రొఫైల్ గురించి")}</Text>

          <Text style={styles.label}>{tr("About", "గురించి")}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={tr("Write about yourself, family values and expectations", "మీ గురించి, కుటుంబ విలువలు మరియు ఆశయాలను వ్రాయండి")}
            value={form.about}
            onChangeText={(text) => updateField("about", text)}
            multiline
            textAlignVertical="top"
            placeholderTextColor="#9CA3AF"
          />

        

          <FormInput
            label={tr("Habits", "అలవాట్లు")}
            placeholder={tr("Reading, travel, fitness, music", "చదవడం, ప్రయాణం, ఫిట్‌నెస్, సంగీతం")}
            value={form.habits}
            onChangeText={(text) => updateField("habits", text)}
          />

          <Text style={styles.sectionTitle}>{tr("Partner Preferences", "భాగస్వామి ప్రాధాన్యతలు")}</Text>

          <FormInput
            label={tr("Preferred Age", "ఇష్టమైన వయసు")}
            placeholder={tr("Example: 24 - 30", "ఉదాహరణ: 24 - 30")}
            value={form.partnerAge}
            onChangeText={(text) => updateField("partnerAge", text)}
          />

          <DropdownField
            label={tr("Preferred Community", "ఇష్టమైన కమ్యూనిటీ")}
            placeholder={tr("Any / Same community", "ఏదైనా / అదే కమ్యూనిటీ")}
            value={form.partnerCommunity}
            options={PREFERRED_COMMUNITY_OPTIONS}
            icon="people-circle-outline"
            isOpen={openDropdown === "partnerCommunity"}
            onToggle={() => setOpenDropdown((current) => (current === "partnerCommunity" ? "" : "partnerCommunity"))}
            onSelect={(value) => {
              updateField("partnerCommunity", value);
              setOpenDropdown("");
            }}
          />

          <FormInput
            label={tr("Preferred Location", "ఇష్టమైన స్థానం")}
            placeholder={tr("Kerala / Bangalore / Any", "కేరళ / బెంగళూరు / ఏదైనా")}
            value={form.partnerLocation}
            onChangeText={(text) => updateField("partnerLocation", text)}
          />

          <FormInput
            label={tr("Preferred Education", "ఇష్టమైన విద్య")}
            placeholder={tr("Graduate / Post Graduate", "స్నాతక / స్నాతకోత్తర")}
            value={form.partnerEducation}
            onChangeText={(text) => updateField("partnerEducation", text)}
          />

          <Modal transparent visible={showDobPicker} animationType="fade" onRequestClose={() => setShowDobPicker(false)}>
            <TouchableOpacity style={styles.calendarOverlay} activeOpacity={1} onPress={() => setShowDobPicker(false)}>
              <TouchableOpacity style={styles.calendarSheet} activeOpacity={1} onPress={() => {}}>
                <View style={styles.calendarHeader}>
                  <TouchableOpacity
                    style={styles.calendarNavBtn}
                    onPress={() => setDobMonth(new Date(dobMonth.getFullYear(), dobMonth.getMonth() - 1, 1))}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
                  </TouchableOpacity>

                  <Text style={styles.calendarTitle}>{formatMonthTitle(dobMonth)}</Text>

                  <TouchableOpacity
                    style={styles.calendarNavBtn}
                    onPress={() => setDobMonth(new Date(dobMonth.getFullYear(), dobMonth.getMonth() + 1, 1))}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.yearRow}>
                  {Array.from({ length: DOB_YEAR_RANGE + 1 }, (_, index) => {
                    const year = new Date().getFullYear() - DOB_YEAR_RANGE + index;
                    const active = year === dobMonth.getFullYear();
                    return (
                      <TouchableOpacity
                        key={year}
                        style={[styles.yearChip, active && styles.yearChipActive]}
                        onPress={() => setDobMonth(new Date(year, dobMonth.getMonth(), 1))}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.yearChipText, active && styles.yearChipTextActive]}>{year}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <View style={styles.weekRow}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                    <Text key={day} style={styles.weekLabel}>{day}</Text>
                  ))}
                </View>

                <View style={styles.calendarGrid}>
                  {buildCalendarDays(dobMonth).map((date, index) => {
                    if (!date) {
                      return <View key={`empty-${index}`} style={styles.calendarCell} />;
                    }

                    const selected = form.dob === formatDobString(date);
                    return (
                      <TouchableOpacity
                        key={date.toISOString()}
                        style={[styles.calendarCell, selected && styles.calendarCellActive]}
                        activeOpacity={0.85}
                        onPress={() => {
                          updateField("dob", formatDobString(date));
                          setShowDobPicker(false);
                        }}
                      >
                        <Text style={[styles.calendarCellText, selected && styles.calendarCellTextActive]}>
                          {date.getDate()}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.calendarActions}>
                  <TouchableOpacity
                    style={[styles.calendarActionBtn, styles.calendarCancelBtn]}
                    onPress={() => setShowDobPicker(false)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.calendarCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.calendarActionBtn, styles.calendarDoneBtn]}
                    onPress={() => setShowDobPicker(false)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.calendarDoneText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>

          <PrimaryButton
            title="Save Profile"
            onPress={handleSave}
            style={styles.saveBtn}
            disabled={isUploadingImage}
          />

          {Platform.OS === "web" && showSuccessOk ? (
            <PrimaryButton
              title="OK"
              onPress={handleSuccessAcknowledge}
              style={styles.okBtn}
            />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function DropdownField({
  label,
  value,
  placeholder,
  options,
  icon,
  isOpen,
  onToggle,
  onSelect,
  disabled = false,
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.dropdownTrigger, disabled && styles.dropdownTriggerDisabled]}
        activeOpacity={disabled ? 1 : 0.85}
        onPress={disabled ? undefined : onToggle}
        disabled={disabled}
      >
        <Ionicons name={icon} size={20} color={COLORS.muted} />
        <Text
          style={[styles.dropdownValue, !value && styles.dropdownPlaceholder]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up-outline" : "chevron-down-outline"}
          size={18}
          color={COLORS.muted}
        />
      </TouchableOpacity>

      <Modal transparent visible={isOpen && !disabled} animationType="fade" onRequestClose={onToggle}>
        <TouchableOpacity style={styles.dropdownOverlay} activeOpacity={1} onPress={onToggle}>
          <View style={styles.dropdownMenu}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((option) => {
                const selected = value === option;

                return (
                  <TouchableOpacity
                    key={option}
                    activeOpacity={0.85}
                    style={[styles.dropdownItem, selected && styles.dropdownItemActive]}
                    onPress={() => onSelect(option)}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selected && styles.dropdownItemTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                    {selected ? (
                      <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  containerStyle,
  maxLength,
}) {
  return (
    <View style={containerStyle}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        maxLength={maxLength}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 160,
    flexGrow: 1,
    gap: 12,
  },

  photoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 3,
    marginBottom: 18,
  },

  imageBox: {
    position: "relative",
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: COLORS.border,
    borderWidth: 3,
    borderColor: COLORS.white,
  },

  cameraBtn: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
    elevation: 4,
  },

  photoInfo: {
    flex: 1,
  },

  photoTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
  },

  photoText: {
    color: COLORS.muted,
    fontWeight: "700",
    marginTop: 5,
    lineHeight: 18,
    fontSize: 12,
  },

  photoActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },

  chooseBtn: {
    height: 38,
    paddingHorizontal: 13,
    borderRadius: 13,
    backgroundColor: COLORS.softMaroon || COLORS.softOrange,
    borderWidth: 1,
    borderColor: COLORS.maroon || COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  chooseBtnText: {
    color: COLORS.maroon || COLORS.primary,
    fontWeight: "900",
    fontSize: 12,
  },

  removeBtn: {
    height: 38,
    paddingHorizontal: 13,
    borderRadius: 13,
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FECACA",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  removeBtnText: {
    color: COLORS.danger,
    fontWeight: "900",
    fontSize: 12,
  },

  disabledAction: {
    opacity: 0.55,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 18,
    marginBottom: 4,
  },

  label: {
    color: COLORS.text,
    fontWeight: "900",
    marginTop: 13,
    marginBottom: 7,
  },

  input: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    color: COLORS.text,
    fontWeight: "700",
  },

  textArea: {
    height: 120,
    paddingTop: 14,
    lineHeight: 21,
  },

  twoCol: {
    flexDirection: "row",
    gap: 12,
  },

  flexOne: {
    flex: 1,
  },

  optionRow: {
    flexDirection: "row",
    gap: 12,
  },

  optionBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  activeOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  optionText: {
    color: COLORS.primary,
    fontWeight: "900",
  },

  activeOptionText: {
    color: COLORS.white,
  },

  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  smallChip: {
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  activeChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  smallChipText: {
    color: COLORS.text,
    fontWeight: "900",
  },

  activeChipText: {
    color: COLORS.white,
  },

  dropdownTrigger: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  dropdownTriggerDisabled: {
    opacity: 0.65,
  },

  dropdownValue: {
    flex: 1,
    color: COLORS.text,
    fontWeight: "700",
  },

  dropdownPlaceholder: {
    color: "#9CA3AF",
    fontWeight: "700",
  },

  dobTrigger: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  dobValue: {
    flex: 1,
    color: COLORS.text,
    fontWeight: "700",
  },

  dobPlaceholder: {
    color: "#9CA3AF",
    fontWeight: "700",
  },

  calendarOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.42)",
    justifyContent: "center",
    padding: 18,
  },

  calendarSheet: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  calendarNavBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  calendarTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "900",
    color: COLORS.text,
    fontSize: 16,
  },

  yearRow: {
    paddingVertical: 8,
  },

  yearChip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  yearChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  yearChipText: {
    fontWeight: "800",
    color: COLORS.text,
  },

  yearChipTextActive: {
    color: COLORS.white,
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 6,
  },

  weekLabel: {
    width: 38,
    textAlign: "center",
    fontWeight: "800",
    color: COLORS.muted,
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  calendarCell: {
    width: "13.5%",
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    backgroundColor: COLORS.bg,
  },

  calendarCellActive: {
    backgroundColor: COLORS.primary,
  },

  calendarCellText: {
    fontWeight: "800",
    color: COLORS.text,
  },

  calendarCellTextActive: {
    color: COLORS.white,
  },

  calendarActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  calendarActionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  calendarCancelBtn: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  calendarDoneBtn: {
    backgroundColor: COLORS.primary,
  },

  calendarCancelText: {
    color: COLORS.text,
    fontWeight: "900",
  },

  calendarDoneText: {
    color: COLORS.white,
    fontWeight: "900",
  },

  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.42)",
    justifyContent: "center",
    padding: 18,
  },

  dropdownMenu: {
    maxHeight: 420,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  dropdownItem: {
    minHeight: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  dropdownItemActive: {
    backgroundColor: "rgba(179, 34, 34, 0.08)",
  },

  dropdownItemText: {
    flex: 1,
    color: COLORS.text,
    fontWeight: "800",
  },

  dropdownItemTextActive: {
    color: COLORS.primary,
  },
  saveBtn: {
    marginTop: 24,
  },

  okBtn: {
    marginTop: 12,
  },
});


