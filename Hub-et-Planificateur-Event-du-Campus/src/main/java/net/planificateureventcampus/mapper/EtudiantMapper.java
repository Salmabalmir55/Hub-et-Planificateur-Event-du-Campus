package net.planificateureventcampus.mapper;

import net.planificateureventcampus.DTOs.UtilisateurDTO;
import net.planificateureventcampus.entities.Etudiant;
import net.planificateureventcampus.enums.Role;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

@Mapper(componentModel = "spring")
public abstract class EtudiantMapper {

    @Autowired
    protected PasswordEncoder passwordEncoder;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "motDePasse", expression = "java(passwordEncoder.encode(dto.getMotDePasse()))")
    @Mapping(target = "role", constant = "ROLE_ETUDIANT")
    @Mapping(target = "actif", constant = "true")
    @Mapping(target = "dateInscription", ignore = true)
    @Mapping(target = "derniereConnexion", ignore = true)
    @Mapping(target = "inscriptions", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    public abstract Etudiant toEntity(UtilisateurDTO dto);

    @Mapping(target = "motDePasse", ignore = true)
    @Mapping(target = "departement", ignore = true)
    @Mapping(target = "estVerifie", ignore = true)
    public abstract UtilisateurDTO toDto(Etudiant etudiant);
}
