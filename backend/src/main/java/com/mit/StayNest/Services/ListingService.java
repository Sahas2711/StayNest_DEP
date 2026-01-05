package com.mit.StayNest.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mit.StayNest.Entity.Listing;

@Service
public interface ListingService {
	
	public Listing createListing(Listing listing);
	
	public List<Listing> getAllListing();
	
	public Listing updateListing(Listing listing);
	
	public Listing deleteListing(Listing listing);
	
	public Listing getSpecificListing(Long id);

	public List<Listing> getListingByOwnerId(long ownerId);

	public List<Listing> searchByArea(String area);

	public List<Listing> searchByGender(String gender);
	
	public List<Listing> searchBelowEqualRent(Double rent);
}	

