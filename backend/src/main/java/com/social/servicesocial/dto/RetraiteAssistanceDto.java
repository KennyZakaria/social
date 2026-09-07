package com.social.servicesocial.dto;
import java.time.LocalDate;
public record RetraiteAssistanceDto(String nature, String organisme, LocalDate date, String observation) {}
