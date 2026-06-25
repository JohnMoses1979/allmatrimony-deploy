package com.allmatrimony.backend.dto;

public class TranslateResponse {
    private String originalText;
    private String translatedText;
    private String sourceLang;
    private String targetLang;
    private Boolean fromCache;

    public TranslateResponse(String originalText, String translatedText, String sourceLang, String targetLang, Boolean fromCache) {
        this.originalText = originalText;
        this.translatedText = translatedText;
        this.sourceLang = sourceLang;
        this.targetLang = targetLang;
        this.fromCache = fromCache;
    }

    public String getOriginalText() {
        return originalText;
    }

    public String getTranslatedText() {
        return translatedText;
    }

    public String getSourceLang() {
        return sourceLang;
    }

    public String getTargetLang() {
        return targetLang;
    }

    public Boolean getFromCache() {
        return fromCache;
    }
}