package com.social.servicesocial.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record FicheRenseignementsDecesRequest(
        String observation,
        List<@Valid LiquidationInput> liquidations,
        List<@Valid PensionInput> pensions,
        List<@Valid AssuranceInput> assurances,
        @Valid SituationFinanciereInput situationFinanciere,
        List<@Valid AssistanceInput> assistancesOctroyees
) {
    public record LiquidationInput(@NotBlank String designation, @DecimalMin("0.00") BigDecimal montant, String beneficiaire, String reference) {}
    public record PensionInput(@NotBlank String typeBeneficiaire, Long ayantDroitId, String numero, @DecimalMin("0.00") BigDecimal montant) {}
    public record AssuranceInput(@NotBlank String typeBeneficiaire, Long ayantDroitId, String numeroCheque, @DecimalMin("0.00") BigDecimal montant) {}
    public record SituationFinanciereInput(
            @DecimalMin("0.00") BigDecimal pmr, @DecimalMin("0.00") BigDecimal pmi, @DecimalMin("0.00") BigDecimal salaire,
            @DecimalMin("0.00") BigDecimal autresRessources, @DecimalMin("0.00") BigDecimal eauElectricite,
            @DecimalMin("0.00") BigDecimal fraisMedicaux, @DecimalMin("0.00") BigDecimal fraisScolarite,
            @DecimalMin("0.00") BigDecimal loyer, @DecimalMin("0.00") BigDecimal autresCharges) {}
    public record AssistanceInput(@NotBlank String designation, @DecimalMin("0.00") BigDecimal montant, LocalDate date, String chequeReference) {}
}