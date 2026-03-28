package com.rentwheelsx.controller;

import com.rentwheelsx.dto.ApiResponse;
import com.rentwheelsx.dto.BookingResponse;
import com.rentwheelsx.dto.UserResponse;
import com.rentwheelsx.dto.VehicleResponse;
import com.rentwheelsx.repository.UserRepository;
import com.rentwheelsx.service.BookingService;
import com.rentwheelsx.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final VehicleService vehicleService;
    private final BookingService bookingService;
    private final UserRepository userRepository;

    /** List all vehicles regardless of status */
    @GetMapping("/vehicles")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getAllVehicles() {
        List<VehicleResponse> vehicles = vehicleService.getAllVehicles();
        return ResponseEntity.ok(ApiResponse.success("All vehicles retrieved", vehicles));
    }

    /** Approve a vehicle */
    @PatchMapping("/vehicles/{id}/approve")
    public ResponseEntity<ApiResponse<VehicleResponse>> approveVehicle(@PathVariable Long id) {
        VehicleResponse vehicle = vehicleService.approveVehicle(id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle approved", vehicle));
    }

    /** Reject a vehicle */
    @PatchMapping("/vehicles/{id}/reject")
    public ResponseEntity<ApiResponse<VehicleResponse>> rejectVehicle(@PathVariable Long id) {
        VehicleResponse vehicle = vehicleService.rejectVehicle(id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle rejected", vehicle));
    }

    /** List all users */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userRepository.findAll()
                .stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("All users retrieved", users));
    }

    /** List all bookings */
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        List<BookingResponse> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.success("All bookings retrieved", bookings));
    }
}
