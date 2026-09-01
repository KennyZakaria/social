package mutuelle_backend.dto;
import mutuelle_backend.entity.Section;
public record UserResponse(Long id, String username, Section section, boolean enabled) {}
