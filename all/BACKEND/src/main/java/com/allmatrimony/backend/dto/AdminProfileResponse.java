package com.allmatrimony.backend.dto;

import com.allmatrimony.backend.entity.AdminProfile;
import java.time.LocalDateTime;

public class AdminProfileResponse {

    private Long id;
    private Long adminId;
    private String fullName;
    private String email;
    private String mobile;
    private String role;
    private String address;
    private String about;
    private String profileImageUrl;
    private LocalDateTime updatedAt;

    public AdminProfileResponse(AdminProfile profile) {
        this.id = profile.getId();
        this.adminId = profile.getAdminId();
        this.fullName = profile.getFullName();
        this.email = profile.getEmail();
        this.mobile = profile.getMobile();
        this.role = profile.getRole();
        this.address = profile.getAddress();
        this.about = profile.getAbout();
        this.profileImageUrl = profile.getProfileImage();
        this.updatedAt = profile.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public Long getAdminId() {
        return adminId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getMobile() {
        return mobile;
    }

    public String getRole() {
        return role;
    }

    public String getAddress() {
        return address;
    }

    public String getAbout() {
        return about;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}

