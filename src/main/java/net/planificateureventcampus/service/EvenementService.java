package net.planificateureventcampus.service;

import net.planificateureventcampus.DTOs.EvenementDTO;
import net.planificateureventcampus.entities.Evenement;
import net.planificateureventcampus.enums.StatutEvenement;
import net.planificateureventcampus.mapper.EvenementMapper;
import net.planificateureventcampus.repositories.EvenementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EvenementService {

    @Autowired
    private EvenementRepository evenementRepository;

    @Autowired
    private EvenementMapper evenementMapper;

    public EvenementDTO createEvenement(EvenementDTO dto) {
        Evenement evenement = evenementMapper.toEntity(dto);
        evenement = evenementRepository.save(evenement);
        return evenementMapper.toDto(evenement);
    }

    public List<EvenementDTO> getAllEvenements() {
        return evenementRepository.findAll().stream()
                .map(evenementMapper::toDto)
                .collect(Collectors.toList());
    }

    public EvenementDTO getEvenementById(Long id) {
        Evenement evenement = evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));
        return evenementMapper.toDto(evenement);
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

    public EvenementDTO updateEvenement(Long id, EvenementDTO dto) {
        Evenement evenement = evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));
        evenementMapper.updateEntity(evenement, dto);
        evenement = evenementRepository.save(evenement);
        return evenementMapper.toDto(evenement);
    }

    public void deleteEvenement(Long id) {
        evenementRepository.deleteById(id);
    }
}