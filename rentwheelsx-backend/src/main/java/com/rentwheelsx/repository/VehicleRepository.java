package com.rentwheelsx.repository;

import com.rentwheelsx.entity.Vehicle;
import com.rentwheelsx.enums.ApprovalStatus;
import com.rentwheelsx.enums.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByStatusAndApprovalStatus(VehicleStatus status, ApprovalStatus approvalStatus);

    List<Vehicle> findByOwnerId(Long ownerId);

    boolean existsByVehicleNumber(String vehicleNumber);
}
