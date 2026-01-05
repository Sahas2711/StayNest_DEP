package com.mit.StayNest.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mit.StayNest.Entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByListingId(Long listingId);
    List<Review> findByTenantId(Long tenantId);
    List<Review> findByListingOwnerId(Long ownerId);
}
