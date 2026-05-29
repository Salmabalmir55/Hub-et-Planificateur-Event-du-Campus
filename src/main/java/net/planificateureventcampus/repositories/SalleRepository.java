package net.planificateureventcampus.repositories;

import net.planificateureventcampus.entities.Salle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalleRepository extends JpaRepository<Salle, Long> {


    Optional<Salle> findByNom(String nom);

    List<Salle> findByDisponibleTrue();

    List<Salle> findByCapaciteGreaterThanEqual(Integer capacite);

    @Query("SELECT s FROM Salle s WHERE s.disponible = true AND " +
            "(s.evenement IS NULL OR " +
            "(s.evenement.dateDebut > :dateFin OR s.evenement.dateFin < :dateDebut))")
    List<Salle> findSallesDisponiblesBetween(@Param("dateDebut") LocalDateTime dateDebut,
                                             @Param("dateFin") LocalDateTime dateFin);

    @Query("SELECT s FROM Salle s WHERE s.equipements LIKE %:equipement%")
    List<Salle> findByEquipementContaining(@Param("equipement") String equipement);
}
