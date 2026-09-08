package com.social.servicesocial.dto;

import java.time.LocalDateTime;

public record RetraiteHistoriqueDto(Long id, String action, String detail, LocalDateTime dateAction) {}
