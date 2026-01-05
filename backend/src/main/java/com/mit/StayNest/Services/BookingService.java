package com.mit.StayNest.Services;

import com.mit.StayNest.Entity.Booking;
import com.mit.StayNest.Entity.Listing;
import com.mit.StayNest.Entity.Owner;
import com.mit.StayNest.Entity.User;

import java.util.List;
import java.util.Optional;

public interface BookingService {

    Booking createBooking(Booking booking);

    List<Booking> getBookingsByTenant(User tenant);

    List<Booking> getBookingsByListing(Listing listing);

    Optional<Booking> getBookingById(Long id);

    List<Booking> getBookingsByStatus(String status);

    Booking cancelBooking(Long id);
    

    void updateBookingStatus(Long bookingId, String action, Owner owner);


    double getRentForBooking(Long id , double month);

    List<Booking> getBookingsByOwner(Owner owner);
}
