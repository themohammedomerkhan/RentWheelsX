package com.rentwheelsx.dto;

import com.rentwheelsx.entity.Vehicle;
import com.rentwheelsx.enums.ApprovalStatus;
import com.rentwheelsx.enums.VehicleStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class VehicleResponse {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private String name;
    private String brand;
    private String type;
    private Integer manufactureYear;
    private String vehicleNumber;
    private BigDecimal pricePerHour;
    private String currentAddress;
    private String mobileNumber;
    private Double latitude;
    private Double longitude;
    private List<String> images;
    private String videoUrl;
    private VehicleStatus status;
    private ApprovalStatus approvalStatus;
    private LocalDateTime createdAt;

    public static VehicleResponse from(Vehicle v) {
        return VehicleResponse.builder()
                .id(v.getId())
                .ownerId(v.getOwner().getId())
                .ownerName(v.getOwner().getName())
                .name(v.getName())
                .brand(v.getBrand())
                .type(v.getType())
                .manufactureYear(v.getManufactureYear())
                .vehicleNumber(v.getVehicleNumber())
                .pricePerHour(v.getPricePerHour())
                .currentAddress(v.getCurrentAddress())
                .mobileNumber(v.getMobileNumber())
                .latitude(v.getLatitude())
                .longitude(v.getLongitude())
                .images(v.getImages())
                .videoUrl(v.getVideoUrl())
                .status(v.getStatus())
                .approvalStatus(v.getApprovalStatus())
                .createdAt(v.getCreatedAt())
                .build();
    }
}
