package com.rentwheelsx.dto;

import com.rentwheelsx.entity.User;
import com.rentwheelsx.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String mobile;
    private Role role;
    private boolean isVerified;
    private String aadharNumber;
    private String drivingLicense;
    private String vehicleRc;
    private LocalDateTime createdAt;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .role(user.getRole())
                .isVerified(user.isVerified())
                .aadharNumber(user.getAadharNumber())
                .drivingLicense(user.getDrivingLicense())
                .vehicleRc(user.getVehicleRc())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
