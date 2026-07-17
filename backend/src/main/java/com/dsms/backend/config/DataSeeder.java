package com.dsms.backend.config;

import com.dsms.backend.domain.PlatformUser;
import com.dsms.backend.repository.PlatformUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedPlatformData(PlatformUserRepository platformUserRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if super admin exists
            if (platformUserRepository.findByEmail("admin@dsms.com").isEmpty()) {
                PlatformUser admin = new PlatformUser();
                admin.setEmail("admin@dsms.com");
                admin.setPasswordHash(passwordEncoder.encode("admin123")); // Default password
                admin.setFullName("System Super Admin");
                admin.setRole("SUPER_ADMIN");
                admin.setActive(true);
                
                platformUserRepository.save(admin);
                System.out.println("Seeded default Super Admin: admin@dsms.com / admin123");
            }
        };
    }
}
