import { API_BASE_URL } from "../config/api";

const looksBroken = (value = "") =>
  /INVALID LANGUAGE PAIR|NO CONTENT|NOT SUPPORTED|ERROR/i.test(String(value || ""));

export const translateText = async (text, targetLang = "te") => {
  try {
    if (!text || targetLang === "en") {
      return text;
    }

    const response = await fetch(`${API_BASE_URL}/api/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        sourceLang: "en",
        targetLang,
      }),
    });

    if (!response.ok) {
      return text;
    }

    const data = await response.json();
    const translatedText = String(data?.translatedText || "").trim();

    return translatedText && !looksBroken(translatedText) ? translatedText : text;
  } catch (error) {
    return text;
  }
};