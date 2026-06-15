package com.allmatrimony.backend.service;

import com.allmatrimony.backend.config.TwilioProperties;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Service;

@Service
public class TwilioSmsService implements SmsService {

    private final TwilioProperties twilioProperties;
    private boolean initialized = false;

    public TwilioSmsService(TwilioProperties twilioProperties) {
        this.twilioProperties = twilioProperties;
    }

    @Override
    public void sendOtp(String phone, String otp) {
        if (!isConfigured()) {
            throw new IllegalStateException("Twilio credentials are not configured.");
        }

        initTwilio();

        Message.creator(
                new PhoneNumber(phone),
                new PhoneNumber(twilioProperties.getPhoneNumber()),
                "Your All Matrimony OTP is " + otp + ". Do not share this code."
        ).create();
    }

    @Override
    public boolean verifyOtp(String phone, String otp) {
        return false;
    }

    public boolean isConfigured() {
        return twilioProperties.isConfigured();
    }

    private void initTwilio() {
        if (!initialized) {
            Twilio.init(
                    twilioProperties.getAccountSid(),
                    twilioProperties.getAuthToken()
            );
            initialized = true;
        }
    }
}
