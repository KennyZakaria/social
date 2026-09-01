package mutuelle_backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import mutuelle_backend.dto.LoginRequest;
import mutuelle_backend.dto.LoginResponse;
import mutuelle_backend.entity.AppUser;
import mutuelle_backend.exception.UnauthorizedException;
import mutuelle_backend.repository.UserRepository;
import mutuelle_backend.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        AppUser user = userRepository
                .findByUsername(request.username())
                .orElseThrow(() ->
                        new UnauthorizedException(
                                "Username ou mot de passe incorrect"
                        )
                );

        if (!user.isEnabled()) {
            throw new UnauthorizedException(
                    "Utilisateur désactivé"
            );
        }

        if (!passwordEncoder.matches(
                request.password(),
                user.getPasswordHash()
        )) {
            throw new UnauthorizedException(
                    "Username ou mot de passe incorrect"
            );
        }

        String token = jwtService.generate(user);

        return new LoginResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getRole().name(),
                user.getSection().name()
        );
    }
}