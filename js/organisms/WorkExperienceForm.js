// WorkExperienceForm - Organism component for work experience management
class WorkExperienceForm extends HTMLElement {
  constructor() {
    super();
    this.experiences = [];
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.innerHTML = `
      <div class="card mb-4">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <button class="btn btn-link text-white text-decoration-none p-0 flex-grow-1 text-start collapsed" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#workExperienceCollapse" 
                  aria-expanded="false" 
                  aria-controls="workExperienceCollapse">
            <h5 class="mb-0">
              <i class="bi bi-briefcase me-2"></i>
              Work Experience
              <i class="bi bi-chevron-down float-end"></i>
            </h5>
          </button>
          <div class="d-flex align-items-center gap-2">
            <app-button 
              text="Add" 
              variant="light" 
              size="sm"
              icon="plus-lg"
              data-action="add-experience"
            ></app-button>
          </div>
        </div>
        <div class="collapse" id="workExperienceCollapse">
          <div class="card-body">
          <div id="experiences-container">
            ${this.experiences.length === 0 ? `
              <div class="text-center text-muted py-4">
                <i class="bi bi-briefcase display-4 mb-3"></i>
                <p>No work experience added yet.</p>
                <p class="small">Click "Add Experience" to get started.</p>
              </div>
            ` : ''}
          </div>
          </div>
        </div>
      </div>
    `;

    this.renderExperiences();
  }

  renderExperiences() {
    const container = this.querySelector('#experiences-container');
    if (!container) return;

    if (this.experiences.length === 0) {
      container.innerHTML = `
        <div class="text-center text-muted py-4">
          <i class="bi bi-briefcase display-4 mb-3"></i>
          <p>No work experience added yet.</p>
          <p class="small">Click "Add Experience" to get started.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.experiences.map((exp, index) => 
      `<experience-item index="${index}" data='${JSON.stringify(exp)}'></experience-item>`
    ).join('');
  }

  attachEventListeners() {
    // Add experience button
    const addBtn = this.querySelector('[data-action="add-experience"]');
    if (addBtn) {
      addBtn.addEventListener('app-click', () => {
        this.addExperience();
      });
    }

    // Listen for experience changes
    this.addEventListener('experience-changed', (e) => {
      const index = parseInt(e.detail.index);
      let field = e.detail.field;
      const value = e.detail.value;

      // Remove index suffix from field name (e.g., "title-0" -> "title")
      if (field.includes('-')) {
        field = field.split('-')[0];
      }

      // Ensure experience object exists
      if (!this.experiences[index]) {
        this.experiences[index] = {
          title: '',
          company: '',
          location: '',
          employmentType: '',
          startDate: '',
          endDate: '',
          isPresent: false,
          description: '',
          achievements: '',
          technologies: ''
        };
      }

      if (field === 'dates') {
        this.experiences[index] = {
          ...this.experiences[index],
          startDate: value.startDate,
          endDate: value.endDate,
          isPresent: value.isPresent
        };
      } else {
        this.experiences[index] = {
          ...this.experiences[index],
          [field]: value
        };
      }

      // Clean up any old field names with index suffixes
      const cleanedExperience = { ...this.experiences[index] };
      Object.keys(cleanedExperience).forEach(key => {
        if (key.includes('-') && key.match(/\d+$/)) {
          delete cleanedExperience[key];
        }
      });
      this.experiences[index] = cleanedExperience;

      this.emitChange();
    });

    // Listen for experience removal
    this.addEventListener('experience-removed', (e) => {
      const index = parseInt(e.detail.index);
      this.experiences.splice(index, 1);
      this.renderExperiences();
      this.emitChange();
    });

    // Note: field-changed and value-changed events are handled by ExperienceItem
    // which then emits experience-changed events that we listen to above
  }

  addExperience() {
    const newExperience = {
      title: '',
      company: '',
      location: '',
      type: '',
      startDate: '',
      endDate: '',
      isPresent: false,
      description: '',
      achievements: '',
      technologies: ''
    };

    this.experiences.push(newExperience);
    this.renderExperiences();
    this.emitChange();
  }

  getData() {
    return this.experiences;
  }

  setData(experiences) {
    this.experiences = experiences || [];
    this.renderExperiences();
  }

  validate() {
    let isValid = true;
    const experienceItems = this.querySelectorAll('experience-item');
    
    experienceItems.forEach(item => {
      if (!item.validate()) {
        isValid = false;
      }
    });

    return isValid;
  }

  emitChange() {
    console.log('💼 Work experience form emitting change:', this.experiences);
    this.dispatchEvent(new CustomEvent('data-changed', {
      bubbles: true,
      detail: { section: 'workExperience', data: this.experiences }
    }));
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

customElements.define('work-experience-form', WorkExperienceForm);

