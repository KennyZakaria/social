package com.social.servicesocial.config;

import com.social.servicesocial.model.CaseRecord;
import com.social.servicesocial.model.CaseStatus;
import com.social.servicesocial.model.AppRole;
import com.social.servicesocial.model.MailDirection;
import com.social.servicesocial.model.MailRecord;
import com.social.servicesocial.model.MailStatus;
import com.social.servicesocial.model.SocialModule;
import com.social.servicesocial.model.UserProfile;
import com.social.servicesocial.repository.CaseRecordRepository;
import com.social.servicesocial.repository.MailRecordRepository;
import com.social.servicesocial.repository.UserProfileRepository;
import java.time.LocalDate;
import java.util.EnumSet;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SeedDataConfig {

    private String moduleCode(SocialModule module) {
        return switch (module) {
            case MUTUELLE -> "MUT";
            case ASSISTANCE_SOCIALE -> "ASSI";
            case CULTURE_LOISIRS -> "CUL";
            case RETRAITES -> "RET";
            case DECES -> "DEC";
            case ASSURANCE_SOCIALE -> "ASSU";
            case BUREAU_ORDRE -> "BO";
        };
    }

    @Bean
    @ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true", matchIfMissing = true)
    CommandLineRunner initData(
            CaseRecordRepository caseRepo,
            MailRecordRepository mailRepo,
            UserProfileRepository userRepo,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (userRepo.count() == 0) {
                // ── ADMIN: full access ────────────────────────────────────────────
                UserProfile admin = new UserProfile();
                admin.setUsername("admin");
                admin.setMatricule("ADM-001");
                admin.setFullName("Administrateur Service Social");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setRole(AppRole.ADMIN);
                admin.setAllowedModules(EnumSet.allOf(SocialModule.class));
                admin.setActive(true);
                userRepo.save(admin);

                // ── MANAGER: all modules including bureau d'ordre ──────────────
                UserProfile manager = new UserProfile();
                manager.setUsername("manager");
                manager.setMatricule("MNG-001");
                manager.setFullName("Responsable Service Social");
                manager.setPasswordHash(passwordEncoder.encode("manager123"));
                manager.setRole(AppRole.MANAGER);
                manager.setAllowedModules(EnumSet.allOf(SocialModule.class));
                manager.setActive(true);
                userRepo.save(manager);

                // ── AGENT — Bureau d'Ordre ────────────────────────────────────────
                UserProfile agentBureau = new UserProfile();
                agentBureau.setUsername("agent.bureau");
                agentBureau.setMatricule("AGT-BO-001");
                agentBureau.setFullName("Agent Bureau d'Ordre");
                agentBureau.setPasswordHash(passwordEncoder.encode("agent123"));
                agentBureau.setRole(AppRole.AGENT);
                agentBureau.setAllowedModules(EnumSet.of(SocialModule.BUREAU_ORDRE));
                agentBureau.setActive(true);
                userRepo.save(agentBureau);

                // ── AGENT — Mutuelle ───────────────────────────────────────────────
                UserProfile agentMutuelle = new UserProfile();
                agentMutuelle.setUsername("agent.mutuelle");
                agentMutuelle.setMatricule("AGT-MUT-001");
                agentMutuelle.setFullName("Agent Section Mutuelle");
                agentMutuelle.setPasswordHash(passwordEncoder.encode("agent123"));
                agentMutuelle.setRole(AppRole.AGENT);
                agentMutuelle.setAllowedModules(EnumSet.of(SocialModule.MUTUELLE));
                agentMutuelle.setActive(true);
                userRepo.save(agentMutuelle);

                // ── AGENT — Assurance Sociale ─────────────────────────────────────
                UserProfile agentAssurance = new UserProfile();
                agentAssurance.setUsername("agent.assurance");
                agentAssurance.setMatricule("AGT-ASU-001");
                agentAssurance.setFullName("Agent Assurance Sociale");
                agentAssurance.setPasswordHash(passwordEncoder.encode("agent123"));
                agentAssurance.setRole(AppRole.AGENT);
                agentAssurance.setAllowedModules(EnumSet.of(SocialModule.ASSURANCE_SOCIALE));
                agentAssurance.setActive(true);
                userRepo.save(agentAssurance);

                // ── AGENT — Assistance Sociale ────────────────────────────────────
                UserProfile agentAssistance = new UserProfile();
                agentAssistance.setUsername("agent.assistance");
                agentAssistance.setMatricule("AGT-ASS-001");
                agentAssistance.setFullName("Agent Assistance Sociale");
                agentAssistance.setPasswordHash(passwordEncoder.encode("agent123"));
                agentAssistance.setRole(AppRole.AGENT);
                agentAssistance.setAllowedModules(EnumSet.of(SocialModule.ASSISTANCE_SOCIALE));
                agentAssistance.setActive(true);
                userRepo.save(agentAssistance);

                // ── AGENT — Retraites ─────────────────────────────────────────────
                UserProfile agentRetraites = new UserProfile();
                agentRetraites.setUsername("agent.retraites");
                agentRetraites.setMatricule("AGT-RET-001");
                agentRetraites.setFullName("Agent Section Retraites");
                agentRetraites.setPasswordHash(passwordEncoder.encode("agent123"));
                agentRetraites.setRole(AppRole.AGENT);
                agentRetraites.setAllowedModules(EnumSet.of(SocialModule.RETRAITES));
                agentRetraites.setActive(true);
                userRepo.save(agentRetraites);

                // ── AGENT — Décès ─────────────────────────────────────────────────
                UserProfile agentDeces = new UserProfile();
                agentDeces.setUsername("agent.deces");
                agentDeces.setMatricule("AGT-DEC-001");
                agentDeces.setFullName("Agent Section Décès");
                agentDeces.setPasswordHash(passwordEncoder.encode("agent123"));
                agentDeces.setRole(AppRole.AGENT);
                agentDeces.setAllowedModules(EnumSet.of(SocialModule.DECES));
                agentDeces.setActive(true);
                userRepo.save(agentDeces);

                // ── AGENT — Culture & Loisirs ─────────────────────────────────────
                UserProfile agentCulture = new UserProfile();
                agentCulture.setUsername("agent.culture");
                agentCulture.setMatricule("AGT-CUL-001");
                agentCulture.setFullName("Agent Culture et Loisirs");
                agentCulture.setPasswordHash(passwordEncoder.encode("agent123"));
                agentCulture.setRole(AppRole.AGENT);
                agentCulture.setAllowedModules(EnumSet.of(SocialModule.CULTURE_LOISIRS));
                agentCulture.setActive(true);
                userRepo.save(agentCulture);
            }

            if (caseRepo.count() == 0) {
                for (SocialModule module : SocialModule.values()) {
                    CaseRecord record = new CaseRecord();
                    record.setReferenceCode("CAS-" + moduleCode(module) + "-001");
                    record.setModule(module);
                    record.setTitle("Dossier initial " + module.name());
                    record.setMemberName("Adherent Demonstration");
                    record.setPriority("NORMALE");
                    record.setStatus(CaseStatus.IN_PROGRESS);
                    record.setDueDate(LocalDate.now().plusDays(14));
                    record.setNotes("Dossier demo pour initialiser le module.");
                    caseRepo.save(record);
                }
            }

            if (mailRepo.count() == 0) {
                MailRecord incoming = new MailRecord();
                incoming.setMailNumber("BO-2026-001");
                incoming.setSubject("Demande urgente de prise en charge");
                incoming.setSenderName("Clinique Centrale");
                incoming.setReceiverSection("MUTUELLE");
                incoming.setDirection(MailDirection.INCOMING);
                incoming.setStatus(MailStatus.ASSIGNED);
                incoming.setUrgent(true);
                mailRepo.save(incoming);

                MailRecord outgoing = new MailRecord();
                outgoing.setMailNumber("BO-2026-002");
                outgoing.setSubject("Transmission dossier assistance sociale");
                outgoing.setSenderName("Service Social");
                outgoing.setReceiverSection("ASSISTANCE_SOCIALE");
                outgoing.setDirection(MailDirection.OUTGOING);
                outgoing.setStatus(MailStatus.IN_PROGRESS);
                outgoing.setUrgent(false);
                mailRepo.save(outgoing);
            }
        };
    }
}
