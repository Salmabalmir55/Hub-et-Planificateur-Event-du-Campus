package net.planificateureventcampus.repositories;

import net.planificateureventcampus.entities.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategorieRepository extends JpaRepository<Categorie, Long> {

  Optional<Categorie> findByNom(String nom);

  List<Categorie> findByNomContainingIgnoreCase(String nom);

  List<Categorie> findByActiveTrue();

  List<Categorie> findByCouleur(String couleur);

  @Query("SELECT c.nom, COUNT(e) FROM Categorie c LEFT JOIN c.evenements e GROUP BY c.nom")
  List<Object[]> countEvenementsByCategorie();

  @Query("SELECT c FROM Categorie c ORDER BY SIZE(c.evenements) DESC")
  List<Categorie> findTopCategories();

  // ✅ AJOUTER CETTE MÉTHODE
  @Query("SELECT DISTINCT c FROM Categorie c LEFT JOIN FETCH c.evenements WHERE c.id = :id")
  Optional<Categorie> findByIdWithEvenements(@Param("id") Long id);
}
