package com.allmatrimony.backend.dto;

public class TranslateRequest {
    public String text;
    public String sourceLanguage;
    public String targetLanguage;
    public String sourceLang;
    public String targetLang;
    public String language;

    public TranslateRequest() {
    }

    public TranslateRequest(String text, String sourceLanguage, String targetLanguage) {
        this.text = text;
        this.sourceLanguage = sourceLanguage;
        this.sourceLang = sourceLanguage;
        this.targetLanguage = targetLanguage;
        this.targetLang = targetLanguage;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getSourceLanguage() {
        return sourceLanguage != null ? sourceLanguage : sourceLang;
    }

    public void setSourceLanguage(String sourceLanguage) {
        this.sourceLanguage = sourceLanguage;
        this.sourceLang = sourceLanguage;
    }

    public String getTargetLanguage() {
        return targetLanguage != null ? targetLanguage : targetLang;
    }

    public void setTargetLanguage(String targetLanguage) {
        this.targetLanguage = targetLanguage;
        this.targetLang = targetLanguage;
    }

    public String getSourceLang() {
        return sourceLang != null ? sourceLang : sourceLanguage;
    }

    public void setSourceLang(String sourceLang) {
        this.sourceLang = sourceLang;
        this.sourceLanguage = sourceLang;
    }

    public String getTargetLang() {
        return targetLang != null ? targetLang : targetLanguage;
    }

    public void setTargetLang(String targetLang) {
        this.targetLang = targetLang;
        this.targetLanguage = targetLang;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
