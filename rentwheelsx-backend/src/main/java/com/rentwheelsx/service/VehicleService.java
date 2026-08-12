package com.rentwheelsx.service;

import com.rentwheelsx.dto.AddVehicleRequest;
import com.rentwheelsx.dto.VehicleResponse;
import com.rentwheelsx.entity.User;
import com.rentwheelsx.entity.Vehicle;
import com.rentwheelsx.enums.ApprovalStatus;
import com.rentwheelsx.enums.VehicleStatus;
import com.rentwheelsx.repository.UserRepository;
import com.rentwheelsx.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    private static final int MAX_VEHICLE_AGE_YEARS = 15;

    public VehicleResponse addVehicle(String ownerEmail, AddVehicleRequest request) {

        // Validate vehicle age
        int currentYear = LocalDate.now().getYear();
        int vehicleAge = currentYear - request.getManufactureYear();

        if (vehicleAge > MAX_VEHICLE_AGE_YEARS) {
            throw new RuntimeException(
                    "Vehicle too old. Maximum allowed age is " + MAX_VEHICLE_AGE_YEARS + " years. " +
                            "Manufacture year must be " +
                            (currentYear - MAX_VEHICLE_AGE_YEARS) +
                            " or later."
            );
        }

        if (request.getManufactureYear() > currentYear) {
            throw new RuntimeException(
                    "Manufacture year cannot be in the future."
            );
        }

        // Check duplicate vehicle number
        if (vehicleRepository.existsByVehicleNumber(request.getVehicleNumber())) {
            throw new RuntimeException(
                    "Vehicle with this number already registered: " +
                            request.getVehicleNumber()
            );
        }

        // Find vehicle owner
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Normalize image URLs before saving
        List<String> normalizedImages =
                normalizeImageUrls(request.getImages());

        Vehicle vehicle = Vehicle.builder()
                .owner(owner)
                .name(request.getName())
                .brand(request.getBrand())
                .type(request.getType())
                .manufactureYear(request.getManufactureYear())
                .vehicleNumber(request.getVehicleNumber())
                .pricePerHour(request.getPricePerHour())
                .currentAddress(request.getCurrentAddress())
                .mobileNumber(request.getMobileNumber())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .images(normalizedImages)
                .videoUrl(request.getVideoUrl())
                .status(VehicleStatus.ACTIVE)
                .approvalStatus(ApprovalStatus.PENDING)
                .build();

        vehicleRepository.save(vehicle);

        return VehicleResponse.from(vehicle);
    }

    /**
     * Converts image URLs copied from image-search result pages
     * into the actual image URL.
     *
     * Currently handles Google Images URLs such as:
     *
     * https://www.google.com/imgres?imgurl=https://example.com/image.jpg
     *
     * Direct image URLs are kept unchanged.
     */
    private List<String> normalizeImageUrls(List<String> imageUrls) {

        if (imageUrls == null || imageUrls.isEmpty()) {
            return imageUrls;
        }

        List<String> normalizedUrls = new ArrayList<>();

        for (String imageUrl : imageUrls) {

            if (imageUrl == null || imageUrl.isBlank()) {
                continue;
            }

            imageUrl = imageUrl.trim();

            try {

                // Check whether this is a Google Images result URL
                if (imageUrl.contains("google.com/imgres")) {

                    URI uri = URI.create(imageUrl);

                    String query = uri.getRawQuery();

                    if (query != null) {

                        String[] parameters = query.split("&");

                        boolean extracted = false;

                        for (String parameter : parameters) {

                            String[] keyValue = parameter.split("=", 2);

                            if (keyValue.length == 2
                                    && keyValue[0].equals("imgurl")) {

                                String originalImageUrl =
                                        URLDecoder.decode(
                                                keyValue[1],
                                                StandardCharsets.UTF_8
                                        );

                                normalizedUrls.add(originalImageUrl);

                                extracted = true;
                                break;
                            }
                        }

                        // If imgurl was not found, keep original URL
                        if (!extracted) {
                            normalizedUrls.add(imageUrl);
                        }

                    } else {
                        normalizedUrls.add(imageUrl);
                    }

                } else {

                    // Already a direct/normal URL
                    normalizedUrls.add(imageUrl);
                }

            } catch (Exception e) {

                // If URL parsing fails, don't break vehicle creation.
                // Keep the original URL.
                normalizedUrls.add(imageUrl);
            }
        }

        return normalizedUrls;
    }

    public List<VehicleResponse> getApprovedActiveVehicles() {

        return vehicleRepository
                .findByStatusAndApprovalStatus(
                        VehicleStatus.ACTIVE,
                        ApprovalStatus.APPROVED
                )
                .stream()
                .map(VehicleResponse::from)
                .collect(Collectors.toList());
    }

    public List<VehicleResponse> getMyVehicles(String ownerEmail) {

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return vehicleRepository
                .findByOwnerId(owner.getId())
                .stream()
                .map(VehicleResponse::from)
                .collect(Collectors.toList());
    }

    public VehicleResponse getVehicleById(Long id) {

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Vehicle not found with id: " + id
                        )
                );

        return VehicleResponse.from(vehicle);
    }

    public VehicleResponse toggleStatus(
            Long vehicleId,
            String ownerEmail) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found")
                );

        if (!vehicle.getOwner().getEmail().equals(ownerEmail)) {
            throw new RuntimeException(
                    "You are not authorized to modify this vehicle"
            );
        }

        vehicle.setStatus(
                vehicle.getStatus() == VehicleStatus.ACTIVE
                        ? VehicleStatus.INACTIVE
                        : VehicleStatus.ACTIVE
        );

        vehicleRepository.save(vehicle);

        return VehicleResponse.from(vehicle);
    }

    public void deleteVehicle(
            Long vehicleId,
            String ownerEmail) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found")
                );

        if (!vehicle.getOwner().getEmail().equals(ownerEmail)) {
            throw new RuntimeException(
                    "You are not authorized to delete this vehicle"
            );
        }

        vehicleRepository.delete(vehicle);
    }

    // =========================
    // Admin Operations
    // =========================

    public List<VehicleResponse> getAllVehicles() {

        return vehicleRepository.findAll()
                .stream()
                .map(VehicleResponse::from)
                .collect(Collectors.toList());
    }

    public VehicleResponse approveVehicle(Long vehicleId) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found")
                );

        vehicle.setApprovalStatus(ApprovalStatus.APPROVED);

        vehicleRepository.save(vehicle);

        return VehicleResponse.from(vehicle);
    }

    public VehicleResponse rejectVehicle(Long vehicleId) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found")
                );

        vehicle.setApprovalStatus(ApprovalStatus.REJECTED);

        vehicleRepository.save(vehicle);

        return VehicleResponse.from(vehicle);
    }
}