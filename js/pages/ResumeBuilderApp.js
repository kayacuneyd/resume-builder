// ResumeBuilderApp - Main app orchestrator
import { storageManager } from '../utils/localStorage.js';
import { Validator } from '../utils/validation.js';

class ResumeBuilderApp extends HTMLElement {
  constructor() {
    super();
    this.isAuthenticated = false;
    this.user = null;
    this.resumeData = {};
    this.autoSaveInterval = null;
  }

  async connectedCallback() {
    await this.initializeApp();
  }

  async initializeApp() {
    try {
      // Wait for Clerk to load
      await this.waitForClerk();
      
      // Check authentication status
      this.isAuthenticated = window.Clerk.user !== null;
      this.user = window.Clerk.user;

      if (this.isAuthenticated) {
        await this.renderAuthenticatedApp();
      } else {
        this.renderUnauthenticatedApp();
      }

      // Set up Clerk listeners
      this.setupClerkListeners();

    } catch (error) {
      console.error('Error initializing app:', error);
      this.renderErrorState();
    }
  }

  async waitForClerk() {
    while (!window.Clerk) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    await window.Clerk.load();
  }

  setupClerkListeners() {
    if (window.Clerk && !this.clerkListenerAdded) {
      this.clerkListenerAdded = true;
      window.Clerk.addListener(({ user }) => {
        this.isAuthenticated = user !== null;
        this.user = user;
        
        if (this.isAuthenticated) {
          this.renderAuthenticatedApp();
        } else {
          this.renderUnauthenticatedApp();
        }
      });
    }
  }

  async renderAuthenticatedApp() {
    this.innerHTML = `
      <app-header></app-header>
      <resume-builder-template></resume-builder-template>
    `;

    // Set up user-specific storage
    if (this.user) {
      storageManager.setUserId(this.user.id);
    }

    // Initialize theme system
    await this.initializeTheme();

    // Load existing resume data
    await this.loadResumeData();

    // Set up auto-save
    this.setupAutoSave();

    // Set up event listeners
    this.attachEventListeners();
  }

  renderUnauthenticatedApp() {
    this.innerHTML = `
      <app-header></app-header>
      <landing-page></landing-page>
    `;
  }

  renderErrorState() {
    this.innerHTML = `
      <div class="container-fluid vh-100 d-flex align-items-center">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-6 text-center">
              <i class="bi bi-exclamation-triangle display-1 text-danger mb-4"></i>
              <h1 class="display-4 fw-bold mb-4">Something went wrong</h1>
              <p class="lead mb-4">
                We're having trouble loading the application. Please refresh the page and try again.
              </p>
              <app-button 
                text="Refresh Page" 
                variant="primary" 
                size="lg"
                icon="arrow-clockwise"
                data-action="refresh"
              ></app-button>
            </div>
          </div>
        </div>
      </div>
    `;

    const refreshBtn = this.querySelector('[data-action="refresh"]');
    if (refreshBtn) {
      refreshBtn.addEventListener('app-click', () => {
        window.location.reload();
      });
    }
  }

  async loadResumeData() {
    try {
      const data = storageManager.loadResumeData();
      this.resumeData = data;
      
      // Update the template with loaded data
      const template = this.querySelector('resume-builder-template');
      if (template) {
        template.setResumeData(data);
      }

      // Update the preview
      const preview = this.querySelector('resume-preview');
      if (preview) {
        preview.updatePreview(data);
      }

    } catch (error) {
      console.error('Error loading resume data:', error);
    }
  }

  setupAutoSave() {
    // Clear existing auto-save
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    // Set up new auto-save
    this.autoSaveInterval = setInterval(() => {
      this.autoSave();
    }, 10000); // Auto-save every 10 seconds
  }

  async autoSave() {
    try {
      const template = this.querySelector('resume-builder-template');
      if (template) {
        const data = template.getResumeData();
        this.resumeData = data;
        
        const success = storageManager.saveResumeData(data);
        if (success) {
          this.updateSaveStatus('Saved');
        } else {
          this.updateSaveStatus('Error');
        }
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      this.updateSaveStatus('Error');
    }
  }

  attachEventListeners() {
    // Listen for data changes
    this.addEventListener('data-changed', (e) => {
      console.log('🎯 ResumeBuilderApp received data-changed event:', e.detail);
      this.handleDataChange(e.detail);
    });

    // Listen for save events
    this.addEventListener('save-resume', () => {
      this.handleSave();
    });

    // Listen for clear events
    this.addEventListener('clear-resume', () => {
      this.handleClear();
    });
  }

  handleDataChange(detail) {
    const { section, data } = detail;
    
    console.log('🔄 Data change received:', { section, data });
    
    // Update resume data
    this.resumeData[section] = data;
    
    console.log('📊 Updated resume data:', this.resumeData);
    
    // Update preview
    const preview = this.querySelector('resume-preview');
    if (preview) {
      console.log('✅ Preview found, updating...');
      preview.updatePreview(this.resumeData);
    } else {
      console.log('❌ Preview not found');
    }

    // Update save status
    this.updateSaveStatus('Saving...');
  }

  async handleSave() {
    try {
      console.log('💾 Starting save process...');
      const template = this.querySelector('resume-builder-template');
      if (template) {
        console.log('📝 Template found, getting data...');
        const data = template.getResumeData();
        console.log('📊 Resume data to save:', data);
        this.resumeData = data;
        
        // Validate data
        console.log('🔍 Validating data...');
        const validation = this.validateResumeData(data);
        if (!validation.isValid) {
          console.log('❌ Validation failed:', validation.errors);
          this.showNotification(`Validation errors: ${validation.errors.join(', ')}`, 'warning');
          return;
        }

        // Save data
        console.log('💾 Saving to localStorage...');
        const success = storageManager.saveResumeData(data);
        if (success) {
          console.log('✅ Save successful');
          this.updateSaveStatus('Saved');
          this.showNotification('Resume saved successfully!', 'success');
        } else {
          console.log('❌ Save failed');
          this.updateSaveStatus('Error');
          this.showNotification('Error saving resume. Please try again.', 'danger');
        }
      } else {
        console.log('❌ Template not found');
        this.showNotification('Template not found. Please refresh the page.', 'danger');
      }
    } catch (error) {
      console.error('💥 Save error:', error);
      this.updateSaveStatus('Error');
      this.showNotification('Error saving resume. Please try again.', 'danger');
    }
  }

  async handleClear() {
    try {
      const success = storageManager.clearResumeData();
      if (success) {
        this.resumeData = {};
        
        // Reset template
        const template = this.querySelector('resume-builder-template');
        if (template) {
          template.setResumeData({});
        }

        // Reset preview
        const preview = this.querySelector('resume-preview');
        if (preview) {
          preview.updatePreview({});
        }

        this.showNotification('Resume cleared successfully!', 'success');
      } else {
        this.showNotification('Error clearing resume. Please try again.', 'danger');
      }
    } catch (error) {
      console.error('Clear error:', error);
      this.showNotification('Error clearing resume. Please try again.', 'danger');
    }
  }

  validateResumeData(data) {
    return Validator.validateResumeData(data);
  }

  updateSaveStatus(status) {
    const header = this.querySelector('app-header');
    if (header) {
      header.updateSaveStatus(status);
    }
  }

  showNotification(message, type = 'info') {
    const header = this.querySelector('app-header');
    if (header) {
      header.showNotification(message, type);
    }
  }

  // Export functionality
  exportResumeData() {
    storageManager.exportData();
  }

  // Import functionality
  async importResumeData(file) {
    try {
      const data = await storageManager.importData(file);
      this.resumeData = data;
      
      // Update template
      const template = this.querySelector('resume-builder-template');
      if (template) {
        template.setResumeData(data);
      }

      // Update preview
      const preview = this.querySelector('resume-preview');
      if (preview) {
        preview.updatePreview(data);
      }

      this.showNotification('Resume data imported successfully!', 'success');
    } catch (error) {
      console.error('Import error:', error);
      this.showNotification('Error importing resume data. Please check the file format.', 'danger');
    }
  }

  disconnectedCallback() {
    // Clean up auto-save
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
  }

  static get observedAttributes() {
    return [];
  }

  async initializeTheme() {
    try {
      // Import and initialize theme manager
      const { themeManager } = await import('../utils/themeManager.js');
      
      // Load saved theme for this user
      const savedTheme = themeManager.loadTheme();
      console.log('🎨 ResumeBuilderApp - Theme initialized:', savedTheme);
      
      // Apply the theme
      themeManager.applyTheme(savedTheme);
      
    } catch (error) {
      console.error('❌ Error initializing theme:', error);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      // Don't call attachEventListeners() here to avoid infinite loop
    }
  }
}

customElements.define('resume-builder-app', ResumeBuilderApp);

