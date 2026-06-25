import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";

const normalizeLanguage = (lang) => (String(lang || "en").startsWith("te") ? "te" : "en");
const hasTranslatableLetters = (value) => /[A-Za-z\u0C00-\u0C7F]/.test(String(value || ""));
const looksLikeApiError = (value) => /INVALID LANGUAGE PAIR|NO CONTENT|NOT SUPPORTED|ERROR/i.test(String(value || ""));

const NUMBER_TOKEN_PREFIX = "__CODEX_NUM_";
const NUMBER_PATTERN = /\d+(?:[.,:/-]\d+)*/g;

const maskNumbers = (text) => {
  const tokens = [];
  const masked = String(text).replace(NUMBER_PATTERN, (match) => {
    const token = `${NUMBER_TOKEN_PREFIX}${tokens.length}__`;
    tokens.push({ token, value: match });
    return token;
  });

  return { masked, tokens };
};

const unmaskNumbers = (text, tokens) => {
  return tokens.reduce((result, { token, value }) => {
    return result.replace(new RegExp(token, "g"), value);
  }, String(text));
};

export const translateText = async (text, targetLang, sourceLang = "en") => {
  if (!text) return text;

  const normalizedTargetLang = normalizeLanguage(targetLang);
  const normalizedSourceLang = normalizeLanguage(sourceLang);
  const plainText = String(text).trim();

  if (!plainText) return text;
  if (normalizedTargetLang === normalizedSourceLang) return plainText;
  if (!hasTranslatableLetters(plainText)) return plainText;

  const { masked, tokens } = maskNumbers(plainText);
  const cacheKey = `translate_${normalizedSourceLang}_${normalizedTargetLang}_${plainText}`;

  const cached = await AsyncStorage.getItem(cacheKey);

  if (cached && !looksLikeApiError(cached)) {
    return cached;
  }

  if (cached && looksLikeApiError(cached)) {
    await AsyncStorage.removeItem(cacheKey);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: masked,
        sourceLang: normalizedSourceLang,
        targetLang: normalizedTargetLang,
      }),
    });

    const data = await response.json();
    const translatedText = String(data?.translatedText || "").trim();
    const restoredText = translatedText ? unmaskNumbers(translatedText, tokens) : "";

    if (response.ok && restoredText && !looksLikeApiError(restoredText)) {
      await AsyncStorage.setItem(cacheKey, restoredText);
      return restoredText;
    }

    return plainText;
  } catch (error) {
    console.log("Frontend translation error:", error);
    return plainText;
  }
};
