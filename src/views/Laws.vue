<template>
  <div class="laws">
    <div class="page-header">
      <h1>Lois</h1>
      <button @click="showAddForm = true" class="btn btn-primary">Ajouter une loi</button>
    </div>

    <!-- Add Law Form -->
    <div v-if="showAddForm" class="form-overlay">
      <div class="form-modal">
        <h2>Ajouter une loi</h2>
        <form @submit.prevent="addLaw">
          <div class="form-group">
            <label for="title">Titre de la loi :</label>
            <input 
              type="text" 
              id="title" 
              v-model="newLaw.title" 
              required
              placeholder="Ex: Loi sur la protection des données personnelles"
            >
          </div>
          <div class="form-group">
            <label for="reference">Référence :</label>
            <input 
              type="text" 
              id="reference" 
              v-model="newLaw.reference" 
              required
              placeholder="Ex: L. 78-17 du 6 janvier 1978"
            >
          </div>
          <div class="form-group">
            <label for="description">Description :</label>
            <textarea 
              id="description" 
              v-model="newLaw.description" 
              required
              placeholder="Description de la loi et de son application..."
              rows="4"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="domain">Domaine :</label>
            <select id="domain" v-model="newLaw.domain" required>
              <option value="">Sélectionner un domaine</option>
              <option value="protection-donnees">Protection des données</option>
              <option value="droit-travail">Droit du travail</option>
              <option value="droit-commercial">Droit commercial</option>
              <option value="droit-civil">Droit civil</option>
              <option value="droit-penal">Droit pénal</option>
              <option value="droit-administratif">Droit administratif</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div class="form-group">
            <label for="effectiveDate">Date d'entrée en vigueur :</label>
            <input 
              type="date" 
              id="effectiveDate" 
              v-model="newLaw.effectiveDate" 
              required
            >
          </div>
          <div class="form-group">
            <label for="status">Statut :</label>
            <select id="status" v-model="newLaw.status" required>
              <option value="">Sélectionner un statut</option>
              <option value="en-vigueur">En vigueur</option>
              <option value="abroge">Abrogée</option>
              <option value="modifie">Modifiée</option>
              <option value="projet">Projet de loi</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" @click="cancelAdd" class="btn btn-secondary">Annuler</button>
            <button type="submit" class="btn btn-primary">Ajouter</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Laws List -->
    <div class="laws-list">
      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="laws.length === 0" class="empty-state">
        Aucune loi trouvée. Ajoutez-en une !
      </div>
      <div v-else class="laws-grid">
        <div v-for="law in laws" :key="law.id" class="law-card">
          <div class="law-header">
            <h3>{{ law.title }}</h3>
            <span class="status-badge" :class="getStatusClass(law.status)">
              {{ getStatusLabel(law.status) }}
            </span>
          </div>
          <div class="law-reference">
            <strong>Référence :</strong> {{ law.reference }}
          </div>
          <div class="law-domain">
            <span class="domain-badge" :class="getDomainClass(law.domain)">
              {{ getDomainLabel(law.domain) }}
            </span>
          </div>
          <p class="law-description">{{ law.description }}</p>
          <div class="law-meta">
            <div class="effective-date">
              <strong>Entrée en vigueur :</strong> {{ formatDate(law.effectiveDate) }}
            </div>
          </div>
          <div class="law-actions">
            <button @click="editLaw(law)" class="btn btn-small btn-secondary">Modifier</button>
            <button @click="deleteLaw(law.id)" class="btn btn-small btn-danger">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { lawsAPI } from '../services/api.js'

export default {
  name: 'Laws',
  data() {
    return {
      laws: [],
      loading: false,
      error: null,
      showAddForm: false,
      newLaw: {
        title: '',
        reference: '',
        description: '',
        domain: '',
        effectiveDate: '',
        status: ''
      }
    }
  },
  async mounted() {
    await this.loadLaws()
  },
  methods: {
    async loadLaws() {
      this.loading = true
      this.error = null
      try {
        const response = await lawsAPI.getAll()
        this.laws = response.data || []
      } catch (error) {
        this.error = 'Erreur lors du chargement des lois. Vérifiez la connexion au backend.'
        console.error('Error loading laws:', error)
      } finally {
        this.loading = false
      }
    },
    async addLaw() {
      try {
        await lawsAPI.create(this.newLaw)
        await this.loadLaws()
        this.cancelAdd()
      } catch (error) {
        this.error = 'Erreur lors de l\'ajout de la loi.'
        console.error('Error adding law:', error)
      }
    },
    async deleteLaw(id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette loi ?')) {
        try {
          await lawsAPI.delete(id)
          await this.loadLaws()
        } catch (error) {
          this.error = 'Erreur lors de la suppression de la loi.'
          console.error('Error deleting law:', error)
        }
      }
    },
    editLaw(law) {
      // For now, just show an alert - can be expanded later
      alert('Fonctionnalité de modification à implémenter')
    },
    cancelAdd() {
      this.showAddForm = false
      this.newLaw = {
        title: '',
        reference: '',
        description: '',
        domain: '',
        effectiveDate: '',
        status: ''
      }
    },
    getStatusClass(status) {
      const classes = {
        'en-vigueur': 'status-active',
        'abroge': 'status-repealed',
        'modifie': 'status-modified',
        'projet': 'status-draft'
      }
      return classes[status] || 'status-unknown'
    },
    getStatusLabel(status) {
      const labels = {
        'en-vigueur': 'En vigueur',
        'abroge': 'Abrogée',
        'modifie': 'Modifiée',
        'projet': 'Projet de loi'
      }
      return labels[status] || 'Inconnu'
    },
    getDomainClass(domain) {
      const classes = {
        'protection-donnees': 'domain-data',
        'droit-travail': 'domain-labor',
        'droit-commercial': 'domain-commercial',
        'droit-civil': 'domain-civil',
        'droit-penal': 'domain-penal',
        'droit-administratif': 'domain-admin',
        'autre': 'domain-other'
      }
      return classes[domain] || 'domain-other'
    },
    getDomainLabel(domain) {
      const labels = {
        'protection-donnees': 'Protection des données',
        'droit-travail': 'Droit du travail',
        'droit-commercial': 'Droit commercial',
        'droit-civil': 'Droit civil',
        'droit-penal': 'Droit pénal',
        'droit-administratif': 'Droit administratif',
        'autre': 'Autre'
      }
      return labels[domain] || 'Autre'
    },
    formatDate(dateString) {
      if (!dateString) return 'Non spécifiée'
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR')
    }
  }
}
</script>

<style scoped>
.laws {
  padding: 2rem 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #2c3e50;
  margin: 0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form-modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-modal h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #3498db;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.error {
  color: #e74c3c;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.laws-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.law-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.law-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.law-header h3 {
  margin: 0;
  color: #2c3e50;
  flex: 1;
  line-height: 1.3;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-left: 1rem;
  white-space: nowrap;
}

.status-active { background-color: #d4edda; color: #155724; }
.status-repealed { background-color: #f8d7da; color: #721c24; }
.status-modified { background-color: #fff3cd; color: #856404; }
.status-draft { background-color: #cce5ff; color: #004085; }
.status-unknown { background-color: #f5f5f5; color: #616161; }

.law-reference {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.law-domain {
  margin-bottom: 1rem;
}

.domain-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.domain-data { background-color: #e3f2fd; color: #1976d2; }
.domain-labor { background-color: #fce4ec; color: #c2185b; }
.domain-commercial { background-color: #e8f5e8; color: #388e3c; }
.domain-civil { background-color: #fff3e0; color: #f57c00; }
.domain-penal { background-color: #ffebee; color: #d32f2f; }
.domain-admin { background-color: #f3e5f5; color: #7b1fa2; }
.domain-other { background-color: #f5f5f5; color: #616161; }

.law-description {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.law-meta {
  margin-bottom: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.effective-date {
  color: #666;
  font-size: 0.9rem;
}

.law-actions {
  display: flex;
  gap: 0.5rem;
}
</style>