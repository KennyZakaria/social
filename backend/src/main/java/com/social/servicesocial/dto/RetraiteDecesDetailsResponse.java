package com.social.servicesocial.dto;

import java.time.LocalDate;

public record RetraiteDecesDetailsResponse(
        LocalDate dateDeces,
        String causeDeces,
        String natureDeces) {
}
