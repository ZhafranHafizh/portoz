<template>
  <div class="admin-view">
    <div v-if="!session" class="login-container">
      <div class="login-box">
        <h2>Admin Login</h2>
        <p>Please enter your email and password to access the CMS.</p>
        <form @submit.prevent="handleLogin">
          <input 
            type="email" 
            v-model="email" 
            placeholder="Email" 
            required 
            class="form-input"
          />
          <input 
            type="password" 
            v-model="password" 
            placeholder="Password" 
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
          <button @click="handleLogout" class="btn btn-secondary">Logout</button>
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
                <img :src="project.image_url || 'https://via.placeholder.com/50'" alt="thumbnail" class="thumbnail" />
              </td>
              <td class="td-title">{{ project.title }}</td>
              <td>{{ getCategoryString(project.category) }}</td>
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
                <label>Image Upload (Bucket: images) *</label>
                <input type="file" @change="handleFileUpload" class="form-input" accept="image/*" />
                <p v-if="uploading" class="status-info">Uploading image...</p>
                <img v-if="formData.image_url" :src="formData.image_url" class="preview-img" alt="preview" />
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
              <button type="submit" class="btn btn-primary" :disabled="saving || uploading">
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
import { supabase } from '@/config/supabaseClient';

export default {
  name: 'AdminView',
  data() {
    return {
      session: null,
      email: '',
      password: '',
      loginError: '',
      loading: false,
      saving: false,
      uploading: false,
      projects: [],
      showModal: false,
      isEditing: false,
      formData: this.getDefaultFormData()
    }
  },
  mounted() {
    supabase.auth.getSession().then(({ data: { session } }) => {
      this.session = session;
      if (this.session) this.fetchProjects();
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      this.session = session;
      if (this.session) this.fetchProjects();
    });
  },
  methods: {
    getDefaultFormData() {
      return {
        id: null,
        title: '',
        description: '',
        image_url: '',
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
    async handleLogin() {
      this.loading = true;
      this.loginError = '';
      const { error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      });
      if (error) {
        this.loginError = error.message;
      }
      this.loading = false;
    },
    async handleLogout() {
      await supabase.auth.signOut();
      this.projects = [];
    },
    async fetchProjects() {
      this.loading = true;
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        this.projects = data;
      }
      this.loading = false;
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.uploading = true;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message);
        this.uploading = false;
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      this.formData.image_url = publicUrl;
      this.uploading = false;
    },
    openAddModal() {
      this.isEditing = false;
      this.formData = this.getDefaultFormData();
      this.showModal = true;
    },
    openEditModal(project) {
      this.isEditing = true;
      this.formData = {
        ...project,
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
        category: Array.isArray(project.category) ? project.category.join(', ') : project.category || '',
        features: Array.isArray(project.features) ? project.features.join('\n') : project.features || ''
      };
      this.showModal = true;
    },
    getCategoryString(category) {
      return Array.isArray(category) ? category.join(', ') : category;
    },
    async saveProject() {
      this.saving = true;
      
      // Clean up data
      const projectData = {
        title: this.formData.title,
        description: this.formData.description,
        image_url: this.formData.image_url,
        link: this.formData.link,
        github: this.formData.github,
        figma: this.formData.figma,
        tags: this.formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        category: this.formData.category.includes(',') 
          ? this.formData.category.split(',').map(c => c.trim()).filter(Boolean)
          : this.formData.category.trim(),
        features: this.formData.features.split('\n').map(f => f.trim()).filter(Boolean),
        challenges: this.formData.challenges,
        duration: this.formData.duration,
        team: this.formData.team,
        role: this.formData.role,
        updated_at: new Date().toISOString()
      };

      let error;
      if (this.isEditing) {
        ({ error } = await supabase
          .from('portfolio_projects')
          .update(projectData)
          .eq('id', this.formData.id));
      } else {
        ({ error } = await supabase
          .from('portfolio_projects')
          .insert([projectData]));
      }

      if (error) {
        alert('Error saving project: ' + error.message);
      } else {
        await this.fetchProjects();
        this.showModal = false;
      }
      this.saving = false;
    },
    async confirmDelete(id) {
      if (!confirm('Are you sure you want to delete this project?')) return;
      
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Error deleting project: ' + error.message);
      } else {
        await this.fetchProjects();
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

.btn-delete {
  background-color: #ef4444;
  color: white;
}

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

.preview-img {
  max-width: 200px;
  margin-top: 10px;
  border-radius: 4px;
}

.status-info {
  font-size: 12px;
  color: #3b82f6;
  margin: 5px 0;
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

.form-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
