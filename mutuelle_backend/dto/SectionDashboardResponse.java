package mutuelle_backend.dto;
import mutuelle_backend.entity.Section; import java.util.Map;
public record SectionDashboardResponse(Section section, String message, Map<String, Long> metrics) {}
