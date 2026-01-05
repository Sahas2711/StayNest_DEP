package com.mit.StayNest.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "owner")
public class Owner {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = false)
	private String password;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String phoneNumber;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public Owner() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Owner(Long id, String email, String password, String name, String phoneNumber) {
		super();
		this.id = id;
		this.email = email;
		this.password = password;
		this.name = name;
		this.phoneNumber = phoneNumber;
	}

	@Override
	public String toString() {
		return "Owner [id=" + id + ", email=" + email + ", password=" + password + ", name=" + name + ", phoneNumber="
				+ phoneNumber + "]";
	}
}
