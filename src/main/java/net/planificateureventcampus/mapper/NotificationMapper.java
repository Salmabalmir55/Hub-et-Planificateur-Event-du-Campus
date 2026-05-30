package net.planificateureventcampus.mapper;

import net.planificateureventcampus.DTOs.NotificationDTO;
import net.planificateureventcampus.entities.Notification;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "destinataire", ignore = true)
    @Mapping(target = "evenement", ignore = true)
    @Mapping(target = "dateEnvoi", ignore = true)
    @Mapping(target = "lu", constant = "false")
    @Mapping(target = "dateLecture", ignore = true)
    Notification toEntity(NotificationDTO dto);

    @Mapping(target = "destinataireId", source = "destinataire.id")
    @Mapping(target = "destinataireNom", expression = "java(notification.getDestinataire().getNom() + \" \" + notification.getDestinataire().getPrenom())")
    @Mapping(target = "destinataireEmail", source = "destinataire.email")
    @Mapping(target = "evenementId", source = "evenement.id")
    @Mapping(target = "evenementTitre", source = "evenement.titre")
    NotificationDTO toDto(Notification notification);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "destinataire", ignore = true)
    @Mapping(target = "evenement", ignore = true)
    @Mapping(target = "dateEnvoi", ignore = true)
    @Mapping(target = "type", ignore = true)
    @Mapping(target = "titre", ignore = true)
    @Mapping(target = "message", ignore = true)
    void updateEntity(@MappingTarget Notification notification, NotificationDTO dto);
}