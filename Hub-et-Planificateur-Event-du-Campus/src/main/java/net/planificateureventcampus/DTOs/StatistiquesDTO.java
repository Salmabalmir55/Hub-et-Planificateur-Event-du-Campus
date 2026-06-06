package net.planificateureventcampus.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatistiquesDTO {


    private long totalUtilisateurs;
    private long totalEtudiants;
    private long totalOrganisateurs;
    private long totalAdmins;
    private long utilisateursActifs;
    private long nouvellesInscriptionsSemaine;

    private long totalEvenements;
    private long evenementsAVenir;
    private long evenementsEnCours;
    private long evenementsTermines;
    private long evenementsAnnules;
    private long evenementsCetteSemaine;
    private long evenementsCeMois;


    private long totalInscriptions;
    private long inscriptionsCetteSemaine;
    private double tauxParticipationMoyen;
    private double tauxRemplissageMoyen;

    private long totalFeedbacks;
    private double noteMoyenneGlobale;
    private Map<Integer, Long> distributionNotes;

    private Map<String, Long> evenementsParMois;
    private Map<String, Long> evenementsParCategorie;
    private Map<String, Long> inscriptionsParJour;
}
