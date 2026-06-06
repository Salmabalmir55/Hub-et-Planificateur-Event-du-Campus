package net.planificateureventcampus.mapper;

import net.planificateureventcampus.DTOs.ReservationDTO;
import net.planificateureventcampus.entities.Reservation;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {

  public ReservationDTO toDto(Reservation entity) {
    if (entity == null) return null;

    ReservationDTO dto = new ReservationDTO();
    dto.setId(entity.getId());
    dto.setTitre(entity.getTitre());
    dto.setDescription(entity.getDescription());
    dto.setSalleId(entity.getSalleId());
    dto.setEvenementId(entity.getEvenementId());
    dto.setDateDebut(entity.getDateDebut());
    dto.setDateFin(entity.getDateFin());
    dto.setStatut(entity.getStatut());
    dto.setOrganisateurId(entity.getOrganisateurId());
    dto.setNombreParticipants(entity.getNombreParticipants());
    dto.setEquipements(entity.getEquipements() != null ? entity.getEquipements().split(",") : null);
    dto.setNotes(entity.getNotes());
    dto.setDateCreation(entity.getDateCreation());

    return dto;
  }

  public Reservation toEntity(ReservationDTO dto) {
    if (dto == null) return null;

    Reservation entity = new Reservation();
    entity.setId(dto.getId());
    entity.setTitre(dto.getTitre());
    entity.setDescription(dto.getDescription());
    entity.setSalleId(dto.getSalleId());
    entity.setEvenementId(dto.getEvenementId());
    entity.setDateDebut(dto.getDateDebut());
    entity.setDateFin(dto.getDateFin());
    entity.setStatut(dto.getStatut());
    entity.setOrganisateurId(dto.getOrganisateurId());
    entity.setNombreParticipants(dto.getNombreParticipants());
    if (dto.getEquipements() != null) {
      entity.setEquipements(String.join(",", dto.getEquipements()));
    }
    entity.setNotes(dto.getNotes());
    entity.setDateCreation(dto.getDateCreation());

    return entity;
  }
}
