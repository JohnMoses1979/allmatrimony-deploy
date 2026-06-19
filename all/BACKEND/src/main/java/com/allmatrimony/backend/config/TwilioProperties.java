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

    public String getVerifyServiceSid() {
        return System.getenv("TWILIO_VERIFY_SERVICE_SID");
    }

    public boolean isConfigured() {
        return StringUtils.hasText(getAccountSid())
                && StringUtils.hasText(getAuthToken())
                && StringUtils.hasText(getVerifyServiceSid());
    }
}
