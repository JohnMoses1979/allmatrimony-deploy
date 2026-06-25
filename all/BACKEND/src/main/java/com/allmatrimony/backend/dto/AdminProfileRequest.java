package com.allmatrimony.backend.dto;

 
public class AdminProfileRequest {

    private String fullName;
    private String email;
    private String mobile;
    private String address;
    private String about;
    private String profileImageUrl;

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getMobile() {
        return mobile;
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

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
}
