package com.rentwheelsx.config;

import com.rentwheelsx.entity.User;
import com.rentwheelsx.enums.Role;
import com.rentwheelsx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin account
        if (!userRepository.existsByEmail("admin@rentwheelsx.com")) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@rentwheelsx.com")
                    .password(passwordEncoder.encode("admin123"))
                    .mobile("9999999999")
                    .role(Role.ADMIN)
                    .isVerified(true)
                    .build();
            userRepository.save(admin);
            log.info("=======================================================");
            log.info("  Default Admin Account Created:");
            log.info("  Email    : admin@rentwheelsx.com");
            log.info("  Password : admin123");
            log.info("=======================================================");
        }
    }
}
