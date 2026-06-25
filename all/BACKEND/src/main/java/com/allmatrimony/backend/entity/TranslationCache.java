package com.allmatrimony.backend.entity;

 
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "translation_cache",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"source_text_hash", "source_lang", "target_lang"})
        }
)
public class TranslationCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_text", columnDefinition = "TEXT", nullable = false)
    private String sourceText;

    @Column(name = "translated_text", columnDefinition = "TEXT", nullable = false)
    private String translatedText;

    @Column(name = "source_text_hash", nullable = false, length = 64)
    private String sourceTextHash;
    
    @Column(name="source_lang",nullable=false,length=10)
    private String sourceLang;

    @Column(name = "target_lang", nullable = false, length = 10)
    private String targetLang;

    private LocalDateTime createdAt;

    public TranslationCache(){

    }

    public TranslationCache(String sourceText,String translatedText,String sourceTextHash,String sourceLang,String targetLang){
        this.sourceText=sourceText;
        this.translatedText=translatedText;
        this.sourceTextHash=sourceTextHash;
        this.sourceLang=sourceLang;
        this.targetLang=targetLang;
        this.createdAt=LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getSourceText() {
        return sourceText;
    }

    public String getTranslatedText() {
        return translatedText;
    }

      public String getSourceTextHash() {
        return sourceTextHash;
    }

       public String getSourceLang() {
        return sourceLang;
    }

    public void setSourceText(String sourceText) {
        this.sourceText = sourceText;
    }

  

    public void setSourceTextHash(String sourceTextHash) {
        this.sourceTextHash = sourceTextHash;
    }

 

    public void setSourceLang(String sourceLang) {
        this.sourceLang = sourceLang;
    }

    public String getTargetLang() {
        return targetLang;
    }

    public void setTargetLang(String targetLang) {
        this.targetLang = targetLang;
    }

    public void setTranslatedText(String translatedText) {
        this.translatedText = translatedText;
    }

    public LocalDateTime getCreatedAt(){
        return createdAt;
    }
}