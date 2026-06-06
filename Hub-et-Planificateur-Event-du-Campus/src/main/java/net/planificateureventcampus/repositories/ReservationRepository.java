package net.planificateureventcampus.repositories;

import net.planificateureventcampus.entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

  // ============================================
  // VÉRIFICATION DES CONFLITS
  // ============================================

  // Vérifier les conflits de réservation pour une salle
  @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.salleId = :salleId " +
    "AND r.statut != 'annulee' " +
    "AND r.statut != 'terminee' " +
    "AND ((r.dateDebut <= :dateFin AND r.dateFin >= :dateDebut))")
  boolean existsConflitReservation(@Param("salleId") Long salleId,
                                   @Param("dateDebut") LocalDateTime dateDebut,
                                   @Param("dateFin") LocalDateTime dateFin);

  // Vérifier les conflits en excluant un ID (pour modification)
  @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.salleId = :salleId " +
    "AND r.id != :excludedId " +
    "AND r.statut != 'annulee' " +
    "AND r.statut != 'terminee' " +
    "AND ((r.dateDebut <= :dateFin AND r.dateFin >= :dateDebut))")
  boolean existsConflitReservationExcludingId(@Param("salleId") Long salleId,
                                              @Param("dateDebut") LocalDateTime dateDebut,
                                              @Param("dateFin") LocalDateTime dateFin,
                                              @Param("excludedId") Long excludedId);

  // ============================================
  // RECHERCHE PAR RELATION
  // ============================================

  // Trouver une réservation par ID d'événement
  @Query("SELECT r FROM Reservation r WHERE r.evenementId = :evenementId")
  Optional<Reservation> findByEvenementId(@Param("evenementId") Long evenementId);

  // Trouver les réservations par salle
  List<Reservation> findBySalleId(Long salleId);

  // Trouver les réservations par organisateur
  List<Reservation> findByOrganisateurId(Long organisateurId);

  // Trouver les réservations par statut
  List<Reservation> findByStatut(String statut);

  // ============================================
  // RECHERCHE PAR DATE
  // ============================================

  // Trouver les réservations à venir (non annulées)
  @Query("SELECT r FROM Reservation r WHERE r.dateDebut > :date AND r.statut != :statut")
  List<Reservation> findByDateDebutAfterAndStatutNot(@Param("date") LocalDateTime date,
                                                     @Param("statut") String statut);

  // Trouver les réservations par période
  List<Reservation> findByDateDebutBetween(LocalDateTime debut, LocalDateTime fin);

  // Trouver les réservations par date de début
  List<Reservation> findByDateDebutAfter(LocalDateTime date);

  // Trouver les réservations par date de fin
  List<Reservation> findByDateFinBefore(LocalDateTime date);

  // ============================================
  // RECHERCHE COMBINÉE
  // ============================================

  // Trouver les réservations par salle et statut
  List<Reservation> findBySalleIdAndStatut(Long salleId, String statut);

  // Trouver les réservations par organisateur et statut
  List<Reservation> findByOrganisateurIdAndStatut(Long organisateurId, String statut);

  // Trouver les réservations par salle et période
  @Query("SELECT r FROM Reservation r WHERE r.salleId = :salleId " +
    "AND ((r.dateDebut <= :dateFin AND r.dateFin >= :dateDebut))")
  List<Reservation> findConflitsBySalleAndPeriod(@Param("salleId") Long salleId,
                                                 @Param("dateDebut") LocalDateTime dateDebut,
                                                 @Param("dateFin") LocalDateTime dateFin);

  // ============================================
  // COMPTAGES
  // ============================================

  // Compter les réservations par statut
  long countByStatut(String statut);

  // Compter les réservations par salle
  long countBySalleId(Long salleId);
}
