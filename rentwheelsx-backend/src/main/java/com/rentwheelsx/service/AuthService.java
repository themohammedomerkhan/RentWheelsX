package com.rentwheelsx.service;

import com.rentwheelsx.dto.*;
import com.rentwheelsx.entity.User;
import com.rentwheelsx.enums.Role;
import com.rentwheelsx.repository.UserRepository;
import com.rentwheelsx.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public String signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new RuntimeException("Mobile number already registered");
        }

        // Generate OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .mobile(request.getMobile())
                .role(Role.USER)
                .isVerified(false)
                .otp(otp)
                .otpExpiresAt(LocalDateTime.now().plusMinutes(10))
                .build();

        try {
            userRepository.save(user);
            emailService.sendOtp(user.getEmail(), otp);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email. Please try again.");
        }

        return "User registered successfully! Please check your email for the OTP.";
    }

    public String resendOtp(ResendOtpRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isVerified()) {
            throw new RuntimeException("Account already verified");
        }

        String otp = String.format("%06d", new Random().nextInt(999999));

        user.setOtp(otp);
        user.setOtpExpiresAt(LocalDateTime.now().plusMinutes(10));

        userRepository.save(user);

        try {
            emailService.sendOtp(user.getEmail(), otp);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email.");
        }

        return "A new OTP has been sent to your email.";
    }

    public AuthResponse verifyOtp(OtpVerifyRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isVerified()) {
            throw new RuntimeException("Account already verified");
        }
        if (user.getOtp() == null || !user.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }
        if (user.getOtpExpiresAt() != null && LocalDateTime.now().isAfter(user.getOtpExpiresAt())) {
            throw new RuntimeException("OTP expired");
        }

        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiresAt(null);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .user(UserResponse.from(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isVerified()) {
            throw new RuntimeException("Account not verified. Please verify OTP first.");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .user(UserResponse.from(user))
                .build();
    }

    public UserResponse submitKyc(String email, KycRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAadharNumber(request.getAadharNumber());
        user.setDrivingLicense(request.getDrivingLicense());
        user.setVehicleRc(request.getVehicleRc());
        userRepository.save(user);

        return UserResponse.from(user);
    }

    public UserResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserResponse.from(user);
    }

    public String forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        String otp = String.format("%06d",
                new Random().nextInt(999999));

        user.setOtp(otp);
        user.setOtpExpiresAt(LocalDateTime.now().plusMinutes(10));
        user.setResetOtpVerified(false);

        userRepository.save(user);

        emailService.sendPasswordResetOtp(
                user.getEmail(),
                otp
        );

        return "Password reset OTP sent successfully.";
    }

    public String verifyResetOtp(
            VerifyResetOtpRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (user.getOtp() == null ||
                !user.getOtp().equals(request.getOtp())) {

            throw new RuntimeException("Invalid OTP");
        }

        if (LocalDateTime.now()
                .isAfter(user.getOtpExpiresAt())) {

            throw new RuntimeException("OTP expired");
        }

        user.setResetOtpVerified(true);
        user.setOtp(null);
        user.setOtpExpiresAt(null);

        userRepository.save(user);

        return "OTP verified successfully.";
    }

    public String resetPassword(
            ResetPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!user.isResetOtpVerified()) {

            throw new RuntimeException(
                    "Please verify OTP first."
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        user.setResetOtpVerified(false);

        userRepository.save(user);

        return "Password updated successfully.";
    }
}
