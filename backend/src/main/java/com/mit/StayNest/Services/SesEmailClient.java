package com.mit.StayNest.Services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.Body;
import software.amazon.awssdk.services.ses.model.Content;
import software.amazon.awssdk.services.ses.model.Destination;
import software.amazon.awssdk.services.ses.model.Message;
import software.amazon.awssdk.services.ses.model.SendEmailRequest;

@Service
public class SesEmailClient {

    private static final Logger logger = LoggerFactory.getLogger(SesEmailClient.class);

    private final SesClient sesClient;

    @Value("${app.mail.from-email}")
    private String fromEmail;

    public SesEmailClient(SesClient sesClient) {
        this.sesClient = sesClient;
    }

    public void sendHtmlEmail(String to, String subject, String html) {
        if (fromEmail == null || fromEmail.isBlank()) {
            throw new IllegalStateException("SES from email is not configured");
        }

        SendEmailRequest request = SendEmailRequest.builder()
                .source(fromEmail)
                .destination(Destination.builder().toAddresses(to).build())
                .message(Message.builder()
                        .subject(Content.builder().data(subject).charset("UTF-8").build())
                        .body(Body.builder()
                                .html(Content.builder().data(html).charset("UTF-8").build())
                                .build())
                        .build())
                .build();

        sesClient.sendEmail(request);
        logger.info("SES email sent to {}", to);
    }
}
