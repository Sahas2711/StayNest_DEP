package com.mit.StayNest.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mit.StayNest.Entity.Review;
import com.mit.StayNest.Entity.User;
import com.mit.StayNest.Repository.ReviewRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class ReviewServiceImpl implements ReviewService {
	private static final Logger logger = LoggerFactory.getLogger(ReviewServiceImpl.class);

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public Review createReview(Review review) {
    	 logger.info("Creating new review for listing ID: {}", review.getListing().getId());
        return reviewRepository.save(review);
    }

    @Override
    public Review getReviewById(Long id) {
    	 logger.info("Fetching review with ID: {}", id);
    	 return reviewRepository.findById(id)
    	            .orElseThrow(() -> {
    	                logger.warn("Review not found with ID: {}", id);
    	                return new RuntimeException("Review not found with ID: " + id);
    	            });
    }

    @Override
    public List<Review> getAllReviews() {
    	 logger.info("Fetching all reviews");
        return reviewRepository.findAll();
    }

    @Override
    public Review updateReview(User user,Review review) {
    	logger.info("Updating review with ID: {}", review.getId());
    	
        if (!reviewRepository.existsById(review.getId())) {
        	 logger.warn("Review not found with ID: {}", review.getId());
            throw new RuntimeException("Review not found with ID: " + review.getId());
        }
        return reviewRepository.save(review);
    }

    @Override
    public void deleteReviewById(Long id) {
    	logger.info("Deleting review with ID: {}", id);
        if (!reviewRepository.existsById(id)) {
        	logger.warn("Review not found with ID: {}", id);
            throw new RuntimeException("Review not found with ID: " + id);
        }
        reviewRepository.deleteById(id);
        logger.info("Review deleted with ID: {}", id);
    }

    @Override
    public List<Review> getReviewsByListingId(Long listingId) {
    	 logger.info("Fetching reviews for listing ID: {}", listingId);
        return reviewRepository.findByListingId(listingId);
    }

    @Override
    public List<Review> getReviewsByTenantId(Long tenantId) {
    	 logger.info("Fetching reviews for tenant ID: {}", tenantId);
        return reviewRepository.findByTenantId(tenantId);
    }
    @Override
    public List<Review> getReviewsByOwnerId(Long ownerId) {
        logger.info("Fetching reviews for all listings owned by owner ID: {}", ownerId);
        return reviewRepository.findByListingOwnerId(ownerId);
    }
    
}
