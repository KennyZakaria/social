package mutuelle_backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import mutuelle_backend.entity.AppUser;
import mutuelle_backend.entity.Role;
import mutuelle_backend.entity.Section;
import mutuelle_backend.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {

        return args -> {

            // ADMIN
            if (!userRepository.existsByUsername("admin")) {

                AppUser admin = AppUser.builder()
                        .username("admin")
                        .passwordHash(
                                passwordEncoder.encode("admin123")
                        )
                        .role(Role.SUPER_ADMIN)
                        .section(Section.SUPER_ADMIN)
                        .enabled(true)
                        .build();

                userRepository.save(admin);
            }

            // DECES
            if (!userRepository.existsByUsername("deces")) {

                AppUser deces = AppUser.builder()
                        .username("deces")
                        .passwordHash(
                                passwordEncoder.encode("1234")
                        )
                        .role(Role.AGENT)
                        .section(Section.DECES)
                        .enabled(true)
                        .build();

                userRepository.save(deces);
            }
        };
    }
}