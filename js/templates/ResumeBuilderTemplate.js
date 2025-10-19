// ResumeBuilderTemplate - Template component for the main app layout
class ResumeBuilderTemplate extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.innerHTML = `
      <div class="container-fluid">
        <div class="row">
          <!-- Left Sidebar - Forms -->
          <div class="col-lg-12">
            <div class="p-4">
              <div class="mb-4">
                <h2 class="fw-bold mb-2">Build Your Resume</h2>
                <p class="text-muted">Fill out the sections below to create your professional resume.</p>
              </div>

              <!-- Progress Indicator -->
              <div class="card mb-4">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="mb-0">Resume Progress</h6>
                    <span class="badge bg-primary" id="progress-percentage">0%</span>
                  </div>
                  <div class="progress" style="height: 8px;">
                    <div class="progress-bar" role="progressbar" id="progress-bar" style="width: 0%"></div>
                  </div>
                </div>
              </div>

              <!-- Form Sections -->
              <div class="row">
                <div class="col-md-6">
                  <div id="form-sections">
                    <personal-info-form></personal-info-form>
                    <work-experience-form></work-experience-form>
                    <education-form></education-form>
                    <skills-form></skills-form>
                    <projects-form></projects-form>
                    <certifications-form></certifications-form>
                  </div>
                </div>
                <div class="col-md-6">
                  <theme-customizer></theme-customizer>
                  <resume-preview></resume-preview>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="card mb-4">
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <app-button 
                        text="Save Resume" 
                        variant="success" 
                        icon="save"
                        data-action="save-resume"
                      ></app-button>
                    </div>
                    <div class="col-md-6 text-end">
                      <app-button 
                        text="Clear All" 
                        variant="outline-danger" 
                        icon="trash"
                        data-action="clear-resume"
                      ></app-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const saveBtn = this.querySelector('[data-action="save-resume"]');
    const clearBtn = this.querySelector('[data-action="clear-resume"]');

    if (saveBtn) {
      saveBtn.addEventListener('app-click', () => {
        this.handleSave();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('app-click', () => {
        this.handleClear();
      });
    }

    // Listen for data changes to update progress and forward to parent
    this.addEventListener('data-changed', (e) => {
      console.log('📝 Template received data change:', e.detail);
      this.updateProgress();
      
      // Update preview directly
      this.updatePreviewDirectly();
      
      // Forward the event to parent (ResumeBuilderApp)
      const event = new CustomEvent('data-changed', {
        bubbles: true,
        detail: e.detail
      });
      this.dispatchEvent(event);
      console.log('📤 Template forwarded data change to parent');
    });
  }

  handleSave() {
    const saveBtn = this.querySelector('[data-action="save-resume"]');
    if (saveBtn) {
      saveBtn.setLoading(true);
    }

    // Emit save event
    this.dispatchEvent(new CustomEvent('save-resume', {
      bubbles: true,
      detail: { action: 'save' }
    }));

    // Reset button state after a delay
    setTimeout(() => {
      if (saveBtn) {
        saveBtn.setLoading(false);
      }
    }, 1000);
  }

  handleClear() {
    if (confirm('Are you sure you want to clear all resume data? This action cannot be undone.')) {
      this.dispatchEvent(new CustomEvent('clear-resume', {
        bubbles: true,
        detail: { action: 'clear' }
      }));
    }
  }

  updateProgress() {
    const progressBar = this.querySelector('#progress-bar');
    const progressPercentage = this.querySelector('#progress-percentage');
    
    if (!progressBar || !progressPercentage) return;

    // Calculate progress based on filled sections
    const sections = [
      this.querySelector('personal-info-form'),
      this.querySelector('work-experience-form'),
      this.querySelector('education-form'),
      this.querySelector('skills-form'),
      this.querySelector('projects-form'),
      this.querySelector('certifications-form')
    ];

    let completedSections = 0;
    let totalSections = sections.length;

    sections.forEach(section => {
      if (section && this.isSectionComplete(section)) {
        completedSections++;
      }
    });

    const percentage = Math.round((completedSections / totalSections) * 100);
    
    progressBar.style.width = `${percentage}%`;
    progressPercentage.textContent = `${percentage}%`;
    
    // Update progress bar color
    progressBar.className = `progress-bar ${percentage === 100 ? 'bg-success' : percentage >= 50 ? 'bg-warning' : 'bg-primary'}`;
  }

  updatePreviewDirectly() {
    console.log('🔄 Template updating preview directly...');
    
    // Get current data from all forms
    const personalInfo = this.querySelector('personal-info-form')?.getData() || {};
    const workExperience = this.querySelector('work-experience-form')?.getData() || [];
    const education = this.querySelector('education-form')?.getData() || [];
    const skills = this.querySelector('skills-form')?.getData() || [];
    const projects = this.querySelector('projects-form')?.getData() || [];
    const certifications = this.querySelector('certifications-form')?.getData() || [];

    const resumeData = {
      personalInfo,
      workExperience,
      education,
      skills,
      projects,
      certifications
    };

    console.log('📊 Template resume data:', resumeData);

    // Update preview
    const preview = this.querySelector('resume-preview');
    if (preview) {
      console.log('✅ Template found preview, updating...');
      preview.updatePreview(resumeData);
    } else {
      console.log('❌ Template preview not found');
    }
  }

  isSectionComplete(section) {
    if (!section) return false;

    const sectionType = section.tagName.toLowerCase();
    
    switch (sectionType) {
      case 'personal-info-form':
        const personalData = section.getData();
        return personalData.fullName && personalData.email && personalData.professionalTitle;
      
      case 'work-experience-form':
        const workData = section.getData();
        return workData.length > 0;
      
      case 'education-form':
        const educationData = section.getData();
        return educationData.length > 0;
      
      case 'skills-form':
        const skillsData = section.getData();
        return skillsData.length > 0;
      
      case 'projects-form':
        const projectsData = section.getData();
        return projectsData.length > 0;
      
      case 'certifications-form':
        const certificationsData = section.getData();
        return certificationsData.length > 0;
      
      default:
        return false;
    }
  }

  getResumeData() {
    const personalInfo = this.querySelector('personal-info-form')?.getData() || {};
    const workExperience = this.querySelector('work-experience-form')?.getData() || [];
    const education = this.querySelector('education-form')?.getData() || [];
    const skills = this.querySelector('skills-form')?.getData() || [];
    const projects = this.querySelector('projects-form')?.getData() || [];
    const certifications = this.querySelector('certifications-form')?.getData() || [];

    return {
      personalInfo,
      workExperience,
      education,
      skills,
      projects,
      certifications
    };
  }

  setResumeData(data) {
    if (data.personalInfo) {
      const personalInfoForm = this.querySelector('personal-info-form');
      if (personalInfoForm) personalInfoForm.setData(data.personalInfo);
    }

    if (data.workExperience) {
      const workExperienceForm = this.querySelector('work-experience-form');
      if (workExperienceForm) workExperienceForm.setData(data.workExperience);
    }

    if (data.education) {
      const educationForm = this.querySelector('education-form');
      if (educationForm) educationForm.setData(data.education);
    }

    if (data.skills) {
      const skillsForm = this.querySelector('skills-form');
      if (skillsForm) skillsForm.setData(data.skills);
    }

    if (data.projects) {
      const projectsForm = this.querySelector('projects-form');
      if (projectsForm) projectsForm.setData(data.projects);
    }

    if (data.certifications) {
      const certificationsForm = this.querySelector('certifications-form');
      if (certificationsForm) certificationsForm.setData(data.certifications);
    }

    // Update preview
    const preview = this.querySelector('resume-preview');
    if (preview) {
      preview.updatePreview(this.getResumeData());
    }
  }

  validateResume() {
    const sections = [
      this.querySelector('personal-info-form'),
      this.querySelector('work-experience-form'),
      this.querySelector('education-form'),
      this.querySelector('skills-form'),
      this.querySelector('projects-form'),
      this.querySelector('certifications-form')
    ];

    let isValid = true;
    const errors = [];

    sections.forEach(section => {
      if (section && section.validate) {
        if (!section.validate()) {
          isValid = false;
          errors.push(`${section.tagName} has validation errors`);
        }
      }
    });

    return { isValid, errors };
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      // Don't call attachEventListeners() here to avoid infinite loop
    }
  }
}

customElements.define('resume-builder-template', ResumeBuilderTemplate);

