package com.mit.StayNest.Controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mit.StayNest.Entity.Listing;
import com.mit.StayNest.Entity.Owner;
import com.mit.StayNest.Repository.OwnerRepository;
import com.mit.StayNest.Security.JwtHelper;
import com.mit.StayNest.Services.ListingServiceImpl;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/listing")
public class ListingController {

    @Autowired
    private ListingServiceImpl listingServiceImpl;

    @Autowired
    private JwtHelper jwtHelper;

    @Autowired
    private OwnerRepository ownerRepository;

    private static final Logger logger = LoggerFactory.getLogger(ListingController.class);

    @PostMapping("/add")
    public ResponseEntity<?> addListing(@RequestBody Listing listing, HttpServletRequest request) {
        try {
            logger.info("Received request to add listing with ID: {}", listing.getId());

            if (listing.getId() == null) {
                logger.warn("Listing ID is null - explicit ID assignment required");
                return ResponseEntity.badRequest().body("ID must be provided explicitly.");
            }

            Optional<Listing> existing = listingServiceImpl.findById(listing.getId());
            if (existing.isPresent()) {
                logger.warn("Listing with ID {} already exists. Rejecting insertion.", listing.getId());
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("A listing with the given ID already exists.");
            }

            listing.setOwner(getOwnerFromToken(request));
            logger.info("Owner set for listing: {}", listing.getOwner().getId());

            Listing created = listingServiceImpl.createListing(listing);
            logger.info("Listing created successfully with ID: {}", created.getId());

            return ResponseEntity.ok(created);
        } catch (Exception e) {
            logger.error("Failed to create listing: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error creating listing: " + e.getMessage());
        }
    }

    // ✅ Get single listing by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getListingById(@PathVariable Long id) {
        try {
            logger.info("Fetching listing with ID: {}", id);
            Listing listing = listingServiceImpl.getSpecificListing(id);

            if (listing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Listing not found");
            }

            return ResponseEntity.ok(listing);
        } catch (Exception e) {
            logger.error("Failed to fetch listing: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching listing");
        }
    }

    // ✅ Get all listings
    @GetMapping("/all")
    public List<Listing> getAllListing() {
        logger.info("Fetching all listings");
        List<Listing> listings = listingServiceImpl.getAllListing();
        logger.info("Total listings: {}", listings.size());
        return listings;
    }

    // ✅ Update listing - owner injected from JWT
    @PutMapping("/update")
    public ResponseEntity<?> updateListing(@RequestBody Listing listing, HttpServletRequest request) {
        try {
            Owner owner = getOwnerFromToken(request);
            listing.setOwner(owner);

            logger.info("Updating listing ID: {}", listing.getId());
            Listing updated = listingServiceImpl.updateListing(listing);

            logger.info("Listing updated with ID: {}", updated.getId());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("Failed to update listing: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating listing: " + e.getMessage());
        }
    }

    // ✅ Delete listing - owner injected from JWT
    @DeleteMapping("/delete/{listingId}")
    public ResponseEntity<?> deleteListing(@PathVariable Long listingId, HttpServletRequest request) {
        try {
            Owner owner = getOwnerFromToken(request);

            Listing dummy = new Listing();
            dummy.setId(listingId);
            dummy.setOwner(owner);

            logger.info("Deleting listing ID: {} by owner ID: {}", listingId, owner.getId());
            Listing deleted = listingServiceImpl.deleteListing(dummy);

            return ResponseEntity.ok("Deleted listing with ID: " + deleted.getId());
        } catch (Exception e) {
            logger.error("Failed to delete listing: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error deleting listing: " + e.getMessage());
        }
    }

    // ✅ Get listings for current owner (from JWT)
    @GetMapping("/owner/my-listings")
    public ResponseEntity<?> getMyListings(HttpServletRequest request) {
        try {
            Owner owner = getOwnerFromToken(request);
            List<Listing> listings = listingServiceImpl.getListingByOwnerId(owner.getId());

            logger.info("Fetched {} listings for owner ID: {}", listings.size(), owner.getId());
            return ResponseEntity.ok(listings);
        } catch (Exception e) {
            logger.error("Failed to fetch listings for owner: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/search/area")
    public List<Listing> searchByArea(@RequestParam("location") String area) {
        logger.info("Searching listings in area: {}", area);
        List<Listing> results = listingServiceImpl.searchByArea(area);
        logger.info("Found {} listings in area '{}'", results.size(), area);
        return results;
    }


    // ✅ View profile (owner ID and name from JWT)
    @GetMapping("/owner/profile")
    public ResponseEntity<?> getOwnerProfile(HttpServletRequest request) {
        try {
            Owner owner = getOwnerFromToken(request);
            logger.info("Owner profile accessed: ID={}, Name={}", owner.getId(), owner.getName());
            return ResponseEntity.ok("Owner ID: " + owner.getId() + ", Name: " + owner.getName());
        } catch (Exception e) {
            logger.error("Failed to fetch owner profile: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/search/gender")
    public List<Listing> searchByGender(@RequestParam("gender") String gender) {
        logger.info("Searching listings in gender: {}", gender);
        List<Listing> results = listingServiceImpl.searchByGender(gender);
        logger.info("Found {} listings with gender '{}'", results.size(), gender);
        return results;
    }
    @GetMapping("/search/budget")
    public List<Listing> searchByBudget(@RequestParam("budget") double rent) {
        logger.info("Searching listings in area: {}", rent);
        List<Listing> results = listingServiceImpl.searchBelowEqualRent(rent);
        logger.info("Found {} listings in area '{}'", results.size(), rent);
        return results;
    }
    // ✅ Utility method to extract Owner from JWT token
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
    
}
