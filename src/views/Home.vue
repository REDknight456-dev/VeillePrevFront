<template>
  <div class="home">
    <div class="hero-section">
      <h1>Bienvenue sur Veille Préventive</h1>
      <p>Système de gestion des termes juridiques et des lois</p>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>{{ juridicalTermsCount }}</h3>
        <p>Termes Juridiques</p>
      </div>
      <div class="stat-card">
        <h3>{{ lawsCount }}</h3>
        <p>Lois</p>
      </div>
    </div>

    <div class="connection-status">
      <h3>État de la connexion au backend</h3>
      <div class="status-indicator" :class="{ 'connected': isConnected, 'disconnected': !isConnected }">
        {{ connectionStatus }}
      </div>
    </div>
  </div>
</template>

<script>
import { juridicalTermsAPI, lawsAPI } from '../services/api.js'

export default {
  name: 'Home',
  data() {
    return {
      juridicalTermsCount: 0,
      lawsCount: 0,
      isConnected: false,
      connectionStatus: 'Vérification...'
    }
  },
  async mounted() {
    await this.checkConnection()
    await this.loadStats()
  },
  methods: {
    async checkConnection() {
      try {
        await juridicalTermsAPI.getAll()
        this.isConnected = true
        this.connectionStatus = 'Connecté au backend (port 9090)'
      } catch (error) {
        this.isConnected = false
        this.connectionStatus = 'Déconnecté - Vérifiez que le backend fonctionne sur le port 9090'
        console.error('Connection error:', error)
      }
    },
    async loadStats() {
      try {
        const [termsResponse, lawsResponse] = await Promise.all([
          juridicalTermsAPI.getAll().catch(() => ({ data: [] })),
          lawsAPI.getAll().catch(() => ({ data: [] }))
        ])
        this.juridicalTermsCount = termsResponse.data?.length || 0
        this.lawsCount = lawsResponse.data?.length || 0
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }
  }
}
</script>

<style scoped>
.home {
  padding: 2rem 0;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
}

.hero-section h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero-section p {
  color: #7f8c8d;
  font-size: 1.2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  color: #3498db;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-card p {
  color: #7f8c8d;
  font-weight: 500;
}

.connection-status {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.connection-status h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.status-indicator {
  padding: 1rem;
  border-radius: 4px;
  font-weight: bold;
}

.status-indicator.connected {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-indicator.disconnected {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>