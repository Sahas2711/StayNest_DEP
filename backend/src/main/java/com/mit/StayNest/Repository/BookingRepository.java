package com.mit.StayNest.Repository;

import com.mit.StayNest.Entity.Booking;
import com.mit.StayNest.Entity.Listing;
import com.mit.StayNest.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByListing(Listing listing);
    List<Booking> findByStatus(String status);
    List<Booking> findByTenant(User Tenant);
    String findByStatus(Listing listing);
    @Query("SELECT b FROM Booking b WHERE b.listing.owner.id = :ownerId")
    List<Booking> getBookingsByOwner(@Param("ownerId") Long ownerId);
}
