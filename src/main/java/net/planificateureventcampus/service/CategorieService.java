package net.planificateureventcampus.service;

import net.planificateureventcampus.DTOs.CategorieDTO;
import net.planificateureventcampus.entities.Categorie;
import net.planificateureventcampus.mapper.CategorieMapper;
import net.planificateureventcampus.repositories.CategorieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategorieService {

    @Autowired
    private CategorieRepository categorieRepository;

    @Autowired
    private CategorieMapper categorieMapper;

    public CategorieDTO createCategorie(CategorieDTO dto) {
        if (categorieRepository.findByNom(dto.getNom()).isPresent()) {
            throw new RuntimeException("Une catégorie avec ce nom existe déjà");
        }
        Categorie categorie = categorieMapper.toEntity(dto);
        categorie = categorieRepository.save(categorie);
        return categorieMapper.toDto(categorie);
    }

    public List<CategorieDTO> getAllCategories() {
        return categorieRepository.findAll().stream()
                .map(categorieMapper::toDto)
                .collect(Collectors.toList());
    }

    public CategorieDTO getCategorieById(Long id) {
        Categorie categorie = categorieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec ID: " + id));
        return categorieMapper.toDto(categorie);
    }

    public List<CategorieDTO> getActiveCategories() {
        return categorieRepository.findByActiveTrue().stream()
                .map(categorieMapper::toDto)
                .collect(Collectors.toList());
    }

    public CategorieDTO updateCategorie(Long id, CategorieDTO dto) {
        Categorie categorie = categorieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));

        categorieMapper.updateEntity(categorie, dto);
        categorie = categorieRepository.save(categorie);
        return categorieMapper.toDto(categorie);
    }

    public void deleteCategorie(Long id) {
        if (!categorieRepository.existsById(id)) {
            throw new RuntimeException("Catégorie non trouvée");
        }
        categorieRepository.deleteById(id);
    }
}
