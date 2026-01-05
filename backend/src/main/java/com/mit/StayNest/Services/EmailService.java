package com.mit.StayNest.Services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.mit.StayNest.Entity.Booking;
import com.mit.StayNest.Entity.Listing;
import com.mit.StayNest.Entity.Owner;
import com.mit.StayNest.Entity.User;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;

@Service
public class EmailService {

   private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final ResendEmailClient resendEmailClient;

    public EmailService(ResendEmailClient resendEmailClient) {
        this.resendEmailClient = resendEmailClient;
    }

    public void sendEmail(String to, String subject, String htmlContent) {
        try {
            resendEmailClient.sendHtmlEmail(to, subject, htmlContent);
        } catch (Exception e) {
            logger.error("Email send failed to {}", to, e);
            throw new RuntimeException("Email sending failed", e);
        }
    }

    // Method for Booking Confirmation to Tenant
    public void sendBookingConfirmationEmail(User tenant, Listing listing, String selectedRoomType, Booking booking ) {
        String subject = "Your StayNest Booking Request for " + listing.getTitle() ;
        String htmlBody = buildTenantBookingConfirmationHtml(tenant, listing, selectedRoomType, booking);
        sendEmail(tenant.getEmail(), subject, htmlBody);
    }

    // Method for New Booking Notification to Owner
    public void sendNewBookingNotificationEmail(Owner owner, Listing listing, User tenant, String selectedRoomType, Booking booking) {
        String subject = "New Booking Request Received on StayNest for " + listing.getTitle();
        String htmlBody = buildOwnerBookingNotificationHtml(owner, listing, tenant, selectedRoomType, booking);
        sendEmail(owner.getEmail(), subject, htmlBody);
    }

    // Method for Forgot Password OTP
    public void sendForgotPasswordOtpEmail(String email, String name, String link) {
        String subject = "StayNest - Password Reset Link";
        String htmlBody = buildForgotPasswordOtpHtml(name, link);
        sendEmail(email, subject, htmlBody);
    }

    // Method for Booking Status Update (e.g., APPROVED, REJECTED)
    public void sendBookingStatusUpdateEmail(User tenant, Booking booking) {
        String subject = "StayNest - Your Booking Status Update for " + booking.getListing().getTitle() + " :- "+ booking.getStatus();
        String htmlBody = buildBookingStatusUpdateHtml(tenant, booking);
        sendEmail(tenant.getEmail(), subject, htmlBody);
    }

    // --- Private Helper Methods to Build HTML Content ---

    private String buildTenantBookingConfirmationHtml(User tenant, Listing listing, String selectedRoomType, Booking booking) {
        long durationMonths = 0;
        if (booking.getStartDate() != null && booking.getEndDate() != null) {
            LocalDate start = booking.getStartDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            LocalDate end = booking.getEndDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            durationMonths = ChronoUnit.MONTHS.between(start, end);
        }

        String ownerName = listing.getOwner() != null ? listing.getOwner().getName() : "Owner";
        String ownerPhone = listing.getOwner() != null ? listing.getOwner().getPhoneNumber() : "N/A";
        String ownerEmail = listing.getOwner() != null ? listing.getOwner().getEmail() : "N/A";

        return "<!DOCTYPE html>"
                + "<html lang='en'>"
                + "<head>"
                + "    <meta charset='UTF-8'>"
                + "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                + "    <title>Booking " +  booking.getStatus()+ "</title>"
                + "    <link href='https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins:wght@400;700&display=swap' rel='stylesheet'>"
                + "    <style>"
                + "        body { font-family: 'Poppins', Arial, sans-serif; background-color: #f9f7ff; margin: 0; padding: 0; color: #5e4b8b; }"
                + "        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden; }"
                + "        .header { background-color: #7c5ff0; color: #ffffff; padding: 20px; text-align: center; font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 600; }"
                + "        .content { padding: 30px; line-height: 1.6; }"
                + "        .content h2 { color: #5e4b8b; font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 15px; }"
                + "        .details p { margin: 8px 0; font-size: 16px; }"
                + "        .details strong { color: #ff9f59; }"
                + "        .footer { background-color: #f2f2f2; color: #777777; text-align: center; padding: 15px; font-size: 12px; }"
                + "        .button { display: inline-block; background-color: #9f8fff; color: white !important; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; transition: background-color 0.3s ease; }"
                + "        .button:hover { background-color: #7f6cd6; }"
                + "    </style>"
                + "</head>"
                + "<body>"
                + "    <div class='container'>"
                + "        <div class='header'>"
                + "            Your Booking Status update "
                + "        </div>"
                + "        <div class='content'>"
                + "            <h2>Hi " + tenant.getName() + ",</h2>"
                + "            <p>Your booking request for <strong style='color: #ff9f59;'>" + listing.getTitle() + "</strong> has been successfully received!</p>"
                + "            <div class='details'>"
                + "                <p><strong>Listing Details:</strong></p>"
                + "                <p>Name: <span style='color: #5e4b8b;'>" + listing.getTitle() + "</span></p>"
                + "                <p>Location: <span style='color: #5e4b8b;'>" + listing.getAddress() + "</span></p>"
                + "                <p>Room Type: <strong style='color: #ff9f59;'>" + selectedRoomType + "</strong></p>"
                + "                <p>Check-in Date: <span style='color: #5e4b8b;'>" + booking.getStartDate() + "</span></p>"
                + "                <p>Duration: <span style='color: #5e4b8b;'>" + durationMonths + " months</span></p>"
                + "                <p>Total Amount Paid: <span style='color: #5e4b8b;'>₹" + String.format("%.2f", booking.getTotalRent()) + "</span></p>"
                + "                <p>Your Booking ID: <strong style='color: #7c5ff0;'>" + booking.getId() + "</strong></p>"
                + "                <p>Booking Status: <strong style='color: #ff9f59;'>" + booking.getStatus() + "</strong></p>"
                + "            </div>"
                + "            <br>"
                + "            <div class='details'>"
                + "                <p><strong>Owner Details:</strong></p>"
                + "                <p>Name: <span style='color: #5e4b8b;'>" + ownerName + "</span></p>"
                + "                <p>Phone: <span style='color: #5e4b8b;'>" + ownerPhone + "</span></p>"
                + "                <p>Email: <span style='color: #5e4b8b;'>" + ownerEmail + "</span></p>"
                + "            </div>"
                + "            <p>The owner has been notified and will get in touch with you shortly.</p>"
                + "            <p>Thank you for choosing StayNest for your accommodation needs!</p>"
                + "            <div style='text-align: center; margin-top: 25px;'>"
                + "                <a href='http://localhost:3000/login' class='button'>Go to Your Dashboard</a>"
                + "            </div>"
                + "        </div>"
                + "        <div class='footer'>"
                + "            &copy; " + java.time.Year.now() + " StayNest. All rights reserved."
                + "        </div>"
                + "    </div>"
                + "</body>"
                + "</html>";
    }
    private String buildOwnerBookingNotificationHtml(Owner owner, Listing listing, User tenant, String selectedRoomType, Booking booking) {
        long durationMonths = 0;
        if (booking.getStartDate() != null && booking.getEndDate() != null) {
            LocalDate start = booking.getStartDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            LocalDate end = booking.getEndDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            durationMonths = ChronoUnit.MONTHS.between(start, end);
        }

        return "<!DOCTYPE html>"
                + "<html lang='en'>"
                + "<head>"
                + "    <meta charset='UTF-8'>"
                + "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                + "    <title>New Booking Request</title>"
                + "    <link href='https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins:wght@400;700&display=swap' rel='stylesheet'>"
                + "    <style>"
                + "        body { font-family: 'Poppins', Arial, sans-serif; background-color: #f9f7ff; margin: 0; padding: 0; color: #5e4b8b; }"
                + "        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden; }"
                + "        .header { background-color: #ff9f59; color: #ffffff; padding: 20px; text-align: center; font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 600; }"
                + "        .content { padding: 30px; line-height: 1.6; }"
                + "        .content h2 { color: #5e4b8b; font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 15px; }"
                + "        .details p { margin: 8px 0; font-size: 16px; }"
                + "        .details strong { color: #7c5ff0; }"
                + "        .footer { background-color: #f2f2f2; color: #777777; text-align: center; padding: 15px; font-size: 12px; }"
                + "        .button { display: inline-block; background-color: #ff9f59; color: white !important; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; transition: background-color 0.3s ease; }"
                + "        .button:hover { background-color: #e67e32; }"
                + "    </style>"
                + "</head>"
                + "<body>"
                + "    <div class='container'>"
                + "        <div class='header'>"
                + "            StayNest - New Booking Request!"
                + "        </div>"
                + "        <div class='content'>"
                + "            <h2>Hello " + owner.getName() + ",</h2>"
                + "            <p>You've received a new booking request for your listing: <strong style='color: #ff9f59;'>" + listing.getTitle() + "</strong>.</p>"
                + "            <div class='details'>"
                + "                <p><strong>Tenant Details:</strong></p>"
                + "                <p>Name: <span style='color: #5e4b8b;'>" + tenant.getName() + "</span></p>"
                + "                <p>Email: <span style='color: #5e4b8b;'>" + tenant.getEmail() + "</span></p>"
                + "                <p>Phone: <span style='color: #5e4b8b;'>" + tenant.getPhoneNumber() + "</span></p>"
                + "                <p><strong>Booking Details:</strong></p>"
                + "                <p>Listing: <span style='color: #5e4b8b;'>" + listing.getTitle() + "</span></p>"
                + "                <p>Location: <span style='color: #5e4b8b;'>" + listing.getAddress() + "</span></p>"
                + "                <p>Room Type Booked: <strong style='color: #7c5ff0;'>" + selectedRoomType + "</strong></p>"
                + "                <p>Check-in Date: <span style='color: #5e4b8b;'>" + booking.getStartDate() + "</span></p>"
                + "                <p>Duration: <span style='color: #5e4b8b;'>" + durationMonths + " months</span></p>"
                + "                <p>Total Rent: <span style='color: #5e4b8b;'>₹" + String.format("%.2f", booking.getTotalRent()) + "</span></p>"
                + "                <p>Booking Status: <strong style='color: #ff9f59;'>" + booking.getStatus() + "</strong></p>"
                + "            </div>"
                + "            <p>Please log in to your StayNest owner dashboard to view and manage this booking.</p>"
                + "            <p>Thank you for using StayNest!</p>"
                + "            <div style='text-align: center; margin-top: 25px;'>"
                + "                <a href='http://localhost:3000/login' class='button'>Go to Dashboard</a>"
                + "            </div>"
                + "        </div>"
                + "        <div class='footer'>"
                + "            &copy; " + java.time.Year.now() + " StayNest. All rights reserved."
                + "        </div>"
                + "    </div>"
                + "</body>"
                + "</html>";
    }

    private String buildForgotPasswordOtpHtml(String userName, String resetLink) {
        return "<!DOCTYPE html>"
                + "<html lang=\"en\">"
                + "<head>"
                + "    <meta charset=\"UTF-8\">"
                + "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
                + "    <title>Reset Your Password - StayNest</title>"
                + "    <link href='https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins:wght@400;700&display=swap' rel='stylesheet'>"
                + "    <style>"
                + "        body { font-family: 'Poppins', Arial, sans-serif; background-color: #f9f7ff; margin: 0; padding: 0; color: #5e4b8b; }"
                + "        table { border-collapse: collapse; width: 100%; }"
                + "        td { padding: 0; }"
                + "        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }"
                + "        .header { background: linear-gradient(to right, #ff9f59, #ffc06a); padding: 20px; text-align: center; }"
                + "        .header h1 { color: #ffffff; font-family: 'Playfair Display', serif; font-size: 28px; margin: 0; font-weight: bold; }"
                + "        .content { padding: 30px; line-height: 1.6; }"
                + "        .content p { margin-bottom: 15px; font-size: 16px; }"
                + "        .button-container { text-align: center; padding: 20px 0; }"
                + "        .button { display: inline-block; background-color: #ff9f59; color: #ffffff !important; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 8px rgba(255, 159, 89, 0.3); transition: background-color 0.3s ease; }"
                + "        .button:hover { background-color: #e67e32; }"
                + "        .footer { background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 12px; color: #777777; }"
                + "        .footer p { margin: 0; }"
                + "        a { color: #7c5ff0; text-decoration: none; }"
                + "        a:hover { text-decoration: underline; }"
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
                + "                            <p>Hello <span style='color: #7c5ff0; font-weight: bold;'>" + userName + "</span>,</p>"
                + "                            <p>We received a request to reset your password for your StayNest account. If you did not make this request, you can safely ignore this email.</p>"
                + "                            <p>To reset your password, please click on the button below:</p>"
                + "                            <div class=\"button-container\">"
                + "                                <a href=\"" + resetLink + "\" class=\"button\" target=\"_blank\">Reset Your Password</a>"
                + "                            </div>"
                + "                            <p>This link is valid for a 15 minutes for security reasons. If the button above doesn't work, you can copy and paste the following link into your web browser:</p>"
                + "                            <p style=\"word-break: break-all;\"><a href=\"" + resetLink + "\" target=\"_blank\" style='color: #ff9f59;'>" + resetLink + "</a></p>"
                + "                            <p>If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>"
                + "                            <p>Thank you,<br>The StayNest Team</p>"
                + "                        </td>"
                + "                    </tr>"
                + "                    <tr>"
                + "                        <td class=\"footer\">"
                + "                            <p>&copy; 2025 StayNest. All rights reserved.</p>"
                + "                            <p><a href=\"#\" target=\"_blank\">Privacy Policy</a> | <a href=\"#\" target=\"_blank\">Terms of Service</a></p>"
                + "                        </td>"
                + "                    </tr>"
                + "                </table>"
                + "            </td>"
                + "        </tr>"
                + "    </table>"
                + "</body>"
                + "</html>";
    }

    private String buildBookingStatusUpdateHtml(User tenant, Booking booking) {
        String statusColor;
        String statusMessage;
        String headerBgColor; // New variable for header background
        String buttonBgColor; // New variable for button background

        switch (booking.getStatus()) {
            case "APPROVED":
                statusColor = "#4CAF50"; // Green for success
                headerBgColor = "#4CAF50";
                buttonBgColor = "#9f8fff"; // Lavender button for consistency
                statusMessage = "Good news! Your booking for <strong style='color: #ff9f59;'>" + booking.getListing().getTitle() + "</strong> has been <strong style='color: " + statusColor + ";'>APPROVED</strong> by the owner!";
                break;
            case "REJECTED":
                statusColor = "#D32F2F"; // Red for rejection
                headerBgColor = "#D32F2F";
                buttonBgColor = "#ff9f59"; // Orange button for consistency
                statusMessage = "Unfortunately, your booking for <strong style='color: #ff9f59;'>" + booking.getListing().getTitle() + "</strong> has been <strong style='color: " + statusColor + ";'>REJECTED</strong> by the owner.";
                break;
            case "CANCELLED":
                statusColor = "#FFC107"; // Orange for cancelled (warning)
                headerBgColor = "#FFC107";
                buttonBgColor = "#ff9f59"; // Orange button for consistency
                statusMessage = "Your booking for <strong style='color: #ff9f59;'>" + booking.getListing().getTitle() + "</strong> has been <strong style='color: " + statusColor + ";'>CANCELLED</strong>.";
                break;
            default:
                statusColor = "#2196F3"; // Blue for other statuses or default
                headerBgColor = "#7c5ff0"; // Purple for default
                buttonBgColor = "#9f8fff"; // Lavender for default
                statusMessage = "The status of your booking for <strong style='color: #ff9f59;'>" + booking.getListing().getTitle() + "</strong> has been updated to <strong style='color: " + statusColor + ";'>" + booking.getStatus() + "</strong>.";
                break;
        }

        return "<!DOCTYPE html>"
                + "<html lang='en'>"
                + "<head>"
                + "    <meta charset='UTF-8'>"
                + "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                + "    <title>Booking Status Update</title>"
                + "    <link href='https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins:wght@400;700&display=swap' rel='stylesheet'>"
                + "    <style>"
                + "        body { font-family: 'Poppins', Arial, sans-serif; background-color: #f9f7ff; margin: 0; padding: 0; color: #5e4b8b; }"
                + "        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden; }"
                + "        .header { background-color: " + headerBgColor + "; color: #ffffff; padding: 20px; text-align: center; font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 600; }"
                + "        .content { padding: 30px; line-height: 1.6; }"
                + "        .content h2 { color: #5e4b8b; font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 15px; }"
                + "        .details p { margin: 8px 0; font-size: 16px; }"
                + "        .details strong { color: #7c5ff0; }" // Using a consistent purple for emphasis
                + "        .footer { background-color: #f2f2f2; color: #777777; text-align: center; padding: 15px; font-size: 12px; }"
                + "        .button { display: inline-block; background-color: " + buttonBgColor + "; color: white !important; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; transition: background-color 0.3s ease; }"
                + "        .button:hover { background-color: #7f6cd6; }" // Hover for lavender, or adjust for orange
                + "    </style>"
                + "</head>"
                + "<body>"
                + "    <div class='container'>"
                + "        <div class='header'>"
                + "            StayNest - Booking Status Update"
                + "        </div>"
                + "        <div class='content'>"
                + "            <h2>Hi " + tenant.getName() + ",</h2>"
                + "            <p>" + statusMessage + "</p>"
                + "            <div class='details'>"
                + "                <p><strong>Booking ID:</strong> <span style='color: #5e4b8b;'>" + booking.getId() + "</span></p>"
                + "                <p><strong>Listing:</strong> <span style='color: #5e4b8b;'>" + booking.getListing().getTitle() + "</span></p>"
                + "                <p><strong>Current Status:</strong> <strong style='color: " + statusColor + ";'>" + booking.getStatus() + "</strong></p>"
                + "                <p><strong>Check-in Date:</strong> <span style='color: #5e4b8b;'>" + booking.getStartDate() + "</span></p>"
                + "                <p><strong>Location:</strong> <span style='color: #5e4b8b;'>" + booking.getListing().getAddress() + "</span></p>"
                + "            </div>"
                + "            <p>Please log in to your dashboard for more details.</p>"
                + "            <div style='text-align: center; margin-top: 25px;'>"
                + "                <a href='http://localhost:3000/login' class='button'>Go to Your Dashboard</a>"
                + "            </div>"
                + "        </div>"
                + "        <div class='footer'>"
                + "            &copy; " + java.time.Year.now() + " StayNest. All rights reserved."
                + "        </div>"
                + "    </div>"
                + "</body>"
                + "</html>";
    }

    public String genrateWelcomeMessage(String userName, String browsePgLink, String contactFaqLink) {
        return "<!DOCTYPE html>"
                + "<html lang=\"en\">"
                + "<head>"
                + "    <meta charset=\"UTF-8\">"
                + "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
                + "    <title>Welcome to StayNest!</title>"
                + "    <link href='https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins:wght@400;700&display=swap' rel='stylesheet'>"
                + "    <style>"
                + "        body { font-family: 'Poppins', Arial, sans-serif; background-color: #f9f7ff; margin: 0; padding: 0; color: #5e4b8b; }"
                + "        table { border-collapse: collapse; width: 100%; }"
                + "        td { padding: 0; }"
                + "        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }"
                + "        .header { background: linear-gradient(to right, #7c5ff0, #9f8fff); padding: 20px; text-align: center; }"
                + "        .header h1 { color: #ffffff; font-family: 'Playfair Display', serif; font-size: 28px; margin: 0; font-weight: bold; }"
                + "        .content { padding: 30px; line-height: 1.6; }"
                + "        .content p { margin-bottom: 15px; font-size: 16px; }"
                + "        .button-container { text-align: center; padding: 20px 0; }"
                + "        .button { display: inline-block; background-color: #ff9f59; color: #ffffff !important; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 8px rgba(255, 159, 89, 0.3); transition: background-color 0.3s ease; }"
                + "        .button.lavender { background-color: #9f8fff; box-shadow: 0 4px 8px rgba(159, 143, 255, 0.3); }"
                + "        .button:hover { background-color: #e67e32; }"
                + "        .button.lavender:hover { background-color: #7f6cd6; }"
                + "        .footer { background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 12px; color: #777777; }"
                + "        .footer p { margin: 0; }"
                + "        a { color: #7c5ff0; text-decoration: none; }"
                + "        a:hover { text-decoration: underline; }"
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
                + "                            <p>Hello <span style='color: #7c5ff0; font-weight: bold;'>" + userName + "</span>,</p>"
                + "                            <p>Welcome to StayNest! We're thrilled to have you join our community.</p>"
                + "                            <p>StayNest helps you find your perfect nest away from home. Explore verified PGs and hostels, book easily, and manage your stays with confidence.</p>"
                + "                            <div class=\"button-container\">"
                + "                                <a href=\"" + browsePgLink + "\" class=\"button\" target=\"_blank\">Browse PG's</a>"
                
                + "                            </div>"
                + "                            <p>We're here to make your renting experience seamless and enjoyable. If you have any questions, feel free to reach out to our support team.</p>"
                + "                            <p>Happy searching!<br>The StayNest Team</p>"
                + "                        </td>"
                + "                    </tr>"
                + "                    <tr>"
                + "                        <td class=\"footer\">"
                + "                            <p>&copy; 2025 StayNest. All rights reserved.</p>"
                + "                            <p><a href=\"#\" target=\"_blank\">Privacy Policy</a> | <a href=\"#\" target=\"_blank\">Terms of Service</a></p>"
                + "                        </td>"
                + "                    </tr>"
                + "                </table>"
                + "            </td>"
                + "        </tr>"
                + "    </table>"
                + "</body>"
                + "</html>";
    }
}