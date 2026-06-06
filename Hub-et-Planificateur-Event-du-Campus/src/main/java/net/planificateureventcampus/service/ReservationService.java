package net.planificateureventcampus.service;

import net.planificateureventcampus.DTOs.ReservationDTO;
import net.planificateureventcampus.entities.Reservation;
import net.planificateureventcampus.entities.Salle;
import net.planificateureventcampus.entities.Utilisateur;
import net.planificateureventcampus.mapper.ReservationMapper;
import net.planificateureventcampus.repositories.ReservationRepository;
import net.planificateureventcampus.repositories.SalleRepository;
import net.planificateureventcampus.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReservationService {

  @Autowired
  private ReservationRepository reservationRepository;

  @Autowired
  private SalleRepository salleRepository;

  @Autowired
  private UtilisateurRepository utilisateurRepository;

  @Autowired
  private ReservationMapper reservationMapper;

  // ============================================
  // RÉCUPÉRER TOUTES LES RÉSERVATIONS
  // ============================================
  public List<ReservationDTO> getAllReservations() {
    return reservationRepository.findAll().stream()
      .map(this::convertToDTO)
      .collect(Collectors.toList());
  }

  // ============================================
  // RÉCUPÉRER UNE RÉSERVATION PAR ID
  // ============================================
  public ReservationDTO getReservationById(Long id) {
    Reservation reservation = reservationRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec ID: " + id));
    return convertToDTO(reservation);
  }

  // ============================================
  // RÉCUPÉRER LES RÉSERVATIONS PAR SALLE
  // ============================================
  public List<ReservationDTO> getReservationsBySalleId(Long salleId) {
    return reservationRepository.findBySalleId(salleId).stream()
      .map(this::convertToDTO)
      .collect(Collectors.toList());
  }

  // ============================================
  // RÉCUPÉRER LES RÉSERVATIONS PAR ORGANISATEUR
  // ============================================
  public List<ReservationDTO> getReservationsByOrganisateurId(Long organisateurId) {
    return reservationRepository.findByOrganisateurId(organisateurId).stream()
      .map(this::convertToDTO)
      .collect(Collectors.toList());
  }

  // ============================================
  // RÉCUPÉRER LES RÉSERVATIONS DE L'ORGANISATEUR CONNECTÉ
  // ============================================
  public List<ReservationDTO> getMesReservations() {
    UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    String email = userDetails.getUsername();
    Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
      .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

    return reservationRepository.findByOrganisateurId(utilisateur.getId()).stream()
      .map(this::convertToDTO)
      .collect(Collectors.toList());
  }

  // ============================================
  // RÉCUPÉRER LES RÉSERVATIONS PAR STATUT
  // ============================================
  public List<ReservationDTO> getReservationsByStatut(String statut) {
    return reservationRepository.findByStatut(statut).stream()
      .map(this::convertToDTO)
      .collect(Collectors.toList());
  }

  // ============================================
  // CRÉER UNE RÉSERVATION
  // ============================================
  public ReservationDTO createReservation(ReservationDTO dto) {
    // Vérifier si la salle existe
    Salle salle = salleRepository.findById(dto.getSalleId())
      .orElseThrow(() -> new RuntimeException("Salle non trouvée"));

    // Vérifier si la salle est disponible
    if (!salle.isDisponible()) {
      throw new RuntimeException("La salle n'est pas disponible");
    }

    // Vérifier les conflits de réservation
    boolean conflit = reservationRepository.existsConflitReservation(
      dto.getSalleId(), dto.getDateDebut(), dto.getDateFin());

    if (conflit) {
      throw new RuntimeException("La salle est déjà réservée sur ce créneau");
    }

    // Récupérer l'organisateur connecté
    UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    String email = userDetails.getUsername();
    Utilisateur organisateur = utilisateurRepository.findByEmail(email)
      .orElseThrow(() -> new RuntimeException("Organisateur non trouvé"));

    Reservation reservation = new Reservation();
    reservation.setTitre(dto.getTitre());
    reservation.setDescription(dto.getDescription());
    reservation.setSalleId(dto.getSalleId());
    reservation.setEvenementId(dto.getEvenementId());
    reservation.setDateDebut(dto.getDateDebut());
    reservation.setDateFin(dto.getDateFin());
    reservation.setStatut("en_attente");
    reservation.setOrganisateurId(organisateur.getId());
    reservation.setNombreParticipants(dto.getNombreParticipants());
    reservation.setNotes(dto.getNotes());

    // Convertir les équipements en String
    if (dto.getEquipements() != null && dto.getEquipements().length > 0) {
      reservation.setEquipements(String.join(",", dto.getEquipements()));
    }

    reservation = reservationRepository.save(reservation);
    return convertToDTO(reservation);
  }

  // ============================================
  // MODIFIER UNE RÉSERVATION
  // ============================================
  public ReservationDTO updateReservation(Long id, ReservationDTO dto) {
    Reservation reservation = reservationRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

    // Vérifier les conflits (sauf pour cette réservation)
    boolean conflit = reservationRepository.existsConflitReservationExcludingId(
      dto.getSalleId(), dto.getDateDebut(), dto.getDateFin(), id);

    if (conflit) {
      throw new RuntimeException("La salle est déjà réservée sur ce créneau");
    }

    reservation.setTitre(dto.getTitre());
    reservation.setDescription(dto.getDescription());
    reservation.setSalleId(dto.getSalleId());
    reservation.setDateDebut(dto.getDateDebut());
    reservation.setDateFin(dto.getDateFin());
    reservation.setNombreParticipants(dto.getNombreParticipants());
    reservation.setNotes(dto.getNotes());

    if (dto.getEquipements() != null && dto.getEquipements().length > 0) {
      reservation.setEquipements(String.join(",", dto.getEquipements()));
    }

    reservation = reservationRepository.save(reservation);
    return convertToDTO(reservation);
  }

  // ============================================
  // ANNULER UNE RÉSERVATION
  // ============================================
  public ReservationDTO annulerReservation(Long id) {
    Reservation reservation = reservationRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

    reservation.setStatut("annulee");
    reservation = reservationRepository.save(reservation);
    return convertToDTO(reservation);
  }

  // ============================================
  // CONFIRMER UNE RÉSERVATION (ADMIN)
  // ============================================
  public ReservationDTO confirmerReservation(Long id) {
    Reservation reservation = reservationRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

    reservation.setStatut("confirmee");
    reservation = reservationRepository.save(reservation);
    return convertToDTO(reservation);
  }

  // ============================================
  // TERMINER UNE RÉSERVATION
  // ============================================
  public ReservationDTO terminerReservation(Long id) {
    Reservation reservation = reservationRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

    reservation.setStatut("terminee");
    reservation = reservationRepository.save(reservation);
    return convertToDTO(reservation);
  }

  // ============================================
  // SUPPRIMER UNE RÉSERVATION
  // ============================================
  public void deleteReservation(Long id) {
    if (!reservationRepository.existsById(id)) {
      throw new RuntimeException("Réservation non trouvée");
    }
    reservationRepository.deleteById(id);
  }

  // ============================================
  // VÉRIFIER LA DISPONIBILITÉ D'UNE SALLE
  // ============================================
  public boolean isSalleDisponible(Long salleId, LocalDateTime dateDebut, LocalDateTime dateFin) {
    return !reservationRepository.existsConflitReservation(salleId, dateDebut, dateFin);
  }

  // ============================================
  // RÉCUPÉRER LES RÉSERVATIONS À VENIR
  // ============================================
  public List<ReservationDTO> getReservationsAVenir() {
    return reservationRepository.findByDateDebutAfterAndStatutNot(LocalDateTime.now(), "annulee").stream()
      .map(this::convertToDTO)
      .collect(Collectors.toList());
  }

  // ============================================
  // CONVERSION ENTITÉ → DTO
  // ============================================
  private ReservationDTO convertToDTO(Reservation reservation) {
    ReservationDTO dto = new ReservationDTO();
    dto.setId(reservation.getId());
    dto.setTitre(reservation.getTitre());
    dto.setDescription(reservation.getDescription());
    dto.setSalleId(reservation.getSalleId());
    dto.setEvenementId(reservation.getEvenementId());
    dto.setDateDebut(reservation.getDateDebut());
    dto.setDateFin(reservation.getDateFin());
    dto.setStatut(reservation.getStatut());
    dto.setOrganisateurId(reservation.getOrganisateurId());
    dto.setNombreParticipants(reservation.getNombreParticipants());
    dto.setNotes(reservation.getNotes());
    dto.setDateCreation(reservation.getDateCreation());

    // Récupérer le nom de la salle
    try {
      Salle salle = salleRepository.findById(reservation.getSalleId()).orElse(null);
      dto.setSalleNom(salle != null ? salle.getNom() : "Salle inconnue");
    } catch (Exception e) {
      dto.setSalleNom("Salle inconnue");
    }

    // Récupérer le nom de l'organisateur
    try {
      Utilisateur organisateur = utilisateurRepository.findById(reservation.getOrganisateurId()).orElse(null);
      if (organisateur != null) {
        dto.setOrganisateurNom(organisateur.getPrenom() + " " + organisateur.getNom());
      } else {
        dto.setOrganisateurNom("Organisateur inconnu");
      }
    } catch (Exception e) {
      dto.setOrganisateurNom("Organisateur inconnu");
    }

    // Convertir les équipements (String → String[])
    if (reservation.getEquipements() != null && !reservation.getEquipements().isEmpty()) {
      dto.setEquipements(reservation.getEquipements().split(","));
    }

    return dto;
  }
}
