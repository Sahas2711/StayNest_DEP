package com.mit.StayNest.Payloads;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.mit.StayNest.Entity.User;

@Component
public class JwtRequest {
	private String email;
	private Long userId;
	private String password;
    private final Key key = Keys.hmacShaKeyFor("mysecretkeymysecretkeymysecretkey1234".getBytes()); 
    // Should be at least 256 bits (32+ chars) for HS256

    // Generate token
    public String generateToken(User user, Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("email", user.getEmail());
        return createToken(claims, user.getEmail());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract email
    public String extractEmail(String token) {
        return extractAllClaims(token).get("email", String.class);
    }

    // Extract userId
    public Long extractUserId(String token) {
        return extractAllClaims(token).get("userId", Long.class);
    }

    // Validate token
    public boolean validateToken(String token) {
        try {
            extractAllClaims(token); // if parsing fails, it's invalid
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    // Extract all claims
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public JwtRequest() {
		super();
		// TODO Auto-generated constructor stub
	}

	public JwtRequest(String email, Long userId, String password) {
		super();
		this.email = email;
		this.userId = userId;
		this.password = password;
	}

	@Override
	public String toString() {
		return "JwtRequest [email=" + email + ", userId=" + userId + ", password=" + password + ", key=" + key + "]";
	}

	
}
