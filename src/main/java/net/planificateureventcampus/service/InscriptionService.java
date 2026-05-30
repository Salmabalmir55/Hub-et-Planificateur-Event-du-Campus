package net.planificateureventcampus.service;

import net.planificateureventcampus.DTOs.InscriptionDTO;
import net.planificateureventcampus.entities.Evenement;
import net.planificateureventcampus.entities.Etudiant;
import net.planificateureventcampus.entities.Inscription;
import net.planificateureventcampus.enums.StatutInscription;
import net.planificateureventcampus.mapper.InscriptionMapper;
import net.planificateureventcampus.repositories.EvenementRepository;
import net.planificateureventcampus.repositories.InscriptionRepository;
import net.planificateureventcampus.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InscriptionService {

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @Autowired
    private EvenementRepository evenementRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private InscriptionMapper inscriptionMapper;

    public InscriptionDTO createInscription(Long etudiantId, Long evenementId) {
        Etudiant etudiant = (Etudiant) utilisateurRepository.findById(etudiantId)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));

        Evenement evenement = evenementRepository.findById(evenementId)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));

        if (inscriptionRepository.existsByEtudiantIdAndEvenementIdAndStatutNot(
                etudiantId, evenementId, StatutInscription.ANNULEE)) {
            throw new RuntimeException("Vous êtes déjà inscrit à cet événement");
        }

        if (evenement.getCapaciteMax() != null && evenement.getPlacesRestantes() <= 0) {
            throw new RuntimeException("L'événement est complet");
        }

        Inscription inscription = new Inscription();
        inscription.setEtudiant(etudiant);
        inscription.setEvenement(evenement);
        inscription.setStatut(StatutInscription.CONFIRMEE);
        inscription.setDateInscription(LocalDateTime.now());

        inscription = inscriptionRepository.save(inscription);
        return inscriptionMapper.toDto(inscription);
    }

    public List<InscriptionDTO> getAllInscriptions() {
        return inscriptionRepository.findAll().stream()
                .map(inscriptionMapper::toDto)
                .collect(Collectors.toList());
    }

    public InscriptionDTO getInscriptionById(Long id) {
        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée avec ID: " + id));
        return inscriptionMapper.toDto(inscription);
    }

    public List<InscriptionDTO> getInscriptionsByEtudiant(Long etudiantId) {
        return inscriptionRepository.findByEtudiantId(etudiantId).stream()
                .map(inscriptionMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<InscriptionDTO> getInscriptionsByEvenement(Long evenementId) {
        return inscriptionRepository.findByEvenementId(evenementId).stream()
                .map(inscriptionMapper::toDto)
                .collect(Collectors.toList());
    }

    public InscriptionDTO annulerInscription(Long id) {
        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));

        inscription.annuler();
        inscription = inscriptionRepository.save(inscription);
        return inscriptionMapper.toDto(inscription);
    }

    public InscriptionDTO confirmerInscription(Long id) {
        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));

        inscription.setStatut(StatutInscription.CONFIRMEE);
        inscription = inscriptionRepository.save(inscription);
        return inscriptionMapper.toDto(inscription);
    }

    public InscriptionDTO marquerPresence(Long id) {
        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));

        inscription.setStatut(StatutInscription.PRESENTE);
        inscription = inscriptionRepository.save(inscription);
        return inscriptionMapper.toDto(inscription);
    }

    public long countInscriptionsByEvenement(Long evenementId) {
        return inscriptionRepository.findInscriptionsConfirmeesByEvenement(evenementId).size();
    }

    public void annulerInscriptionsByEvenement(Long evenementId) {
        inscriptionRepository.annulerInscriptionsByEvenement(evenementId, LocalDateTime.now());
    }

    public boolean isEtudiantInscrit(Long etudiantId, Long evenementId) {
        return inscriptionRepository.existsByEtudiantIdAndEvenementIdAndStatutNot(
                etudiantId, evenementId, StatutInscription.ANNULEE);
    }
}