package net.planificateureventcampus.service;

import net.planificateureventcampus.DTOs.EvenementDTO;
import net.planificateureventcampus.entities.Evenement;
import net.planificateureventcampus.entities.Organisateur;
import net.planificateureventcampus.entities.Reservation;
import net.planificateureventcampus.entities.Salle;
import net.planificateureventcampus.enums.StatutEvenement;
import net.planificateureventcampus.mapper.EvenementMapper;
import net.planificateureventcampus.repositories.EvenementRepository;
import net.planificateureventcampus.repositories.OrganisateurRepository;
import net.planificateureventcampus.repositories.ReservationRepository;
import net.planificateureventcampus.repositories.SalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class EvenementService {

  @Autowired
  private EvenementRepository evenementRepository;

  @Autowired
  private OrganisateurRepository organisateurRepository;

  @Autowired
  private EvenementMapper evenementMapper;

  @Autowired
  private ReservationRepository reservationRepository;

  @Autowired
  private SalleRepository salleRepository;

  // ============================================
  // CRÉER UN ÉVÉNEMENT AVEC RÉSERVATION DE SALLE
  // ============================================
  public EvenementDTO createEvenement(EvenementDTO dto) {
    Evenement evenement = evenementMapper.toEntity(dto);

    // Récupérer l'organisateur connecté
    UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    String email = userDetails.getUsername();
    Organisateur organisateur = organisateurRepository.findByEmail(email)
      .orElseThrow(() -> new RuntimeException("Organisateur non trouvé"));

    evenement.setOrganisateur(organisateur);
    evenement.setStatut(StatutEvenement.EN_ATTENTE);
    evenement.setDateCreation(LocalDateTime.now());
    evenement.setDateModification(LocalDateTime.now());

    // ✅ Gestion de la salle et vérification de disponibilité
    if (dto.getSalleId() != null) {
      Salle salle = salleRepository.findById(dto.getSalleId())
        .orElseThrow(() -> new RuntimeException("Salle non trouvée"));

      // Vérifier si la salle est disponible
      if (!salle.isDisponible()) {
        throw new RuntimeException("La salle n'est pas disponible actuellement");
      }

      // Vérifier si la salle est déjà réservée sur ce créneau
      boolean existeConflit = reservationRepository.existsConflitReservation(
        salle.getId(),
        dto.getDateDebut(),
        dto.getDateFin()
      );

      if (existeConflit) {
        throw new RuntimeException("La salle est déjà réservée sur ce créneau horaire");
      }

      evenement.setSalle(salle);
      if (dto.getLieu() == null || dto.getLieu().isBlank()) {
        evenement.setLieu(salle.getNom());
      }
    }

    evenement = evenementRepository.save(evenement);

    // ✅ Créer automatiquement la réservation
    if (evenement.getSalle() != null) {
      createReservationForEvenement(evenement);
    }

    return evenementMapper.toDto(evenement);
  }

  // ============================================
  // VALIDER UN ÉVÉNEMENT + CONFIRMER RÉSERVATION
  // ============================================
  public EvenementDTO validerEvenement(Long id) {
    Evenement evenement = evenementRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Événement non trouvé avec l'id: " + id));

    evenement.setStatut(StatutEvenement.VALIDE);
    evenement.setDateModification(LocalDateTime.now());
    evenement = evenementRepository.save(evenement);

    // ✅ Mettre à jour la réservation
    updateReservationStatut(id, "confirmee");

    return evenementMapper.toDto(evenement);
  }

  // ============================================
  // REFUSER UN ÉVÉNEMENT
  // ============================================
  public EvenementDTO refuserEvenement(Long id) {
    Evenement evenement = evenementRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Événement non trouvé avec l'id: " + id));

    evenement.setStatut(StatutEvenement.ANNULE);
    evenement.setDateModification(LocalDateTime.now());
    evenement = evenementRepository.save(evenement);

    // ✅ Annuler la réservation
    updateReservationStatut(id, "annulee");

    return evenementMapper.toDto(evenement);
  }

  // ============================================
  // ANNULER UN ÉVÉNEMENT
  // ============================================
  public EvenementDTO annulerEvenement(Long id) {
    Evenement evenement = evenementRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Événement non trouvé avec ID: " + id));

    evenement.setStatut(StatutEvenement.ANNULE);
    evenement.setDateModification(LocalDateTime.now());
    evenement = evenementRepository.save(evenement);

    // ✅ Annuler la réservation
    updateReservationStatut(id, "annulee");

    return evenementMapper.toDto(evenement);
  }

  // ============================================
  // MÉTHODES EXISTANTES (non modifiées)
  // ============================================

  public List<EvenementDTO> getAllEvenements() {
    return evenementRepository.findAll().stream()
      .map(evenementMapper::toDto)
      .collect(Collectors.toList());
  }

  public List<EvenementDTO> getEvenementsValides() {
    return evenementRepository.findByStatut(StatutEvenement.VALIDE).stream()
      .map(evenementMapper::toDto)
      .collect(Collectors.toList());
  }

  public List<EvenementDTO> getEvenementsEnAttente() {
    return evenementRepository.findByStatut(StatutEvenement.EN_ATTENTE).stream()
      .map(evenementMapper::toDto)
      .collect(Collectors.toList());
  }

  public List<EvenementDTO> getEvenementsByOrganisateur(Long organisateurId) {
    return evenementRepository.findByOrganisateurId(organisateurId).stream()
      .map(evenementMapper::toDto)
      .collect(Collectors.toList());
  }

  public List<EvenementDTO> getEvenementsByStatut(StatutEvenement statut) {
    return evenementRepository.findByStatut(statut).stream()
      .map(evenementMapper::toDto)
      .collect(Collectors.toList());
  }

  public List<EvenementDTO> getEvenementsAVenir() {
    return evenementRepository.findByDateDebutAfterOrderByDateDebutAsc(LocalDateTime.now()).stream()
      .map(evenementMapper::toDto)
      .collect(Collectors.toList());
  }

  public EvenementDTO getEvenementById(Long id) {
    Evenement evenement = evenementRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Événement non trouvé avec ID: " + id));
    return evenementMapper.toDto(evenement);
  }

  public EvenementDTO updateEvenement(Long id, EvenementDTO dto) {
    Evenement evenement = evenementRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Événement non trouvé avec ID: " + id));

    evenementMapper.updateEntity(evenement, dto);
    evenement.setDateModification(LocalDateTime.now());

    evenement = evenementRepository.save(evenement);
    return evenementMapper.toDto(evenement);
  }

  public void deleteEvenement(Long id) {
    if (!evenementRepository.existsById(id)) {
      throw new RuntimeException("Événement non trouvé avec ID: " + id);
    }
    // Supprimer la réservation associée
    reservationRepository.findByEvenementId(id).ifPresent(reservationRepository::delete);
    evenementRepository.deleteById(id);
  }

  public long countByStatut(StatutEvenement statut) {
    return evenementRepository.countByStatut(statut);
  }

  public List<EvenementDTO> searchEvenements(String titre, StatutEvenement statut, Long categorieId,
                                             LocalDateTime dateDebut, LocalDateTime dateFin) {
    return evenementRepository.searchEvenements(titre, statut, categorieId, dateDebut, dateFin).stream()
      .map(evenementMapper::toDto)
      .collect(Collectors.toList());
  }

  // ============================================
  // MÉTHODES DE GESTION DES RÉSERVATIONS
  // ============================================

  public boolean isSalleDisponible(Long salleId, LocalDateTime dateDebut, LocalDateTime dateFin) {
    return !reservationRepository.existsConflitReservation(salleId, dateDebut, dateFin);
  }

  public Optional<Reservation> getReservationByEvenementId(Long evenementId) {
    return reservationRepository.findByEvenementId(evenementId);
  }

  @Transactional
  public void createReservationForEvenement(Evenement evenement) {
    if (evenement.getSalle() != null) {
      Reservation reservation = new Reservation();
      reservation.setTitre(evenement.getTitre());
      reservation.setDescription(evenement.getDescription());
      reservation.setSalleId(evenement.getSalle().getId());
      reservation.setEvenementId(evenement.getId());
      reservation.setDateDebut(evenement.getDateDebut());
      reservation.setDateFin(evenement.getDateFin());
      reservation.setStatut("en_attente");
      reservation.setOrganisateurId(evenement.getOrganisateur().getId());
      reservation.setNombreParticipants(evenement.getCapaciteMax());

      reservationRepository.save(reservation);
    }
  }

  @Transactional
  public void updateReservationStatut(Long evenementId, String statut) {
    reservationRepository.findByEvenementId(evenementId).ifPresent(reservation -> {
      reservation.setStatut(statut);
      reservationRepository.save(reservation);
    });
  }
}
