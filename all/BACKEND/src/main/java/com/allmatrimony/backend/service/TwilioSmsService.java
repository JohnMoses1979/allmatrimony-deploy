package com.allmatrimony.backend.service;

import com.allmatrimony.backend.config.TwilioProperties;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class TwilioSmsService implements SmsService {

    private final TwilioProperties twilioProperties;
    private boolean initialized = false;

    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    public TwilioSmsService(TwilioProperties twilioProperties) {
        this.twilioProperties = twilioProperties;
    }

    @Override
    public void sendOtp(String phone, String otp) {
        if (!isConfigured()) {
            throw new IllegalStateException("Twilio credentials are not configured.");
        }

        initTwilio();

        String toPhone = toE164India(phone);

        if (!StringUtils.hasText(toPhone)) {
            throw new IllegalArgumentException("Phone number is required.");
        }

        String finalOtp = StringUtils.hasText(otp)
                ? otp
                : String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));

        otpStore.put(toPhone, finalOtp);

        Message.creator(
                new PhoneNumber(toPhone),
                new PhoneNumber(twilioProperties.getPhoneNumber()),
                "Your All Matrimony OTP is " + finalOtp + ". Do not share this code."
        ).create();
    }

    @Override
    public boolean verifyOtp(String phone, String otp) {
        String toPhone = toE164India(phone);

        if (!StringUtils.hasText(toPhone) || !StringUtils.hasText(otp)) {
            return false;
        }

        String savedOtp = otpStore.get(toPhone);

        if (savedOtp != null && savedOtp.equals(otp)) {
            otpStore.remove(toPhone);
            return true;
        }

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

    private String toE164India(String phone) {
        if (phone == null) {
            return null;
        }

        String trimmed = phone.trim();

        if (trimmed.startsWith("+")) {
            return trimmed;
        }

        String digits = trimmed.replaceAll("\\D", "");

        if (digits.length() == 10) {
            return "+91" + digits;
        }

        if (digits.length() == 12 && digits.startsWith("91")) {
            return "+" + digits;
        }

        return trimmed;
    }
}
