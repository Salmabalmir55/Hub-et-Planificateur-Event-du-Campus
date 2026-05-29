package net.planificateureventcampus.repositories;

import net.planificateureventcampus.entities.Ressource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Repository
public interface RessourceRepository extends JpaRepository<Ressource, Long> {

    List<Ressource> findByType(String type);

    @Query("SELECT r FROM Ressource r WHERE r.quantiteDisponible > r.quantiteReservee")
    List<Ressource> findRessourcesDisponibles();

    List<Ressource> findByEvenementId(Long evenementId);

    @Modifying
    @Transactional
    @Query("UPDATE Ressource r SET r.quantiteReservee = 0 WHERE r.evenement.id = :evenementId")
    void libererRessourcesByEvenement(@Param("evenementId") Long evenementId);

    @Query("SELECT CASE WHEN (r.quantiteDisponible - r.quantiteReservee) >= :quantite THEN true ELSE false END " +
            "FROM Ressource r WHERE r.id = :ressourceId")
    boolean isDisponible(@Param("ressourceId") Long ressourceId, @Param("quantite") Integer quantite);
}
