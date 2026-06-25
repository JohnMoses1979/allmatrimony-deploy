package com.allmatrimony.backend.repository;

import com.allmatrimony.backend.entity.TranslationCache;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TranslationCacheRepository extends JpaRepository<TranslationCache, Long> {
    Optional<TranslationCache> findBySourceTextHashAndSourceLangAndTargetLang(
            String sourceTextHash, String sourceLang, String targetLang);
}