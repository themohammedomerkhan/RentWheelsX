package com.rentwheelsx.entity;

import com.rentwheelsx.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String mobile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(name = "is_verified")
    private boolean isVerified = false;

    private String otp;

    @Column(name = "otp_expires_at")
    private LocalDateTime otpExpiresAt;

    // KYC Fields
    @Column(name = "aadhar_number")
    private String aadharNumber;

    @Column(name = "driving_license")
    private String drivingLicense;

    @Column(name = "vehicle_rc")
    private String vehicleRc;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Vehicle> vehicles;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Booking> bookings;

    @Column(name = "reset_otp_verified", nullable = false)
    @Builder.Default
    private boolean resetOtpVerified = false;
}
