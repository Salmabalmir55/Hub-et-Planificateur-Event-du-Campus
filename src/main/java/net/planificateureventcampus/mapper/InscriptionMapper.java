package net.planificateureventcampus.mapper;

import net.planificateureventcampus.DTOs.InscriptionDTO;
import net.planificateureventcampus.entities.Inscription;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface InscriptionMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "etudiant", ignore = true)
    @Mapping(target = "evenement", ignore = true)
    @Mapping(target = "statut", constant = "CONFIRMEE")
    @Mapping(target = "dateInscription", ignore = true)
    @Mapping(target = "dateAnnulation", ignore = true)
    @Mapping(target = "codeQR", ignore = true)
    Inscription toEntity(InscriptionDTO dto);

    @Mapping(target = "etudiantId", source = "etudiant.id")
    @Mapping(target = "etudiantNom", source = "etudiant.nom")
    @Mapping(target = "etudiantPrenom", source = "etudiant.prenom")
    @Mapping(target = "etudiantMatricule", source = "etudiant.matricule")
    @Mapping(target = "evenementId", source = "evenement.id")
    @Mapping(target = "evenementTitre", source = "evenement.titre")
    @Mapping(target = "evenementLieu", source = "evenement.lieu")
    @Mapping(target = "evenementDateDebut", source = "evenement.dateDebut")
    InscriptionDTO toDto(Inscription inscription);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "etudiant", ignore = true)
    @Mapping(target = "evenement", ignore = true)
    @Mapping(target = "dateInscription", ignore = true)
    @Mapping(target = "codeQR", ignore = true)
    void updateEntity(@MappingTarget Inscription inscription, InscriptionDTO dto);
}