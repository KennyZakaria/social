package com.social.servicesocial.dto;
import java.time.LocalDate;
import jakarta.validation.constraints.*;
public record RetraiteAssistanceDto(@NotBlank @Size(max=255) String nature,
        @NotBlank @Size(max=255) String organisme, @NotNull LocalDate date,
        @Size(max=1000) String observation) {}
