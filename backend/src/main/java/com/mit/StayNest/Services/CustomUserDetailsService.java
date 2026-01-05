package com.mit.StayNest.Services;

import com.mit.StayNest.Entity.Owner;
import com.mit.StayNest.Entity.User;
import com.mit.StayNest.Repository.OwnerRepository;
import com.mit.StayNest.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Primary
@Service("customUserDetailService") 
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private OwnerRepository ownerRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepo.findByEmail(username);
        if (user.isPresent()) {
            return new org.springframework.security.core.userdetails.User(
                user.get().getEmail(),
                user.get().getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
            );
        }

        Optional<Owner> owner = ownerRepo.findByEmail(username);
        if (owner.isPresent()) {
            return new org.springframework.security.core.userdetails.User(
                owner.get().getEmail(),
                owner.get().getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_OWNER"))
            );
        }

        throw new UsernameNotFoundException("User/Owner not found with email: " + username);
    }
}
