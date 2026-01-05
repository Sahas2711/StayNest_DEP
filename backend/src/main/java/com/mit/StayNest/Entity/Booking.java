package com.mit.StayNest.Entity;

import java.util.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "bookings")
public class Booking {

	@Id
	private Long id;

	@ManyToOne
	@JoinColumn(name = "tenant_id")
	private User tenant;

	@ManyToOne
	@JoinColumn(name = "listing_id")
	private Listing listing;

	@Column(name = "start_date")
	private Date startDate;

	@Column(name = "end_date")
	private Date endDate;
	@Column
	private String status;
	@Column
	private Double totalRent;
	
	@Column
	private String roomType;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getTenant() {
		return tenant;
	}

	public void setTenant(User tenant) {
		this.tenant = tenant;
	}

	public Listing getListing() {
		return listing;
	}

	public void setListing(Listing listing) {
		this.listing = listing;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Double getTotalRent() {
		return totalRent;
	}

	public void setTotalRent(Double totalRent) {
		this.totalRent = totalRent;
	}
	
	
	public String getRoomType() {
		return roomType;
	}

	public void setRoomType(String roomType) {
		this.roomType = roomType;
	}

	public Booking() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public Booking(Long id, User tenant, Listing listing, Date startDate, Date endDate, String status,
			Double totalRent) {
		super();
		this.id = id;
		this.tenant = tenant;
		this.listing = listing;
		this.startDate = startDate;
		this.endDate = endDate;
		this.status = status;
		this.totalRent = totalRent;
	}

	@Override
	public String toString() {
		return "Booking [id=" + id + ", tenant=" + tenant + ", listing=" + listing + ", startDate=" + startDate
				+ ", endDate=" + endDate + ", status=" + status + ", totalRent=" + totalRent + "]";
	}

	

}