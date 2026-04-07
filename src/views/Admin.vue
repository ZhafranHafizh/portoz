<template>
  <div class="admin-view">
    <div v-if="!isAuthenticated" class="login-container">
      <div class="login-box">
        <h2>Admin Login</h2>
        <p>Please enter your password to access the CMS.</p>
        <form @submit.prevent="login">
          <input 
            type="password" 
            v-model="passwordInput" 
            placeholder="Admin Password" 
            required 
            class="form-input"
          />
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        <p v-if="loginError" class="error-text">{{ loginError }}</p>
      </div>
    </div>

    <div v-else class="cms-container">
      <div class="cms-header">
        <h1>Portfolio Projects CMS</h1>
        <div class="header-actions">
          <button @click="openAddModal" class="btn btn-primary">+ Add New Project</button>
          <button @click="logout" class="btn btn-secondary">Logout</button>
        </div>
      </div>

      <div class="cms-content">
        <div v-if="loading" class="loading-state">Loading projects...</div>
        
        <table v-else class="projects-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in projects" :key="project.id">
              <td>{{ project.id }}</td>
              <td>
                <img :src="project.imageUrl || 'https://via.placeholder.com/50'" alt="thumbnail" class="thumbnail" />
              </td>
              <td class="td-title">{{ project.title }}</td>
              <td>{{ Array.isArray(project.category) ? project.category.join(', ') : project.category }}</td>
              <td class="action-buttons">
                <button @click="openEditModal(project)" class="btn btn-sm btn-edit">Edit</button>
                <button @click="confirmDelete(project.id)" class="btn btn-sm btn-delete">Delete</button>
              </td>
            </tr>
            <tr v-if="projects.length === 0">
              <td colspan="5" class="empty-state">No projects found. Try adding one!</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ isEditing ? 'Edit Project' : 'Add New Project' }}</h2>
            <button class="close-btn" @click="showModal = false">&times;</button>
          </div>
          
          <form @submit.prevent="saveProject" class="project-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Title *</label>
                <input type="text" v-model="formData.title" required class="form-input" />
              </div>
              <div class="form-group">
                <label>Category (comma separated for multiple)</label>
                <input type="text" v-model="formData.category" class="form-input" />
              </div>
              <div class="form-group full-width">
                <label>Description</label>
                <textarea v-model="formData.description" class="form-input" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label>Image URL</label>
                <input type="text" v-model="formData.imageUrl" class="form-input" placeholder="../galeri/image.webp or pure URL" />
              </div>
              <div class="form-group">
                <label>Live Link</label>
                <input type="text" v-model="formData.link" class="form-input" />
              </div>
              <div class="form-group">
                <label>GitHub Link</label>
                <input type="text" v-model="formData.github" class="form-input" />
              </div>
              <div class="form-group">
                <label>Figma Link</label>
                <input type="text" v-model="formData.figma" class="form-input" />
              </div>
              <div class="form-group full-width">
                <label>Tags (comma separated)</label>
                <input type="text" v-model="formData.tags" class="form-input" placeholder="Vue.js, Frontend, UI/UX" />
              </div>
              <div class="form-group full-width">
                <label>Features (one per line)</label>
                <textarea v-model="formData.features" class="form-input" rows="4"></textarea>
              </div>
              <div class="form-group full-width">
                <label>Challenges</label>
                <textarea v-model="formData.challenges" class="form-input" rows="2"></textarea>
              </div>
              <div class="form-group">
                <label>Duration / Timeline</label>
                <input type="text" v-model="formData.duration" class="form-input" />
              </div>
              <div class="form-group">
                <label>Team Size/Name</label>
                <input type="text" v-model="formData.team" class="form-input" />
              </div>
              <div class="form-group">
                <label>Your Role</label>
                <input type="text" v-model="formData.role" class="form-input" />
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="showModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? 'Saving...' : 'Save Project' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminView',
  data() {
    return {
      isAuthenticated: false,
      passwordInput: '',
      loginError: '',
      loading: false,
      saving: false,
      projects: [],
      showModal: false,
      isEditing: false,
      formData: this.getDefaultFormData()
    }
  },
  mounted() {
    const savedPassword = sessionStorage.getItem('adminToken');
    if (savedPassword) {
      this.passwordInput = savedPassword;
      this.fetchProjects(true); // Attempt silent login
    }
  },
  methods: {
    getDefaultFormData() {
      return {
        id: null,
        title: '',
        description: '',
        imageUrl: '',
        link: '',
        github: '',
        figma: '',
        tags: '',
        category: '',
        features: '',
        challenges: '',
        duration: '',
        team: '',
        role: ''
      };
    },
    async login() {
      this.loginError = '';
      this.loading = true;
      await this.fetchProjects(false);
    },
    logout() {
      sessionStorage.removeItem('adminToken');
      this.isAuthenticated = false;
      this.passwordInput = '';
    },
    async fetchProjects(isSilent = false) {
      this.loading = true;
      try {
        const response = await fetch('/.netlify/functions/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        this.projects = data;
        
        // If we reach here and it's a login attempt, we check if password is correct 
        // by making a test protected call, or we just assume it's true until we try to write.
        // Let's do a dummy validation by sending a small request or just trusting it until a POST fails.
        // Actually, let's just authenticate them and only error out during POST/PUT.
        // But better yet, we can't test unless we try a protected endpoint. 
        // We'll trust the password entry for reading, but it will fail on write if wrong.
        
        this.isAuthenticated = true;
        sessionStorage.setItem('adminToken', this.passwordInput);
      } catch (err) {
        if (!isSilent) {
          this.loginError = 'Error fetching data. Check your connection.';
        }
      } finally {
        this.loading = false;
      }
    },
    openAddModal() {
      this.isEditing = false;
      this.formData = this.getDefaultFormData();
      this.showModal = true;
    },
    openEditModal(project) {
      this.isEditing = true;
      // Convert arrays/json to strings for forms
      this.formData = {
        ...project,
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
        category: Array.isArray(project.category) ? project.category.join(', ') : project.category || '',
        features: Array.isArray(project.features) ? project.features.join('\n') : project.features || ''
      };
      this.showModal = true;
    },
    getFormattedData() {
      // Convert comma strings back to array
      return {
        ...this.formData,
        tags: this.formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        category: this.formData.category.includes(',') 
          ? this.formData.category.split(',').map(c => c.trim()).filter(Boolean)
          : this.formData.category.trim(),
        features: this.formData.features.split('\n').map(f => f.trim()).filter(Boolean)
      };
    },
    async saveProject() {
      this.saving = true;
      const url = '/.netlify/functions/projects';
      const method = this.isEditing ? 'PUT' : 'POST';
      const payload = this.getFormattedData();

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.passwordInput
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          if (response.status === 401) {
            this.loginError = 'Invalid Password! Failed to save.';
            this.logout();
            this.showModal = false;
            throw new Error('Unauthorized');
          }
          throw new Error('Failed to save');
        }

        await this.fetchProjects(); // Refresh table
        this.showModal = false;
      } catch (err) {
        alert(err.message || 'An error occurred while saving.');
      } finally {
        this.saving = false;
      }
    },
    async confirmDelete(id) {
      if (!confirm('Are you sure you want to delete this project?')) return;
      
      try {
        const response = await fetch('/.netlify/functions/projects', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.passwordInput
          },
          body: JSON.stringify({ id })
        });

        if (!response.ok) {
           if (response.status === 401) {
            this.logout();
            alert('Unauthorized. Please login again.');
            return;
          }
          throw new Error('Failed to delete');
        }

        await this.fetchProjects(); // Refresh table
      } catch (err) {
        alert(err.message || 'An error occurred while deleting.');
      }
    }
  }
}
</script>

<style scoped>
.admin-view {
  min-height: 100vh;
  background-color: #f3f4f6;
  color: #1f2937;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Light theme specifically forced for Admin to differentiate from main site */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-box h2 {
  margin-bottom: 10px;
}

.login-box p {
  color: #6b7280;
  margin-bottom: 20px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
  box-sizing: border-box;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: auto;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  width: 100%;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-primary:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #4b5563;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-edit {
  background-color: #f59e0b;
  color: white;
  margin-right: 8px;
}

.btn-edit:hover { background-color: #d97706; }

.btn-delete {
  background-color: #ef4444;
  color: white;
}

.btn-delete:hover { background-color: #dc2626; }

.error-text {
  color: #ef4444;
  margin-top: 10px;
  font-size: 14px;
}

/* CMS Dashboard */
.cms-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.cms-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.header-actions .btn {
  width: auto;
}

.cms-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow-x: auto;
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
}

.projects-table th, 
.projects-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.projects-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.thumbnail {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  background: #f3f4f6;
}

.td-title {
  font-weight: 500;
}

.action-buttons {
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  padding: 40px !important;
  color: #6b7280;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
}

.project-form {
  padding: 20px;
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 14px;
  color: #374151;
}

textarea.form-input {
  resize: vertical;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.form-actions .btn {
  width: auto;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
