package com.mit.StayNest.Controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.mit.StayNest.Entity.Owner;
import com.mit.StayNest.Services.OwnerService;
import com.mit.StayNest.Security.JwtHelper;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/owner")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private JwtHelper jwtHelper;

    private static final Logger logger = LoggerFactory.getLogger(OwnerController.class);

    @PostMapping("/register")
    public Owner register(@RequestBody Owner request) {
        logger.info("Registering new owner with email: {}", request.getEmail());
        Owner registered = ownerService.register(request);
        logger.info("Owner registered with ID: {}", registered.getId());
        return registered;
    }

    @GetMapping("/getusers")
    public List<Owner> getUsers() {
        logger.info("Fetching all owners");
        List<Owner> owners = ownerService.getOwner();
        logger.info("Total owners found: {}", owners.size());
        return owners;
    }

    @GetMapping("/users/me")
    public Owner currentUser(HttpServletRequest request) {
        String email = extractEmailFromToken(request);
        logger.info("Fetching current owner for email: {}", email);
        Owner user = new Owner();
        user.setEmail(email);
        Owner result = ownerService.currentOwner(user);
        logger.info("Owner fetched with ID: {}", result.getId());
        return result;
    }

    @PutMapping("/users/update")
    public Owner updateUser(HttpServletRequest request, @RequestBody Owner user) {
        String email = extractEmailFromToken(request);
        user.setEmail(email);
        logger.info("Updating owner with email: {}", email);
        Owner updated = ownerService.updateOwner(user);
        logger.info("Owner updated with ID: {}", updated.getId());
        return updated;
    }

    @DeleteMapping("/users/delete")
    public Owner deleteUser(HttpServletRequest request, @RequestBody Owner user) {
        String email = extractEmailFromToken(request);
        user.setEmail(email);
        logger.info("Deleting owner with email: {}", email);
        Owner deleted = ownerService.deleteOwner(user);
        logger.info("Owner deleted with ID: {}", deleted.getId());
        return deleted;
    }

    @GetMapping("/users/{id}")
    public Owner getUserById(@PathVariable String id) {
        logger.info("Fetching owner by ID: {}", id);
        Owner owner = ownerService.getOwnerById(id);
        logger.info("Owner fetched: email = {}", owner.getEmail());
        return owner;
    }

    private String extractEmailFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = jwtHelper.getUsernameFromToken(token); // adjust if method is named differently
            logger.debug("Extracted email from JWT: {}", email);
            return email;
        }
        logger.warn("Authorization header is missing or invalid");
        throw new RuntimeException("Authorization header missing or invalid");
    }
}
