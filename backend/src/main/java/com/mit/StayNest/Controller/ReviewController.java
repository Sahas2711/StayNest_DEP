package com.mit.StayNest.Controller;

import com.mit.StayNest.Entity.Review;
import com.mit.StayNest.Entity.User;
import com.mit.StayNest.Repository.UserRepository;
import com.mit.StayNest.Security.JwtHelper;
import com.mit.StayNest.Services.ReviewServiceImpl;

import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    private ReviewServiceImpl reviewService;

    @Autowired
    private JwtHelper jwtHelper;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);

    // 🔐 Utility to extract user from JWT
    private User getUserFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = jwtHelper.getUsernameFromToken(token);
            logger.debug("Extracted email from JWT: {}", email);

            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        }

        logger.warn("Missing or invalid Authorization header");
        throw new RuntimeException("Authorization header is missing or invalid");
    }

    // ✅ Add review with tenant injected
    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody Review review, HttpServletRequest request) {
        try {
            if(review.getListing() == null) {
            	logger.info("No Listing found with id : {}",review.getId());
            	throw new RuntimeException("Listing not found with id ");
            }
        	User tenant = getUserFromToken(request);
            
            review.setTenant(tenant);
            logger.info("Adding review by tenant: {}", tenant.getEmail());

            Review saved = reviewService.createReview(review);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            logger.error("Error adding review: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReviewById(@PathVariable Long id) {
        try {
            Review review = reviewService.getReviewById(id);
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public List<Review> getAllReviews() {
        logger.info("Fetching all reviews");
        return reviewService.getAllReviews();
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateReview(@RequestBody Review review, HttpServletRequest request) {
        try {
            User user = getUserFromToken(request);
            logger.info("User {} updating review ID {}", user.getEmail(), review.getId());

            Review updated = reviewService.updateReview(user,review);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            logger.error("Update failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        try {
            reviewService.deleteReviewById(id);
            logger.info("Deleted review ID: {}", id);
            return ResponseEntity.ok("Deleted review with ID: " + id);
        } catch (RuntimeException e) {
            logger.error("Delete failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/listing/{listingId}")
    public ResponseEntity<?> getReviewsByListing(@PathVariable Long listingId) {
        try {
            List<Review> reviews = reviewService.getReviewsByListingId(listingId);
            return ResponseEntity.ok(reviews);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<?> getReviewsByTenant(@PathVariable Long tenantId) {
        try {
            List<Review> reviews = reviewService.getReviewsByTenantId(tenantId);
            return ResponseEntity.ok(reviews);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Review>> getReviewsByOwner(@PathVariable Long ownerId) {
        logger.info("Fetching all reviews for owner ID: {}", ownerId);
        List<Review> reviews = reviewService.getReviewsByOwnerId(ownerId);
        return ResponseEntity.ok(reviews);
    }
}
