package com.allmatrimony.backend.config;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class TwilioProperties {

    public String getAccountSid() {
        return System.getenv("TWILIO_ACCOUNT_SID");
    }

    public String getAuthToken() {
        return System.getenv("TWILIO_AUTH_TOKEN");
    }

    public String getPhoneNumber() {
        return System.getenv("TWILIO_PHONE_NUMBER");
    }

    public boolean isConfigured() {
        return StringUtils.hasText(getAccountSid())
                && StringUtils.hasText(getAuthToken())
                && StringUtils.hasText(getPhoneNumber());
    }
}
