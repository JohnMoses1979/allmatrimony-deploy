package com.allmatrimony.backend.service;

import com.allmatrimony.backend.config.TwilioProperties;
import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
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
        phone = formatPhone(phone);

        if (!isConfigured()) {
            throw new IllegalStateException("Twilio credentials are not configured.");
        }

        initTwilio();

        try {
            Verification verification = Verification.creator(
                    twilioProperties.getVerifyServiceSid(),
                    phone,
                    "sms"
            ).create();

            System.out.println("TWILIO OTP SENT STATUS = " + verification.getStatus());
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public boolean verifyOtp(String phone, String otp) {
        phone = formatPhone(phone);

        System.out.println("VERIFY PHONE = " + phone);
        System.out.println("VERIFY OTP = " + otp);
        System.out.println("VERIFY SERVICE = " + twilioProperties.getVerifyServiceSid());

        if (!isConfigured()) {
            throw new IllegalStateException("Twilio credentials are not configured.");
        }

        initTwilio();

        try {
            VerificationCheck check = VerificationCheck.creator(
                    twilioProperties.getVerifyServiceSid()
            )
            .setTo(phone)
            .setCode(otp.trim())
            .create();

            System.out.println("TWILIO VERIFY STATUS = " + check.getStatus());
            return "approved".equals(check.getStatus());
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private String formatPhone(String phone) {
        if (phone == null) {
            return null;
        }

        phone = phone.trim();

        if (phone.startsWith("+")) {
            return phone;
        }

        if (phone.length() == 10) {
            return "+91" + phone;
        }

        return phone;
    }

    @Override
    public boolean isConfigured() {
        return twilioProperties.getAccountSid() != null
                && !twilioProperties.getAccountSid().isBlank()
                && twilioProperties.getAuthToken() != null
                && !twilioProperties.getAuthToken().isBlank()
                && twilioProperties.getVerifyServiceSid() != null
                && !twilioProperties.getVerifyServiceSid().isBlank();
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
