// net.planificateureventcampus/service/SalleService.java

package net.planificateureventcampus.service;

import net.planificateureventcampus.DTOs.SalleDTO;
import net.planificateureventcampus.entities.Salle;
import net.planificateureventcampus.mapper.SalleMapper;
import net.planificateureventcampus.repositories.SalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SalleService {

  @Autowired
  private SalleRepository salleRepository;

  @Autowired
  private SalleMapper salleMapper;

  public SalleDTO createSalle(SalleDTO dto) {
    if (salleRepository.findByNom(dto.getNom()).isPresent()) {
      throw new RuntimeException("Une salle avec ce nom existe déjà");
    }
    Salle salle = salleMapper.toEntity(dto);
    salle = salleRepository.save(salle);
    return salleMapper.toDto(salle);
  }

  public List<SalleDTO> getAllSalles() {
    return salleRepository.findAll().stream()
      .map(salleMapper::toDto)
      .collect(Collectors.toList());
  }

  public List<SalleDTO> getSallesDisponibles() {
    return salleRepository.findSallesDisponibles().stream()
      .map(salleMapper::toDto)
      .collect(Collectors.toList());
  }

  public SalleDTO getSalleById(Long id) {
    Salle salle = salleRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Salle non trouvée avec ID: " + id));
    return salleMapper.toDto(salle);
  }

  public SalleDTO updateSalle(Long id, SalleDTO dto) {
    Salle salle = salleRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Salle non trouvée"));

    salleMapper.updateEntity(salle, dto);
    salle = salleRepository.save(salle);
    return salleMapper.toDto(salle);
  }

  public void deleteSalle(Long id) {
    Salle salle = salleRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Salle non trouvée"));

    if (salle.getEvenements() != null && !salle.getEvenements().isEmpty()) {
      throw new RuntimeException("Impossible de supprimer une salle qui a des événements");
    }
    salleRepository.deleteById(id);
  }

  public SalleDTO activerSalle(Long id) {
    Salle salle = salleRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Salle non trouvée"));
    salle.setDisponible(true);
    return salleMapper.toDto(salleRepository.save(salle));
  }

  public SalleDTO desactiverSalle(Long id) {
    Salle salle = salleRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Salle non trouvée"));
    salle.setDisponible(false);
    return salleMapper.toDto(salleRepository.save(salle));
  }
}
