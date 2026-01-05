package com.mit.StayNest.Services;



import com.mit.StayNest.Entity.Owner;
import com.mit.StayNest.Repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class OwnerUserDetailsService{} //implements UserDetailsService {
//
//    @Autowired
//    private OwnerRepository ownerRepo;
//
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        Owner owner = ownerRepo.findByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("Owner not found with email: " + email));
//
//        return new org.springframework.security.core.userdetails.User(
//                owner.getEmail(),
//                owner.getPassword(),
//                Collections.emptyList() // or add authorities if needed
//        );
//    }
//}
