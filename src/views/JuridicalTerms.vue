<template>
  <div class="juridical-terms">
    <div class="page-header">
      <h1>Termes Juridiques</h1>
      <button @click="showAddForm = true" class="btn btn-primary">Ajouter un terme</button>
    </div>

    <!-- Add Term Form -->
    <div v-if="showAddForm" class="form-overlay">
      <div class="form-modal">
        <h2>Ajouter un terme juridique</h2>
        <form @submit.prevent="addTerm">
          <div class="form-group">
            <label for="term">Terme :</label>
            <input 
              type="text" 
              id="term" 
              v-model="newTerm.term" 
              required
              placeholder="Ex: Jurisprudence"
            >
          </div>
          <div class="form-group">
            <label for="definition">Définition :</label>
            <textarea 
              id="definition" 
              v-model="newTerm.definition" 
              required
              placeholder="Définition du terme juridique..."
              rows="4"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="category">Catégorie :</label>
            <select id="category" v-model="newTerm.category" required>
              <option value="">Sélectionner une catégorie</option>
              <option value="droit-civil">Droit Civil</option>
              <option value="droit-penal">Droit Pénal</option>
              <option value="droit-commercial">Droit Commercial</option>
              <option value="droit-administratif">Droit Administratif</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" @click="cancelAdd" class="btn btn-secondary">Annuler</button>
            <button type="submit" class="btn btn-primary">Ajouter</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Terms List -->
    <div class="terms-list">
      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="terms.length === 0" class="empty-state">
        Aucun terme juridique trouvé. Ajoutez-en un !
      </div>
      <div v-else class="terms-grid">
        <div v-for="term in terms" :key="term.id" class="term-card">
          <div class="term-header">
            <h3>{{ term.term }}</h3>
            <span class="category-badge" :class="getCategoryClass(term.category)">
              {{ getCategoryLabel(term.category) }}
            </span>
          </div>
          <p class="term-definition">{{ term.definition }}</p>
          <div class="term-actions">
            <button @click="editTerm(term)" class="btn btn-small btn-secondary">Modifier</button>
            <button @click="deleteTerm(term.id)" class="btn btn-small btn-danger">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { juridicalTermsAPI } from '../services/api.js'

export default {
  name: 'JuridicalTerms',
  data() {
    return {
      terms: [],
      loading: false,
      error: null,
      showAddForm: false,
      newTerm: {
        term: '',
        definition: '',
        category: ''
      }
    }
  },
  async mounted() {
    await this.loadTerms()
  },
  methods: {
    async loadTerms() {
      this.loading = true
      this.error = null
      try {
        const response = await juridicalTermsAPI.getAll()
        this.terms = response.data || []
      } catch (error) {
        this.error = 'Erreur lors du chargement des termes. Vérifiez la connexion au backend.'
        console.error('Error loading terms:', error)
      } finally {
        this.loading = false
      }
    },
    async addTerm() {
      try {
        await juridicalTermsAPI.create(this.newTerm)
        await this.loadTerms()
        this.cancelAdd()
      } catch (error) {
        this.error = 'Erreur lors de l\'ajout du terme.'
        console.error('Error adding term:', error)
      }
    },
    async deleteTerm(id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce terme ?')) {
        try {
          await juridicalTermsAPI.delete(id)
          await this.loadTerms()
        } catch (error) {
          this.error = 'Erreur lors de la suppression du terme.'
          console.error('Error deleting term:', error)
        }
      }
    },
    editTerm(term) {
      // For now, just show an alert - can be expanded later
      alert('Fonctionnalité de modification à implémenter')
    },
    cancelAdd() {
      this.showAddForm = false
      this.newTerm = { term: '', definition: '', category: '' }
    },
    getCategoryClass(category) {
      const classes = {
        'droit-civil': 'category-civil',
        'droit-penal': 'category-penal',
        'droit-commercial': 'category-commercial',
        'droit-administratif': 'category-admin',
        'autre': 'category-other'
      }
      return classes[category] || 'category-other'
    },
    getCategoryLabel(category) {
      const labels = {
        'droit-civil': 'Droit Civil',
        'droit-penal': 'Droit Pénal',
        'droit-commercial': 'Droit Commercial',
        'droit-administratif': 'Droit Administratif',
        'autre': 'Autre'
      }
      return labels[category] || 'Autre'
    }
  }
}
</script>

<style scoped>
.juridical-terms {
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
  max-width: 500px;
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

.terms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.term-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.term-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.term-header h3 {
  margin: 0;
  color: #2c3e50;
  flex: 1;
}

.category-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-left: 1rem;
}

.category-civil { background-color: #e3f2fd; color: #1976d2; }
.category-penal { background-color: #fce4ec; color: #c2185b; }
.category-commercial { background-color: #e8f5e8; color: #388e3c; }
.category-admin { background-color: #fff3e0; color: #f57c00; }
.category-other { background-color: #f5f5f5; color: #616161; }

.term-definition {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.term-actions {
  display: flex;
  gap: 0.5rem;
}
</style>