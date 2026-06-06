package net.planificateureventcampus.repositories;

import net.planificateureventcampus.entities.Evenement;
import net.planificateureventcampus.enums.StatutEvenement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EvenementRepository extends JpaRepository<Evenement, Long> {
    List<Evenement> findByOrganisateurIdAndStatut(Long organisateurId, StatutEvenement statut);
    List<Evenement> findByStatut(StatutEvenement statut);

    List<Evenement> findByOrganisateurId(Long organisateurId);

    List<Evenement> findByCategorieId(Long categorieId);

    List<Evenement> findByDateDebutAfterOrderByDateDebutAsc(LocalDateTime date);

    List<Evenement> findByDateFinBeforeOrderByDateFinDesc(LocalDateTime date);

    @Query("SELECT e FROM Evenement e WHERE e.dateDebut <= :now AND e.dateFin >= :now")
    List<Evenement> findEvenementsEnCours(@Param("now") LocalDateTime now);

    List<Evenement> findByTitreContainingIgnoreCase(String titre);

    List<Evenement> findByDateDebutBetween(LocalDateTime debut, LocalDateTime fin);

    @Query("SELECT e FROM Evenement e WHERE e.capaciteMax IS NOT NULL AND SIZE(e.inscriptions) >= e.capaciteMax")
    List<Evenement> findEvenementsComplets();

    @Query("SELECT e FROM Evenement e WHERE " +
            "(:titre IS NULL OR LOWER(e.titre) LIKE LOWER(CONCAT('%', :titre, '%'))) AND " +
            "(:statut IS NULL OR e.statut = :statut) AND " +
            "(:categorieId IS NULL OR e.categorie.id = :categorieId) AND " +
            "(:dateDebut IS NULL OR e.dateDebut >= :dateDebut) AND " +
            "(:dateFin IS NULL OR e.dateFin <= :dateFin)")
    List<Evenement> searchEvenements(@Param("titre") String titre,
                                     @Param("statut") StatutEvenement statut,
                                     @Param("categorieId") Long categorieId,
                                     @Param("dateDebut") LocalDateTime dateDebut,
                                     @Param("dateFin") LocalDateTime dateFin);

    @Query("SELECT e FROM Evenement e ORDER BY SIZE(e.inscriptions) DESC")
    List<Evenement> findTopEvenements();

    long countByStatut(StatutEvenement statut);
}
