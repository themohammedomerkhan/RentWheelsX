package com.rentwheelsx.entity;

import com.rentwheelsx.enums.PaymentStatus;
import com.rentwheelsx.enums.RentalType;
import com.rentwheelsx.enums.RideStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Enumerated(EnumType.STRING)
    @Column(name = "rental_type", nullable = false)
    private RentalType rentalType;

    @Column(nullable = false)
    private Integer duration;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "ride_status", nullable = false)
    private RideStatus rideStatus = RideStatus.UPCOMING;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
