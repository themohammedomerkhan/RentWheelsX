package com.rentwheelsx.entity;

import com.rentwheelsx.enums.ApprovalStatus;
import com.rentwheelsx.enums.VehicleStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String type;

    @Column(name = "manufacture_year", nullable = false)
    private Integer manufactureYear;

    @Column(name = "vehicle_number", nullable = false, unique = true)
    private String vehicleNumber;

    @Column(name = "price_per_hour", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerHour;

    @Column(name = "current_address", nullable = false)
    private String currentAddress;

    @Column(name = "mobile_number", nullable = false)
    private String mobileNumber;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @ElementCollection
    @CollectionTable(name = "vehicle_images", joinColumns = @JoinColumn(name = "vehicle_id"))
    @Column(name = "image_url")
    private List<String> images;

    @Column(name = "video_url", nullable = false)
    private String videoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status = VehicleStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false)
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<Booking> bookings;
}
