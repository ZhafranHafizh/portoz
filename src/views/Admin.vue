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
        <h1>Portfolio CMS</h1>
        <div class="header-actions">
          <button @click="handleLogout" class="btn btn-secondary">Logout</button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button 
          :class="['tab-btn', { active: activeTab === 'projects' }]"
          @click="activeTab = 'projects'"
        >
          <i class="fas fa-folder"></i> Projects
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'gallery' }]"
          @click="activeTab = 'gallery'"
        >
          <i class="fas fa-images"></i> Gallery
        </button>
      </div>

      <div class="cms-content">
        <!-- Projects Tab -->
        <div v-if="activeTab === 'projects'">
          <div class="tab-header">
            <h2>Projects Management</h2>
            <button @click="openAddProjectModal" class="btn btn-primary">+ Add New Project</button>
          </div>

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
                  <button @click="openEditProjectModal(project)" class="btn btn-sm btn-edit">Edit</button>
                  <button @click="confirmDeleteProject(project.id)" class="btn btn-sm btn-delete">Delete</button>
                </td>
              </tr>
              <tr v-if="projects.length === 0">
                <td colspan="5" class="empty-state">No projects found. Try adding one!</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Gallery Tab -->
        <div v-if="activeTab === 'gallery'">
          <div class="tab-header">
            <h2>Gallery Management</h2>
            <button @click="openAddGalleryModal" class="btn btn-primary">+ Add Gallery Image</button>
          </div>

          <div v-if="loadingGallery" class="loading-state">Loading gallery...</div>

          <table v-else class="projects-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="image in galleryImages" :key="image.id">
                <td>{{ image.id }}</td>
                <td>
                  <img :src="image.image_url || 'https://via.placeholder.com/50'" alt="thumbnail" class="thumbnail" />
                </td>
                <td class="td-title">{{ image.title }}</td>
                <td>{{ image.category }}</td>
                <td>{{ image.display_order }}</td>
                <td class="action-buttons">
                  <button @click="openEditGalleryModal(image)" class="btn btn-sm btn-edit">Edit</button>
                  <button @click="confirmDeleteGallery(image.id)" class="btn btn-sm btn-delete">Delete</button>
                </td>
              </tr>
              <tr v-if="galleryImages.length === 0">
                <td colspan="6" class="empty-state">No gallery images found. Try adding one!</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add/Edit Project Modal -->
      <div v-if="showProjectModal" class="modal-overlay" @click.self="showProjectModal = false">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ isEditingProject ? 'Edit Project' : 'Add New Project' }}</h2>
            <button class="close-btn" @click="showProjectModal = false">&times;</button>
          </div>

          <form @submit.prevent="saveProject" class="project-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Title *</label>
                <input type="text" v-model="projectForm.title" required class="form-input" />
              </div>
              <div class="form-group">
                <label>Category (comma separated for multiple)</label>
                <input type="text" v-model="projectForm.category" class="form-input" />
              </div>
              <div class="form-group full-width">
                <label>Description</label>
                <textarea v-model="projectForm.description" class="form-input" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label>Image Upload (Bucket: images) *</label>
                <input type="file" @change="handleProjectFileUpload" class="form-input" accept="image/*" />
                <p v-if="uploadingProject" class="status-info">Uploading image...</p>
                <img v-if="projectForm.image_url" :src="projectForm.image_url" class="preview-img" alt="preview" />
              </div>
              <div class="form-group">
                <label>Live Link</label>
                <input type="text" v-model="projectForm.link" class="form-input" />
              </div>
              <div class="form-group">
                <label>GitHub Link</label>
                <input type="text" v-model="projectForm.github" class="form-input" />
              </div>
              <div class="form-group">
                <label>Figma Link</label>
                <input type="text" v-model="projectForm.figma" class="form-input" />
              </div>
              <div class="form-group full-width">
                <label>Tags (comma separated)</label>
                <input type="text" v-model="projectForm.tags" class="form-input" placeholder="Vue.js, Frontend, UI/UX" />
              </div>
              <div class="form-group full-width">
                <label>Features (one per line)</label>
                <textarea v-model="projectForm.features" class="form-input" rows="4"></textarea>
              </div>
              <div class="form-group full-width">
                <label>Challenges</label>
                <textarea v-model="projectForm.challenges" class="form-input" rows="2"></textarea>
              </div>
              <div class="form-group">
                <label>Duration / Timeline</label>
                <input type="text" v-model="projectForm.duration" class="form-input" />
              </div>
              <div class="form-group">
                <label>Team Size/Name</label>
                <input type="text" v-model="projectForm.team" class="form-input" />
              </div>
              <div class="form-group">
                <label>Your Role</label>
                <input type="text" v-model="projectForm.role" class="form-input" />
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="showProjectModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="savingProject || uploadingProject">
                {{ savingProject ? 'Saving...' : 'Save Project' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Add/Edit Gallery Modal -->
      <div v-if="showGalleryModal" class="modal-overlay" @click.self="showGalleryModal = false">
        <div class="modal-content modal-small">
          <div class="modal-header">
            <h2>{{ isEditingGallery ? 'Edit Gallery Image' : 'Add Gallery Image' }}</h2>
            <button class="close-btn" @click="showGalleryModal = false">&times;</button>
          </div>

          <form @submit.prevent="saveGalleryImage" class="project-form">
            <div class="form-grid">
              <div class="form-group full-width">
                <label>Title *</label>
                <input type="text" v-model="galleryForm.title" required class="form-input" />
              </div>
              <div class="form-group full-width">
                <label>Description</label>
                <textarea v-model="galleryForm.description" class="form-input" rows="3"></textarea>
              </div>
              <div class="form-group full-width">
                <label>Image Upload (Bucket: gallery) *</label>
                <input type="file" @change="handleGalleryFileUpload" class="form-input" accept="image/*" />
                <p v-if="uploadingGallery" class="status-info">Uploading image...</p>
                <img v-if="galleryForm.image_url" :src="galleryForm.image_url" class="preview-img" alt="preview" />
              </div>
              <div class="form-group">
                <label>Category *</label>
                <select v-model="galleryForm.category" class="form-input" required>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Website">Website</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Branding">Branding</option>
                </select>
              </div>
              <div class="form-group">
                <label>Display Order</label>
                <input type="number" v-model.number="galleryForm.display_order" class="form-input" min="0" />
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="showGalleryModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="savingGallery || uploadingGallery">
                {{ savingGallery ? 'Saving...' : 'Save Gallery Image' }}
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
      activeTab: 'projects',
      
      // Projects
      loading: false,
      savingProject: false,
      uploadingProject: false,
      projects: [],
      showProjectModal: false,
      isEditingProject: false,
      projectForm: this.getDefaultProjectData(),
      
      // Gallery
      loadingGallery: false,
      savingGallery: false,
      uploadingGallery: false,
      galleryImages: [],
      showGalleryModal: false,
      isEditingGallery: false,
      galleryForm: this.getDefaultGalleryData()
    }
  },
  mounted() {
    supabase.auth.getSession().then(({ data: { session } }) => {
      this.session = session;
      if (this.session) {
        this.fetchProjects();
        this.fetchGalleryImages();
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      this.session = session;
      if (this.session) {
        this.fetchProjects();
        this.fetchGalleryImages();
      }
    });
  },
  methods: {
    getDefaultProjectData() {
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
    getDefaultGalleryData() {
      return {
        id: null,
        title: '',
        description: '',
        image_url: '',
        category: 'Website',
        display_order: 0
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
      this.galleryImages = [];
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
    async fetchGalleryImages() {
      this.loadingGallery = true;
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching gallery images:', error);
      } else {
        this.galleryImages = data;
      }
      this.loadingGallery = false;
    },
    async handleProjectFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.uploadingProject = true;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message);
        this.uploadingProject = false;
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      this.projectForm.image_url = publicUrl;
      this.uploadingProject = false;
    },
    async handleGalleryFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.uploadingGallery = true;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message);
        this.uploadingGallery = false;
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      this.galleryForm.image_url = publicUrl;
      this.uploadingGallery = false;
    },
    openAddProjectModal() {
      this.isEditingProject = false;
      this.projectForm = this.getDefaultProjectData();
      this.showProjectModal = true;
    },
    openEditProjectModal(project) {
      this.isEditingProject = true;
      this.projectForm = {
        ...project,
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
        category: Array.isArray(project.category) ? project.category.join(', ') : project.category || '',
        features: Array.isArray(project.features) ? project.features.join('\n') : project.features || ''
      };
      this.showProjectModal = true;
    },
    openAddGalleryModal() {
      this.isEditingGallery = false;
      this.galleryForm = this.getDefaultGalleryData();
      this.showGalleryModal = true;
    },
    openEditGalleryModal(image) {
      this.isEditingGallery = true;
      this.galleryForm = { ...image };
      this.showGalleryModal = true;
    },
    getCategoryString(category) {
      return Array.isArray(category) ? category.join(', ') : category;
    },
    async saveProject() {
      this.savingProject = true;

      // Clean up data
      const projectData = {
        title: this.projectForm.title,
        description: this.projectForm.description,
        image_url: this.projectForm.image_url,
        link: this.projectForm.link,
        github: this.projectForm.github,
        figma: this.projectForm.figma,
        tags: this.projectForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        category: this.projectForm.category.includes(',')
          ? this.projectForm.category.split(',').map(c => c.trim()).filter(Boolean)
          : this.projectForm.category.trim(),
        features: this.projectForm.features.split('\n').map(f => f.trim()).filter(Boolean),
        challenges: this.projectForm.challenges,
        duration: this.projectForm.duration,
        team: this.projectForm.team,
        role: this.projectForm.role,
        updated_at: new Date().toISOString()
      };

      let error;
      if (this.isEditingProject) {
        ({ error } = await supabase
          .from('portfolio_projects')
          .update(projectData)
          .eq('id', this.projectForm.id));
      } else {
        ({ error } = await supabase
          .from('portfolio_projects')
          .insert([projectData]));
      }

      if (error) {
        alert('Error saving project: ' + error.message);
      } else {
        await this.fetchProjects();
        this.showProjectModal = false;
      }
      this.savingProject = false;
    },
    async saveGalleryImage() {
      this.savingGallery = true;

      const imageData = {
        title: this.galleryForm.title,
        description: this.galleryForm.description,
        image_url: this.galleryForm.image_url,
        category: this.galleryForm.category,
        display_order: this.galleryForm.display_order,
        updated_at: new Date().toISOString()
      };

      let error;
      if (this.isEditingGallery) {
        ({ error } = await supabase
          .from('gallery_images')
          .update(imageData)
          .eq('id', this.galleryForm.id));
      } else {
        ({ error } = await supabase
          .from('gallery_images')
          .insert([imageData]));
      }

      if (error) {
        alert('Error saving gallery image: ' + error.message);
      } else {
        await this.fetchGalleryImages();
        this.showGalleryModal = false;
      }
      this.savingGallery = false;
    },
    async confirmDeleteProject(id) {
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
    },
    async confirmDeleteGallery(id) {
      if (!confirm('Are you sure you want to delete this gallery image?')) return;

      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Error deleting gallery image: ' + error.message);
      } else {
        await this.fetchGalleryImages();
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

.tab-navigation {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0;
}

.tab-btn {
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-btn:hover {
  color: #3b82f6;
}

.tab-btn.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tab-header h2 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
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

.modal-small {
  max-width: 600px;
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
