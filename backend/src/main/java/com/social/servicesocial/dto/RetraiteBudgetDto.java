package com.social.servicesocial.dto;
import java.math.BigDecimal;
import jakarta.validation.constraints.*;
public record RetraiteBudgetDto(@NotBlank @Size(max=100) String designation,
        @NotNull @DecimalMin("0") @Digits(integer=10, fraction=2) BigDecimal montant) {}
