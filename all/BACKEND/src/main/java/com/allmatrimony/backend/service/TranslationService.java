package com.allmatrimony.backend.service;

import com.allmatrimony.backend.dto.TranslateResponse;
import com.allmatrimony.backend.entity.TranslationCache;
import com.allmatrimony.backend.repository.TranslationCacheRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;

@Service
public class TranslationService {

    private final TranslationCacheRepository cacheRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${translation.google.api-key:}")
    private String googleApiKey;

    public TranslationService(TranslationCacheRepository cacheRepository) {
        this.cacheRepository = cacheRepository;
    }

    public TranslateResponse translate(String text, String sourceLang, String targetLang) {
        if (text == null || text.trim().isEmpty()) {
            return new TranslateResponse(text, text, sourceLang, targetLang, true);
        }

        if (sourceLang == null || targetLang == null) {
            return new TranslateResponse(text, text, sourceLang, targetLang, true);
        }

        if (sourceLang.equalsIgnoreCase(targetLang)) {
            return new TranslateResponse(text, text, sourceLang, targetLang, true);
        }

        String cleanText = text.trim();
        String hash = sha256(cleanText);

        var cached = cacheRepository.findBySourceTextHashAndSourceLangAndTargetLang(
                hash,
                sourceLang,
                targetLang
        );

        if (cached.isPresent() && isUsableTranslation(cached.get().getTranslatedText(), cleanText)) {
            return new TranslateResponse(
                    cleanText,
                    cached.get().getTranslatedText(),
                    sourceLang,
                    targetLang,
                    true
            );
        }

        cached.ifPresent(cacheRepository::delete);

        String translated = callGoogleTranslate(cleanText, sourceLang, targetLang);

        if (isUsableTranslation(translated, cleanText)) {
            TranslationCache cache = new TranslationCache(
                    cleanText,
                    translated,
                    hash,
                    sourceLang,
                    targetLang
            );

            cacheRepository.save(cache);
            return new TranslateResponse(cleanText, translated, sourceLang, targetLang, false);
        }

        return new TranslateResponse(cleanText, cleanText, sourceLang, targetLang, false);
    }

    private String callGoogleTranslate(String text, String sourceLang, String targetLang) {
        if (googleApiKey != null && !googleApiKey.isBlank()) {
            String translated = callGoogleCloud(text, sourceLang, targetLang);
            if (isUsableTranslation(translated, text)) {
                return translated;
            }
        }

        return callGooglePublic(text, sourceLang, targetLang);
    }

    private String callGoogleCloud(String text, String sourceLang, String targetLang) {
        try {
            URI uri = UriComponentsBuilder
                    .fromHttpUrl("https://translation.googleapis.com/language/translate/v2")
                    .queryParam("key", googleApiKey)
                    .build()
                    .encode()
                    .toUri();
            String response = restTemplate.postForObject(
                    uri,
                    Map.of("q", text, "source", sourceLang, "target", targetLang, "format", "text"),
                    String.class
            );
            JsonNode root = objectMapper.readTree(response);
            return root.path("data").path("translations").path(0).path("translatedText").asText(text);
        } catch (Exception e) {
            return text;
        }
    }

    private String callGooglePublic(String text, String sourceLang, String targetLang) {
        try {
            URI uri = UriComponentsBuilder
                    .fromHttpUrl("https://translate.googleapis.com/translate_a/single")
                    .queryParam("client", "gtx")
                    .queryParam("sl", sourceLang)
                    .queryParam("tl", targetLang)
                    .queryParam("dt", "t")
                    .queryParam("q", text)
                    .build()
                    .encode()
                    .toUri();
            JsonNode segments = objectMapper.readTree(restTemplate.getForObject(uri, String.class)).path(0);
            StringBuilder translated = new StringBuilder();

            for (JsonNode segment : segments) {
                translated.append(segment.path(0).asText(""));
            }

            return translated.isEmpty() ? text : translated.toString();
        } catch (Exception e) {
            return text;
        }
    }

    private boolean isUsableTranslation(String translated, String original) {
        if (translated == null || translated.isBlank() || translated.equalsIgnoreCase(original)) {
            return false;
        }

        String normalized = translated.toUpperCase();
        return !normalized.contains("INVALID LANGUAGE PAIR")
                && !normalized.contains("NO CONTENT")
                && !normalized.contains("%20")
                && !normalized.contains("NOT SUPPORTED");
    }

    private String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(value.getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder();
            for (byte b : hashBytes) {
                hex.append(String.format("%02x", b));
            }

            return hex.toString();
        } catch (Exception e) {
            return String.valueOf(value.hashCode());
        }
    }
}
