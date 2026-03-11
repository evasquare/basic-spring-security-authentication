package com.evasquare.jwt_authentication.config;

import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.evasquare.jwt_authentication.entity.Role;
import com.evasquare.jwt_authentication.entity.User;
import com.evasquare.jwt_authentication.repository.UserRepository;
import com.evasquare.jwt_authentication.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    @Value("${jwt.admin-password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@admin.com")) {
            User admin = User.builder()
                    .email("admin@admin.com")
                    .password(passwordEncoder.encode(adminPassword))
                    .roles(Set.of(Role.ADMIN, Role.USER))
                    .enabled(true)
                    .accountNonExpired(true)
                    .accountNonLocked(true)
                    .credentialsNonExpired(true)
                    .build();

            userRepository.save(admin);
        } else {
            userService.updateAdminCredentials(adminPassword);
        }
    }
}
