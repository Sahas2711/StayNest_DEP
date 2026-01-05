package com.mit.StayNest.Services;

import java.util.List;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.mit.StayNest.Entity.Booking;
import com.mit.StayNest.Entity.Listing;
import com.mit.StayNest.Entity.User;
import com.mit.StayNest.Entity.Owner;
import com.mit.StayNest.Repository.BookingRepository;
import com.mit.StayNest.Repository.ListingRepository;
import com.mit.StayNest.Repository.OwnerRepository;
import com.mit.StayNest.Repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Component
public class ListingServiceImpl implements ListingService {
	private static final Logger logger = LoggerFactory.getLogger(ListingServiceImpl.class);

	@Autowired
	ListingRepository listingRepo;

	@Autowired
	UserRepository userRepo;

	@Autowired
	OwnerRepository ownerRepo;

	@Autowired
	BookingRepository bookingRepo;
	
	@Override
	public Listing createListing(Listing listing) {
		Long id = listing.getOwner().getId();
		 logger.info("Creating listing for owner ID: {}", id);
		try {
			
			Optional<Owner> optionalUser = ownerRepo.findById(id);

			if (optionalUser.isPresent()) {
				Owner user = optionalUser.get();
				 logger.info("Owner found. Saving listing...");
				listing.setOwner(user);
				return listingRepo.save(listing);
			} else {
				logger.warn("Owner not found with ID: {}", id);
				throw new RuntimeException("Owner not found with ID: " + id);
			}
		} catch (Exception e) {
			 logger.error("Error creating listing for owner ID: {} - {}", id, e.getMessage(), e);
			throw new RuntimeException("Error creating listing: " + e.getMessage());
		}
	}

	@Override
	public List<Listing> getAllListing() {
		logger.info("Fetching all listings");
		List<Listing> allListing = listingRepo.findAll();
		logger.info("Total no. of Listings : {} " , allListing.size());
		return allListing;
	}

	@Override
	public Listing updateListing(Listing listing) {
	    logger.info("Updating listing with ID: {}", listing.getId());
	    Optional<Listing> existingListing = listingRepo.findById(listing.getId());

	    if (existingListing.isPresent()) {
	        Listing updatedListing = existingListing.get();
	        updatedListing.setTitle(listing.getTitle());
	        updatedListing.setOwner(listing.getOwner());
	        updatedListing.setRent(listing.getRent());
	        updatedListing.setAddress(listing.getAddress());
	        
	        // ✅ Add missing fields
	        updatedListing.setGender(listing.getGender());
	        updatedListing.setDescription(listing.getDescription());
	        updatedListing.setDiscount(listing.getDiscount());
	        updatedListing.setDeposite(listing.getDeposite());
	        updatedListing.setStartDate(listing.getStartDate());
	        updatedListing.setEndDate(listing.getEndDate());

	        updatedListing.setAcAvilable(listing.isAcAvilable());
	        updatedListing.setWifiAvilable(listing.isWifiAvilable());
	        updatedListing.setCctvAvilable(listing.isCctvAvilable());
	        updatedListing.setMealsAvilable(listing.isMealsAvilable());
	        updatedListing.setLaudryAvilable(listing.isLaudryAvilable());
	        updatedListing.setParkingAvilable(listing.isParkingAvilable());
	        updatedListing.setCommonAreasAvilable(listing.isCommonAreasAvilable());
	        updatedListing.setStudyDeskAvilable(listing.isStudyDeskAvilable());

	        
	        updatedListing.setRoomDetails(listing.getRoomDetails());
	        updatedListing.setUrls(listing.getUrls());

	        logger.info("Listing updated successfully with ID: {}", updatedListing.getId());
	        return listingRepo.save(updatedListing);
	    } else {
	        logger.warn("Listing not found for update with ID: {}", listing.getId());
	        throw new RuntimeException("Listing not found with ID: " + listing.getId());
	    }
	}

	@Override
	public Listing deleteListing(Listing listing) {
		logger.info("Attempting to delete listing with ID: {}", listing.getId());
		Optional<Listing> existingListing = listingRepo.findById(listing.getId());

		if (existingListing.isPresent()) {
			listingRepo.deleteById(listing.getId());
			logger.info("Listing deleted successfully with ID: {}", listing.getId());
			return existingListing.get();
		} else {
			 logger.warn("Listing not found for deletion with ID: {}", listing.getId());
			throw new RuntimeException("Listing Not found with ID :- " + listing.getId());
		}
	}

	@Override
	public List<Listing> getListingByOwnerId(long ownerId) {
		 logger.info("Fetching listings for owner ID: {}", ownerId);
		Optional<User> optionalUser = userRepo.findById(ownerId);
		if (optionalUser.isPresent()) {
			return listingRepo.findByOwnerId(ownerId);
		} else {
			 logger.warn("Owner not found with ID: {}", ownerId);
			throw new RuntimeException("Owner not found with ID : " + ownerId);
		}

	}

	@Override
	public List<Listing> searchByArea(String area) {
		logger.info("Searching listings in area containing: '{}'", area);
		return listingRepo.findByAddressContaining(area);

	}

	@Override
	public Listing getSpecificListing(Long id) {
		logger.info("Fetching specific listing with ID: {}", id);
		Optional<Listing> listing = listingRepo.findById(id);
		if (listing.isPresent()) {
			return listing.get();
		} else {
			logger.warn("Listing not found with ID: {}", id);
			throw new RuntimeException("No Listing exists with this id: " + id);
		}
	}
	public Optional<Listing> findById(Long id) {
		logger.info("Finding listing by ID: {}", id);
	    return listingRepo.findById(id);
	}

	@Override
	public List<Listing> searchByGender(String gender) {
		logger.info("Finding Listings with gender {}" , gender);
		return listingRepo.findByGender(gender);
	}

	@Override
	public List<Listing> searchBelowEqualRent(Double rent) {
		logger.info("Finding Listings below Rent :- {}" , rent);
		return listingRepo.findByRentLessThanEqual(rent);
	}
	
//	@Override
//	public boolean handleBookingAction(long bookingId, String action) {
//	    logger.info("Received booking action request: bookingId = {}, action = {}", bookingId, action);
//
//	    Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);
//
//	    if (bookingOpt.isEmpty()) {
//	        logger.warn("Booking action failed — Booking with ID {} not found", bookingId);
//	        throw new RuntimeException("Booking ID not found: " + bookingId);
//	    }
//
//	    Booking booking = bookingOpt.get();
//	    String currentStatus = booking.getStatus();
//	    logger.info("Current status of booking ID {} is {}", bookingId, currentStatus);
//
//	    if (!"PENDING".equalsIgnoreCase(currentStatus)) {
//	        logger.warn("Booking ID {} is already in '{}' status — action not allowed", bookingId, currentStatus);
//	        throw new RuntimeException("Booking is already " + currentStatus + ". Action not allowed.");
//	    }
//
//	    switch (action.toUpperCase()) {
//	        case "ACCEPT":
//	            booking.setStatus("CONFIRMED");
//	            logger.info("Booking ID {} has been approved by the owner", bookingId);
//	            break;
//
//	        case "REJECT":
//	            booking.setStatus("REJECTED");
//	            logger.info("Booking ID {} has been rejected by the owner", bookingId);
//	            break;
//
//	        default:
//	            logger.error("Invalid booking action '{}' received for booking ID {}", action, bookingId);
//	            throw new IllegalArgumentException("Invalid action: " + action + ". Use ACCEPT or REJECT.");
//	    }
//
//	    bookingRepo.save(booking);
//	    logger.info("Booking ID {} status updated to '{}'", bookingId, booking.getStatus());
//
//	    return true;
//	}


}
