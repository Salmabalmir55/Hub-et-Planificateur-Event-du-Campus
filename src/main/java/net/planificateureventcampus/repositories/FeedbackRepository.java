package net.planificateureventcampus.repositories;

import net.planificateureventcampus.entities.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByEvenementId(Long evenementId);

    List<Feedback> findByUtilisateurId(Long utilisateurId);

    List<Feedback> findByApprouveTrue();

    List<Feedback> findByApprouveFalse();

    @Query("SELECT AVG(f.note) FROM Feedback f WHERE f.evenement.id = :evenementId AND f.approuve = true")
    Double findNoteMoyenneByEvenement(@Param("evenementId") Long evenementId);

    @Query("SELECT f FROM Feedback f WHERE f.note >= 4 AND f.approuve = true ORDER BY f.note DESC")
    List<Feedback> findTopFeedbacks();

    @Query("SELECT f.note, COUNT(f) FROM Feedback f WHERE f.evenement.id = :evenementId AND f.approuve = true GROUP BY f.note")
    List<Object[]> findNoteDistribution(@Param("evenementId") Long evenementId);
}
