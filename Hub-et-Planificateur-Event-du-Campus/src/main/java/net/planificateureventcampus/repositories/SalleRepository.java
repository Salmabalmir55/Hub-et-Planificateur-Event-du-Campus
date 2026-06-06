// net.planificateureventcampus/repositories/SalleRepository.java

package net.planificateureventcampus.repositories;

import net.planificateureventcampus.entities.Salle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalleRepository extends JpaRepository<Salle, Long> {

  Optional<Salle> findByNom(String nom);

  List<Salle> findByDisponibleTrue();

  List<Salle> findByCapaciteGreaterThanEqual(Integer capacite);

  @Query("SELECT s FROM Salle s WHERE s.disponible = true ORDER BY s.capacite DESC")
  List<Salle> findSallesDisponibles();

  @Query("SELECT s, COUNT(e) FROM Salle s LEFT JOIN s.evenements e GROUP BY s.id")
  List<Object[]> findSallesWithEventCount();
}
