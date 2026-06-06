package net.planificateureventcampus.repositories;

import net.planificateureventcampus.entities.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {

    Optional<Etudiant> findByMatricule(String matricule);

    // Recherche par filière
    List<Etudiant> findByFiliere(String filiere);

    // Recherche par niveau
    List<Etudiant> findByNiveau(Integer niveau);

    List<Etudiant> findByNomContainingIgnoreCaseAndPrenomContainingIgnoreCase(String nom, String prenom);

    @Query("SELECT e.filiere, COUNT(e) FROM Etudiant e GROUP BY e.filiere")
    List<Object[]> countEtudiantsByFiliere();

    @Query("SELECT e FROM Etudiant e WHERE e.id NOT IN (SELECT i.etudiant.id FROM Inscription i)")
    List<Etudiant> findEtudiantsSansInscription();

    @Query("SELECT e FROM Etudiant e JOIN e.inscriptions i WHERE i.evenement.id = :evenementId")
    List<Etudiant> findEtudiantsByEvenementId(@Param("evenementId") Long evenementId);
}
