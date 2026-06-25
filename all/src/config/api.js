export const API_BASE_URL = "http://13.206.220.74:8090";

export const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");

export const toApiAssetUrl = (value) => {
  if (!value) return value;
  if (String(value).startsWith("http")) return value;
  if (String(value).startsWith("/")) return `${API_BASE_URL}${value}`;
  return `${API_BASE_URL}/${value}`;
};

export const toStoredAssetPath = (value) => {
  if (!value) return value;
  return String(value).replace(API_BASE_URL, "");
};

export const buildChatSocketUrl = (userId) =>
  `${WS_BASE_URL}/ws/chat?userId=${userId}`;
