-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 01 juin 2026 à 22:13
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `planificateur_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `administrateurs`
--

CREATE TABLE `administrateurs` (
  `niveau_acces` varchar(255) DEFAULT NULL,
  `utilisateur_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL,
  `active` bit(1) NOT NULL,
  `couleur` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `icone` varchar(255) DEFAULT NULL,
  `nom` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `active`, `couleur`, `description`, `icone`, `nom`) VALUES
(1, b'1', '#FF5733', 'Conférences et séminaires', NULL, 'Conférence'),
(2, b'1', '#33FF57', 'Événements sportifs', NULL, 'Sport'),
(3, b'1', '#3357FF', 'Concerts, expositions, théâtre', NULL, 'Culture');

-- --------------------------------------------------------

--
-- Structure de la table `etudiants`
--

CREATE TABLE `etudiants` (
  `filiere` varchar(255) DEFAULT NULL,
  `matricule` varchar(255) NOT NULL,
  `niveau` int(11) DEFAULT NULL,
  `utilisateur_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `etudiants`
--

INSERT INTO `etudiants` (`filiere`, `matricule`, `niveau`, `utilisateur_id`) VALUES
('Informatique', '20240001', 3, 3);

-- --------------------------------------------------------

--
-- Structure de la table `evenements`
--

CREATE TABLE `evenements` (
  `id` bigint(20) NOT NULL,
  `capacite_max` int(11) DEFAULT NULL,
  `date_creation` datetime(6) DEFAULT NULL,
  `date_debut` datetime(6) NOT NULL,
  `date_fin` datetime(6) NOT NULL,
  `date_modification` datetime(6) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `lien_visio` varchar(255) DEFAULT NULL,
  `lieu` varchar(255) DEFAULT NULL,
  `statut` enum('ANNULE','EN_ATTENTE','EN_COURS','TERMINE','VALIDE') DEFAULT NULL,
  `titre` varchar(255) NOT NULL,
  `categorie_id` bigint(20) DEFAULT NULL,
  `organisateur_id` bigint(20) NOT NULL,
  `salle_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `evenements`
--

INSERT INTO `evenements` (`id`, `capacite_max`, `date_creation`, `date_debut`, `date_fin`, `date_modification`, `description`, `image_url`, `lien_visio`, `lieu`, `statut`, `titre`, `categorie_id`, `organisateur_id`, `salle_id`) VALUES
(1, 200, '2026-06-01 18:22:04.000000', '2026-06-11 18:22:04.000000', '2026-06-11 22:22:04.000000', '2026-06-01 18:22:04.000000', 'Grande conférence sur les nouvelles technologies', 'https://example.com/tech.jpg', NULL, 'Amphithéâtre A', 'VALIDE', 'Conférence Tech 2025', 1, 2, 1),
(2, 100, '2026-06-01 18:22:04.000000', '2026-06-16 18:22:04.000000', '2026-06-16 21:22:04.000000', '2026-06-01 18:22:04.000000', 'Tournoi inter-filières', NULL, NULL, 'Stade Universitaire', 'VALIDE', 'Tournoi de Football', 2, 2, 2),
(3, 500, '2026-06-01 18:22:04.000000', '2026-06-06 18:22:04.000000', '2026-06-06 20:22:04.000000', '2026-06-01 18:22:04.000000', 'Concert d\'accueil des nouveaux étudiants', NULL, NULL, 'Espace Culturel', 'EN_ATTENTE', 'Concert de Bienvenue', NULL, 2, NULL),
(2099, 150, '2026-06-01 10:00:00.000000', '2026-09-05 20:00:00.000000', '2026-09-06 02:00:00.000000', '2026-06-01 10:00:00.000000', 'Grande soirée annuelle pour accueillir les nouveaux étudiants sur le campus.', NULL, NULL, 'Gymnase eCampus', 'EN_ATTENTE', 'Soirée d intégration', 1, 1, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` bigint(20) NOT NULL,
  `approuve` bit(1) NOT NULL,
  `commentaire` varchar(1000) DEFAULT NULL,
  `date_creation` datetime(6) DEFAULT NULL,
  `note` int(11) DEFAULT NULL,
  `evenement_id` bigint(20) NOT NULL,
  `utilisateur_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `inscriptions`
--

CREATE TABLE `inscriptions` (
  `id` bigint(20) NOT NULL,
  `codeqr` varchar(255) DEFAULT NULL,
  `date_annulation` datetime(6) DEFAULT NULL,
  `date_inscription` datetime(6) DEFAULT NULL,
  `statut` enum('ANNULEE','CONFIRMEE','EN_ATTENTE','PRESENTE') DEFAULT NULL,
  `etudiant_id` bigint(20) NOT NULL,
  `evenement_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL,
  `date_envoi` datetime(6) DEFAULT NULL,
  `date_lecture` datetime(6) DEFAULT NULL,
  `lu` bit(1) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `titre` varchar(255) DEFAULT NULL,
  `type` enum('ALERTE','ANNULATION','CONFIRMATION','INFORMATION','RAPPEL') DEFAULT NULL,
  `utilisateur_id` bigint(20) NOT NULL,
  `evenement_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `organisateurs`
--

CREATE TABLE `organisateurs` (
  `departement` varchar(255) DEFAULT NULL,
  `est_verifie` bit(1) NOT NULL,
  `utilisateur_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `organisateurs`
--

INSERT INTO `organisateurs` (`departement`, `est_verifie`, `utilisateur_id`) VALUES
('Administration', b'1', 1),
('Club Sportif', b'1', 2);

-- --------------------------------------------------------

--
-- Structure de la table `ressources`
--

CREATE TABLE `ressources` (
  `id` bigint(20) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `quantite_disponible` int(11) DEFAULT NULL,
  `quantite_reservee` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `evenement_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `salles`
--

CREATE TABLE `salles` (
  `id` bigint(20) NOT NULL,
  `capacite` int(11) DEFAULT NULL,
  `disponible` bit(1) NOT NULL,
  `equipements` varchar(255) DEFAULT NULL,
  `localisation` varchar(255) DEFAULT NULL,
  `nom` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `salles`
--

INSERT INTO `salles` (`id`, `capacite`, `disponible`, `equipements`, `localisation`, `nom`) VALUES
(1, 200, b'1', 'Vidéoprojecteur, Tableau, Sono', 'Bâtiment Principal - RDC', 'Amphithéâtre A'),
(2, 50, b'1', 'Vidéoprojecteur, Ordinateurs', 'Bâtiment B - 1er étage', 'Salle B101');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` bigint(20) NOT NULL,
  `actif` bit(1) NOT NULL,
  `date_inscription` datetime(6) DEFAULT NULL,
  `derniere_connexion` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `photo_profil` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) NOT NULL,
  `role` enum('ROLE_ADMIN','ROLE_ETUDIANT','ROLE_ORGANISATEUR') NOT NULL,
  `telephone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `actif`, `date_inscription`, `derniere_connexion`, `email`, `mot_de_passe`, `nom`, `photo_profil`, `prenom`, `role`, `telephone`) VALUES
(1, b'1', '2026-06-01 18:22:03.000000', NULL, 'admin@campus.com', '123', 'Admin', NULL, 'Super', 'ROLE_ADMIN', NULL),
(2, b'1', '2026-06-01 18:22:04.000000', NULL, 'organisateur@campus.com', '$2a$10$0Lp9gLJTpFTlrUyYj.aRDu/nXeaiiyErc6.uNv7x9E6U/6e12saKy', 'Martin', NULL, 'Sophie', 'ROLE_ORGANISATEUR', NULL),
(3, b'1', '2026-06-01 18:22:04.000000', NULL, 'etudiant@campus.com', '$2a$10$nacZ4qRbhopE1utAVT7KqeCGqwhtsqd0HW2ytulmjFFKBFdvy/V8u', 'Dupont', NULL, 'Jean', 'ROLE_ETUDIANT', '0687654321');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `administrateurs`
--
ALTER TABLE `administrateurs`
  ADD PRIMARY KEY (`utilisateur_id`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_l15ogrfsiv1ijo5bi874gbgr5` (`nom`);

--
-- Index pour la table `etudiants`
--
ALTER TABLE `etudiants`
  ADD PRIMARY KEY (`utilisateur_id`),
  ADD UNIQUE KEY `UK_7dcho6ioi2rdfjm2fjtsm1xcy` (`matricule`);

--
-- Index pour la table `evenements`
--
ALTER TABLE `evenements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_jf9j4n39vkyn77tnm6oxivm9h` (`salle_id`),
  ADD KEY `FK91mg2blb0wldo27ghc49417o4` (`categorie_id`),
  ADD KEY `FKsq951d62pg1naomykop6cjbga` (`organisateur_id`);

--
-- Index pour la table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKdwk2aynkvvvjr7ac1b503ooc5` (`evenement_id`),
  ADD KEY `FK707w8tdrbue36n7f3q89xqchw` (`utilisateur_id`);

--
-- Index pour la table `inscriptions`
--
ALTER TABLE `inscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKl1kl10k9hn3tee5ur72kn028f` (`etudiant_id`,`evenement_id`),
  ADD KEY `FK5q97hk56trnpodnpptaomnppn` (`evenement_id`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKsoq6jchv8p6wnydvsnf6ubw4y` (`utilisateur_id`),
  ADD KEY `FK8ai21bnbyhmy8y0ayhcoe3gkj` (`evenement_id`);

--
-- Index pour la table `organisateurs`
--
ALTER TABLE `organisateurs`
  ADD PRIMARY KEY (`utilisateur_id`);

--
-- Index pour la table `ressources`
--
ALTER TABLE `ressources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKqwa9odhx5rrrt9khmfiu56qy9` (`evenement_id`);

--
-- Index pour la table `salles`
--
ALTER TABLE `salles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_baqiyi6ypsidfq05qu8l9o2w9` (`nom`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_6ldvumu3hqvnmmxy1b6lsxwqy` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `evenements`
--
ALTER TABLE `evenements`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2100;

--
-- AUTO_INCREMENT pour la table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `inscriptions`
--
ALTER TABLE `inscriptions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `ressources`
--
ALTER TABLE `ressources`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `salles`
--
ALTER TABLE `salles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `administrateurs`
--
ALTER TABLE `administrateurs`
  ADD CONSTRAINT `FKdy30wuuedkvejprnwils1arcp` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`);

--
-- Contraintes pour la table `etudiants`
--
ALTER TABLE `etudiants`
  ADD CONSTRAINT `FKpeotkq2muyhl6xriwk8ldb4oe` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`);

--
-- Contraintes pour la table `evenements`
--
ALTER TABLE `evenements`
  ADD CONSTRAINT `FK3y0vxtesipt94esq0ma67uwub` FOREIGN KEY (`salle_id`) REFERENCES `salles` (`id`),
  ADD CONSTRAINT `FK91mg2blb0wldo27ghc49417o4` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `FKsq951d62pg1naomykop6cjbga` FOREIGN KEY (`organisateur_id`) REFERENCES `organisateurs` (`utilisateur_id`);

--
-- Contraintes pour la table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `FK707w8tdrbue36n7f3q89xqchw` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`),
  ADD CONSTRAINT `FKdwk2aynkvvvjr7ac1b503ooc5` FOREIGN KEY (`evenement_id`) REFERENCES `evenements` (`id`);

--
-- Contraintes pour la table `inscriptions`
--
ALTER TABLE `inscriptions`
  ADD CONSTRAINT `FK5q97hk56trnpodnpptaomnppn` FOREIGN KEY (`evenement_id`) REFERENCES `evenements` (`id`),
  ADD CONSTRAINT `FKrbdv2i5mc55pqxpuwt4fgxdbh` FOREIGN KEY (`etudiant_id`) REFERENCES `etudiants` (`utilisateur_id`);

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FK8ai21bnbyhmy8y0ayhcoe3gkj` FOREIGN KEY (`evenement_id`) REFERENCES `evenements` (`id`),
  ADD CONSTRAINT `FKsoq6jchv8p6wnydvsnf6ubw4y` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`);

--
-- Contraintes pour la table `organisateurs`
--
ALTER TABLE `organisateurs`
  ADD CONSTRAINT `FK7vrg1kn22456eamoiw5jevy30` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`);

--
-- Contraintes pour la table `ressources`
--
ALTER TABLE `ressources`
  ADD CONSTRAINT `FKqwa9odhx5rrrt9khmfiu56qy9` FOREIGN KEY (`evenement_id`) REFERENCES `evenements` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
