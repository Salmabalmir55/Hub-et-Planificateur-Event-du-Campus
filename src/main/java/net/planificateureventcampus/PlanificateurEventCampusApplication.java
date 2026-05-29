package net.planificateureventcampus;

import net.planificateureventcampus.entities.Etudiant;
import net.planificateureventcampus.entities.Organisateur;
import net.planificateureventcampus.entities.Categorie;
import net.planificateureventcampus.entities.Evenement;
import net.planificateureventcampus.entities.Salle;
import net.planificateureventcampus.enums.Role;
import net.planificateureventcampus.enums.StatutEvenement;
import net.planificateureventcampus.repositories.UtilisateurRepository;
import net.planificateureventcampus.repositories.CategorieRepository;
import net.planificateureventcampus.repositories.EvenementRepository;
import net.planificateureventcampus.repositories.SalleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@SpringBootApplication
public class PlanificateurEventCampusApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlanificateurEventCampusApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(UtilisateurRepository utilisateurRepository,
                                      CategorieRepository categorieRepository,
                                      EvenementRepository evenementRepository,
                                      SalleRepository salleRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Créer un ADMIN
            if (!utilisateurRepository.existsByEmail("admin@campus.com")) {
                Organisateur admin = new Organisateur();
                admin.setNom("Admin");
                admin.setPrenom("Super");
                admin.setEmail("admin@campus.com");
                admin.setMotDePasse(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ROLE_ADMIN);
                admin.setDepartement("Administration");
                admin.setActif(true);
                admin.setEstVerifie(true);
                admin.setDateInscription(LocalDateTime.now());
                utilisateurRepository.save(admin);
                System.out.println("Admin créé: admin@campus.com / admin123");
            }

            // 2. Créer un ORGANISATEUR
            if (!utilisateurRepository.existsByEmail("organisateur@campus.com")) {
                Organisateur organisateur = new Organisateur();
                organisateur.setNom("Martin");
                organisateur.setPrenom("Sophie");
                organisateur.setEmail("organisateur@campus.com");
                organisateur.setMotDePasse(passwordEncoder.encode("org123"));
                organisateur.setRole(Role.ROLE_ORGANISATEUR);
                organisateur.setDepartement("Club Sportif");
                organisateur.setTelephone("0612345678");
                organisateur.setActif(true);
                organisateur.setEstVerifie(true);
                organisateur.setDateInscription(LocalDateTime.now());
                utilisateurRepository.save(organisateur);
                System.out.println("Organisateur créé: organisateur@campus.com / org123");
            }

            // 3. Créer un ÉTUDIANT
            if (!utilisateurRepository.existsByEmail("etudiant@campus.com")) {
                Etudiant etudiant = new Etudiant();
                etudiant.setNom("Dupont");
                etudiant.setPrenom("Jean");
                etudiant.setEmail("etudiant@campus.com");
                etudiant.setMotDePasse(passwordEncoder.encode("etu123"));
                etudiant.setRole(Role.ROLE_ETUDIANT);
                etudiant.setMatricule("20240001");
                etudiant.setFiliere("Informatique");
                etudiant.setNiveau(3);
                etudiant.setTelephone("0687654321");
                etudiant.setActif(true);
                etudiant.setDateInscription(LocalDateTime.now());
                utilisateurRepository.save(etudiant);
                System.out.println("Étudiant créé: etudiant@campus.com / etu123");
            }

            // 4. Créer des CATÉGORIES
            if (categorieRepository.count() == 0) {
                Categorie cat1 = new Categorie();
                cat1.setNom("Conférence");
                cat1.setDescription("Conférences et séminaires");
                cat1.setCouleur("#FF5733");
                cat1.setActive(true);
                categorieRepository.save(cat1);

                Categorie cat2 = new Categorie();
                cat2.setNom("Sport");
                cat2.setDescription("Événements sportifs");
                cat2.setCouleur("#33FF57");
                cat2.setActive(true);
                categorieRepository.save(cat2);

                Categorie cat3 = new Categorie();
                cat3.setNom("Culture");
                cat3.setDescription("Concerts, expositions, théâtre");
                cat3.setCouleur("#3357FF");
                cat3.setActive(true);
                categorieRepository.save(cat3);

                System.out.println("3 catégories créées");
            }

            // 5. Créer des SALLES
            if (salleRepository.count() == 0) {
                Salle salle1 = new Salle();
                salle1.setNom("Amphithéâtre A");
                salle1.setCapacite(200);
                salle1.setEquipements("Vidéoprojecteur, Tableau, Sono");
                salle1.setLocalisation("Bâtiment Principal - RDC");
                salle1.setDisponible(true);
                salleRepository.save(salle1);

                Salle salle2 = new Salle();
                salle2.setNom("Salle B101");
                salle2.setCapacite(50);
                salle2.setEquipements("Vidéoprojecteur, Ordinateurs");
                salle2.setLocalisation("Bâtiment B - 1er étage");
                salle2.setDisponible(true);
                salleRepository.save(salle2);

                System.out.println("2 salles créées");
            }

            // 6. Créer des ÉVÉNEMENTS (avec organisateur_id)
            if (evenementRepository.count() == 0) {
                // Récupérer l'organisateur existant
                Organisateur organisateur = (Organisateur) utilisateurRepository.findByEmail("organisateur@campus.com")
                        .orElseThrow(() -> new RuntimeException("Organisateur non trouvé"));

                // Récupérer les catégories
                Categorie catConf = categorieRepository.findByNom("Conférence").orElse(null);
                Categorie catSport = categorieRepository.findByNom("Sport").orElse(null);

                // Récupérer les salles
                Salle salleAmphi = salleRepository.findByNom("Amphithéâtre A").orElse(null);
                Salle salleStade = salleRepository.findByNom("Salle B101").orElse(null);

                Evenement event1 = new Evenement();
                event1.setTitre("Conférence Tech 2025");
                event1.setDescription("Grande conférence sur les nouvelles technologies");
                event1.setDateDebut(LocalDateTime.now().plusDays(10));
                event1.setDateFin(LocalDateTime.now().plusDays(10).plusHours(4));
                event1.setLieu("Amphithéâtre A");
                event1.setCapaciteMax(200);
                event1.setStatut(StatutEvenement.VALIDE);
                event1.setOrganisateur(organisateur);  // ← AJOUTER CETTE LIGNE
                event1.setCategorie(catConf);
                event1.setSalle(salleAmphi);
                event1.setImageUrl("https://example.com/tech.jpg");
                evenementRepository.save(event1);
                System.out.println("Événement 1 créé");

                Evenement event2 = new Evenement();
                event2.setTitre("Tournoi de Football");
                event2.setDescription("Tournoi inter-filières");
                event2.setDateDebut(LocalDateTime.now().plusDays(15));
                event2.setDateFin(LocalDateTime.now().plusDays(15).plusHours(3));
                event2.setLieu("Stade Universitaire");
                event2.setCapaciteMax(100);
                event2.setStatut(StatutEvenement.VALIDE);
                event2.setOrganisateur(organisateur);  // ← AJOUTER CETTE LIGNE
                event2.setCategorie(catSport);
                event2.setSalle(salleStade);
                evenementRepository.save(event2);
                System.out.println("Événement 2 créé");

                Evenement event3 = new Evenement();
                event3.setTitre("Concert de Bienvenue");
                event3.setDescription("Concert d'accueil des nouveaux étudiants");
                event3.setDateDebut(LocalDateTime.now().plusDays(5));
                event3.setDateFin(LocalDateTime.now().plusDays(5).plusHours(2));
                event3.setLieu("Espace Culturel");
                event3.setCapaciteMax(500);
                event3.setStatut(StatutEvenement.EN_ATTENTE);
                event3.setOrganisateur(organisateur);  // ← AJOUTER CETTE LIGNE
                evenementRepository.save(event3);
                System.out.println("Événement 3 créé");

                System.out.println("3 événements créés");
            }

        };
    }
}