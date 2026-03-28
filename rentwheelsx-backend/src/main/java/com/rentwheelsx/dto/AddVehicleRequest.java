package com.rentwheelsx.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class AddVehicleRequest {

    @NotBlank(message = "Vehicle name is required")
    private String name;

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Type is required")
    private String type;

    @NotNull(message = "Manufacture year is required")
    @Min(value = 1900, message = "Invalid manufacture year")
    private Integer manufactureYear;

    @NotBlank(message = "Vehicle number is required")
    private String vehicleNumber;

    @NotNull(message = "Price per hour is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal pricePerHour;

    @NotBlank(message = "Current address is required")
    private String currentAddress;

    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private List<String> images;

    @NotBlank(message = "Video URL is required")
    private String videoUrl;
}
