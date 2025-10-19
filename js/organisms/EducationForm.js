// EducationForm - Organism component for education management
class EducationForm extends HTMLElement {
  constructor() {
    super();
    this.educations = [];
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
                  data-bs-target="#educationCollapse" 
                  aria-expanded="false" 
                  aria-controls="educationCollapse">
            <h5 class="mb-0">
              <i class="bi bi-mortarboard me-2"></i>
              Education
              <i class="bi bi-chevron-down float-end"></i>
            </h5>
          </button>
          <div class="d-flex align-items-center gap-2">
            <app-button 
              text="Add" 
              variant="light" 
              size="sm"
              icon="plus-lg"
              data-action="add-education"
            ></app-button>
          </div>
        </div>
        <div class="collapse" id="educationCollapse">
          <div class="card-body">
          <div id="educations-container">
            ${this.educations.length === 0 ? `
              <div class="text-center text-muted py-4">
                <i class="bi bi-mortarboard display-4 mb-3"></i>
                <p>No education added yet.</p>
                <p class="small">Click "Add Education" to get started.</p>
              </div>
            ` : ''}
          </div>
          </div>
        </div>
      </div>
    `;

    this.renderEducations();
  }

  renderEducations() {
    const container = this.querySelector('#educations-container');
    if (!container) return;

    if (this.educations.length === 0) {
      container.innerHTML = `
        <div class="text-center text-muted py-4">
          <i class="bi bi-mortarboard display-4 mb-3"></i>
          <p>No education added yet.</p>
          <p class="small">Click "Add Education" to get started.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.educations.map((edu, index) => 
      `<education-item index="${index}" data='${JSON.stringify(edu)}'></education-item>`
    ).join('');
  }

  attachEventListeners() {
    // Add education button
    const addBtn = this.querySelector('[data-action="add-education"]');
    if (addBtn) {
      addBtn.addEventListener('app-click', () => {
        this.addEducation();
      });
    }

    // Listen for education changes
    this.addEventListener('education-changed', (e) => {
      console.log('🎓 EducationForm received education-changed:', e.detail);
      const index = parseInt(e.detail.index);
      let field = e.detail.field;
      const value = e.detail.value;

      // Remove index suffix from field name (e.g., "degree-0" -> "degree")
      if (field.includes('-')) {
        field = field.split('-')[0];
      }

      console.log('🎓 EducationForm - Index:', index, 'Field:', field, 'Value:', value);
      console.log('🎓 EducationForm - Current educations:', this.educations);

      // Ensure education object exists
      if (!this.educations[index]) {
        this.educations[index] = {
          institution: '',
          degree: '',
          field: '',
          location: '',
          startDate: '',
          endDate: '',
          isPresent: false,
          gpa: '',
          honors: '',
          coursework: '',
          activities: ''
        };
      }

      if (field === 'dates') {
        this.educations[index] = {
          ...this.educations[index],
          startDate: value.startDate,
          endDate: value.endDate,
          isPresent: value.isPresent
        };
      } else {
        this.educations[index] = {
          ...this.educations[index],
          [field]: value
        };
      }

      // Clean up any old field names with index suffixes
      const cleanedEducation = { ...this.educations[index] };
      Object.keys(cleanedEducation).forEach(key => {
        if (key.includes('-') && key.match(/\d+$/)) {
          delete cleanedEducation[key];
        }
      });
      this.educations[index] = cleanedEducation;

      console.log('🎓 EducationForm updated educations:', this.educations);
      this.emitChange();
    });

    // Listen for education removal
    this.addEventListener('education-removed', (e) => {
      const index = parseInt(e.detail.index);
      this.educations.splice(index, 1);
      this.renderEducations();
      this.emitChange();
    });

    // Note: field-changed and value-changed events are handled by EducationItem
    // which then emits education-changed events that we listen to above
  }

  addEducation() {
    const newEducation = {
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      isPresent: false,
      gpa: '',
      honors: '',
      coursework: '',
      activities: ''
    };

    this.educations.push(newEducation);
    this.renderEducations();
    this.emitChange();
  }

  getData() {
    return this.educations;
  }

  setData(educations) {
    this.educations = educations || [];
    this.renderEducations();
  }

  validate() {
    let isValid = true;
    const educationItems = this.querySelectorAll('education-item');
    
    educationItems.forEach(item => {
      if (!item.validate()) {
        isValid = false;
      }
    });

    return isValid;
  }

  emitChange() {
    console.log('🎓 Education form emitting change:', this.educations);
    this.dispatchEvent(new CustomEvent('data-changed', {
      bubbles: true,
      detail: { section: 'education', data: this.educations }
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

customElements.define('education-form', EducationForm);

