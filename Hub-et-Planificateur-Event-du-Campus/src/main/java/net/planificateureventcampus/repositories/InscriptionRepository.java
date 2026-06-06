package net.planificateureventcampus.repositories;

import net.planificateureventcampus.entities.Inscription;
import net.planificateureventcampus.enums.StatutInscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
  // Pour vérifier si un étudiant est inscrit
    boolean existsByEtudiantIdAndEvenementId(Long etudiantId, Long evenementId);
    List<Inscription> findByEtudiantId(Long etudiantId);

    List<Inscription> findByEvenementId(Long evenementId);

    List<Inscription> findByStatut(StatutInscription statut);

    Optional<Inscription> findByEtudiantIdAndEvenementId(Long etudiantId, Long evenementId);

    boolean existsByEtudiantIdAndEvenementIdAndStatutNot(Long etudiantId, Long evenementId, StatutInscription statut);

    Optional<Inscription> findByCodeQR(String codeQR);

    @Query("SELECT i FROM Inscription i WHERE i.evenement.id = :evenementId AND i.statut = 'CONFIRMEE'")
    List<Inscription> findInscriptionsConfirmeesByEvenement(@Param("evenementId") Long evenementId);

    List<Inscription> findByDateInscriptionAfter(LocalDateTime date);

    @Modifying
    @Transactional
    @Query("UPDATE Inscription i SET i.statut = 'ANNULEE', i.dateAnnulation = :date WHERE i.evenement.id = :evenementId AND i.statut = 'CONFIRMEE'")
    void annulerInscriptionsByEvenement(@Param("evenementId") Long evenementId, @Param("date") LocalDateTime date);

    @Query("SELECT i.evenement.id, COUNT(i) FROM Inscription i WHERE i.statut = 'CONFIRMEE' GROUP BY i.evenement.id")
    List<Object[]> countInscriptionsByEvenement();

    @Query("SELECT COUNT(i) FROM Inscription i WHERE i.evenement.id = :evenementId AND i.statut = 'PRESENTE'")
    long countPresencesByEvenement(@Param("evenementId") Long evenementId);
}
