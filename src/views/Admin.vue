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
        <button 
          :class="['tab-btn', { active: activeTab === 'sitecontent' }]"
          @click="activeTab = 'sitecontent'"
        >
          <i class="fas fa-file-alt"></i> Site Content
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'cvmanager' }]"
          @click="activeTab = 'cvmanager'"
        >
          <i class="fas fa-file-pdf"></i> CV Manager
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

        <!-- Site Content Tab -->
      <div v-if="activeTab === 'sitecontent'">
        <div class="tab-header">
          <h2>Site Content Management</h2>
          <div style="display: flex; gap: 10px;">
            <button @click="fetchSiteContent" class="btn btn-secondary" :disabled="loadingSiteContent">
              <i class="fas fa-sync-alt"></i> Refresh
            </button>
            <button @click="saveAllSiteContent" class="btn btn-primary" :disabled="savingSiteContent">
              {{ savingSiteContent ? 'Saving...' : 'Save All Changes' }}
            </button>
          </div>
        </div>

        <div v-if="loadingSiteContent" class="loading-state">Loading site content...</div>
        <div v-else-if="siteContentError" class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <p>{{ siteContentError }}</p>
          <button @click="fetchSiteContent" class="btn btn-primary">Retry</button>
        </div>

        <div v-else class="site-content-editor">
          <!-- Home Page Section -->
          <div class="content-section">
            <h3>
              <button class="section-toggle" @click="toggleSection('home')">
                <i :class="expandedSections.home ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
                Home Page
              </button>
            </h3>
            <div v-if="expandedSections.home" class="section-body">
              <div class="form-group">
                <label>Profile Image</label>
                <input type="file" @change="handleHomeProfileUpload" class="form-input" accept="image/*" />
                <p v-if="uploadingProfileImage" class="status-info">Uploading image...</p>
                <img v-if="siteContent.home.hero.profile_image" :src="siteContent.home.hero.profile_image" class="preview-img" alt="preview" />
              </div>
              <div class="form-group">
                <label>Hero Title (supports **bold**)</label>
                <textarea v-model="siteContent.home.hero.title" class="form-input" rows="2"></textarea>
              </div>
              <div class="form-group">
                <label>Hero Subtitle</label>
                <textarea v-model="siteContent.home.hero.subtitle" class="form-input" rows="2"></textarea>
              </div>
              <div class="form-group">
                <label>Hero Description</label>
                <textarea v-model="siteContent.home.hero.description" class="form-input" rows="4"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>CTA Button Text</label>
                  <input type="text" v-model="siteContent.home.hero.cta_text" class="form-input" />
                </div>
                <div class="form-group">
                  <label>CTA Button Link</label>
                  <input type="text" v-model="siteContent.home.hero.cta_link" class="form-input" />
                </div>
              </div>
            </div>
          </div>

          <!-- About Page Section -->
          <div class="content-section">
            <h3>
              <button class="section-toggle" @click="toggleSection('about')">
                <i :class="expandedSections.about ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
                About Page
              </button>
            </h3>
            <div v-if="expandedSections.about" class="section-body">
              <h4>Profile Section</h4>
              <div class="form-group">
                <label>Profile Image</label>
                <input type="file" @change="handleAboutProfileUpload" class="form-input" accept="image/*" />
                <p v-if="uploadingAboutImage" class="status-info">Uploading image...</p>
                <img v-if="siteContent.about.profile.image" :src="siteContent.about.profile.image" class="preview-img" alt="preview" />
              </div>
              <div class="form-group">
                <label>Heading</label>
                <input type="text" v-model="siteContent.about.profile.heading" class="form-input" />
              </div>
              <div class="form-group">
                <label>Tagline (use ** for bold)</label>
                <textarea v-model="siteContent.about.profile.tagline" class="form-input" rows="2"></textarea>
              </div>
              <div class="form-group">
                <label>Introduction</label>
                <textarea v-model="siteContent.about.profile.intro" class="form-input" rows="3"></textarea>
              </div>

              <h4>Philosophy Section</h4>
              <div class="form-group">
                <label>Heading</label>
                <input type="text" v-model="siteContent.about.philosophy.heading" class="form-input" />
              </div>
              <div class="form-group">
                <label>Content</label>
                <textarea v-model="siteContent.about.philosophy.content" class="form-input" rows="5"></textarea>
              </div>

              <h4>Expertise Section</h4>
              <div class="form-group">
                <label>Heading</label>
                <input type="text" v-model="siteContent.about.expertise.heading" class="form-input" />
              </div>
              <div class="form-group">
                <label>Intro Text</label>
                <textarea v-model="siteContent.about.expertise.intro" class="form-input" rows="2"></textarea>
              </div>
              <div class="form-group">
                <label>Skills (JSON array - advanced)</label>
                <textarea v-model="siteContent.about.expertise.skills_raw" class="form-input form-textarea-mono" rows="8" placeholder='[{"title":"Skill","desc":"Description"}]'></textarea>
                <p class="hint-text">Format: JSON array of {"title":"...","desc":"..."}</p>
              </div>

              <h4>Connect Section</h4>
              <div class="form-group">
                <label>Heading</label>
                <input type="text" v-model="siteContent.about.connect.heading" class="form-input" />
              </div>
              <div class="form-group">
                <label>Content</label>
                <textarea v-model="siteContent.about.connect.content" class="form-input" rows="3"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>CTA Button Text</label>
                  <input type="text" v-model="siteContent.about.connect.cta_text" class="form-input" />
                </div>
                <div class="form-group">
                  <label>CTA Button Link</label>
                  <input type="text" v-model="siteContent.about.connect.cta_link" class="form-input" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CV Manager Tab -->
      <div v-if="activeTab === 'cvmanager'">
        <div class="tab-header">
          <h2>CV Management</h2>
          <button @click="openUploadCVModal" class="btn btn-primary">+ Upload New CV</button>
        </div>

        <div v-if="loadingCV" class="loading-state">Loading CV files...</div>

        <table v-else class="projects-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Filename</th>
              <th>Uploaded At</th>
              <th>Version Note</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cv in cvFiles" :key="cv.id">
              <td>{{ cv.id }}</td>
              <td>{{ cv.filename }}</td>
              <td>{{ new Date(cv.uploaded_at).toLocaleDateString() }}</td>
              <td>{{ cv.version_note || '-' }}</td>
              <td>
                <span :class="cv.is_active ? 'status-active' : 'status-inactive'">
                  {{ cv.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="action-buttons">
                <button v-if="!cv.is_active" @click="setActiveCV(cv.id)" class="btn btn-sm btn-activate">Activate</button>
                <button @click="confirmDeleteCV(cv.id)" class="btn btn-sm btn-delete">Delete</button>
              </td>
            </tr>
            <tr v-if="cvFiles.length === 0">
              <td colspan="6" class="empty-state">No CV files found. Upload your first CV!</td>
            </tr>
          </tbody>
        </table>

        <div class="cv-info-box">
          <h4><i class="fas fa-info-circle"></i> How it works</h4>
          <ul>
            <li>Upload your CV as a PDF file</li>
            <li>Only one CV can be "Active" at a time - this is the one users will download</li>
            <li>Click "Activate" to make an older version the active download</li>
            <li>The active CV will be used on the About page and Project pages</li>
          </ul>
        </div>
      </div>
    </div> <!-- Close cms-content and cms-container -->

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

    <!-- Upload CV Modal -->
    <div v-if="showUploadCVModal" class="modal-overlay" @click.self="showUploadCVModal = false">
      <div class="modal-content modal-small">
        <div class="modal-header">
          <h2>Upload New CV</h2>
          <button class="close-btn" @click="showUploadCVModal = false">&times;</button>
        </div>

        <form @submit.prevent="uploadCV" class="project-form">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>CV File (PDF) *</label>
              <input type="file" @change="handleCVFileUpload" class="form-input" accept=".pdf" required />
              <p v-if="uploadingCV" class="status-info">Uploading CV file...</p>
              <p v-if="cvForm.filename" class="status-info">Selected: {{ cvForm.filename }}</p>
            </div>
            <div class="form-group full-width">
              <label>Version Note (optional)</label>
              <input type="text" v-model="cvForm.version_note" class="form-input" placeholder="e.g., Updated for 2025" />
            </div>
            <div class="form-group full-width">
              <label>
                <input type="checkbox" v-model="cvForm.is_active" style="margin-right: 8px;" />
                Set as Active CV (will be available for download)
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="showUploadCVModal = false">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="uploadingCV || savingCV">
              {{ uploadingCV ? 'Uploading...' : savingCV ? 'Saving...' : 'Upload CV' }}
            </button>
          </div>
        </form>
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
      galleryForm: this.getDefaultGalleryData(),
      
      // Site Content
      loadingSiteContent: false,
      savingSiteContent: false,
      uploadingProfileImage: false,
      uploadingAboutImage: false,
      siteContentError: '',
      siteContent: {
        home: {
          hero: {
            profile_image: '',
            title: '',
            subtitle: '',
            description: '',
            cta_text: '',
            cta_link: ''
          }
        },
        about: {
          profile: { image: '', heading: '', tagline: '', intro: '' },
          philosophy: { heading: '', content: '' },
          expertise: { heading: '', intro: '', skills_raw: '' },
          connect: { heading: '', content: '', cta_text: '', cta_link: '' }
        }
      },
      expandedSections: { home: true, about: true },
      
      // CV Manager
      loadingCV: false,
      savingCV: false,
      uploadingCV: false,
      cvFiles: [],
      showUploadCVModal: false,
      cvForm: { filename: '', file_url: '', version_note: '', is_active: false },
      cvFileToUpload: null
    }
  },
  mounted() {
    supabase.auth.getSession().then(({ data: { session } }) => {
      this.session = session;
      if (this.session) {
        this.fetchProjects();
        this.fetchGalleryImages();
        this.fetchSiteContent();
        this.fetchCVFiles();
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      this.session = session;
      if (this.session) {
        this.fetchProjects();
        this.fetchGalleryImages();
        this.fetchSiteContent();
        this.fetchCVFiles();
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
    },
    
    // Site Content Methods
    async fetchSiteContent() {
      this.loadingSiteContent = true;
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('*');

        if (error) {
          console.error('Error fetching site content:', error);
          this.siteContentError = 'Failed to load content: ' + error.message;
          this.loadingSiteContent = false;
          return;
        }

        if (data && data.length > 0) {
          // Map database data to the siteContent structure
          data.forEach(item => {
            const page = item.page;
            const section = item.section;
            const key = item.key;
            let value = item.value;
            
            // Handle JSONB vs string
            if (typeof value === 'object') {
              value = JSON.stringify(value);
            } else if (typeof value === 'string') {
              // Remove surrounding quotes if present
              if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
              }
            }
            
            if (this.siteContent[page] && this.siteContent[page][section]) {
              // Vue 3: Direct assignment (no this.$set needed)
              this.siteContent[page][section][key] = value;
            }
          });
          
          // Handle skills separately
          const skillsItem = data.find(item => item.page === 'about' && item.section === 'expertise' && item.key === 'skills');
          if (skillsItem && skillsItem.value) {
            this.siteContent.about.expertise.skills_raw = typeof skillsItem.value === 'string' 
              ? skillsItem.value 
              : JSON.stringify(skillsItem.value, null, 2);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        this.siteContentError = 'Failed to load content: ' + error.message;
      }
      this.loadingSiteContent = false;
    },
    toggleSection(section) {
      // Vue 3: Direct assignment
      this.expandedSections[section] = !this.expandedSections[section];
    },
    async handleHomeProfileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.uploadingProfileImage = true;
      const fileExt = file.name.split('.').pop();
      const fileName = `home-profile-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message);
        this.uploadingProfileImage = false;
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      this.siteContent.home.hero.profile_image = publicUrl;
      this.uploadingProfileImage = false;
    },
    async handleAboutProfileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.uploadingAboutImage = true;
      const fileExt = file.name.split('.').pop();
      const fileName = `about-profile-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message);
        this.uploadingAboutImage = false;
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      this.siteContent.about.profile.image = publicUrl;
      this.uploadingAboutImage = false;
    },
    async saveAllSiteContent() {
      this.savingSiteContent = true;
      let hasError = false;

      try {
        // Save all content items
        const contentToSave = [];
        
        // Home content
        Object.entries(this.siteContent.home.hero).forEach(([key, value]) => {
          contentToSave.push({
            page: 'home',
            section: 'hero',
            key,
            value: key === 'profile_image' ? value : `"${value}"`
          });
        });

        // About content
        Object.entries(this.siteContent.about).forEach(([section, data]) => {
          Object.entries(data).forEach(([key, value]) => {
            if (key === 'skills_raw') {
              // Handle skills separately as JSONB
              try {
                const parsedSkills = JSON.parse(value);
                contentToSave.push({
                  page: 'about',
                  section: 'expertise',
                  key: 'skills',
                  value: parsedSkills
                });
              } catch (e) {
                alert('Invalid JSON format for skills. Please check the format.');
                hasError = true;
              }
            } else {
              contentToSave.push({
                page: 'about',
                section,
                key,
                value: `"${value}"`
              });
            }
          });
        });

        // Upsert each content item
        for (const item of contentToSave) {
          const { error } = await supabase
            .from('site_content')
            .upsert(item, { onConflict: 'page,section,key' });

          if (error) {
            console.error('Error saving content:', error);
            hasError = true;
          }
        }

        if (!hasError) {
          alert('All site content saved successfully!');
        }
      } catch (error) {
        alert('Error saving site content: ' + error.message);
      }
      
      this.savingSiteContent = false;
    },

    // CV Management Methods
    async fetchCVFiles() {
      this.loadingCV = true;
      const { data, error } = await supabase
        .from('cv_files')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching CV files:', error);
      } else {
        this.cvFiles = data;
      }
      this.loadingCV = false;
    },
    openUploadCVModal() {
      this.cvForm = { filename: '', file_url: '', version_note: '', is_active: false };
      this.cvFileToUpload = null;
      this.showUploadCVModal = true;
    },
    async handleCVFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file only.');
        return;
      }

      this.uploadingCV = true;
      this.cvFileToUpload = file;
      this.cvForm.filename = file.name;

      const fileExt = file.name.split('.').pop();
      const fileName = `cv_${Date.now()}.${fileExt}`;
      const filePath = `cvs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        alert('Error uploading CV: ' + uploadError.message);
        this.uploadingCV = false;
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      this.cvForm.file_url = publicUrl;
      this.uploadingCV = false;
    },
    async uploadCV() {
      if (!this.cvForm.file_url) {
        alert('Please upload a CV file first.');
        return;
      }

      this.savingCV = true;

      try {
        // If setting as active, deactivate all others first
        if (this.cvForm.is_active) {
          await supabase
            .from('cv_files')
            .update({ is_active: false })
            .neq('id', 0); // Will update all in next step
        }

        const { error } = await supabase
          .from('cv_files')
          .insert([{
            filename: this.cvForm.filename,
            file_url: this.cvForm.file_url,
            version_note: this.cvForm.version_note,
            is_active: this.cvForm.is_active
          }]);

        if (error) {
          alert('Error uploading CV: ' + error.message);
        } else {
          // If this is active, deactivate others
          if (this.cvForm.is_active) {
            const { data: newCV } = await supabase
              .from('cv_files')
              .select('id')
              .order('uploaded_at', { ascending: false })
              .limit(1);
            
            if (newCV && newCV[0]) {
              await supabase
                .from('cv_files')
                .update({ is_active: false })
                .neq('id', newCV[0].id);
              
              await supabase
                .from('cv_files')
                .update({ is_active: true })
                .eq('id', newCV[0].id);
            }
          }
          
          await this.fetchCVFiles();
          this.showUploadCVModal = false;
        }
      } catch (error) {
        alert('Error uploading CV: ' + error.message);
      }
      
      this.savingCV = false;
    },
    async setActiveCV(id) {
      if (!confirm('Set this CV as the active one for downloads?')) return;

      try {
        // Deactivate all
        await supabase
          .from('cv_files')
          .update({ is_active: false });

        // Activate selected one
        const { error } = await supabase
          .from('cv_files')
          .update({ is_active: true })
          .eq('id', id);

        if (error) {
          alert('Error activating CV: ' + error.message);
        } else {
          await this.fetchCVFiles();
        }
      } catch (error) {
        alert('Error activating CV: ' + error.message);
      }
    },
    async confirmDeleteCV(id) {
      if (!confirm('Are you sure you want to delete this CV file?')) return;

      const { error } = await supabase
        .from('cv_files')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Error deleting CV: ' + error.message);
      } else {
        await this.fetchCVFiles();
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

/* Site Content Editor Styles */
.site-content-editor {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.content-section {
  margin-bottom: 30px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.content-section h3 {
  margin: 0;
  padding: 0;
}

.section-toggle {
  width: 100%;
  padding: 16px 20px;
  background: #f9fafb;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-toggle:hover {
  background: #f3f4f6;
}

.section-body {
  padding: 20px;
}

.section-body h4 {
  margin: 20px 0 10px 0;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-textarea-mono {
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.hint-text {
  font-size: 12px;
  color: #6b7280;
  margin-top: 5px;
}

/* CV Manager Styles */
.cv-info-box {
  margin-top: 30px;
  padding: 20px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  text-align: center;
}

.error-state i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #ef4444;
}

.error-state p {
  font-size: 14px;
  color: #991b1b;
  margin: 0 0 20px 0;
  max-width: 500px;
}

.cv-info-box h4 {
  margin: 0 0 10px 0;
  color: #0369a1;
  font-size: 14px;
}

.cv-info-box ul {
  margin: 0;
  padding-left: 20px;
  color: #0c4a6e;
  font-size: 13px;
}

.cv-info-box li {
  margin-bottom: 5px;
}

.status-active {
  display: inline-block;
  padding: 4px 12px;
  background: #dcfce7;
  color: #166534;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-inactive {
  display: inline-block;
  padding: 4px 12px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.btn-activate {
  background-color: #22c55e;
  color: white;
  margin-right: 8px;
}

.btn-activate:hover {
  background-color: #16a34a;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .tab-btn {
    padding: 10px 16px;
    font-size: 14px;
  }
}
</style>
