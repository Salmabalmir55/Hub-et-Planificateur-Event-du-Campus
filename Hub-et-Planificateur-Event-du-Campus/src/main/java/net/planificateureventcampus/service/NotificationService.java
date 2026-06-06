package net.planificateureventcampus.service;

import net.planificateureventcampus.DTOs.NotificationDTO;
import net.planificateureventcampus.entities.Notification;
import net.planificateureventcampus.mapper.NotificationMapper;
import net.planificateureventcampus.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@SuppressWarnings("null")
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationMapper notificationMapper;

    public NotificationDTO createNotification(NotificationDTO dto) {
        Notification notification = notificationMapper.toEntity(dto);
        notification = notificationRepository.save(notification);
        return notificationMapper.toDto(notification);
    }

    public List<NotificationDTO> getAllNotifications() {
        return notificationRepository.findAll().stream()
                .map(notificationMapper::toDto)
                .collect(Collectors.toList());
    }

    public NotificationDTO getNotificationById(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée avec ID: " + id));
        return notificationMapper.toDto(notification);
    }

    public List<NotificationDTO> getNotificationsByUser(Long userId) {
        return notificationRepository.findByDestinataireIdOrderByDateEnvoiDesc(userId).stream()
                .map(notificationMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        return notificationRepository.findByDestinataireIdAndLuFalseOrderByDateEnvoiDesc(userId).stream()
                .map(notificationMapper::toDto)
                .collect(Collectors.toList());
    }

    public NotificationDTO marquerCommeLue(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));
        notification.marquerCommeLu();
        notification = notificationRepository.save(notification);
        return notificationMapper.toDto(notification);
    }

    public void marquerToutesCommeLues(Long userId) {
        notificationRepository.marquerToutesCommeLues(userId);
    }

    public long countUnreadNotifications(Long userId) {
        return notificationRepository.countByDestinataireIdAndLuFalse(userId);
    }

    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new RuntimeException("Notification non trouvée");
        }
        notificationRepository.deleteById(id);
    }
}
