// Main application entry point
import { CLERK_CONFIG } from './config.js';

// Import all components
import './atoms/AppButton.js';
import './atoms/AppInput.js';
import './atoms/AppTextarea.js';
import './atoms/AppLabel.js';
import './atoms/SkillTag.js';

import './molecules/FormField.js';
import './molecules/DateRangePicker.js';
import './molecules/ExperienceItem.js';
import './molecules/EducationItem.js';

import './organisms/AppHeader.js';
import './organisms/PersonalInfoForm.js';
import './organisms/WorkExperienceForm.js';
import './organisms/EducationForm.js';
import './organisms/SkillsForm.js';
import './organisms/ProjectsForm.js';
import './organisms/CertificationsForm.js';
import './organisms/ResumePreview.js';
import './organisms/ThemeCustomizer.js';

import './templates/LandingPage.js';
import './templates/ResumeBuilderTemplate.js';

import './pages/ResumeBuilderApp.js';

// Initialize the application
class App {
  constructor() {
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // Wait for Clerk to be available
      await this.waitForClerk();

      // Initialize the main app
      this.initializeApp();

      this.isInitialized = true;
      console.log('Resume Builder App initialized successfully');

    } catch (error) {
      console.error('Error initializing app:', error);
      this.renderErrorState();
    }
  }

  async waitForClerk() {
    // Wait for Clerk script to load
    while (!window.Clerk) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Wait for Clerk to be ready
    await window.Clerk.load();
  }

  initializeApp() {
    const appContainer = document.getElementById('app');
    if (!appContainer) {
      throw new Error('App container not found');
    }

    // Create the main app component
    appContainer.innerHTML = '<resume-builder-app></resume-builder-app>';
  }

  renderErrorState() {
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = `
        <div class="container-fluid vh-100 d-flex align-items-center">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-lg-6 text-center">
                <i class="bi bi-exclamation-triangle display-1 text-danger mb-4"></i>
                <h1 class="display-4 fw-bold mb-4">Application Error</h1>
                <p class="lead mb-4">
                  We're having trouble loading the application. Please check your internet connection and try again.
                </p>
                <button class="btn btn-primary btn-lg" onclick="window.location.reload()">
                  <i class="bi bi-arrow-clockwise me-2"></i>
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }
}

// Create and initialize the app
const app = new App();

// Start the application
app.init().catch(error => {
  console.error('Failed to initialize app:', error);
});

// Export for potential external use
window.ResumeBuilderApp = app;


