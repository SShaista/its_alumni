/**
 * ============================================
 * ITS Alumni & Stages - Script principal
 * ============================================
 * Gère l'affichage public : accueil, annuaire, stages, contact
 */

// Données actuelles (chargées depuis localStorage ou données par défaut)
let currentData = loadData();
let alumni = currentData.alumni;
let stages = currentData.stages;

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initStats();
    initAlumniSection();
    initStagesSection();
    initContactForm();
    initFilters();
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Menu mobile
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Fermer le menu au clic sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Highlight du lien actif au scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================
// STATISTIQUES
// ============================================
function initStats() {
    const entreprises = [...new Set(alumni.map(a => a.entreprise))];

    animateNumber('statAlumni', alumni.length);
    animateNumber('statStages', stages.length);
    animateNumber('statEntreprises', entreprises.length);
}

function animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 50);
}

// ============================================
// ANNUAIRE ALUMNI
// ============================================
function initAlumniSection() {
    populateFilterOptions();
    renderAlumni(alumni);
}

function populateFilterOptions() {
    // Promotions
    const promotions = [...new Set(alumni.map(a => a.promotion))].sort();
    const promoSelect = document.getElementById('filterPromotion');
    if (promoSelect) {
        promotions.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p;
            opt.textContent = 'Promotion ' + p;
            promoSelect.appendChild(opt);
        });
    }

    // Secteurs
    const secteurs = [...new Set(alumni.map(a => a.secteur))].sort();
    const secteurSelect = document.getElementById('filterSecteur');
    if (secteurSelect) {
        secteurs.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = s;
            secteurSelect.appendChild(opt);
        });
    }

    // Entreprises
    const entreprises = [...new Set(alumni.map(a => a.entreprise))].sort();
    const entrepriseSelect = document.getElementById('filterEntreprise');
    if (entrepriseSelect) {
        entreprises.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e;
            opt.textContent = e;
            entrepriseSelect.appendChild(opt);
        });
    }
}

function renderAlumni(data) {
    const grid = document.getElementById('alumniGrid');
    const noResults = document.getElementById('noAlumni');

    if (!grid) return;

    if (data.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    grid.innerHTML = data.map(person => {
        const initials = person.nom.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const linkedinBtn = person.linkedin 
            ? `<a href="${person.linkedin}" target="_blank" class="btn btn-small btn-linkedin">LinkedIn</a>`
            : '';
        const contactBtn = person.email
            ? `<button class="btn btn-small btn-contact" onclick="showContactModal(${person.id})">Contacter</button>`
            : '';

        return `
            <div class="alumni-card">
                <div class="alumni-header">
                    <div class="alumni-avatar">${initials}</div>
                    <div class="alumni-info">
                        <h3>${escapeHtml(person.nom)}</h3>
                        <span class="alumni-promo">Promo ${escapeHtml(person.promotion)}</span>
                    </div>
                </div>
                <div class="alumni-details">
                    <div class="alumni-detail">
                        <span class="icon">🏢</span>
                        <span>${escapeHtml(person.entreprise)}</span>
                    </div>
                    <div class="alumni-detail">
                        <span class="icon">💼</span>
                        <span>${escapeHtml(person.poste)}</span>
                    </div>
                    <div class="alumni-detail">
                        <span class="icon">🎯</span>
                        <span>${escapeHtml(person.secteur)}</span>
                    </div>
                    ${person.bio ? `
                    <div class="alumni-detail">
                        <span class="icon">📝</span>
                        <span>${escapeHtml(person.bio)}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="alumni-actions">
                    ${linkedinBtn}
                    ${contactBtn}
                </div>
            </div>
        `;
    }).join('');
}

function showContactModal(alumniId) {
    const person = alumni.find(a => a.id === alumniId);
    if (!person) return;

    const modal = document.getElementById('contactModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <h2 style="color: var(--primary); margin-bottom: 0.5rem;">Contacter ${escapeHtml(person.nom)}</h2>
        <p style="color: var(--gray-500); margin-bottom: 1.5rem;">
            ${escapeHtml(person.poste)} chez ${escapeHtml(person.entreprise)} - Promo ${escapeHtml(person.promotion)}
        </p>

        ${person.email ? `
        <div style="margin-bottom: 1.5rem;">
            <p style="font-weight: 600; margin-bottom: 0.5rem;">Email :</p>
            <a href="mailto:${person.email}" style="font-size: 1.1rem;">${escapeHtml(person.email)}</a>
        </div>
        ` : ''}

        ${person.linkedin ? `
        <div style="margin-bottom: 1.5rem;">
            <p style="font-weight: 600; margin-bottom: 0.5rem;">LinkedIn :</p>
            <a href="${person.linkedin}" target="_blank" style="font-size: 1.1rem;">Voir le profil LinkedIn</a>
        </div>
        ` : ''}

        <div style="background: var(--gray-50); padding: 1rem; border-radius: var(--radius); margin-top: 1rem;">
            <p style="font-size: 0.9rem; color: var(--gray-500);">
                💡 <strong>Conseil :</strong> Présentez-vous brièvement et expliquez le motif de votre contact 
                (question sur le métier, le secteur, l'entreprise, etc.).
            </p>
        </div>
    `;

    modal.classList.add('active');
}

// ============================================
// RETOURS DE STAGE
// ============================================
function initStagesSection() {
    // Options de filtre pour les stages
    const entreprises = [...new Set(stages.map(s => s.entreprise))].sort();
    const entrepriseSelect = document.getElementById('filterStageEntreprise');
    if (entrepriseSelect) {
        entreprises.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e;
            opt.textContent = e;
            entrepriseSelect.appendChild(opt);
        });
    }

    const annees = [...new Set(stages.map(s => s.annee))].sort((a, b) => b - a);
    const anneeSelect = document.getElementById('filterStageAnnee');
    if (anneeSelect) {
        annees.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a;
            opt.textContent = a;
            anneeSelect.appendChild(opt);
        });
    }

    renderStages(stages);
}

function renderStages(data) {
    const list = document.getElementById('stagesList');
    const noResults = document.getElementById('noStages');

    if (!list) return;

    if (data.length === 0) {
        list.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    list.innerHTML = data.map(stage => `
        <div class="stage-card">
            <div class="stage-header">
                <h3 class="stage-title">${escapeHtml(stage.sujet)}</h3>
                <span class="stage-badge">${stage.annee}</span>
            </div>
            <div class="stage-meta">
                <div class="stage-meta-item">
                    <span class="icon">👤</span>
                    <span>${escapeHtml(stage.etudiant)} (Promo ${escapeHtml(stage.promotion)})</span>
                </div>
                <div class="stage-meta-item">
                    <span class="icon">🏢</span>
                    <span>${escapeHtml(stage.entreprise)}</span>
                </div>
                <div class="stage-meta-item">
                    <span class="icon">📅</span>
                    <span>${escapeHtml(stage.duree)}</span>
                </div>
            </div>
            <div class="stage-description">
                <p>${escapeHtml(stage.description)}</p>
            </div>
            ${stage.conseils ? `
            <div class="stage-conseils">
                <span class="stage-conseils-label">💡 Conseils pour les futurs stagiaires</span>
                <p>${escapeHtml(stage.conseils)}</p>
            </div>
            ` : ''}
            ${stage.contact ? `
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--gray-100);">
                <span style="font-size: 0.9rem; color: var(--gray-500);">
                    📧 Contact entreprise : ${escapeHtml(stage.contact)}
                </span>
            </div>
            ` : ''}
        </div>
    `).join('');
}

// ============================================
// FILTRES
// ============================================
function initFilters() {
    // Filtres alumni
    const searchAlumni = document.getElementById('searchAlumni');
    const filterPromotion = document.getElementById('filterPromotion');
    const filterSecteur = document.getElementById('filterSecteur');
    const filterEntreprise = document.getElementById('filterEntreprise');

    function filterAlumni() {
        const search = searchAlumni ? searchAlumni.value.toLowerCase() : '';
        const promo = filterPromotion ? filterPromotion.value : '';
        const secteur = filterSecteur ? filterSecteur.value : '';
        const entreprise = filterEntreprise ? filterEntreprise.value : '';

        const filtered = alumni.filter(a => {
            const matchSearch = !search || 
                a.nom.toLowerCase().includes(search) ||
                a.entreprise.toLowerCase().includes(search) ||
                a.poste.toLowerCase().includes(search) ||
                a.secteur.toLowerCase().includes(search);
            const matchPromo = !promo || a.promotion === promo;
            const matchSecteur = !secteur || a.secteur === secteur;
            const matchEntreprise = !entreprise || a.entreprise === entreprise;

            return matchSearch && matchPromo && matchSecteur && matchEntreprise;
        });

        renderAlumni(filtered);
    }

    if (searchAlumni) searchAlumni.addEventListener('input', filterAlumni);
    if (filterPromotion) filterPromotion.addEventListener('change', filterAlumni);
    if (filterSecteur) filterSecteur.addEventListener('change', filterAlumni);
    if (filterEntreprise) filterEntreprise.addEventListener('change', filterAlumni);

    // Filtres stages
    const searchStage = document.getElementById('searchStage');
    const filterStageEntreprise = document.getElementById('filterStageEntreprise');
    const filterStageAnnee = document.getElementById('filterStageAnnee');

    function filterStages() {
        const search = searchStage ? searchStage.value.toLowerCase() : '';
        const entreprise = filterStageEntreprise ? filterStageEntreprise.value : '';
        const annee = filterStageAnnee ? filterStageAnnee.value : '';

        const filtered = stages.filter(s => {
            const matchSearch = !search ||
                s.etudiant.toLowerCase().includes(search) ||
                s.entreprise.toLowerCase().includes(search) ||
                s.sujet.toLowerCase().includes(search) ||
                s.description.toLowerCase().includes(search);
            const matchEntreprise = !entreprise || s.entreprise === entreprise;
            const matchAnnee = !annee || s.annee.toString() === annee;

            return matchSearch && matchEntreprise && matchAnnee;
        });

        renderStages(filtered);
    }

    if (searchStage) searchStage.addEventListener('input', filterStages);
    if (filterStageEntreprise) filterStageEntreprise.addEventListener('change', filterStages);
    if (filterStageAnnee) filterStageAnnee.addEventListener('change', filterStages);
}

// ============================================
// FORMULAIRE DE CONTACT
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const modal = document.getElementById('contactModal');
    const modalClose = document.getElementById('modalClose');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const nom = document.getElementById('contactNom').value;
            const email = document.getElementById('contactEmail').value;
            const sujet = document.getElementById('contactSujet').value;
            const message = document.getElementById('contactMessage').value;

            // Simulation d'envoi (pas de backend)
            alert(`Merci ${nom} ! Votre message a bien été enregistré.\n\nSujet : ${sujet}\n\nNote : Ce site n'a pas de backend. Pour nous contacter réellement, utilisez l'email alumni@its.fr`);

            form.reset();
        });
    }

    // Fermeture du modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}

// ============================================
// UTILITAIRES
// ============================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
