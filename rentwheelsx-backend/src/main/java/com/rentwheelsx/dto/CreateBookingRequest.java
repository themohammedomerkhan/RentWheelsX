package com.rentwheelsx.dto;

import com.rentwheelsx.enums.RentalType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateBookingRequest {

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Rental type is required")
    private RentalType rentalType;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1")
    private Integer duration;

    @NotNull(message = "Start date is required")
    @Future(message = "Start date must be in the future")
    private LocalDateTime startDate;
}
