package com.rentwheelsx.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
@Slf4j
public class EmailService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.from.email}")
    private String fromEmail;

    @Value("${brevo.from.name:RentWheelsX}")
    private String fromName;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    private static final String BREVO_API_URL =
            "https://api.brevo.com/v3/smtp/email";


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

            String html = buildOtpTemplate(
                    heading,
                    description,
                    otp
            );


            /*
             * Brevo Transactional Email API
             */
            String jsonBody = """
                    {
                        "sender": {
                            "email": "%s",
                            "name": "%s"
                        },
                        "to": [
                            {
                                "email": "%s"
                            }
                        ],
                        "subject": "%s",
                        "htmlContent": "%s"
                    }
                    """.formatted(
                    escapeJson(fromEmail),
                    escapeJson(fromName),
                    escapeJson(toEmail),
                    escapeJson(subject),
                    escapeJson(html)
            );


            /*
             * Brevo API authentication:
             *
             * API key is sent through the "api-key" header.
             */
            HttpRequest request =
                    HttpRequest.newBuilder()
                            .uri(URI.create(BREVO_API_URL))
                            .header(
                                    "api-key",
                                    brevoApiKey
                            )
                            .header(
                                    "Accept",
                                    "application/json"
                            )
                            .header(
                                    "Content-Type",
                                    "application/json"
                            )
                            .POST(
                                    HttpRequest.BodyPublishers
                                            .ofString(jsonBody)
                            )
                            .build();


            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );


            /*
             * Check Brevo response
             */
            if (response.statusCode() >= 200
                    && response.statusCode() < 300) {

                log.info(
                        "Brevo email sent successfully. To: {}, Status: {}",
                        toEmail,
                        response.statusCode()
                );

            } else {

                /*
                 * Print the actual Brevo response.
                 */
                log.error(
                        "BREVO ERROR | Status: {} | Response: {}",
                        response.statusCode(),
                        response.body()
                );

                throw new RuntimeException(
                        "Brevo API failed. HTTP Status: "
                                + response.statusCode()
                                + " | Response: "
                                + response.body()
                );
            }


        } catch (Exception e) {

            log.error(
                    "EMAIL SENDING FAILED | To: {} | Error: {}",
                    toEmail,
                    e.getMessage(),
                    e
            );

            throw new RuntimeException(
                    "Email sending failed: "
                            + e.getMessage(),
                    e
            );
        }
    }


    // ==========================
    // JSON Escape
    // ==========================

    private String escapeJson(String value) {

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
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

                <body style="
                    margin:0;
                    padding:0;
                    background:#f4f7fb;
                    font-family:Arial,sans-serif;
                ">

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

                                    <td style="
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

                                        <p style="
                                            font-size:16px;
                                            color:#444;
                                        ">
                                            %s
                                        </p>

                                        <div style="
                                            margin:35px 0;
                                            text-align:center;
                                        ">

                                            <div style="
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