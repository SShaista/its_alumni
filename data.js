/**
 * ============================================
 * ITS Alumni & Stages - Données
 * ============================================
 * 
 * Ce fichier contient les données du site.
 * Pour les modifier de manière permanente (visible par tous) :
 * 1. Éditez directement ce fichier
 * 2. Remplacez les tableaux alumniData et stagesData
 * 3. Poussez les modifications sur GitHub
 * 
 * Les données peuvent aussi être modifiées via l'espace admin (admin.html)
 * mais ces modifications restent locales au navigateur (localStorage).
 */

// ============================================
// DONNÉES ALUMNI
// ============================================
// Structure d'un alumni :
// {
//   id: number (unique),
//   nom: string,
//   promotion: string (ex: "2023"),
//   entreprise: string,
//   poste: string,
//   secteur: string,
//   linkedin: string (URL, optionnel),
//   email: string (optionnel),
//   bio: string (optionnel)
// }

const alumniData = [
    {
        id: 1,
        nom: "Marie Dubois",
        promotion: "2023",
        entreprise: "TechSolutions Paris",
        poste: "Développeuse Full-Stack",
        secteur: "Informatique / Développement",
        linkedin: "https://linkedin.com/in/marie-dubois",
        email: "marie.dubois@email.com",
        bio: "Passionnée par le développement web et les nouvelles technologies."
    },
    {
        id: 2,
        nom: "Lucas Martin",
        promotion: "2022",
        entreprise: "DataCorp",
        poste: "Data Analyst",
        secteur: "Data Science / Analytics",
        linkedin: "https://linkedin.com/in/lucas-martin",
        email: "lucas.martin@email.com",
        bio: "Spécialisé en analyse de données et visualisation."
    },
    {
        id: 3,
        nom: "Sophie Bernard",
        promotion: "2023",
        entreprise: "CloudFirst",
        poste: "Ingénieure Cloud",
        secteur: "Cloud Computing / DevOps",
        linkedin: "https://linkedin.com/in/sophie-bernard",
        email: "sophie.bernard@email.com",
        bio: "Experte en architectures cloud et infrastructure."
    },
    {
        id: 4,
        nom: "Thomas Petit",
        promotion: "2021",
        entreprise: "SecureNet",
        poste: "Analyste Cybersécurité",
        secteur: "Cybersécurité",
        linkedin: "https://linkedin.com/in/thomas-petit",
        email: "thomas.petit@email.com",
        bio: "Passionné par la sécurité informatique et la protection des données."
    }
];

// ============================================
// DONNÉES RETOURS DE STAGE
// ============================================
// Structure d'un retour de stage :
// {
//   id: number (unique),
//   etudiant: string (nom),
//   promotion: string,
//   entreprise: string,
//   annee: number,
//   duree: string (ex: "3 mois"),
//   sujet: string,
//   description: string (détaillée),
//   conseils: string (optionnel),
//   contact: string (optionnel)
// }

const stagesData = [
    {
        id: 1,
        etudiant: "Marie Dubois",
        promotion: "2023",
        entreprise: "TechSolutions Paris",
        annee: 2023,
        duree: "4 mois (avril - juillet)",
        sujet: "Développement d'une application web de gestion de projets",
        description: "Durant ce stage, j'ai participé au développement complet d'une application web de gestion de projets en équipe. J'ai travaillé sur le front-end avec React et le back-end avec Node.js. Les missions incluaient la conception de l'interface utilisateur, l'intégration d'API REST, la mise en place de tests automatisés et la collaboration via Git. J'ai également participé aux réunions quotidiennes (daily stand-ups) et aux sprints agiles. Ce stage m'a permis de consolider mes compétences en développement full-stack et de découvrir les méthodologies agiles en entreprise.",
        conseils: "N'hésitez pas à poser des questions dès le début, même si cela peut sembler intimidant. Prenez des notes sur tout ce que vous apprenez et demandez régulièrement du feedback à votre tuteur.",
        contact: "recrutement@techsolutions.fr"
    },
    {
        id: 2,
        etudiant: "Lucas Martin",
        promotion: "2022",
        entreprise: "DataCorp",
        annee: 2022,
        duree: "6 mois (janvier - juin)",
        sujet: "Analyse prédictive des ventes pour un client retail",
        description: "J'ai intégré l'équipe data science de DataCorp pour travailler sur un projet d'analyse prédictive des ventes pour un grand client du retail. Mes missions consistaient à nettoyer et préparer des jeux de données volumineux, construire des modèles de machine learning (régression, clustering) avec Python et scikit-learn, créer des tableaux de bord interactifs avec Power BI, et présenter les résultats aux équipes métier. J'ai aussi participé à des ateliers de brainstorming sur de nouvelles fonctionnalités analytiques.",
        conseils: "Maîtrisez bien Python et les bibliothèques de data science (pandas, numpy, scikit-learn) avant de commencer. Soyez curieux et n'hésitez pas à explorer les données par vous-même en dehors des missions assignées.",
        contact: ""
    }
];

// ============================================
// FONCTIONS UTILITAIRES DE STOCKAGE
// ============================================

/**
 * Charge les données depuis le localStorage ou utilise les données par défaut
 */
function loadData() {
    const storedAlumni = localStorage.getItem('its_alumni');
    const storedStages = localStorage.getItem('its_stages');

    return {
        alumni: storedAlumni ? JSON.parse(storedAlumni) : [...alumniData],
        stages: storedStages ? JSON.parse(storedStages) : [...stagesData]
    };
}

/**
 * Sauvegarde les données dans le localStorage
 */
function saveData(alumni, stages) {
    localStorage.setItem('its_alumni', JSON.stringify(alumni));
    localStorage.setItem('its_stages', JSON.stringify(stages));
}

/**
 * Réinitialise les données aux valeurs par défaut
 */
function resetData() {
    localStorage.removeItem('its_alumni');
    localStorage.removeItem('its_stages');
    return {
        alumni: [...alumniData],
        stages: [...stagesData]
    };
}

/**
 * Exporte les données au format JSON
 */
function exportData() {
    const data = loadData();
    const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'its-alumni-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Génère un nouvel ID unique
 */
function generateId(items) {
    return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
}
