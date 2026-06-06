package net.planificateureventcampus.service;

import net.planificateureventcampus.DTOs.RessourceDTO;
import net.planificateureventcampus.entities.Ressource;
import net.planificateureventcampus.entities.Utilisateur;
import net.planificateureventcampus.mapper.RessourceMapper;
import net.planificateureventcampus.repositories.RessourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RessourceService {

    @Autowired
    private RessourceRepository ressourceRepository;

    @Autowired
    private RessourceMapper ressourceMapper;

    public RessourceDTO createRessource(RessourceDTO dto) {
        Ressource ressource = ressourceMapper.toEntity(dto);
        ressource = ressourceRepository.save(ressource);
        return ressourceMapper.toDto(ressource);
    }

    public List<RessourceDTO> getAllRessources() {
        return ressourceRepository.findAll().stream()
                .map(ressourceMapper::toDto)
                .collect(Collectors.toList());
    }

    public RessourceDTO getRessourceById(Long id) {
        Ressource ressource = ressourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ressource non trouvée avec ID: " + id));
        return ressourceMapper.toDto(ressource);
    }

    public List<RessourceDTO> getRessourcesDisponibles() {
        return ressourceRepository.findRessourcesDisponibles().stream()
                .map(ressourceMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<RessourceDTO> getRessourcesByType(String type) {
        return ressourceRepository.findByType(type).stream()
                .map(ressourceMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<RessourceDTO> getRessourcesByEvenement(Long evenementId) {
        return ressourceRepository.findByEvenementId(evenementId).stream()
                .map(ressourceMapper::toDto)
                .collect(Collectors.toList());
    }

    public void reserverRessource(Long id, int quantite) {
        Ressource ressource = ressourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ressource non trouvée"));
        ressource.reserver(quantite);
        ressourceRepository.save(ressource);
    }

    public void libererRessource(Long id) {
        Ressource ressource = ressourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ressource non trouvée"));
        ressource.liberer();
        ressourceRepository.save(ressource);
    }

    public RessourceDTO updateRessource(Long id, RessourceDTO dto) {
        Ressource ressource = ressourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ressource non trouvée"));

        ressourceMapper.updateEntity(ressource, dto);
        ressource = ressourceRepository.save(ressource);
        return ressourceMapper.toDto(ressource);
    }

    public void deleteRessource(Long id) {
        if (!ressourceRepository.existsById(id)) {
            throw new RuntimeException("Ressource non trouvée");
        }
        ressourceRepository.deleteById(id);
    }
}
