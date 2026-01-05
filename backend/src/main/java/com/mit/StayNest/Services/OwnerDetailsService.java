//package com.mit.StayNest.Services;
//
//import com.mit.StayNest.Entity.Owner;
//import com.mit.StayNest.Repository.OwnerRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.*;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//@Service
//public class OwnerDetailsService implements UserDetailsService {
//	 private static final Logger logger = LoggerFactory.getLogger(OwnerDetailsService.class);
//
//
//    @Autowired
//    private OwnerRepository ownerRepo;
//
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//    	 logger.info("Attempting to load owner by email: {}", email);
//
//        Owner owner = ownerRepo.findByEmail(email)
//                .orElseThrow(() ->{
//                	logger.warn("Owner not found with email: {}", email);
//               return new UsernameNotFoundException("Owner not found with email: " + email);
//                });
//        logger.info("Successfully loaded owner: {}", email);
//        return new org.springframework.security.core.userdetails.User(
//                owner.getEmail(),
//                owner.getPassword(),
//                new ArrayList<>()
//        );
//    }
//}


