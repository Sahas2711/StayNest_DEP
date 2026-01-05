package com.mit.StayNest.Controller;

import com.mit.StayNest.Entity.Booking;
import com.mit.StayNest.Entity.Listing;
import com.mit.StayNest.Entity.Owner;
import com.mit.StayNest.Entity.User;
import com.mit.StayNest.Repository.BookingRepository;
import com.mit.StayNest.Repository.OwnerRepository;
import com.mit.StayNest.Repository.UserRepository;
import com.mit.StayNest.Security.JwtHelper;
import com.mit.StayNest.Services.BookingService;
import com.mit.StayNest.Services.ListingService;

import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    @Autowired
    private BookingService bookingService;

    @Autowired
    private ListingService listingService;

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtHelper jwtHelper;
    
    @Autowired
    private OwnerRepository ownerRepository;

    // ✅ Utility: Extract user from JWT token
    private User getUserFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = jwtHelper.getUsernameFromToken(token);

            logger.debug("Extracted email from token: {}", email);

            return userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        }

        logger.warn("Missing or invalid Authorization header");
        throw new RuntimeException("Authorization header is missing or invalid");
    }

    // ✅ Create a booking by authenticated user
    @PostMapping
    public Booking bookListing(@RequestBody Booking booking, HttpServletRequest request) {
        User user = getUserFromToken(request);
        booking.setTenant(user);

        logger.info("User {} is booking listing {}", user.getEmail(), booking.getListing().getId());
        return bookingService.createBooking(booking);
    }

    // ✅ Get bookings for the current user
    @GetMapping("/user/me")
    public List<Booking> getMyBookings(HttpServletRequest request) {
        User user = getUserFromToken(request);
        logger.info("Fetching bookings for user: {}", user.getEmail());
        return bookingRepo.findByTenant(user);
    }

    // ✅ Get bookings for a specific listing
    @GetMapping("/listing/{id}")
    public List<Booking> getBookingsForListing(@PathVariable Long id) {
        Listing listing = listingService.getSpecificListing(id);
        logger.info("Fetching bookings for listing ID: {}", id);
        return bookingService.getBookingsByListing(listing);
    }

    // ✅ Cancel a booking by ID
    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable Long id) {
        logger.info("Cancelling booking ID: {}", id);
        return bookingService.cancelBooking(id);
    }

    // ✅ Get details of a specific booking
    @GetMapping("/{id}")
    public Booking getBookingDetails(@PathVariable Long id) {
        logger.info("Fetching booking details for ID: {}", id);
        return bookingService.getBookingById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));
    }

    // ✅ Get bookings by status
    @GetMapping("/status/{status}")
    public List<Booking> getBookingsByStatus(@PathVariable String status) {
        logger.info("Fetching bookings with status: {}", status);
        return bookingService.getBookingsByStatus(status);
    }
    

 // ✅ Accept or Reject Booking by Owner
    @PostMapping("/listing/booking/action")
    public ResponseEntity<String> handleBookingAction(@RequestParam Long bookingId,
                                                      @RequestParam String action,
                                                      HttpServletRequest request) {
        Owner user = getOwnerFromToken(request);
        logger.info("Owner {} is attempting to {} booking ID {}", user.getEmail(), action, bookingId);

        try {
            bookingService.updateBookingStatus(bookingId, action.toUpperCase(), user);
            logger.info("Booking ID {} has been {}ED by owner {}", bookingId, action.toUpperCase(), user.getEmail());
            return ResponseEntity.ok("Booking has been " + action.toLowerCase() + "ed successfully.");
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid action '{}' on booking ID {} by owner {}", action, bookingId, user.getEmail());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            logger.error("Unauthorized or invalid booking update: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error during booking update: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error occurred.");
        }
    }
    
    @GetMapping("/owner")
    private List<Booking> getBookingsByOwner(HttpServletRequest request){
    	Owner owner = getOwnerFromToken(request);
    	logger.info("Owner attempting to see the bookings email {}" , owner.getEmail());
    	return bookingService.getBookingsByOwner(owner);
    }
    private Owner getOwnerFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = jwtHelper.getUsernameFromToken(token); // assumes 'sub' = email
            logger.debug("Extracted email from token: {}", email);

            return ownerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Owner not found with email: " + email));
        }

        logger.warn("Authorization header missing or malformed");
        throw new RuntimeException("Authorization header is missing or invalid");
    }


    @GetMapping("/calculate/rent/{id}")
    public double calculateRent(HttpServletRequest request,
                                @RequestParam double month,
                                @PathVariable Long id) {
        User user = getUserFromToken(request);
        logger.info("Fetching Rent for tenant id : {}", user.getEmail());
        return bookingService.getRentForBooking(id, month);
    }
    
    

}
