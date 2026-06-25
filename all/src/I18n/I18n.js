import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const LANGUAGE_STORAGE_KEY = "APP_LANGUAGE";

export const normalizeLanguage = (language) =>
  String(language || "en").toLowerCase().startsWith("te") ? "te" : "en";

const canUseLocalStorage = () =>
  Platform.OS === "web" &&
  typeof window !== "undefined" &&
  typeof window.localStorage !== "undefined";

export async function loadSavedLanguage() {
  try {
    if (canUseLocalStorage()) {
      return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
    }

    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    return normalizeLanguage(savedLanguage);
  } catch (error) {
    return "en";
  }
}

export async function changeAppLanguage(language) {
  const normalizedLanguage = normalizeLanguage(language);

  try {
    if (canUseLocalStorage()) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
    } else {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
    }
  } catch (error) {
    // Persisting language is best-effort.
  }

  return normalizedLanguage;
}
