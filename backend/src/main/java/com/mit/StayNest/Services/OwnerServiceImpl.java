package com.mit.StayNest.Services;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.mit.StayNest.Entity.Owner;
import com.mit.StayNest.Repository.OwnerRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class OwnerServiceImpl implements OwnerService {
	private static final Logger logger = LoggerFactory.getLogger(OwnerServiceImpl.class);

	@Autowired
	private OwnerRepository ownerRepo;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private MailService mailService;

	@Autowired
	private JavaMailSender javaMailSender;

	public Owner register(Owner owner) {
	    logger.info("Attempting to register owner with email: {}", owner.getEmail());

	    Optional<Owner> existingOwner = ownerRepo.findByEmail(owner.getEmail());
	    if (existingOwner.isPresent()) {
	        logger.warn("Registration failed — owner already exists with email: {}", owner.getEmail());
	        throw new RuntimeException("Owner already exists with email: " + owner.getEmail());
	    }

	    String encodedPassword = passwordEncoder.encode(owner.getPassword());
	    owner.setPassword(encodedPassword);
	    Owner savedOwner = ownerRepo.save(owner); // save and get back the saved entity

	    // Prepare dynamic welcome email
	    String userName = savedOwner.getName() != null ? savedOwner.getName() : "There";
	    String email = savedOwner.getEmail();
	    String browsePgLink = "http://localhost:3000/browse-pgs";
	    String contactFaqLink = "http://localhost:3000/contact-us";
	    String subject = "Welcome to StayNest! Your Nest Away From Home Awaits!";

	    String htmlBody = "<!DOCTYPE html>"
                + "<html lang=\"en\">"
                + "<head>"
                + "    <meta charset=\"UTF-8\">"
                + "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
                + "    <title>Welcome to StayNest!</title>"
                + "    <style>"
                + "        body {"
                + "            font-family: Arial, sans-serif;"
                + "            background-color: #f8f8f8;"
                + "            margin: 0;"
                + "            padding: 0;"
                + "            -webkit-text-size-adjust: none;"
                + "            width: 100% !important;"
                + "        }"
                + "        table {"
                + "            border-collapse: collapse;"
                + "            width: 100%;"
                + "        }"
                + "        td {"
                + "            padding: 0;"
                + "        }"
                + "        .container {"
                + "            max-width: 600px;"
                + "            margin: 20px auto;"
                + "            background-color: #ffffff;"
                + "            border-radius: 8px;"
                + "            overflow: hidden;"
                + "            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"
                + "        }"
                + "        .header {"
                + "            background: linear-gradient(to right, #FFC06A, #FFA36A);"
                + "            padding: 20px;"
                + "            text-align: center;"
                + "        }"
                + "        .header h1 {"
                + "            color: #ffffff;"
                + "            font-size: 28px;"
                + "            margin: 0;"
                + "            font-weight: bold;"
                + "        }"
                + "        .content {"
                + "            padding: 30px;"
                + "            color: #333333;"
                + "            line-height: 1.6;"
                + "        }"
                + "        .content p {"
                + "            margin-bottom: 15px;"
                + "            font-size: 16px;"
                + "        }"
                + "        .button-container {"
                + "            text-align: center;"
                + "            padding: 20px 0;"
                + "        }"
                + "        .button {"
                + "            display: inline-block;"
                + "            background-color: #FF8C42;"
                + "            color: #ffffff !important;"
                + "            padding: 12px 25px;"
                + "            text-decoration: none;"
                + "            border-radius: 5px;"
                + "            font-weight: bold;"
                + "            font-size: 16px;"
                + "            box-shadow: 0 4px 8px rgba(255, 140, 66, 0.3);"
                + "            transition: background-color 0.3s ease;"
                + "        }"
                + "        .button:hover {"
                + "            background-color: #e67e32;"
                + "        }"
                + "        .footer {"
                + "            background-color: #f2f2f2;"
                + "            padding: 20px;"
                + "            text-align: center;"
                + "            font-size: 12px;"
                + "            color: #777777;"
                + "        }"
                + "        .footer p {"
                + "            margin: 0;"
                + "        }"
                + "        a {"
                + "            color: #FF8C42;"
                + "            text-decoration: none;"
                + "        }"
                + "        a:hover {"
                + "            text-decoration: underline;"
                + "        }"
                + "    </style>"
                + "</head>"
                + "<body>"
                + "    <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">"
                + "        <tr>"
                + "            <td align=\"center\">"
                + "                <table role=\"presentation\" class=\"container\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">"
                + "                    <tr>"
                + "                        <td class=\"header\">"
                + "                            <h1>StayNest</h1>"
                + "                        </td>"
                + "                    </tr>"
                + "                    <tr>"
                + "                        <td class=\"content\">"
                + "                            <p>Hello " + userName + ",</p>" // Dynamic user name
                + "                            <p>Welcome to StayNest! We're thrilled to have you join our community.</p>"
                + "                            <p>StayNest helps you find your perfect nest away from home. Explore verified PGs and hostels, book easily, and live comfortably.</p>"
                + "                            <div class=\"button-container\">"
                + "                                <a href=\"" + browsePgLink + "\" class=\"button\" target=\"_blank\">Start Exploring Now</a>" // Dynamic link
                + "                            </div>"
                + "                            <p>If you have any questions or need assistance, feel full to visit our <a href=\"" + contactFaqLink + "\" target=\"_blank\">Help Center</a> or contact our support team.</p>" // Dynamic link
                + "                            <p>Happy nesting!<br>The StayNest Team</p>"
                + "                        </td>"
                + "                    </tr>"
                + "                    <tr>"
                + "                        <td class=\"footer\">"
                + "                            <p>&copy; 2025 StayNest. All rights reserved.</p>"
                + "                            <p><a href=\"#\" target=\"_blank\">Privacy Policy</a> | <a href=\"#\" target=\"_blank\">Terms of Service</a></p>" // Update these if you have actual URLs
                + "                        </td>"
                + "                    </tr>"
                + "                </table>"
                + "            </td>"
                + "        </tr>"
                + "    </table>"
                + "</body>"
                + "</html>";

	    try {
	        MimeMessage message = javaMailSender.createMimeMessage();
	        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
	        helper.setTo(email);
	        helper.setSubject(subject);
	        helper.setText(htmlBody, true);
	         helper.setFrom("noreply@staynest.com");
	      //  javaMailSender.send(message);
	        logger.info("Welcome email sent to: {}", email);
	    } catch (MessagingException e) {
	        logger.error("Failed to send welcome email to {}: {}", email, e.getMessage());
	        // Don't interrupt registration if email fails
	    }

	    logger.info("Owner registered successfully with ID: {}", savedOwner.getId());
	    return savedOwner;
	}


	@Override
	public Owner login(Owner owner) {
        if (owner.getEmail() == null || owner.getPassword() == null) {
            logger.warn("Login failed — missing email or password");
            throw new RuntimeException("Credentials not found");
        }
		Optional<Owner> existingowner = ownerRepo.findByEmail(owner.getEmail());

		if (existingowner.isPresent() && existingowner.get().getPassword().equals(owner.getPassword())) {
			 logger.info("Login successful for owner ID: {}", existingowner.get().getId());
			return existingowner.get();
		}
		 logger.warn("Login failed — invalid credentials for email: {}", owner.getEmail());
		throw new RuntimeException("Invalid email or password");
	}


	@Override
	public Owner updateOwner(Owner owner) {
		logger.info("Updating owner with email: {}", owner.getEmail());
		Optional<Owner> currentowner = ownerRepo.findByEmail(owner.getEmail());
		if (currentowner.isPresent()) {
			Owner existingowner = currentowner.get();

			if (owner.getName() != null) {
				existingowner.setName(owner.getName());
			}
			if (owner.getPassword() != null) {
			    String encodedPassword = passwordEncoder.encode(owner.getPassword());
			    existingowner.setPassword(encodedPassword);
			}

			if (owner.getPhoneNumber() != null) {
				existingowner.setPhoneNumber(owner.getPhoneNumber());
			}
			return ownerRepo.save(existingowner);
		} else {
			throw new RuntimeException("owner does not exist");
		}
	}

	@Override
	public List<Owner> getOwner() {
		logger.info("Fetching all owners");
		return ownerRepo.findAll();
	}

	@Override
	public Owner currentOwner(Owner user) {
		logger.info("Fetching current owner with email: {}", user.getEmail());

		Optional<Owner> currentowner = ownerRepo.findByEmail(user.getEmail());
		if (currentowner.isPresent()) {
			return currentowner.get();
		} else {
			 logger.warn("Current owner not found with email: {}", user.getEmail());
			throw new RuntimeException("owner does not exist");
		}
	}

	@Override
	public Owner deleteOwner(Owner owner) {
		logger.info("Attempting to delete owner with ID: {}", owner.getId());
		Optional<Owner> currentowner = ownerRepo.findById(owner.getId());
		if(currentowner.isPresent()) {
			ownerRepo.deleteById(owner.getId());
			logger.info("Owner deleted successfully with ID: {}", owner.getId());
			return currentowner.get();
		}
		else {
			logger.warn("Delete failed — owner not found with ID: {}", owner.getId());
			throw new RuntimeException("No owner exist with this id");
		}
	}

	@Override
	public Owner getOwnerById(String id) {
		logger.info("Fetching owner with ID: {}", id);
		Optional<Owner> owner = ownerRepo.findById(Long.parseLong(id));
		if(owner.isPresent()) {
			return owner.get();
		}
		else {
			 logger.warn("Owner not found with ID: {}", id);
			throw new RuntimeException("No owner exist with this id");
		}
	}
}

