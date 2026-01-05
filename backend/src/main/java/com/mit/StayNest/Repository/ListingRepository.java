package com.mit.StayNest.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mit.StayNest.Entity.Listing;
import com.mit.StayNest.Entity.User;




@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {
    Optional<Listing> findById(Long id);

    List<Listing> findByOwnerId(long ownerId);

    List<Listing> findByAddressContaining(String area);
    
    List<Listing> findByGender(String gender);
    
    List<Listing> findByRentLessThanEqual(double rent);
}
