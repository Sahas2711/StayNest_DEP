package com.mit.StayNest.Services;

import jakarta.mail.internet.MimeMessage; // Import MimeMessage
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper; // Import MimeMessageHelper
import org.springframework.stereotype.Service;

@Service
public class MailServiceImpl implements MailService {

    private static final Logger logger = LoggerFactory.getLogger(MailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendMail(String to, String subject, String body) {
        try {
            // Create a MimeMessage
            MimeMessage message = mailSender.createMimeMessage();
            // Use MimeMessageHelper to easily set properties, especially for HTML
            // The 'true' argument indicates that the email body is HTML
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("staynest06@gmail.com"); 
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); 

            mailSender.send(message);
            logger.info("HTML Email sent successfully to: {}", to);
        } catch (jakarta.mail.MessagingException e) { 
            logger.error("Failed to send HTML email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send email to " + to, e);
        } catch (Exception e) { 
            logger.error("An unexpected error occurred while sending email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("An unexpected error occurred while sending email to " + to, e);
        }
    }
}