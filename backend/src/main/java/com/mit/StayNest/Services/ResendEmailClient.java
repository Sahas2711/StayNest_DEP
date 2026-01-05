package com.mit.StayNest.Services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class ResendEmailClient {

    private static final Logger logger = LoggerFactory.getLogger(ResendEmailClient.class);

    private final WebClient webClient;

    @Value("${resend.from-email}")
    private String fromEmail;

    public ResendEmailClient(WebClient resendWebClient) {
        this.webClient = resendWebClient;
    }

    public void sendHtmlEmail(String to, String subject, String html) {
        Map<String, Object> payload = Map.of(
                "from", fromEmail,
                "to", List.of(to),
                "subject", subject,
                "html", html
        );

        webClient.post()
                .uri("/emails")
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(String.class)
                .doOnSuccess(res -> logger.info("Email sent via Resend to {}", to))
                .doOnError(err -> logger.error("Resend email failed", err))
                .block(); // OK for transactional emails
    }
}
