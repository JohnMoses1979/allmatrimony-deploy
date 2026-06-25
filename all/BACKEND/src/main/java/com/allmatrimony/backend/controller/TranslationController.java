package com.allmatrimony.backend.controller;

import com.allmatrimony.backend.dto.TranslateResponse;
import com.allmatrimony.backend.dto.TranslateRequest;
import com.allmatrimony.backend.service.TranslationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/translate")
@CrossOrigin(origins = "*")
public class TranslationController {

    private final TranslationService translationService;

    public TranslationController(TranslationService translationService) {
        this.translationService = translationService;
    }

    @PostMapping
    public ResponseEntity<TranslateResponse> translate(@RequestBody TranslateRequest request) {
        String sourceLang = request.getSourceLang() == null ? "en" : request.getSourceLang();
        String targetLang = request.getTargetLang() == null ? "te" : request.getTargetLang();

        TranslateResponse response = translationService.translate(
                request.getText(),
                sourceLang,
                targetLang
        );

        return ResponseEntity.ok(response);
    }
}