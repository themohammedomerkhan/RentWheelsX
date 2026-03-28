package com.rentwheelsx.controller;

import com.rentwheelsx.dto.AddVehicleRequest;
import com.rentwheelsx.dto.ApiResponse;
import com.rentwheelsx.dto.VehicleResponse;
import com.rentwheelsx.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    /** Public: list all approved + active vehicles */
    @GetMapping
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getVehicles() {
        List<VehicleResponse> vehicles = vehicleService.getApprovedActiveVehicles();
        return ResponseEntity.ok(ApiResponse.success("Vehicles retrieved", vehicles));
    }

    /** Public: get single vehicle */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleResponse>> getVehicle(@PathVariable Long id) {
        VehicleResponse vehicle = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle retrieved", vehicle));
    }

    /** Authenticated: add a new vehicle */
    @PostMapping
    public ResponseEntity<ApiResponse<VehicleResponse>> addVehicle(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddVehicleRequest request) {
        VehicleResponse vehicle = vehicleService.addVehicle(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Vehicle added, pending admin approval", vehicle));
    }

    /** Authenticated: list my own vehicles */
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getMyVehicles(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<VehicleResponse> vehicles = vehicleService.getMyVehicles(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Your vehicles retrieved", vehicles));
    }

    /** Owner: toggle ACTIVE / INACTIVE */
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<VehicleResponse>> toggleStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        VehicleResponse vehicle = vehicleService.toggleStatus(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Status updated to: " + vehicle.getStatus(), vehicle));
    }

    /** Owner: delete vehicle */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        vehicleService.deleteVehicle(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Vehicle deleted successfully"));
    }
}
