package net.planificateureventcampus.mapper;

import net.planificateureventcampus.DTOs.UtilisateurDTO;
import net.planificateureventcampus.entities.Utilisateur;
import net.planificateureventcampus.entities.Etudiant;
import net.planificateureventcampus.entities.Organisateur;
import net.planificateureventcampus.entities.Administrateur;
import net.planificateureventcampus.enums.Role;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
@Mapper(componentModel = "spring", imports = {Role.class})
public abstract class UtilisateurMapper {

    @Autowired
    protected PasswordEncoder passwordEncoder;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "motDePasse", expression = "java(passwordEncoder.encode(dto.getMotDePasse()))")
    @Mapping(target = "actif", constant = "true")
    @Mapping(target = "dateInscription", ignore = true)
    @Mapping(target = "derniereConnexion", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    public abstract Utilisateur toEntity(UtilisateurDTO dto);

    @Mapping(target = "motDePasse", ignore = true)
    public abstract UtilisateurDTO toDto(Utilisateur utilisateur);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "motDePasse", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "actif", ignore = true)
    @Mapping(target = "dateInscription", ignore = true)
    @Mapping(target = "derniereConnexion", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    public abstract void updateEntity(@MappingTarget Utilisateur utilisateur, UtilisateurDTO dto);

    @AfterMapping
    protected void afterMapping(@MappingTarget UtilisateurDTO dto, Utilisateur utilisateur) {
        if (utilisateur instanceof Etudiant etudiant) {
            dto.setMatricule(etudiant.getMatricule());
            dto.setFiliere(etudiant.getFiliere());
            dto.setNiveau(etudiant.getNiveau());
        } else if (utilisateur instanceof Organisateur organisateur) {
            dto.setDepartement(organisateur.getDepartement());
            dto.setEstVerifie(organisateur.isEstVerifie());
        } else if (utilisateur instanceof Administrateur administrateur) {  // ← AJOUTER
            dto.setNiveauAcces(administrateur.getNiveauAcces());
        }
    }
}
