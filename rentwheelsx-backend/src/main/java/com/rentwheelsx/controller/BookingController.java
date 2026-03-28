package com.rentwheelsx.controller;

import com.rentwheelsx.dto.ApiResponse;
import com.rentwheelsx.dto.BookingResponse;
import com.rentwheelsx.dto.CreateBookingRequest;
import com.rentwheelsx.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    /** Create a new booking */
    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateBookingRequest request) {
        BookingResponse booking = bookingService.createBooking(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking created. Proceed to payment.", booking));
    }

    /** Get all bookings for the current user */
    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<BookingResponse> bookings = bookingService.getUserBookings(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved", bookings));
    }

    /** Get a single booking */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        BookingResponse booking = bookingService.getBookingById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved", booking));
    }

    /**
     * Simulate payment.
     * On success, the owner's contact details are revealed.
     */
    @PostMapping("/{id}/pay")
    public ResponseEntity<ApiResponse<BookingResponse>> payBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        BookingResponse booking = bookingService.processPayment(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(
                "Payment successful! Owner contact details revealed.", booking));
    }

    /** Cancel a booking */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        BookingResponse booking = bookingService.cancelBooking(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled", booking));
    }
}
