package net.planificateureventcampus.repositories;

import net.planificateureventcampus.entities.Notification;
import net.planificateureventcampus.enums.TypeNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByDestinataireIdAndLuFalseOrderByDateEnvoiDesc(Long destinataireId);

    List<Notification> findByDestinataireIdOrderByDateEnvoiDesc(Long destinataireId);

    List<Notification> findByType(TypeNotification type);

    List<Notification> findByEvenementId(Long evenementId);

    long countByDestinataireIdAndLuFalse(Long destinataireId);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.lu = true, n.dateLecture = CURRENT_TIMESTAMP WHERE n.destinataire.id = :utilisateurId")
    void marquerToutesCommeLues(@Param("utilisateurId") Long utilisateurId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Notification n WHERE n.dateEnvoi < :date")
    void deleteOldNotifications(@Param("date") java.time.LocalDateTime date);
}
