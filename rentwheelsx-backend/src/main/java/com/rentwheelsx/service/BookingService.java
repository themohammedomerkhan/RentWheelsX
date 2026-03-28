package com.rentwheelsx.service;

import com.rentwheelsx.dto.BookingResponse;
import com.rentwheelsx.dto.CreateBookingRequest;
import com.rentwheelsx.entity.Booking;
import com.rentwheelsx.entity.User;
import com.rentwheelsx.entity.Vehicle;
import com.rentwheelsx.enums.*;
import com.rentwheelsx.repository.BookingRepository;
import com.rentwheelsx.repository.UserRepository;
import com.rentwheelsx.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    private static final int MAX_DURATION_MONTHS = 2;

    public BookingResponse createBooking(String userEmail, CreateBookingRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        // Only APPROVED + ACTIVE vehicles can be booked
        if (vehicle.getApprovalStatus() != ApprovalStatus.APPROVED) {
            throw new RuntimeException("Vehicle is not approved for rental");
        }
        if (vehicle.getStatus() != VehicleStatus.ACTIVE) {
            throw new RuntimeException("Vehicle is currently inactive");
        }

        // Validate duration
        validateDuration(request.getRentalType(), request.getDuration());

        // Calculate end date and total price
        LocalDateTime endDate = calculateEndDate(request.getStartDate(), request.getRentalType(), request.getDuration());
        BigDecimal totalPrice = calculateTotalPrice(vehicle.getPricePerHour(), request.getRentalType(), request.getDuration());

        Booking booking = Booking.builder()
                .user(user)
                .vehicle(vehicle)
                .rentalType(request.getRentalType())
                .duration(request.getDuration())
                .startDate(request.getStartDate())
                .endDate(endDate)
                .totalPrice(totalPrice)
                .paymentStatus(PaymentStatus.PENDING)
                .rideStatus(RideStatus.UPCOMING)
                .build();

        bookingRepository.save(booking);
        return BookingResponse.from(booking);
    }

    public BookingResponse processPayment(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("You are not authorized for this booking");
        }
        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Booking is already paid");
        }
        if (booking.getRideStatus() == RideStatus.CANCELLED) {
            throw new RuntimeException("Cannot pay for a cancelled booking");
        }

        // Simulate payment success
        booking.setPaymentStatus(PaymentStatus.PAID);
        booking.setRideStatus(RideStatus.UPCOMING);
        booking.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase());
        bookingRepository.save(booking);

        // Return response with owner contact revealed
        return BookingResponse.fromWithOwnerContact(booking);
    }

    public BookingResponse cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("You are not authorized for this booking");
        }
        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Cannot cancel a paid booking. Contact support.");
        }

        booking.setRideStatus(RideStatus.CANCELLED);
        bookingRepository.save(booking);
        return BookingResponse.from(booking);
    }

    public List<BookingResponse> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserId(user.getId())
                .stream()
                .map(BookingResponse::from)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("You are not authorized for this booking");
        }
        return BookingResponse.from(booking);
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(BookingResponse::from)
                .collect(Collectors.toList());
    }

    // ── Private helpers ─────────────────────────────────────────────────────────

    private void validateDuration(RentalType type, int duration) {
        switch (type) {
            case HOUR -> {
                int maxHours = MAX_DURATION_MONTHS * 30 * 24;
                if (duration < 1 || duration > maxHours)
                    throw new RuntimeException("Duration must be between 1 and " + maxHours + " hours (max 2 months)");
            }
            case DAY -> {
                int maxDays = MAX_DURATION_MONTHS * 30;
                if (duration < 1 || duration > maxDays)
                    throw new RuntimeException("Duration must be between 1 and " + maxDays + " days (max 2 months)");
            }
            case MONTH -> {
                if (duration < 1 || duration > MAX_DURATION_MONTHS)
                    throw new RuntimeException("Duration must be between 1 and " + MAX_DURATION_MONTHS + " months");
            }
        }
    }

    private LocalDateTime calculateEndDate(LocalDateTime start, RentalType type, int duration) {
        return switch (type) {
            case HOUR  -> start.plusHours(duration);
            case DAY   -> start.plusDays(duration);
            case MONTH -> start.plusMonths(duration);
        };
    }

    private BigDecimal calculateTotalPrice(BigDecimal pricePerHour, RentalType type, int duration) {
        BigDecimal totalHours = switch (type) {
            case HOUR  -> BigDecimal.valueOf(duration);
            case DAY   -> BigDecimal.valueOf((long) duration * 24);
            case MONTH -> BigDecimal.valueOf((long) duration * 30 * 24);
        };
        return pricePerHour.multiply(totalHours);
    }
}
