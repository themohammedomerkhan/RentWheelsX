package com.rentwheelsx.dto;

import com.rentwheelsx.entity.Booking;
import com.rentwheelsx.enums.PaymentStatus;
import com.rentwheelsx.enums.RentalType;
import com.rentwheelsx.enums.RideStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponse {
    private Long id;
    private Long userId;
    private String userName;
    private Long vehicleId;
    private String vehicleName;
    private String vehicleNumber;
    private RentalType rentalType;
    private Integer duration;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BigDecimal totalPrice;
    private PaymentStatus paymentStatus;
    private RideStatus rideStatus;
    private String transactionId;
    private String ownerName;
    private String ownerMobile;
    private String ownerAddress;
    private LocalDateTime createdAt;

    public static BookingResponse from(Booking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .userId(b.getUser().getId())
                .userName(b.getUser().getName())
                .vehicleId(b.getVehicle().getId())
                .vehicleName(b.getVehicle().getName())
                .vehicleNumber(b.getVehicle().getVehicleNumber())
                .rentalType(b.getRentalType())
                .duration(b.getDuration())
                .startDate(b.getStartDate())
                .endDate(b.getEndDate())
                .totalPrice(b.getTotalPrice())
                .paymentStatus(b.getPaymentStatus())
                .rideStatus(b.getRideStatus())
                .transactionId(b.getTransactionId())
                .createdAt(b.getCreatedAt())
                .build();
    }

    public static BookingResponse fromWithOwnerContact(Booking b) {
        BookingResponse response = from(b);
        response.setOwnerName(b.getVehicle().getOwner().getName());
        response.setOwnerMobile(b.getVehicle().getOwner().getMobile());
        response.setOwnerAddress(b.getVehicle().getCurrentAddress());
        return response;
    }
}
