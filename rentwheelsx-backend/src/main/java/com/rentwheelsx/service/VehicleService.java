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

import java.time.LocalDate;
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
                            "Manufacture year must be " + (currentYear - MAX_VEHICLE_AGE_YEARS) + " or later."
            );
        }
        if (request.getManufactureYear() > currentYear) {
            throw new RuntimeException("Manufacture year cannot be in the future.");
        }

        // Check duplicate vehicle number
        if (vehicleRepository.existsByVehicleNumber(request.getVehicleNumber())) {
            throw new RuntimeException("Vehicle with this number already registered: " + request.getVehicleNumber());
        }

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

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
                .images(request.getImages())
                .videoUrl(request.getVideoUrl())
                .status(VehicleStatus.ACTIVE)
                .approvalStatus(ApprovalStatus.PENDING)
                .build();

        vehicleRepository.save(vehicle);
        return VehicleResponse.from(vehicle);
    }

    public List<VehicleResponse> getApprovedActiveVehicles() {
        return vehicleRepository
                .findByStatusAndApprovalStatus(VehicleStatus.ACTIVE, ApprovalStatus.APPROVED)
                .stream()
                .map(VehicleResponse::from)
                .collect(Collectors.toList());
    }

    public List<VehicleResponse> getMyVehicles(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return vehicleRepository.findByOwnerId(owner.getId())
                .stream()
                .map(VehicleResponse::from)
                .collect(Collectors.toList());
    }

    public VehicleResponse getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        return VehicleResponse.from(vehicle);
    }

    public VehicleResponse toggleStatus(Long vehicleId, String ownerEmail) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        if (!vehicle.getOwner().getEmail().equals(ownerEmail)) {
            throw new RuntimeException("You are not authorized to modify this vehicle");
        }

        vehicle.setStatus(
                vehicle.getStatus() == VehicleStatus.ACTIVE ? VehicleStatus.INACTIVE : VehicleStatus.ACTIVE
        );
        vehicleRepository.save(vehicle);
        return VehicleResponse.from(vehicle);
    }

    public void deleteVehicle(Long vehicleId, String ownerEmail) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        if (!vehicle.getOwner().getEmail().equals(ownerEmail)) {
            throw new RuntimeException("You are not authorized to delete this vehicle");
        }

        vehicleRepository.delete(vehicle);
    }

    // Admin operations
    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll()
                .stream()
                .map(VehicleResponse::from)
                .collect(Collectors.toList());
    }

    public VehicleResponse approveVehicle(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        vehicle.setApprovalStatus(ApprovalStatus.APPROVED);
        vehicleRepository.save(vehicle);
        return VehicleResponse.from(vehicle);
    }

    public VehicleResponse rejectVehicle(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        vehicle.setApprovalStatus(ApprovalStatus.REJECTED);
        vehicleRepository.save(vehicle);
        return VehicleResponse.from(vehicle);
    }
}
