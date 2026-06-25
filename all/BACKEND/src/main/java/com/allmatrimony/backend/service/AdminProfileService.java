package com.allmatrimony.backend.service;

import com.allmatrimony.backend.dto.AdminProfileRequest;
import com.allmatrimony.backend.dto.AdminProfileResponse;
import com.allmatrimony.backend.entity.AdminProfile;
import com.allmatrimony.backend.repository.AdminProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminProfileService {

    private final AdminProfileRepository adminProfileRepository;

    public AdminProfileService(AdminProfileRepository adminProfileRepository) {
        this.adminProfileRepository = adminProfileRepository;
    }

    public AdminProfileResponse getProfile(Long adminId) {
        AdminProfile profile = adminProfileRepository.findByAdminId(adminId)
                .orElseGet(() -> createDefaultProfile(adminId));

        return new AdminProfileResponse(profile);
    }

    public AdminProfileResponse updateProfile(Long adminId, AdminProfileRequest request) {
        AdminProfile profile = adminProfileRepository.findByAdminId(adminId)
                .orElseGet(() -> createDefaultProfile(adminId));

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            boolean emailExists = adminProfileRepository.existsByEmailAndAdminIdNot(
                    request.getEmail(),
                    adminId
            );

            if (emailExists) {
                throw new RuntimeException("Email already used by another admin");
            }
        }

        profile.setFullName(request.getFullName());
        profile.setEmail(request.getEmail());
        profile.setMobile(request.getMobile());
        profile.setAddress(request.getAddress());
        profile.setAbout(request.getAbout());
        profile.setProfileImage(request.getProfileImageUrl());
        profile.setRole("ADMIN");

        AdminProfile saved = adminProfileRepository.save(profile);

        return new AdminProfileResponse(saved);
    }

    private AdminProfile createDefaultProfile(Long adminId) {
        AdminProfile profile = new AdminProfile();
        profile.setAdminId(adminId);
        profile.setFullName("Admin");
        profile.setEmail("admin@allmatrimony.com");
        profile.setMobile("");
        profile.setRole("ADMIN");
        profile.setAddress("");
        profile.setAbout("All Matrimony application administrator");
        profile.setProfileImage("");

        return adminProfileRepository.save(profile);
    }
}

