package mutuelle_backend.dto;
import jakarta.validation.constraints.*; import mutuelle_backend.entity.Section;
public record UserRequest(@NotBlank @Size(max = 80) String username, @NotBlank @Size(min = 4, max = 100) String password, @NotNull Section section, boolean enabled) {}
