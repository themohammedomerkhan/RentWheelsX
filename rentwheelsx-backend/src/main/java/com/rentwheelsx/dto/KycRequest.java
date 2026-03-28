package com.rentwheelsx.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class KycRequest {

    @NotBlank(message = "Aadhar number is required")
    private String aadharNumber;

    @NotBlank(message = "Driving license is required")
    private String drivingLicense;

    private String vehicleRc;
}
