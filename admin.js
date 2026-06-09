/**
 * ============================================
 * ITS Alumni & Stages - Script Admin
 * ============================================
 * Gère l'espace d'administration : CRUD alumni, stages, prévisualisation, données
 */
// ============================================
// PROTECTION ADMIN
// ============================================

(function() {
    const session = localStorage.getItem("its_admin_session");
    const loginTime = parseInt(localStorage.getItem("its_admin_login_time") || "0");
    const SESSION_DURATION = 2 * 60 * 60 * 1000;

    if (session !== "active" || Date.now() - loginTime > SESSION_DURATION) {
        localStorage.removeItem("its_admin_session");
        localStorage.removeItem("its_admin_login_time");
        window.location.replace("login.html");
    }
})();
// Données actuelles
let adminData = loadData();
let adminAlumni = adminData.alumni;
let adminStages = adminData.stages;

// État d'édition
let editingAlumniId = null;
let editingStageId = null;

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initAdminTabs();
    initAlumniForm();
    initStageForm();
    initDataActions();
    refreshAllViews();
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// ============================================
// ONGLETS ADMIN
// ============================================
function initAdminTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    const panels = document.querySelectorAll('.admin-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById('panel-' + target).classList.add('active');

            // Rafraîchir la prévisualisation si onglet preview
            if (target === 'preview') {
                refreshPreview();
            }
        });
    });
}

// ============================================
// FORMULAIRE ALUMNI
// ============================================
function initAlumniForm() {
    const form = document.getElementById('alumniForm');
    const cancelBtn = document.getElementById('alumniCancelBtn');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const alumniItem = {
                id: editingAlumniId || generateId(adminAlumni),
                nom: document.getElementById('adminNom').value.trim(),
                promotion: document.getElementById('adminPromotion').value.trim(),
                entreprise: document.getElementById('adminEntreprise').value.trim(),
                poste: document.getElementById('adminPoste').value.trim(),
                secteur: document.getElementById('adminSecteur').value.trim(),
                linkedin: document.getElementById('adminLinkedin').value.trim(),
                email: document.getElementById('adminEmail').value.trim(),
                bio: document.getElementById('adminBio').value.trim()
            };

            if (editingAlumniId) {
                const index = adminAlumni.findIndex(a => a.id === editingAlumniId);
                if (index !== -1) {
                    adminAlumni[index] = alumniItem;
                }
                showAlert('Alumni modifié avec succès !', 'success');
            } else {
                adminAlumni.push(alumniItem);
                showAlert('Alumni ajouté avec succès !', 'success');
            }

            saveData(adminAlumni, adminStages);
            resetAlumniForm();
            refreshAllViews();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetAlumniForm);
    }
}

function resetAlumniForm() {
    document.getElementById('alumniForm').reset();
    editingAlumniId = null;
    document.getElementById('alumniId').value = '';
    document.getElementById('alumniFormTitle').textContent = 'Ajouter un alumni';
    document.getElementById('alumniSubmitBtn').textContent = 'Ajouter';
    document.getElementById('alumniCancelBtn').style.display = 'none';
}

function editAlumni(id) {
    const person = adminAlumni.find(a => a.id === id);
    if (!person) return;

    editingAlumniId = id;
    document.getElementById('alumniId').value = id;
    document.getElementById('adminNom').value = person.nom;
    document.getElementById('adminPromotion').value = person.promotion;
    document.getElementById('adminEntreprise').value = person.entreprise;
    document.getElementById('adminPoste').value = person.poste;
    document.getElementById('adminSecteur').value = person.secteur;
    document.getElementById('adminLinkedin').value = person.linkedin || '';
    document.getElementById('adminEmail').value = person.email || '';
    document.getElementById('adminBio').value = person.bio || '';

    document.getElementById('alumniFormTitle').textContent = 'Modifier un alumni';
    document.getElementById('alumniSubmitBtn').textContent = 'Enregistrer';
    document.getElementById('alumniCancelBtn').style.display = 'inline-flex';

    // Scroll vers le formulaire
    document.querySelector('.admin-form-wrapper').scrollIntoView({ behavior: 'smooth' });
}

function deleteAlumni(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet alumni ?')) return;

    adminAlumni = adminAlumni.filter(a => a.id !== id);
    saveData(adminAlumni, adminStages);

    if (editingAlumniId === id) {
        resetAlumniForm();
    }

    refreshAllViews();
    showAlert('Alumni supprimé.', 'success');
}

// ============================================
// FORMULAIRE STAGE
// ============================================
function initStageForm() {
    const form = document.getElementById('stageForm');
    const cancelBtn = document.getElementById('stageCancelBtn');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const stageItem = {
                id: editingStageId || generateId(adminStages),
                etudiant: document.getElementById('stageEtudiant').value.trim(),
                promotion: document.getElementById('stagePromotion').value.trim(),
                entreprise: document.getElementById('stageEntreprise').value.trim(),
                annee: parseInt(document.getElementById('stageAnnee').value),
                duree: document.getElementById('stageDuree').value.trim(),
                sujet: document.getElementById('stageSujet').value.trim(),
                description: document.getElementById('stageDescription').value.trim(),
                conseils: document.getElementById('stageConseils').value.trim(),
                contact: document.getElementById('stageContact').value.trim()
            };

            if (editingStageId) {
                const index = adminStages.findIndex(s => s.id === editingStageId);
                if (index !== -1) {
                    adminStages[index] = stageItem;
                }
                showAlert('Retour de stage modifié avec succès !', 'success');
            } else {
                adminStages.push(stageItem);
                showAlert('Retour de stage ajouté avec succès !', 'success');
            }

            saveData(adminAlumni, adminStages);
            resetStageForm();
            refreshAllViews();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetStageForm);
    }
}

function resetStageForm() {
    document.getElementById('stageForm').reset();
    editingStageId = null;
    document.getElementById('stageId').value = '';
    document.getElementById('stageFormTitle').textContent = 'Ajouter un retour de stage';
    document.getElementById('stageSubmitBtn').textContent = 'Ajouter';
    document.getElementById('stageCancelBtn').style.display = 'none';
}

function editStage(id) {
    const stage = adminStages.find(s => s.id === id);
    if (!stage) return;

    editingStageId = id;
    document.getElementById('stageId').value = id;
    document.getElementById('stageEtudiant').value = stage.etudiant;
    document.getElementById('stagePromotion').value = stage.promotion;
    document.getElementById('stageEntreprise').value = stage.entreprise;
    document.getElementById('stageAnnee').value = stage.annee;
    document.getElementById('stageDuree').value = stage.duree || '';
    document.getElementById('stageSujet').value = stage.sujet;
    document.getElementById('stageDescription').value = stage.description;
    document.getElementById('stageConseils').value = stage.conseils || '';
    document.getElementById('stageContact').value = stage.contact || '';

    document.getElementById('stageFormTitle').textContent = 'Modifier un retour de stage';
    document.getElementById('stageSubmitBtn').textContent = 'Enregistrer';
    document.getElementById('stageCancelBtn').style.display = 'inline-flex';

    document.querySelector('#panel-stages .admin-form-wrapper').scrollIntoView({ behavior: 'smooth' });
}

function deleteStage(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce retour de stage ?')) return;

    adminStages = adminStages.filter(s => s.id !== id);
    saveData(adminAlumni, adminStages);

    if (editingStageId === id) {
        resetStageForm();
    }

    refreshAllViews();
    showAlert('Retour de stage supprimé.', 'success');
}

// ============================================
// TABLEAUX ADMIN
// ============================================
function renderAlumniTable() {
    const tbody = document.querySelector('#alumniTable tbody');
    if (!tbody) return;

    if (adminAlumni.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--gray-400);padding:2rem;">Aucun alumni</td></tr>';
        return;
    }

    tbody.innerHTML = adminAlumni.map(a => `
        <tr>
            <td><strong>${escapeHtml(a.nom)}</strong></td>
            <td>${escapeHtml(a.promotion)}</td>
            <td>${escapeHtml(a.entreprise)}</td>
            <td>${escapeHtml(a.poste)}</td>
            <td class="actions">
                <button class="btn btn-small btn-edit" onclick="editAlumni(${a.id})">Modifier</button>
                <button class="btn btn-small btn-delete" onclick="deleteAlumni(${a.id})">Supprimer</button>
            </td>
        </tr>
    `).join('');
}

function renderStageTable() {
    const tbody = document.querySelector('#stageTable tbody');
    if (!tbody) return;

    if (adminStages.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--gray-400);padding:2rem;">Aucun retour de stage</td></tr>';
        return;
    }

    tbody.innerHTML = adminStages.map(s => `
        <tr>
            <td><strong>${escapeHtml(s.etudiant)}</strong></td>
            <td>${escapeHtml(s.entreprise)}</td>
            <td>${escapeHtml(s.sujet)}</td>
            <td>${s.annee}</td>
            <td class="actions">
                <button class="btn btn-small btn-edit" onclick="editStage(${s.id})">Modifier</button>
                <button class="btn btn-small btn-delete" onclick="deleteStage(${s.id})">Supprimer</button>
            </td>
        </tr>
    `).join('');
}

// ============================================
// PRÉVISUALISATION
// ============================================
function refreshPreview() {
    const alumniGrid = document.getElementById('previewAlumniGrid');
    const stagesList = document.getElementById('previewStagesList');

    if (alumniGrid) {
        alumniGrid.innerHTML = adminAlumni.map(person => {
            const initials = person.nom.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
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
                    </div>
                </div>
            `;
        }).join('');
    }

    if (stagesList) {
        stagesList.innerHTML = adminStages.map(stage => `
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
                </div>
                <div class="stage-description">
                    <p>${escapeHtml(stage.description.substring(0, 200))}${stage.description.length > 200 ? '...' : ''}</p>
                </div>
            </div>
        `).join('');
    }
}

// ============================================
// ACTIONS DONNÉES
// ============================================
function initDataActions() {
    const exportBtn = document.getElementById('exportDataBtn');
    const resetBtn = document.getElementById('resetDataBtn');
    const clearBtn = document.getElementById('clearStorageBtn');

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportData();
            showAlert('Données exportées avec succès !', 'success');
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (!confirm('Réinitialiser toutes les données aux valeurs par défaut ? Cette action est irréversible.')) return;

            const reset = resetData();
            adminAlumni = reset.alumni;
            adminStages = reset.stages;

            resetAlumniForm();
            resetStageForm();
            refreshAllViews();
            showAlert('Données réinitialisées avec succès.', 'success');
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (!confirm('Vider complètement le stockage local ? Toutes les données seront perdues.')) return;

            localStorage.clear();
            const reset = resetData();
            adminAlumni = reset.alumni;
            adminStages = reset.stages;

            resetAlumniForm();
            resetStageForm();
            refreshAllViews();
            showAlert('Stockage local vidé.', 'success');
        });
    }
}

// ============================================
// RAFRAÎCHISSEMENT GLOBAL
// ============================================
function refreshAllViews() {
    renderAlumniTable();
    renderStageTable();
}

// ============================================
// ALERTES
// ============================================
function showAlert(message, type) {
    // Supprimer les alertes existantes
    document.querySelectorAll('.alert').forEach(a => a.remove());

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '80px';
    alert.style.right = '20px';
    alert.style.zIndex = '3000';
    alert.style.minWidth = '300px';
    alert.style.boxShadow = 'var(--shadow-lg)';

    document.body.appendChild(alert);

    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateX(100%)';
        alert.style.transition = 'all 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
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
