package com.allmatrimony.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class TwilioProperties {

    @Value("${twilio.account-sid:}")
    private String accountSid;

    @Value("${twilio.auth-token:}")
    private String authToken;

    @Value("${twilio.verify-service-sid:}")
    private String verifyServiceSid;

    public String getAccountSid() {
        return accountSid;
    }

    public String getAuthToken() {
        return authToken;
    }

    public String getVerifyServiceSid() {
        return verifyServiceSid;
    }

    public boolean isConfigured() {
        return StringUtils.hasText(getAccountSid())
                && StringUtils.hasText(getAuthToken())
                && StringUtils.hasText(getVerifyServiceSid());
    }
}
