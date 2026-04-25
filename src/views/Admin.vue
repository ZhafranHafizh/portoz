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
          <button @click="handleLogout" class="btn btn-ghost">Logout</button>
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
        <button 
          :class="['tab-btn', { active: activeTab === 'analytics' }]"
          @click="activeTab = 'analytics'"
        >
          <i class="fas fa-chart-line"></i> Analytics
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'sitesettings' }]"
          @click="activeTab = 'sitesettings'"
        >
          <i class="fas fa-cog"></i> Site Settings
        </button>
      </div>

      <div class="cms-content">
        <!-- Analytics Tab -->
        <div v-if="activeTab === 'analytics'">
          <div class="tab-header">
            <h2>Visitor Analytics</h2>
            <button @click="fetchAnalytics" class="btn btn-ghost"><i class="fas fa-sync"></i> Refresh Data</button>
          </div>

          <div v-if="loadingAnalytics" class="loading-state">Loading analytics data...</div>

          <div v-else class="analytics-dashboard">
            <div class="analytics-summary">
              <div class="stat-card">
                <h3>Total Page Views</h3>
                <p class="stat-value">{{ analyticsStats.totalViews }}</p>
              </div>
              <div class="stat-card">
                <h3>Total Button Clicks</h3>
                <p class="stat-value">{{ analyticsStats.totalClicks }}</p>
              </div>
              <div class="stat-card">
                <h3>Unique Visitors (IPs)</h3>
                <p class="stat-value">{{ analyticsStats.uniqueVisitors }}</p>
              </div>
            </div>

            <div class="analytics-grid">
              <div class="analytics-box">
                <h3>Top Visited Pages</h3>
                <ul class="analytics-list">
                  <li v-for="(count, page) in analyticsStats.topPages" :key="page">
                    <span class="label">{{ page }}</span>
                    <span class="count">{{ count }} views</span>
                  </li>
                </ul>
              </div>

              <div class="analytics-box">
                <h3>Top Button Clicks</h3>
                <ul class="analytics-list">
                  <li v-for="(count, element) in analyticsStats.topClicks" :key="element">
                    <span class="label">{{ element }}</span>
                    <span class="count">{{ count }} clicks</span>
                  </li>
                </ul>
              </div>

              <div class="analytics-box full-width">
                <h3>Visitor Locations</h3>
                <table class="projects-table">
                  <thead>
                    <tr>
                      <th>City</th>
                      <th>Region</th>
                      <th>Country</th>
                      <th>Visits</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="loc in analyticsStats.locations" :key="loc.id">
                      <td>{{ loc.city || 'Unknown' }}</td>
                      <td>{{ loc.region || '-' }}</td>
                      <td>{{ loc.country || '-' }}</td>
                      <td>{{ loc.count }}</td>
                    </tr>
                    <tr v-if="!analyticsStats.locations || analyticsStats.locations.length === 0">
                      <td colspan="4" class="empty-state">No location data available yet.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

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
            <button @click="fetchSiteContent" class="btn btn-ghost" :disabled="loadingSiteContent">
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
          <div class="editor-layout">
            <!-- Left: Editor Form -->
            <div class="editor-panel">
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
                    <label>Hero Title</label>
                    <RichTextEditor 
                      v-model="siteContent.home.hero.title" 
                      placeholder="e.g. Hello, I'm &lt;strong&gt;Zhafran Hafizh&lt;/strong&gt;"
                      :height="100"
                    />
                    <p class="hint-text">Wrap your name in &lt;strong&gt; tags for accent color.</p>
                  </div>
                  <div class="form-group">
                    <label>Hero Subtitle</label>
                    <RichTextEditor 
                      v-model="siteContent.home.hero.subtitle" 
                      placeholder="One-liner about what you do"
                      :height="100"
                    />
                  </div>
                  <div class="form-group">
                    <label>Summary Description</label>
                    <RichTextEditor 
                      v-model="siteContent.home.hero.description" 
                      placeholder="A short paragraph shown in the 'How I work' section"
                      :height="200"
                    />
                    <p class="hint-text">This text appears in the summary card below the highlight cards.</p>
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

                  <h4>Highlights (Core Strengths)</h4>
                  <div class="skills-editor">
                    <div v-for="(item, index) in highlightsList" :key="index" class="skill-item">
                      <div class="skill-header">
                        <span class="skill-number">{{ index + 1 }}</span>
                        <button v-if="highlightsList.length > 1" @click="removeHighlight(index)" class="btn-remove-skill" type="button">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                      <div class="skill-fields">
                        <input 
                          type="text" 
                          v-model="item.title" 
                          class="form-input" 
                          placeholder="Highlight Title"
                        />
                        <textarea 
                          v-model="item.description" 
                          class="form-input" 
                          rows="2" 
                          placeholder="Short description"
                        ></textarea>
                      </div>
                    </div>
                    <button @click="addHighlight" class="btn-add-skill" type="button">
                      <i class="fas fa-plus"></i> Add Highlight
                    </button>
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
                    <label>Tagline</label>
                    <RichTextEditor 
                      v-model="siteContent.about.profile.tagline" 
                      placeholder="Enter tagline"
                      :height="100"
                    />
                  </div>
                  <div class="form-group">
                    <label>Introduction</label>
                    <RichTextEditor 
                      v-model="siteContent.about.profile.intro" 
                      placeholder="Enter introduction"
                      :height="150"
                    />
                  </div>

                  <h4>Philosophy Section</h4>
                  <div class="form-group">
                    <label>Heading</label>
                    <input type="text" v-model="siteContent.about.philosophy.heading" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Content</label>
                    <RichTextEditor 
                      v-model="siteContent.about.philosophy.content" 
                      placeholder="Enter philosophy content"
                      :height="250"
                    />
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
                    <label>Skills</label>
                    <div class="skills-editor">
                      <div v-for="(skill, index) in skillsList" :key="index" class="skill-item">
                        <div class="skill-header">
                          <span class="skill-number">{{ index + 1 }}</span>
                          <button v-if="skillsList.length > 1" @click="removeSkill(index)" class="btn-remove-skill" type="button">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                        <div class="skill-fields">
                          <input 
                            type="text" 
                            v-model="skill.title" 
                            class="form-input" 
                            placeholder="Skill title (e.g., UI/UX Design)"
                            @input="updateSkillsJson"
                          />
                          <textarea 
                            v-model="skill.desc" 
                            class="form-input" 
                            rows="2"
                            placeholder="Skill description"
                            @input="updateSkillsJson"
                          ></textarea>
                        </div>
                      </div>
                      <button @click="addSkill" class="btn-add-skill" type="button">
                        <i class="fas fa-plus"></i> Add Skill
                      </button>
                    </div>
                  </div>

                  <h4>Connect Section</h4>
                  <div class="form-group">
                    <label>Heading</label>
                    <input type="text" v-model="siteContent.about.connect.heading" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Content</label>
                    <RichTextEditor 
                      v-model="siteContent.about.connect.content" 
                      placeholder="Enter connect content"
                      :height="150"
                    />
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

            <!-- Right: Live Preview -->
            <div class="preview-panel">
              <div class="preview-header">
                <h3><i class="fas fa-eye"></i> Live Preview</h3>
                <div class="preview-tabs">
                  <button 
                    :class="['preview-tab', { active: previewPage === 'home' }]"
                    @click="previewPage = 'home'"
                  >
                    Home
                  </button>
                  <button 
                    :class="['preview-tab', { active: previewPage === 'about' }]"
                    @click="previewPage = 'about'"
                  >
                    About
                  </button>
                </div>
              </div>

              <div class="preview-content">
                <!-- Home Preview -->
                <div v-if="previewPage === 'home'" class="home-preview">
                  <div class="preview-hero">
                    <p class="preview-kicker">Portfolio</p>
                    <h1 class="preview-title" v-html="siteContent.home.hero.title"></h1>
                    <p class="preview-subtitle" v-html="siteContent.home.hero.subtitle"></p>
                    <a class="preview-cta" :href="siteContent.home.hero.cta_link">
                      {{ siteContent.home.hero.cta_text }}
                    </a>
                  </div>

                  <div class="preview-highlights-grid">
                    <div v-for="(item, index) in highlightsList" :key="index" class="preview-highlight-card">
                      <div class="highlight-icon-placeholder">
                        <i class="fas fa-bolt"></i>
                      </div>
                      <h4>{{ item.title }}</h4>
                      <p>{{ item.description }}</p>
                    </div>
                  </div>

                  <div class="preview-summary">
                    <h3>How I work</h3>
                    <p v-html="siteContent.home.hero.description"></p>
                  </div>
                </div>

                <!-- About Preview -->
                <div v-if="previewPage === 'about'" class="about-preview">
                  <div class="preview-profile">
                    <img :src="siteContent.about.profile.image || 'https://via.placeholder.com/180'" alt="Profile" class="preview-about-pic">
                    <div class="preview-profile-text">
                      <h1>{{ siteContent.about.profile.heading }}</h1>
                      <h2 v-html="siteContent.about.profile.tagline"></h2>
                      <p class="preview-intro" v-html="siteContent.about.profile.intro"></p>
                    </div>
                  </div>
                  <div class="preview-story">
                    <h3>{{ siteContent.about.philosophy.heading }}</h3>
                    <p>{{ siteContent.about.philosophy.content }}</p>
                    
                    <h3>{{ siteContent.about.expertise.heading }}</h3>
                    <p>{{ siteContent.about.expertise.intro }}</p>
                    <ul class="preview-skills">
                      <li v-for="(skill, index) in parsedSkills" :key="index">
                        <strong>{{ skill.title }}:</strong> {{ skill.desc }}
                      </li>
                    </ul>
                    
                    <h3>{{ siteContent.about.connect.heading }}</h3>
                    <p>{{ siteContent.about.connect.content }}</p>
                    <a class="preview-cta" :href="siteContent.about.connect.cta_link">
                      {{ siteContent.about.connect.cta_text }}
                    </a>
                  </div>
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

      <!-- Site Settings Tab -->
      <div v-if="activeTab === 'sitesettings'">
        <div class="tab-header">
          <h2>Site Settings</h2>
          <button @click="saveSiteSettings" class="btn btn-primary" :disabled="savingSiteSettings">
            {{ savingSiteSettings ? 'Saving...' : 'Save Settings' }}
          </button>
        </div>

        <div v-if="loadingSiteSettings" class="loading-state">Loading settings...</div>

        <div v-else class="site-settings-editor">
          <div class="content-section">
            <h3>
              <button class="section-toggle" @click="toggleSection('siteAccess')">
                <i :class="expandedSections.siteAccess ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
                Public Access Control
              </button>
            </h3>
            <div v-if="expandedSections.siteAccess" class="section-body">
              <div class="toggle-setting-group">
                <div class="toggle-setting">
                  <div class="toggle-info">
                    <h4>Public Access</h4>
                    <p>Turn off to put the site in maintenance mode. Visitors will see a "Under Development" message.</p>
                  </div>
                  <label class="switch">
                    <input type="checkbox" v-model="siteSettings.is_public" />
                    <span class="slider"></span>
                  </label>
                </div>
                <div class="toggle-status" :class="siteSettings.is_public ? 'status-online' : 'status-maintenance'">
                  <i :class="siteSettings.is_public ? 'fas fa-globe' : 'fas fa-tools'"></i>
                  <span>{{ siteSettings.is_public ? 'Website is LIVE' : 'Maintenance Mode ON' }}</span>
                </div>
              </div>

              <div class="form-group" style="margin-top: 24px;">
                <label>Maintenance Message</label>
                <textarea 
                  v-model="siteSettings.maintenance_message" 
                  class="form-input" 
                  rows="3"
                  placeholder="Message to show visitors when site is under maintenance"
                ></textarea>
                <p class="hint-text">This message will be displayed on the maintenance screen</p>
              </div>
            </div>
          </div>
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
                <label>Cover Image (Bucket: images) *</label>
                <input type="file" @change="handleProjectFileUpload" class="form-input" accept="image/*" />
                <p v-if="uploadingProject" class="status-info">Uploading image...</p>
                <img v-if="projectForm.image_url" :src="projectForm.image_url" class="preview-img" alt="preview" />
              </div>
              <div class="form-group full-width">
                <label>Additional Images (Gallery)</label>
                <input type="file" @change="handleProjectGalleryUpload" class="form-input" accept="image/*" multiple />
                <p v-if="uploadingProjectGallery" class="status-info">Uploading images...</p>
                <div v-if="projectForm.images && projectForm.images.length > 0" class="gallery-preview-grid">
                  <div v-for="(img, idx) in projectForm.images" :key="idx" class="gallery-preview-item">
                    <img :src="img" alt="gallery preview" />
                    <button type="button" class="gallery-remove-btn" @click="removeProjectGalleryImage(idx)" title="Remove image">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
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
              <button type="button" class="btn btn-ghost" @click="showProjectModal = false">Cancel</button>
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
              <button type="button" class="btn btn-ghost" @click="showGalleryModal = false">Cancel</button>
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
            <button type="button" class="btn btn-ghost" @click="showUploadCVModal = false">Cancel</button>
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
import RichTextEditor from '@/components/RichTextEditor.vue';

export default {
  name: 'AdminView',
  components: {
    RichTextEditor
  },
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
      uploadingProjectGallery: false,
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
      uploadingAboutImage: false,
      siteContentError: '',
      
      // Analytics
      loadingAnalytics: false,
      analyticsEvents: [],
      
      siteContent: {
        home: {
          hero: {
            title: '',
            subtitle: '',
            description: '',
            cta_text: '',
            cta_link: ''
          },
          highlights: {
            items_raw: '[]'
          }
        },
        about: {
          profile: { image: '', heading: '', tagline: '', intro: '' },
          philosophy: { heading: '', content: '' },
          expertise: { heading: '', intro: '', skills_raw: '' },
          connect: { heading: '', content: '', cta_text: '', cta_link: '' }
        }
      },
      expandedSections: { home: true, about: true, siteAccess: true },
      previewPage: 'home',
      
      // CV Manager
      loadingCV: false,
      savingCV: false,
      uploadingCV: false,
      cvFiles: [],
      showUploadCVModal: false,
      cvForm: { filename: '', file_url: '', version_note: '', is_active: false },
      cvFileToUpload: null,
      
      // Site Settings
      loadingSiteSettings: false,
      savingSiteSettings: false,
      siteSettings: {
        is_public: true,
        maintenance_message: 'Website is currently under development. Please check back soon!'
      }
    }
  },
  computed: {
    skillsList: {
      get() {
        try {
          const skills = JSON.parse(this.siteContent.about.expertise.skills_raw || '[]');
          return Array.isArray(skills) ? skills : [{ title: '', desc: '' }];
        } catch (e) {
          return [{ title: '', desc: '' }];
        }
      },
      set(value) {
        this.siteContent.about.expertise.skills_raw = JSON.stringify(value, null, 2);
      }
    },
    highlightsList: {
      get() {
        try {
          const items = JSON.parse(this.siteContent.home.highlights.items_raw || '[]');
          return Array.isArray(items) ? items : [{ title: '', description: '' }];
        } catch (e) {
          return [{ title: '', description: '' }];
        }
      },
      set(value) {
        this.siteContent.home.highlights.items_raw = JSON.stringify(value, null, 2);
      }
    },
    parsedSkills() {
      try {
        const skills = JSON.parse(this.siteContent.about.expertise.skills_raw);
        return Array.isArray(skills) ? skills : [];
      } catch (e) {
        return [];
      }
    },
    analyticsStats() {
      if (!this.analyticsEvents || this.analyticsEvents.length === 0) {
        return { totalViews: 0, totalClicks: 0, uniqueVisitors: 0, topPages: {}, topClicks: {}, locations: [] };
      }

      const views = this.analyticsEvents.filter(e => e.event_type === 'page_view');
      const clicks = this.analyticsEvents.filter(e => e.event_type === 'click');
      const uniqueIps = new Set(this.analyticsEvents.map(e => e.ip_address).filter(Boolean));

      // Top Pages
      const topPages = {};
      views.forEach(v => {
        const p = v.page_url || 'Unknown';
        topPages[p] = (topPages[p] || 0) + 1;
      });

      // Top Clicks
      const topClicks = {};
      clicks.forEach(c => {
        const el = c.element_id || 'Unknown';
        topClicks[el] = (topClicks[el] || 0) + 1;
      });

      // Locations
      const locMap = {};
      this.analyticsEvents.forEach(e => {
        if (!e.city && !e.country) return;
        const key = `${e.city || 'Unknown'}|${e.region || '-'}|${e.country || '-'}`;
        if (!locMap[key]) {
          locMap[key] = { city: e.city, region: e.region, country: e.country, count: 0, id: key };
        }
        locMap[key].count++;
      });
      const locations = Object.values(locMap).sort((a, b) => b.count - a.count).slice(0, 10); // Top 10

      // Sort Top Pages and Clicks for display
      const sortObject = obj => Object.fromEntries(
        Object.entries(obj).sort(([,a],[,b]) => b - a).slice(0, 5)
      );

      return {
        totalViews: views.length,
        totalClicks: clicks.length,
        uniqueVisitors: uniqueIps.size,
        topPages: sortObject(topPages),
        topClicks: sortObject(topClicks),
        locations
      };
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
        this.fetchSiteSettings();
        this.fetchAnalytics();
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      this.session = session;
      if (this.session) {
        this.fetchProjects();
        this.fetchGalleryImages();
        this.fetchSiteContent();
        this.fetchCVFiles();
        this.fetchSiteSettings();
        this.fetchAnalytics();
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
        images: [],
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
      this.analyticsEvents = [];
    },
    async fetchAnalytics() {
      this.loadingAnalytics = true;
      try {
        const { data, error } = await supabase
          .from('analytics_events')
          .select('*')
          .order('created_at', { ascending: false })
          // Limit to last 1000 events for performance in simple dash
          .limit(1000);

        if (error) throw error;
        this.analyticsEvents = data || [];
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        this.loadingAnalytics = false;
      }
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
    async handleProjectGalleryUpload(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      this.uploadingProjectGallery = true;
      if (!Array.isArray(this.projectForm.images)) {
        this.projectForm.images = [];
      }

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `project-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) {
          alert('Error uploading image: ' + uploadError.message);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        this.projectForm.images.push(publicUrl);
      }
      this.uploadingProjectGallery = false;
    },
    removeProjectGalleryImage(index) {
      this.projectForm.images.splice(index, 1);
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
        features: Array.isArray(project.features) ? project.features.join('\n') : project.features || '',
        images: Array.isArray(project.images) ? [...project.images] : []
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
    addSkill() {
      const currentSkills = this.skillsList;
      currentSkills.push({ title: '', desc: '' });
      this.skillsList = currentSkills;
    },
    removeSkill(index) {
      const currentSkills = this.skillsList;
      currentSkills.splice(index, 1);
      this.skillsList = currentSkills;
    },
    addHighlight() {
      const current = this.highlightsList;
      current.push({ title: '', description: '' });
      this.highlightsList = current;
    },
    removeHighlight(index) {
      const current = this.highlightsList;
      current.splice(index, 1);
      this.highlightsList = current;
    },
    updateSkillsJson() {
      // Skills JSON akan otomatis terupdate karena v-model di skillsList
    },
    async saveProject() {
      this.savingProject = true;

      // Clean up data
      const projectData = {
        title: this.projectForm.title,
        description: this.projectForm.description,
        image_url: this.projectForm.image_url,
        images: Array.isArray(this.projectForm.images) ? this.projectForm.images : [],
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
          } else {
            this.siteContent.about.expertise.skills_raw = '[]';
          }

          // Handle highlights separately
          const highlightsItem = data.find(item => item.page === 'home' && item.section === 'highlights' && item.key === 'items');
          if (highlightsItem && highlightsItem.value) {
            this.siteContent.home.highlights.items_raw = typeof highlightsItem.value === 'string' 
              ? highlightsItem.value 
              : JSON.stringify(highlightsItem.value, null, 2);
          } else {
            this.siteContent.home.highlights.items_raw = '[]';
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
            value: `"${value}"`
          });
        });

        // Home Highlights
        contentToSave.push({
          page: 'home',
          section: 'highlights',
          key: 'items',
          value: this.siteContent.home.highlights.items_raw
        });

        // About content
        Object.entries(this.siteContent.about).forEach(([section, data]) => {
          Object.entries(data).forEach(([key, value]) => {
            if (key === 'skills_raw') {
              // Skip - skills will be saved from skillsList computed property
              return;
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

        // Save skills from skillsList computed property
        try {
          const skills = this.skillsList;
          if (skills && skills.length > 0) {
            contentToSave.push({
              page: 'about',
              section: 'expertise',
              key: 'skills',
              value: skills
            });
          }
        } catch (e) {
          console.error('Error processing skills:', e);
        }

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
    },
    
    // Site Settings Methods
    async fetchSiteSettings() {
      this.loadingSiteSettings = true;
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('key', 'site_status')
          .single();

        if (error) {
          console.error('Error fetching site settings:', error);
          // Use defaults
          return;
        }

        if (data && data.value) {
          this.siteSettings.is_public = data.value.is_public ?? true;
          this.siteSettings.maintenance_message = data.value.maintenance_message || 'Website is currently under development. Please check back soon!';
        }
      } catch (error) {
        console.error('Error:', error);
      }
      this.loadingSiteSettings = false;
    },
    async saveSiteSettings() {
      this.savingSiteSettings = true;
      try {
        const { error } = await supabase
          .from('site_settings')
          .upsert({
            key: 'site_status',
            value: {
              is_public: this.siteSettings.is_public,
              maintenance_message: this.siteSettings.maintenance_message
            }
          }, { onConflict: 'key' });

        if (error) {
          alert('Error saving settings: ' + error.message);
        } else {
          alert('Settings saved successfully!');
        }
      } catch (error) {
        alert('Error saving settings: ' + error.message);
      }
      this.savingSiteSettings = false;
    }
  }
}
</script>

<style scoped>
.admin-view {
  --admin-radius: 12px;
  --admin-radius-sm: 10px;
  --admin-pad-x: 14px;
  --admin-pad-y: 10px;
  --admin-border: 1px solid rgba(15, 23, 42, 0.12);
  --admin-border-strong: 1px solid rgba(15, 23, 42, 0.2);
  --admin-glass: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.82));
  --admin-surface: #ffffff;
  --admin-surface-soft: #f8fafc;
  --admin-text: #1f2937;
  --admin-muted: #6b7280;
  --admin-accent: #2563eb;
  --admin-accent-soft: #eff6ff;
  --admin-fast: 140ms ease;
  min-height: 100vh;
  background-color: #f3f4f6;
  color: var(--admin-text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.login-box {
  background: var(--admin-glass);
  padding: 40px;
  border-radius: var(--admin-radius);
  border: var(--admin-border);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(4px);
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
  padding: var(--admin-pad-y) var(--admin-pad-x);
  border: var(--admin-border);
  background: rgba(255, 255, 255, 0.86);
  border-radius: var(--admin-radius-sm);
  margin-bottom: 16px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color var(--admin-fast), box-shadow var(--admin-fast), background-color var(--admin-fast);
}

.form-input:hover {
  border-color: rgba(37, 99, 235, 0.35);
}

.form-input:focus-visible {
  outline: none;
  border-color: rgba(37, 99, 235, 0.6);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
  background: #fff;
}

.btn {
  padding: var(--admin-pad-y) var(--admin-pad-x);
  border: var(--admin-border);
  border-radius: var(--admin-radius-sm);
  font-weight: 500;
  cursor: pointer;
  transition: transform var(--admin-fast), border-color var(--admin-fast), background-color var(--admin-fast), box-shadow var(--admin-fast), color var(--admin-fast);
  width: auto;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-color: transparent;
  width: 100%;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.24);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.24);
}

.btn-primary:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-secondary {
  background: var(--admin-surface-soft);
  color: var(--admin-text);
  border-color: rgba(15, 23, 42, 0.18);
}

.btn-secondary:hover {
  background-color: #eef2f7;
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.72);
  color: var(--admin-muted);
  border-color: rgba(15, 23, 42, 0.14);
}

.btn-ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.96);
  border-color: rgba(15, 23, 42, 0.26);
  color: var(--admin-text);
}

.btn:active:not(:disabled) {
  transform: translateY(1px);
}

.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.16);
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
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.55);
  border: var(--admin-border);
  border-radius: var(--admin-radius-sm);
  font-weight: 500;
  color: var(--admin-muted);
  cursor: pointer;
  transition: background-color var(--admin-fast), border-color var(--admin-fast), color var(--admin-fast), transform var(--admin-fast);
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-btn:hover {
  color: var(--admin-accent);
  border-color: rgba(37, 99, 235, 0.32);
  background: rgba(239, 246, 255, 0.85);
}

.tab-btn.active {
  color: var(--admin-accent);
  border-color: rgba(37, 99, 235, 0.45);
  background: var(--admin-accent-soft);
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
  color: var(--admin-text);
  letter-spacing: -0.01em;
}

.cms-content {
  background: var(--admin-glass);
  border-radius: var(--admin-radius);
  border: var(--admin-border);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(4px);
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
  background: var(--admin-glass);
  border-radius: var(--admin-radius);
  border: var(--admin-border);
  backdrop-filter: blur(4px);
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
  background: var(--admin-glass);
  border-radius: var(--admin-radius);
  border: var(--admin-border);
  backdrop-filter: blur(4px);
  padding: 20px;
}

.editor-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.editor-panel {
  max-height: 80vh;
  overflow-y: auto;
  padding-right: 10px;
}

/* Preview Panel */
.preview-panel {
  position: sticky;
  top: 20px;
  height: fit-content;
  max-height: 85vh;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.preview-header {
  padding: 16px 20px;
  background: white;
  border-bottom: 2px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-header h3 {
  margin: 0;
  font-size: 16px;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-tabs {
  display: flex;
  gap: 8px;
}

.preview-tab {
  padding: 6px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.preview-tab:hover {
  background: #e5e7eb;
}

.preview-tab.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.preview-content {
  overflow-y: auto;
  max-height: calc(85vh - 60px);
  padding: 20px;
}

/* Home Preview */
.home-preview {
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-hero {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 24px 20px;
  background: linear-gradient(135deg, rgba(249,115,22,0.06), transparent 52%), #fafaf9;
}

.preview-kicker {
  margin: 0 0 8px;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #8b5a2b;
}

.preview-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.preview-title strong {
  color: #8b5a2b;
}

.preview-subtitle {
  font-size: 13px;
  font-weight: 400;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.preview-cta {
  display: inline-block;
  padding: 10px 20px;
  background: linear-gradient(135deg, #8b5a2b 0%, #6b4423 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.2s;
}

.preview-cta:hover {
  transform: translateY(-1px);
}

.preview-summary {
  text-align: left;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  background: white;
}

.preview-summary h3 {
  margin: 0 0 8px;
  font-size: 15px;
  color: #1f2937;
}

.preview-summary p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
}

.preview-highlights-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  text-align: left;
}

.preview-highlight-card {
  padding: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.highlight-icon-placeholder {
  width: 24px;
  height: 24px;
  background: rgba(139, 90, 43, 0.1);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b5a2b;
  font-size: 10px;
  margin-bottom: 8px;
}

.preview-highlight-card h4 {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 700;
  color: #1f2937;
}

.preview-highlight-card p {
  margin: 0;
  font-size: 10px;
  color: #6b7280;
  line-height: 1.4;
}

/* About Preview */
.about-preview {
  padding: 20px;
}

.preview-profile {
  display: flex;
  gap: 20px;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.preview-about-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.preview-profile-text h1 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 6px 0;
}

.preview-profile-text h2 {
  font-size: 13px;
  font-weight: 400;
  color: #8b5a2b;
  margin: 0 0 10px 0;
}

.preview-profile-text h2 strong {
  color: #6b4423;
  font-weight: 600;
}

.preview-intro {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.preview-story h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 20px 0 10px 0;
  padding-bottom: 6px;
  border-bottom: 2px solid #8b5a2b;
  display: inline-block;
}

.preview-story p {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.preview-skills {
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
}

.preview-skills li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 8px;
  font-size: 11px;
  color: #6b7280;
}

.preview-skills li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: 0;
  color: #6b4423;
  font-weight: 700;
  font-size: 14px;
}

.preview-skills li strong {
  color: #374151;
}

/* Skills Editor */
.skills-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-item {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.skill-number {
  font-weight: 600;
  color: #6b7280;
  font-size: 13px;
}

.btn-remove-skill {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;
}

.btn-remove-skill:hover {
  background: #dc2626;
}

.skill-fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-fields input,
.skill-fields textarea {
  margin-bottom: 0;
}

.btn-add-skill {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
  margin-top: 8px;
}

.btn-add-skill:hover {
  background: #059669;
}

/* Site Settings */
.site-settings-editor {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.toggle-setting-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.toggle-setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
}

.toggle-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.toggle-info p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 32px;
  flex-shrink: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 32px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 24px;
  width: 24px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

input:checked + .slider {
  background-color: #22c55e;
}

input:checked + .slider:before {
  transform: translateX(28px);
}

.toggle-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
}

.status-online {
  background: #dcfce7;
  color: #166534;
}

.status-online i {
  color: #22c55e;
}

.status-maintenance {
  background: #fef3c7;
  color: #92400e;
}

.status-maintenance i {
  color: #f59e0b;
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
  padding: 14px 16px;
  background: rgba(248, 250, 252, 0.9);
  border: none;
  border-bottom: var(--admin-border);
  text-align: left;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-toggle:hover {
  background: #eef2f7;
}

.section-body {
  padding: 20px;
}

.section-body h4 {
  margin: 20px 0 10px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--admin-muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  position: relative;
  padding-left: 10px;
}

.section-body h4::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 14px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.42);
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
  padding: 5px 12px;
  background: rgba(220, 252, 231, 0.9);
  border: 1px solid rgba(34, 197, 94, 0.24);
  color: #166534;
  border-radius: var(--admin-radius-sm);
  font-size: 12px;
  font-weight: 600;
}

.status-inactive {
  display: inline-block;
  padding: 5px 12px;
  background: rgba(243, 244, 246, 0.85);
  border: var(--admin-border);
  color: var(--admin-muted);
  border-radius: var(--admin-radius-sm);
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
  
  .editor-layout {
    grid-template-columns: 1fr;
  }
  
  .preview-panel {
    position: static;
    max-height: none;
  }
  
  .editor-panel {
    max-height: none;
  }
}

/* Gallery Preview Grid for Admin */
.gallery-preview-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.gallery-preview-item {
  position: relative;
  width: 100px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.gallery-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(220, 38, 38, 0.85);
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 10px;
  transition: background 0.2s;
}

.gallery-remove-btn:hover {
  background: rgba(220, 38, 38, 1);
}

/* Analytics Dashboard Styles */
.analytics-dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.analytics-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.72);
  padding: 24px;
  border-radius: var(--admin-radius);
  border: var(--admin-border);
  text-align: center;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
  transition: transform var(--admin-fast), border-color var(--admin-fast), box-shadow var(--admin-fast);
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: rgba(15, 23, 42, 0.2);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
}

.stat-card h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  color: #111827;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.analytics-box {
  background: white;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.analytics-box.full-width {
  grid-column: 1 / -1;
}

.analytics-box h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #111827;
}

.analytics-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.analytics-list li {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.analytics-list li:last-child {
  border-bottom: none;
}

.analytics-list .label {
  font-weight: 500;
  color: #374151;
}

.analytics-list .count {
  color: #6b7280;
  font-size: 14px;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 12px;
}
</style>
