package com.rentwheelsx.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    // ==========================
    // Signup OTP Email
    // ==========================
    public void sendOtp(String toEmail, String otp) {

        sendEmail(
                toEmail,
                "🚗 RentWheelsX - Email Verification",
                "Welcome to RentWheelsX!",
                "Thank you for registering. Please verify your email address using the OTP below.",
                otp
        );
    }

    // ==========================
    // Forgot Password OTP Email
    // ==========================
    public void sendPasswordResetOtp(String toEmail, String otp) {

        sendEmail(
                toEmail,
                "🔐 RentWheelsX - Password Reset",
                "Password Reset Request",
                "Please use the OTP below to reset your password.",
                otp
        );
    }

    // ==========================
    // Common Email Sender
    // ==========================
    private void sendEmail(
            String toEmail,
            String subject,
            String heading,
            String description,
            String otp
    ) {

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject(subject);

            String html = buildOtpTemplate(
                    heading,
                    description,
                    otp
            );

            helper.setText(html, true);

            mailSender.send(message);

            log.info("OTP email sent successfully to {}", toEmail);

        } catch (Exception e) {

            log.error(
                    "Failed to send email to {}. Error: {}",
                    toEmail,
                    e.getMessage(),
                    e
            );

            throw new RuntimeException("Failed to send email", e);
        }
    }

    // ==========================
    // HTML Template
    // ==========================
    private String buildOtpTemplate(
            String heading,
            String description,
            String otp
    ) {

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                </head>

                <body style="margin:0;
                             padding:0;
                             background:#f4f7fb;
                             font-family:Arial,sans-serif;">

                <table width="100%%"
                       cellpadding="0"
                       cellspacing="0"
                       style="padding:40px 0;">

                    <tr>
                        <td align="center">

                            <table width="600"
                                   cellpadding="0"
                                   cellspacing="0"
                                   style="
                                        background:white;
                                        border-radius:12px;
                                        overflow:hidden;
                                        box-shadow:0 4px 15px rgba(0,0,0,.1);
                                   ">

                                <tr>
                                    <td
                                        style="
                                            background:#0f172a;
                                            color:white;
                                            text-align:center;
                                            padding:25px;
                                            font-size:28px;
                                            font-weight:bold;
                                        ">
                                        🚗 RentWheelsX
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:40px;">

                                        <h2 style="margin-top:0;">
                                            %s
                                        </h2>

                                        <p style="font-size:16px;color:#444;">
                                            %s
                                        </p>

                                        <div
                                            style="
                                                margin:35px 0;
                                                text-align:center;
                                            ">

                                            <div
                                                style="
                                                    display:inline-block;
                                                    background:#2563eb;
                                                    color:white;
                                                    font-size:36px;
                                                    letter-spacing:8px;
                                                    font-weight:bold;
                                                    padding:18px 35px;
                                                    border-radius:10px;
                                                ">
                                                %s
                                            </div>

                                        </div>

                                        <p style="color:#666;">
                                            This OTP is valid for
                                            <strong>10 minutes</strong>.
                                        </p>

                                        <p style="color:red;">
                                            Never share this OTP with anyone.
                                        </p>

                                        <hr>

                                        <p style="
                                                color:#888;
                                                font-size:13px;
                                                text-align:center;
                                        ">
                                            © 2026 RentWheelsX
                                            <br>
                                            Secure Vehicle Rental Platform
                                        </p>

                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>

                </table>

                </body>
                </html>
                """.formatted(
                heading,
                description,
                otp
        );
    }
}