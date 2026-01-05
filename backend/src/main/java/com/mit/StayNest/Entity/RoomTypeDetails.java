package com.mit.StayNest.Entity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mit.StayNest.Controller.BookingController;

import jakarta.persistence.Column;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;

@Entity
public class RoomTypeDetails {
	private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable=false)
	private String roomType;
	
	@Column(nullable=false)
	private int roomCount;
	
	@Column(nullable=false)
	private double price;
	
	@Column(nullable=false)
	private int bedsPerRoom;
	
	@Column(nullable=false)
	private int avilableBedsPerRoom=bedsPerRoom * roomCount;

	public String getRoomType() {
		return roomType;
	}
	public void setRoomType(String roomType) {
		this.roomType = roomType;
	}
	public int getRoomCount() {
		return roomCount;
	}
	public void setRoomCount(int roomCount) {
		this.roomCount = roomCount;
	}
	public double getPrice() {
		return price;
	}
	public void setPrice(double price) {
		this.price = price;
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public int getBedsPerRoom() {
		return bedsPerRoom;
	}
	public void setBedsPerRoom(int bedsPerRoom) {
		this.bedsPerRoom = bedsPerRoom;
	}
	
	
	public int getAvilableBedsPerRoom() {
		return avilableBedsPerRoom;
	}
	public void setAvilableBedsPerRoom(int avilableBedsPerRoom) {
		this.avilableBedsPerRoom = bedsPerRoom;
	}
	public RoomTypeDetails() {
		super();
		// TODO Auto-generated constructor stub
	}
	public RoomTypeDetails(Long id, String roomType, int roomCount, double price, int bedsPerRoom) {
		super();
		this.id = id;
		this.roomType = roomType;
		this.roomCount = roomCount;
		this.price = price;
		this.bedsPerRoom = bedsPerRoom;
	}
	@Override
	public String toString() {
		return "RoomTypeDetails [id=" + id + ", roomType=" + roomType + ", roomCount=" + roomCount + ", price=" + price
				+ ", bedsPerRoom=" + bedsPerRoom + "]";
	}
	
	public void decrementBedCount() {
	    logger.info("Decrementing bed count");

	    if (bedsPerRoom <= 0) {
	        throw new IllegalStateException("Invalid configuration: bedsPerRoom must be > 0");
	    }

	    if (avilableBedsPerRoom <= 0) {
	        throw new IllegalStateException("No available beds to decrement");
	    }

	    // Decrement 1 bed
	    avilableBedsPerRoom--;

	    // Recalculate roomCount based on remaining beds
	    roomCount = avilableBedsPerRoom / bedsPerRoom;

	    logger.info("Updated roomCount = {}, availableBeds = {}", roomCount, avilableBedsPerRoom);
	}


	
	public void decrementRoomCount() {
		logger.info("Decrementing room count ");
	    if (roomCount > 0) {
	        roomCount--;
	    } else {
	        throw new IllegalStateException("No rooms available for this room type");
	    }
	    logger.info("Decremented room count successfully");
	}
	public void incrementRoomCount() {
	    if (roomCount > 0) {
	        roomCount++;
	    } else {
	        throw new IllegalStateException("No rooms available for this room type");
	    }
	}
	
	@PrePersist
	public void onCreate() {
	    this.avilableBedsPerRoom = this.bedsPerRoom * this.roomCount;
	}
}
