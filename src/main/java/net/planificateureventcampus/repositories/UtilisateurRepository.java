package net.planificateureventcampus.repositories;

import net.planificateureventcampus.entities.Utilisateur;
import net.planificateureventcampus.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Utilisateur> findByRole(Role role);

    List<Utilisateur> findByActifTrue();

    List<Utilisateur> findByActifFalse();

    List<Utilisateur> findByNomContainingIgnoreCase(String nom);

    List<Utilisateur> findByDerniereConnexionAfter(LocalDateTime date);

    long countByRole(Role role);

    @Query("SELECT u FROM Utilisateur u WHERE u.email LIKE %:domain%")
    List<Utilisateur> findUsersByEmailDomain(@Param("domain") String domain);

    @Query("UPDATE Utilisateur u SET u.derniereConnexion = :date WHERE u.id = :id")
    void updateLastLoginDate(@Param("id") Long id, @Param("date") LocalDateTime date);
}
