package com.allmatrimony.backend.controller;

import com.allmatrimony.backend.dto.AdminProfileRequest;
import com.allmatrimony.backend.dto.AdminProfileResponse;
import com.allmatrimony.backend.service.AdminProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/profile")
@CrossOrigin(origins = "*")
public class AdminProfileController {

    private final AdminProfileService adminProfileService;

    public AdminProfileController(AdminProfileService adminProfileService) {
        this.adminProfileService = adminProfileService;
    }

    @GetMapping("/{adminId}")
    public ResponseEntity<AdminProfileResponse> getAdminProfile(@PathVariable Long adminId) {
        return ResponseEntity.ok(adminProfileService.getProfile(adminId));
    }

    @PutMapping("/{adminId}")
    public ResponseEntity<AdminProfileResponse> updateAdminProfile(
            @PathVariable Long adminId,
            @RequestBody AdminProfileRequest request
    ) {
        return ResponseEntity.ok(adminProfileService.updateProfile(adminId, request));
    }
}

