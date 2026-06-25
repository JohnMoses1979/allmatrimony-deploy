package com.allmatrimony.backend.entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "admin_profiles")
public class AdminProfile {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private  Long adminId;

    private String fullName;

    @Column(unique=true)
    private String email;

    private String mobile;

    private String role = "ADMIN";

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(columnDefinition ="TEXT")
    private String about;

    @Column(columnDefinition ="TEXT")
    private String profileImage;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public AdminProfile(){

    }

    @PrePersist
    public void onCreate (){
        createdAt =LocalDateTime.now();
        updatedAt =LocalDateTime.now();

        if (role == null) {
           role= "ADMIN";
        }
    }

    @PreUpdate 
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId(){
        return id;
    }
    
    public Long getAdminId(){
        return adminId;
    }

    public String getFullName(){
        return fullName;
    }

    public String getEmail(){
        return email;
    }

    public String getMobile(){
        return mobile;
    }

      public String getRole(){
        return role;
    }

    public String getAddress(){
        return address;
    }

    public String getAbout(){
        return about;
    }

    public String getProfileImage(){
        return profileImage;
    }

    public LocalDateTime getUpdatedAt(){
        return updatedAt;
    }

    public void setId(Long id){
        this.id= id;
    }

    public void setAdminId(Long adminId){
        this.adminId = adminId;
    }
    public void setFullName(String fullName) {
        this.fullName=fullName;
    }

    public void setEmail(String email){
        this.email = email;
    }

     public void setMobile(String mobile){
        this.mobile = mobile;
    }

    public void setRole(String role){
        this.role =role;
    }

    public void setAddress(String address){
        this.address =address;
    }
    public void setAbout(String about){
        this.about= about;
    }

    public void setProfileImage(String profileImage){
        this.profileImage= profileImage;
    }
}
