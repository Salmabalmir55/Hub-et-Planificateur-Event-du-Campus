package net.planificateureventcampus.web;

import net.planificateureventcampus.DTOs.ApiResponseDTO;
import net.planificateureventcampus.DTOs.ReservationDTO;
import net.planificateureventcampus.entities.Reservation;
import net.planificateureventcampus.mapper.ReservationMapper;
import net.planificateureventcampus.repositories.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

  @Autowired
  private ReservationRepository reservationRepository;

  @Autowired
  private ReservationMapper reservationMapper;

  // GET - Toutes les réservations (Organisateur et Admin)
  @GetMapping
  @PreAuthorize("hasRole('ORGANISATEUR') or hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<List<ReservationDTO>>> getAllReservations() {
    List<ReservationDTO> reservations = reservationRepository.findAll().stream()
      .map(reservationMapper::toDto)
      .collect(Collectors.toList());
    return ResponseEntity.ok(ApiResponseDTO.success(reservations));
  }

  // GET - Réservation par ID
  @GetMapping("/{id}")
  @PreAuthorize("hasRole('ORGANISATEUR') or hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<ReservationDTO>> getReservationById(@PathVariable Long id) {
    Reservation reservation = reservationRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
    return ResponseEntity.ok(ApiResponseDTO.success(reservationMapper.toDto(reservation)));
  }

  // GET - Réservations par organisateur
  @GetMapping("/organisateur/{organisateurId}")
  @PreAuthorize("hasRole('ORGANISATEUR') or hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<List<ReservationDTO>>> getReservationsByOrganisateur(@PathVariable Long organisateurId) {
    List<ReservationDTO> reservations = reservationRepository.findByOrganisateurId(organisateurId).stream()
      .map(reservationMapper::toDto)
      .collect(Collectors.toList());
    return ResponseEntity.ok(ApiResponseDTO.success(reservations));
  }

  // PATCH - Annuler une réservation
  @PatchMapping("/{id}/annuler")
  @PreAuthorize("hasRole('ORGANISATEUR') or hasRole('ADMIN')")
  public ResponseEntity<ApiResponseDTO<Void>> annulerReservation(@PathVariable Long id) {
    Reservation reservation = reservationRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
    reservation.setStatut("annulee");
    reservationRepository.save(reservation);
    return ResponseEntity.ok(ApiResponseDTO.success(null, "Réservation annulée"));
  }
}
