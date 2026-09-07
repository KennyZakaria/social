-- Champs de traçabilité du workflow de validation Décès.
ALTER TABLE dossiers_deces ADD COLUMN IF NOT EXISTS date_soumission_validation TIMESTAMP;
ALTER TABLE dossiers_deces ADD COLUMN IF NOT EXISTS date_retour_complement TIMESTAMP;
ALTER TABLE dossiers_deces ADD COLUMN IF NOT EXISTS soumis_par VARCHAR(120);
ALTER TABLE dossiers_deces ADD COLUMN IF NOT EXISTS retourne_par VARCHAR(120);
-- L'ancien ENUM H2 ne contient pas REJETE ni ARCHIVE.
ALTER TABLE dossiers_deces ALTER COLUMN statut SET DATA TYPE VARCHAR(30);
