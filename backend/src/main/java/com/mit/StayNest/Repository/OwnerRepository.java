package com.mit.StayNest.Repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mit.StayNest.Entity.Owner;

@Repository

public interface OwnerRepository extends JpaRepository<Owner, Long> {
	Optional<Owner> findByEmail(String email);



}