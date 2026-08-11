package com.rentwheelsx.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
@Slf4j
public class EmailService {

    @Value("${mailjet.api.key}")
    private String mailjetApiKey;

    @Value("${mailjet.secret.key}")
    private String mailjetSecretKey;

    @Value("${mailjet.from.email}")
    private String fromEmail;

    @Value("${mailjet.from.name:RentWheelsX}")
    private String fromName;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    private static final String MAILJET_API_URL =
            "https://api.mailjet.com/v3.1/send";


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
             * Mailjet Send API v3.1
             */
            String jsonBody = """
                    {
                        "Messages": [
                            {
                                "From": {
                                    "Email": "%s",
                                    "Name": "%s"
                                },
                                "To": [
                                    {
                                        "Email": "%s"
                                    }
                                ],
                                "Subject": "%s",
                                "HTMLPart": "%s"
                            }
                        ]
                    }
                    """.formatted(
                    escapeJson(fromEmail),
                    escapeJson(fromName),
                    escapeJson(toEmail),
                    escapeJson(subject),
                    escapeJson(html)
            );


            /*
             * Mailjet API authentication:
             *
             * Username = API Key
             * Password = Secret Key
             */
            String credentials =
                    mailjetApiKey + ":" + mailjetSecretKey;

            String encodedCredentials =
                    Base64.getEncoder()
                            .encodeToString(
                                    credentials.getBytes(StandardCharsets.UTF_8)
                            );


            HttpRequest request =
                    HttpRequest.newBuilder()
                            .uri(URI.create(MAILJET_API_URL))
                            .header(
                                    "Authorization",
                                    "Basic " + encodedCredentials
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
             * Check Mailjet response
             */
            if (response.statusCode() >= 200
                    && response.statusCode() < 300) {

                log.info(
                        "Mailjet email sent successfully. To: {}, Status: {}",
                        toEmail,
                        response.statusCode()
                );

            } else {

                /*
                 * VERY IMPORTANT:
                 * Print the actual Mailjet response.
                 */
                log.error(
                        "MAILJET ERROR | Status: {} | Response: {}",
                        response.statusCode(),
                        response.body()
                );

                throw new RuntimeException(
                        "Mailjet API failed. HTTP Status: "
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

            /*
             * Preserve the actual Mailjet error.
             */
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