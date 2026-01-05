package com.mit.StayNest.Services;

import com.mit.StayNest.Entity.Booking;

import com.mit.StayNest.Entity.Listing;
import com.mit.StayNest.Entity.Owner;
import com.mit.StayNest.Entity.RoomTypeDetails;
import com.mit.StayNest.Entity.User;
import com.mit.StayNest.Repository.BookingRepository;
import com.mit.StayNest.Repository.ListingRepository;
import com.mit.StayNest.Services.ListingServiceImpl;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class BookingServiceImpl implements BookingService {
	private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);


    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private ListingServiceImpl listingServiceImpl;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired 
    private ListingRepository listingRepository;
    @Override
    @Transactional
    public Booking createBooking(Booking booking) {
        logger.info("Creating booking for listing ID: {} by tenant ID: {}",
                booking.getListing().getId(), booking.getTenant().getId());

        Listing listing = listingServiceImpl.getSpecificListing(booking.getListing().getId());
        booking.setListing(listing);
        booking.setStatus("PENDING");

        String selectedRoomType = booking.getRoomType();

        Booking saved = bookingRepository.save(booking);
        logger.info("Booking created successfully with ID: {}", saved.getId());

        Owner owner = saved.getListing().getOwner();
        User tenant = saved.getTenant();

       // emailService.sendBookingConfirmationEmail(tenant, listing, selectedRoomType, saved);
        logger.info("Booking email sent to tenant {} ", tenant.getEmail());
       // emailService.sendNewBookingNotificationEmail(owner, listing, tenant, selectedRoomType, saved);
        logger.info("Booking email sent to owner {} ", owner.getEmail());

        return saved;
    }

    @Override
    public List<Booking> getBookingsByTenant(User tenant) {
    	 logger.info("Fetching bookings for tenant ID: {}", tenant.getId());
        return bookingRepository.findByTenant(tenant);
    }

    @Override
    public List<Booking> getBookingsByListing(Listing listing) {
    	 logger.info("Fetching bookings for listing ID: {}", listing.getId());
        return bookingRepository.findByListing(listing);
    }

    @Override
    public Optional<Booking> getBookingById(Long id) {
    	logger.info("Fetching booking by ID: {}", id);
        return bookingRepository.findById(id);
    }

    @Override
    public List<Booking> getBookingsByStatus(String status) {
    	logger.info("Fetching bookings with status: {}", status.toUpperCase());
        return bookingRepository.findByStatus(status.toUpperCase());
    }

    @Override
    public Booking cancelBooking(Long id) {
    	logger.info("Cancellation request received for booking ID: {}", id);

        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> {
                logger.warn("Booking not found with ID: {}", id);
                return new RuntimeException("Booking not found with ID: " + id);
            });
        booking.setStatus("CANCELLED");
        Booking cancelled = bookingRepository.save(booking);
        logger.info("Booking cancelled successfully with ID: {}", cancelled.getId());
        return cancelled;
    }

    
    @Override
    public void updateBookingStatus(Long bookingId, String action, Owner owner) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));
        Listing listing = booking.getListing();
        // Ownership validation
        if (!booking.getListing().getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("You are not authorized to update this booking.");
        }
        String selectedRoomType = booking.getRoomType();
        String newStatus;
        boolean roomFound;
        switch (action.toUpperCase()) {
            case "ACCEPT":
                newStatus = "ACCEPTED";
                 selectedRoomType = booking.getRoomType();

                 roomFound = false;
                for (RoomTypeDetails roomDetail : listing.getRoomDetails()) {
                	
                    if (roomDetail.getRoomType().equals(selectedRoomType)) {
                    	if(selectedRoomType.equals("private")) {
                        roomDetail.decrementRoomCount();
                        logger.info("Decremented room count for room type '{}' on listing ID: {}", selectedRoomType, listing.getId());
                    }
                    	else {
                    		roomDetail.decrementBedCount();
                    		logger.info("Decremented bed count for shared pg {} " , listing.getId());
                    	}
                    	roomFound = true;
                    }
                	
                }

                if (!roomFound) {
                    logger.warn("Selected room type '{}' not found in listing ID: {}", selectedRoomType, listing.getId());
                    throw new RuntimeException("Selected room type not available for this listing.");
                }
                break;
            case "REJECT":
                newStatus = "REJECTED";
                 roomFound = false;
                booking.setTotalRent(new Double(0));
                
                break;
            default:
                throw new IllegalArgumentException("Invalid action. Use 'ACCEPT' or 'REJECT'.");
        }

        booking.setStatus(newStatus);
        bookingRepository.save(booking);
        logger.info("Booking ID {} status changed to {}", bookingId, newStatus);

        // Send email to tenant
        User tenant = booking.getTenant();

        String subject = "Your Booking on StayNest has been " + newStatus;


       // emailService.sendBookingConfirmationEmail(tenant, listing, selectedRoomType, booking);
        
    }




	@Override
	public double getRentForBooking(Long id, double month) {
		Optional<Booking> booking = bookingRepository.findById(id);
		if(booking.isPresent()) {
		logger.info("Rent requested for Booking : {}",booking.get().getId());
		double rent = booking.get().getListing().getRent();
		logger.info("Total rent for Booking : {}",rent * month);
		booking.get().setTotalRent(rent * month);
		bookingRepository.save(booking.get());
		return rent*month;
		}
		else {
			logger.warn("Booking not found with id  : {}", id);
			throw new RuntimeException("Booking not found");
		}
	}

	@Override
	public List<Booking> getBookingsByOwner(Owner owner) {
		// TODO Auto-generated method stub
		Long id = owner.getId();
		logger.info("Owner with id {} accessing for bookings",id);
		List<Booking> result = bookingRepository.getBookingsByOwner(id);
		logger.info("Total bookings found for owner {} " + result.size());
		return result;
	}
    

}
