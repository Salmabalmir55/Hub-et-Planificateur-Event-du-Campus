package net.planificateureventcampus.repositories;

import net.planificateureventcampus.entities.Organisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganisateurRepository extends JpaRepository<Organisateur, Long> {

    List<Organisateur> findByDepartement(String departement);

    List<Organisateur> findByEstVerifieTrue();

    List<Organisateur> findByEstVerifieFalse();

    Optional<Organisateur> findByTelephone(String telephone);
    Optional<Organisateur> findByEmail(String email);
    @Query("SELECT o.id, o.nom, COUNT(e) FROM Organisateur o LEFT JOIN o.evenementsOrganises e GROUP BY o.id, o.nom")
    List<Object[]> countEvenementsByOrganisateur();

    @Query("SELECT o FROM Organisateur o ORDER BY SIZE(o.evenementsOrganises) DESC")
    List<Organisateur> findTopOrganisateurs();
}
