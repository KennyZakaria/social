package com.social.servicesocial;

import com.social.servicesocial.model.Adherent;
import com.social.servicesocial.repository.AdherentRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

import java.net.URI;
import java.net.http.*;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
        "spring.datasource.url=jdbc:h2:mem:retraite_workflow;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop", "spring.jpa.show-sql=false",
        "logging.level.root=WARN", "logging.level.org.hibernate.SQL=WARN", "logging.level.org.springframework=WARN"
})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class RetraiteWorkflowIntegrationTests {
    @LocalServerPort int port;
    @Autowired ObjectMapper mapper;
    @Autowired AdherentRepository adherents;
    @Autowired JdbcTemplate jdbc;
    final HttpClient client = HttpClient.newHttpClient();
    String token;
    static final String PHOTO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aA1cAAAAASUVORK5CYII=";

    @BeforeAll void login() throws Exception {
        var response = send("POST", "/api/auth/login", mapper.readTree("{\"username\":\"admin\",\"password\":\"admin123\"}"));
        assertEquals(200, response.statusCode(), response.body());
        token = mapper.readTree(response.body()).path("token").asText();
    }

    ObjectNode dossier() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        var adherent = adherents.saveAndFlush(Adherent.builder().prenomAr("Prenom").nomAr("Nom")
                .categorie("Retraite").grade("Grade").matriculeBR("BR" + suffix).matricule("M" + suffix)
                .cin("C" + suffix).dateNaissance(LocalDate.of(1960, 1, 1)).lieuNaissance("Rabat")
                .dernierUnite("Unite").formationUnite("Formation").telephone1("0612345678")
                .adresse("Rabat").email("test@example.com").situationCategorie("Retraite").build());
        ObjectNode body = mapper.createObjectNode();
        body.put("adherentId", adherent.getId()).put("nom", "Nom").put("prenom", "Prenom")
                .put("matricule", adherent.getMatriculeBR()).put("cin", adherent.getCin())
                .put("telephoneGsm", "0612345678").put("statut", "EN_COURS")
                .put("proprietaire", false).put("locataire", false);
        return body;
    }

    HttpRequest request(String method, String path, JsonNode body) {
        var builder = HttpRequest.newBuilder(URI.create("http://localhost:" + port + path))
                .header("Content-Type", "application/json");
        if (token != null) builder.header("Authorization", "Bearer " + token);
        return builder.method(method, body == null ? HttpRequest.BodyPublishers.noBody()
                : HttpRequest.BodyPublishers.ofString(body.toString())).build();
    }
    HttpResponse<String> send(String method, String path, JsonNode body) throws Exception {
        return client.send(request(method, path, body), HttpResponse.BodyHandlers.ofString());
    }
    JsonNode expect(int status, String method, String path, JsonNode body) throws Exception {
        var response = send(method, path, body);
        assertEquals(status, response.statusCode(), response.body());
        return mapper.readTree(response.body());
    }
    int count(String table, long id) {
        return jdbc.queryForObject("select count(*) from " + table + " where dossier_retraite_id=?", Integer.class, id);
    }

    @Test void fullWorkflowPersistsEverySectionAndLocksClosedDossier() throws Exception {
        var body = dossier();
        body.put("photo", PHOTO).put("observationSociale", "Enquete complete").put("numeroDossier", "ADH-001");
        body.set("affiliations", mapper.readTree("[{\"typeCarte\":\"A.M.C.\",\"titulaire\":true,\"numeroCarte\":\"AMC-1\"}]"));
        body.set("famille", mapper.readTree("[{\"type\":\"Enfant\",\"lien\":\"Enfant\",\"nom\":\"Nom\",\"prenom\":\"Enfant\",\"dateNaissance\":\"2000-01-01\",\"personneACharge\":true}]"));
        body.set("donneesMedicoSociales", mapper.readTree("[{\"identification\":\"Adherent\",\"diagnostic\":\"Suivi\",\"duree\":\"1 an\"}]"));
        body.set("assistances", mapper.readTree("[{\"nature\":\"Aide\",\"organisme\":\"Fondation\",\"date\":\"2026-01-01\"}]"));
        body.set("ressources", mapper.readTree("[{\"designation\":\"Pension\",\"montant\":1234.50}]"));
        body.set("charges", mapper.readTree("[{\"designation\":\"Loyer\",\"montant\":400}]"));
        body.set("pieces", mapper.readTree("[{\"quantite\":2,\"type\":\"Copie CIN\",\"nom\":\"cin.pdf\",\"mime\":\"application/pdf\",\"contenu\":\"dGVzdA==\"}]"));
        var created = expect(201, "POST", "/api/retraites", body);
        long id = created.path("id").asLong();
        String path = "/api/retraites/" + id;
        var read = expect(200, "GET", path, null);
        assertEquals("EN_COURS", read.path("statut").asText());
        for (String field : List.of("photo", "observationSociale", "numeroDossier")) assertEquals(body.get(field), read.get(field));
        for (String table : List.of("retraite_affiliations", "retraite_membres_famille", "retraite_donnees_medico_sociales",
                "retraite_assistances", "retraite_ressources_mensuelles", "retraite_charges_mensuelles", "retraite_pieces")) assertEquals(1, count(table, id), table);
        assertEquals(PHOTO, jdbc.queryForObject("select photo from dossiers_retraites where id=?", String.class, id));
        assertEquals(2, read.path("pieces").get(0).path("quantite").asInt());
        assertEquals("Suivi", read.path("donneesMedicoSociales").get(0).path("diagnostic").asText());
        assertEquals(1234.50, read.path("ressources").get(0).path("montant").asDouble());
        body.put("observationSociale", "Modifiee");
        body.set("famille", mapper.createArrayNode());
        body.remove("photo"); // An older client must not erase an existing photo.
        expect(200, "PUT", path, body);
        read = expect(200, "GET", path, null);
        assertEquals("Modifiee", read.path("observationSociale").asText());
        assertEquals(PHOTO, read.path("photo").asText());
        assertEquals(0, count("retraite_membres_famille", id));
        assertEquals(1, count("retraite_assistances", id));
        assertEquals("CLOTURE", expect(200, "POST", path + "/close", null).path("statut").asText());
        assertEquals("CLOTURE", jdbc.queryForObject("select d.statut from dossiers d join dossiers_retraites r on r.dossier_id=d.id where r.id=?", String.class, id));
        assertEquals(3, count("retraite_historiques", id));
        expect(200, "POST", path + "/close", null);
        assertEquals(3, count("retraite_historiques", id));
        expect(409, "PUT", path, body);
        expect(409, "POST", "/api/retraites", body);
        assertEquals(3, expect(200, "GET", path + "/historique", null).size());
    }

    @Test void createsShortReferencePersistedInDatabaseAndHistory() throws Exception {
        var created = expect(201, "POST", "/api/retraites", dossier());
        long id = created.path("id").asLong();
        String reference = "RET-" + LocalDate.now().getYear() + "-" + String.format(Locale.ROOT, "%03d", id);
        assertEquals(reference, created.path("reference").asText());
        assertEquals(reference, expect(200, "GET", "/api/retraites/" + id, null).path("reference").asText());
        assertEquals(reference, jdbc.queryForObject(
                "select d.numero from dossiers d join dossiers_retraites r on r.dossier_id=d.id where r.id=?", String.class, id));
        assertEquals("Création du dossier " + reference, jdbc.queryForObject(
                "select detail from retraite_historiques where dossier_retraite_id=?", String.class, id));
    }

    @Test void rejectsDuplicateMatriculeIgnoringCaseForAnotherAdherent() throws Exception {
        var original = dossier();
        long id = expect(201, "POST", "/api/retraites", original).path("id").asLong();
        var duplicate = dossier();
        duplicate.put("matricule", original.path("matricule").asText().toLowerCase(Locale.ROOT));
        int before = jdbc.queryForObject("select count(*) from dossiers_retraites", Integer.class);
        expect(409, "POST", "/api/retraites", duplicate);
        assertEquals(before, jdbc.queryForObject("select count(*) from dossiers_retraites", Integer.class));
        assertEquals(original.path("matricule").asText(),
                expect(200, "GET", "/api/retraites/" + id, null).path("matricule").asText());
    }

    @Test void rejectsInvalidFieldsWithoutCreatingAnyDossier() throws Exception {
        var valid = dossier();
        int before = jdbc.queryForObject("select count(*) from dossiers_retraites", Integer.class);
        for (String field : List.of("nom", "prenom", "cin", "matricule", "telephoneGsm")) {
            var invalid = valid.deepCopy(); invalid.put(field, " ");
            expect(400, "POST", "/api/retraites", invalid);
        }
        for (String status : List.of("CLOTURE", "VALIDE", "A_VALIDER")) {
            var invalid = valid.deepCopy(); invalid.put("statut", status);
            expect(400, "POST", "/api/retraites", invalid);
        }
        Map<String, String> invalidRows = Map.of(
                "famille", "[{\"type\":\"Enfant\"}]",
                "donneesMedicoSociales", "[{\"identification\":\"Adherent\",\"diagnostic\":\"\"}]",
                "assistances", "[{\"nature\":\"Aide\",\"organisme\":\"Fondation\"}]",
                "ressources", "[{\"designation\":\"Pension\",\"montant\":-1}]",
                "charges", "[{\"designation\":\"Loyer\",\"montant\":1.234}]",
                "pieces", "[{\"type\":\"CIN\",\"quantite\":0}]");
        for (var entry : invalidRows.entrySet()) {
            var invalid = valid.deepCopy(); invalid.set(entry.getKey(), mapper.readTree(entry.getValue()));
            expect(400, "POST", "/api/retraites", invalid);
        }
        var invalid = valid.deepCopy(); invalid.put("proprietaire", true).put("locataire", true);
        expect(400, "POST", "/api/retraites", invalid);
        invalid = valid.deepCopy(); invalid.put("photo", "data:text/html;base64,dGVzdA==");
        expect(400, "POST", "/api/retraites", invalid);
        assertEquals(before, jdbc.queryForObject("select count(*) from dossiers_retraites", Integer.class));
    }

    @Test void adherentMustExistAndCannotBeReassigned() throws Exception {
        var body = dossier();
        var invalid = body.deepCopy(); invalid.remove("adherentId");
        expect(400, "POST", "/api/retraites", invalid);
        invalid.put("adherentId", Long.MAX_VALUE);
        expect(404, "POST", "/api/retraites", invalid);
        long id = expect(201, "POST", "/api/retraites", body).path("id").asLong();
        body.put("adherentId", dossier().path("adherentId").asLong());
        expect(409, "PUT", "/api/retraites/" + id, body);
        expect(404, "POST", "/api/retraites/9223372036854775807/close", null);
    }

    @Test void incompleteLegacyDossierMustBeCorrectedBeforeClosure() throws Exception {
        var body = dossier();
        long id = expect(201, "POST", "/api/retraites", body).path("id").asLong();
        jdbc.update("update dossiers_retraites set telephone_gsm='' where id=?", id);
        expect(400, "POST", "/api/retraites/" + id + "/close", null);
        assertEquals("EN_COURS", expect(200, "GET", "/api/retraites/" + id, null).path("statut").asText());
        assertEquals(1, count("retraite_historiques", id));
        expect(200, "PUT", "/api/retraites/" + id, body);
        expect(200, "POST", "/api/retraites/" + id + "/close", null);
    }

    @Test void concurrentCreationsProduceOnlyOneDossier() {
        var body = dossier();
        var first = client.sendAsync(request("POST", "/api/retraites", body), HttpResponse.BodyHandlers.ofString());
        var second = client.sendAsync(request("POST", "/api/retraites", body), HttpResponse.BodyHandlers.ofString());
        CompletableFuture.allOf(first, second).join();
        assertEquals(Set.of(201, 409), new HashSet<>(List.of(first.join().statusCode(), second.join().statusCode())));
        assertEquals(1, jdbc.queryForObject("select count(*) from dossiers_retraites where adherent_id=?", Integer.class, body.path("adherentId").asLong()));
    }

    @Test void anonymousRequestsCannotReadDossiers() throws Exception {
        var req = HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/api/retraites")).GET().build();
        assertTrue(Set.of(401, 403).contains(client.send(req, HttpResponse.BodyHandlers.ofString()).statusCode()));
    }
}
