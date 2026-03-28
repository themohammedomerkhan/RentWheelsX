package com.rentwheelsx.controller;

import com.rentwheelsx.dto.*;
import com.rentwheelsx.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<String>> signup(@Valid @RequestBody SignupRequest request) {
        String message = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(message));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        AuthResponse response = authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/kyc")
    public ResponseEntity<ApiResponse<UserResponse>> submitKyc(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody KycRequest request) {
        UserResponse user = authService.submitKyc(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("KYC submitted successfully", user));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserResponse user = authService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", user));
    }
}
