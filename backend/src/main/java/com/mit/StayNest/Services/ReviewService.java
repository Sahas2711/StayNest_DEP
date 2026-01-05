package com.mit.StayNest.Services;

import java.util.List;

import com.mit.StayNest.Entity.Review;
import com.mit.StayNest.Entity.User;

public interface ReviewService {
    Review createReview(Review review);
    Review getReviewById(Long id);
    List<Review> getAllReviews();
    Review updateReview(User user,Review review);
    void deleteReviewById(Long id);
    List<Review> getReviewsByListingId(Long listingId);
    List<Review> getReviewsByTenantId(Long tenantId);
    List<Review> getReviewsByOwnerId(Long ownerId);
}
