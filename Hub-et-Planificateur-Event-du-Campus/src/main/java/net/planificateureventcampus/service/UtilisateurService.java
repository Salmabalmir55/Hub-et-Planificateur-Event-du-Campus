package net.planificateureventcampus.service;

import net.planificateureventcampus.DTOs.UtilisateurDTO;
import net.planificateureventcampus.entities.Utilisateur;
import net.planificateureventcampus.enums.Role;
import net.planificateureventcampus.mapper.UtilisateurMapper;
import net.planificateureventcampus.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@SuppressWarnings("null")
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private UtilisateurMapper utilisateurMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UtilisateurDTO createUser(UtilisateurDTO dto) {
        if (utilisateurRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }
        Utilisateur utilisateur = utilisateurMapper.toEntity(dto);
        utilisateur.setDateInscription(LocalDateTime.now());
        utilisateur = utilisateurRepository.save(utilisateur);
        return utilisateurMapper.toDto(utilisateur);
    }

    public List<UtilisateurDTO> getAllUsers() {
        return utilisateurRepository.findAll().stream()
                .map(utilisateurMapper::toDto)
                .collect(Collectors.toList());
    }

    public UtilisateurDTO getUserById(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec ID: " + id));
        return utilisateurMapper.toDto(utilisateur);
    }

    public UtilisateurDTO getUserByEmail(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec email: " + email));
        return utilisateurMapper.toDto(utilisateur);
    }

    public UtilisateurDTO updateUser(Long id, UtilisateurDTO dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        utilisateurMapper.updateEntity(utilisateur, dto);

        if (dto.getMotDePasse() != null && !dto.getMotDePasse().isEmpty()) {
            utilisateur.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
        }

        utilisateur = utilisateurRepository.save(utilisateur);
        return utilisateurMapper.toDto(utilisateur);
    }

    public void disableUser(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        utilisateur.setActif(false);
        utilisateurRepository.save(utilisateur);
    }

    public void enableUser(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        utilisateur.setActif(true);
        utilisateurRepository.save(utilisateur);
    }

    public void deleteUser(Long id) {
        if (!utilisateurRepository.existsById(id)) {
            throw new RuntimeException("Utilisateur non trouvé");
        }
        utilisateurRepository.deleteById(id);
    }

    public List<UtilisateurDTO> getUsersByRole(Role role) {
        return utilisateurRepository.findByRole(role).stream()
                .map(utilisateurMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<UtilisateurDTO> getActiveUsers() {
        return utilisateurRepository.findByActifTrue().stream()
                .map(utilisateurMapper::toDto)
                .collect(Collectors.toList());
    }

    public long countUsersByRole(Role role) {
        return utilisateurRepository.countByRole(role);
    }

    public void updateLastLogin(Long id) {
        utilisateurRepository.updateLastLoginDate(id, LocalDateTime.now());
    }
}