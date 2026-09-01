package mutuelle_backend.service;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import mutuelle_backend.dto.UserRequest;
import mutuelle_backend.dto.UserResponse;
import mutuelle_backend.entity.AppUser;
import mutuelle_backend.exception.ConflictException;
import mutuelle_backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        AppUser user = required(username);

        return User.withUsername(user.getUsername())
                .password(user.getPasswordHash())
                .disabled(!user.isEnabled())
                .authorities(
                        new SimpleGrantedAuthority(
                                "SECTION_" + user.getSection().name()
                        )
                )
                .build();
    }

    public AppUser required(String username) {

        return repository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Unknown user"
                        )
                );
    }

    public List<UserResponse> all() {

        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public UserResponse create(UserRequest request) {

        if (repository.existsByUsername(request.username())) {

            throw new ConflictException(
                    "Username already exists"
            );
        }

        AppUser user = AppUser.builder()
                .username(request.username())
                .passwordHash(
                        passwordEncoder.encode(
                                request.password()
                        )
                )
                .section(request.section())
                .enabled(request.enabled())
                .build();

        return toResponse(repository.save(user));
    }

    public UserResponse toResponse(AppUser user) {

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getSection(),
                user.isEnabled()
        );
    }
}