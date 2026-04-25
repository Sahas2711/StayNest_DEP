package com.mit.StayNest.Services;

import org.springframework.stereotype.Service;

@Service
public class MailServiceImpl implements MailService {

    private final SesEmailClient sesEmailClient;

    public MailServiceImpl(SesEmailClient sesEmailClient) {
        this.sesEmailClient = sesEmailClient;
    }

    @Override
    public void sendMail(String to, String subject, String body) {
        sesEmailClient.sendHtmlEmail(to, subject, body);
    }
}
