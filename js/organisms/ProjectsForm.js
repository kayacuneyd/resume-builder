// ProjectsForm - Organism component for projects management
class ProjectsForm extends HTMLElement {
  constructor() {
    super();
    this.projects = [];
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
                  data-bs-target="#projectsCollapse" 
                  aria-expanded="false" 
                  aria-controls="projectsCollapse">
            <h5 class="mb-0">
              <i class="bi bi-code-slash me-2"></i>
              Projects
              <span class="badge bg-light text-dark ms-2">Optional</span>
              <i class="bi bi-chevron-down float-end"></i>
            </h5>
          </button>
          <div class="d-flex align-items-center gap-2">
            <app-button 
              text="Add" 
              variant="light" 
              size="sm"
              icon="plus-lg"
              data-action="add-project"
            ></app-button>
          </div>
        </div>
        <div class="collapse" id="projectsCollapse">
          <div class="card-body">
          <div id="projects-container">
            ${this.projects.length === 0 ? `
              <div class="text-center text-muted py-4">
                <i class="bi bi-code-slash display-4 mb-3"></i>
                <p>No projects added yet.</p>
                <p class="small">Click "Add Project" to showcase your work.</p>
              </div>
            ` : ''}
          </div>
          </div>
        </div>
      </div>
    `;

    this.renderProjects();
  }

  renderProjects() {
    const container = this.querySelector('#projects-container');
    if (!container) return;

    if (this.projects.length === 0) {
      container.innerHTML = `
        <div class="text-center text-muted py-4">
          <i class="bi bi-code-slash display-4 mb-3"></i>
          <p>No projects added yet.</p>
          <p class="small">Click "Add Project" to showcase your work.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.projects.map((project, index) => 
      `<project-item index="${index}" data='${JSON.stringify(project)}'></project-item>`
    ).join('');
  }

  attachEventListeners() {
    // Add project button
    const addBtn = this.querySelector('[data-action="add-project"]');
    if (addBtn) {
      addBtn.addEventListener('app-click', () => {
        this.addProject();
      });
    }

    // Listen for project changes
    this.addEventListener('project-changed', (e) => {
      const index = parseInt(e.detail.index);
      let field = e.detail.field;
      const value = e.detail.value;

      // Remove index suffix from field name (e.g., "name-0" -> "name")
      if (field.includes('-')) {
        field = field.split('-')[0];
      }

      this.projects[index] = {
        ...this.projects[index],
        [field]: value
      };

      this.emitChange();
    });

    // Listen for project removal
    this.addEventListener('project-removed', (e) => {
      const index = parseInt(e.detail.index);
      this.projects.splice(index, 1);
      this.renderProjects();
      this.emitChange();
    });

    // Note: field-changed and value-changed events are handled by ProjectItem
    // which then emits project-changed events that we listen to above
  }

  addProject() {
    const newProject = {
      name: '',
      description: '',
      url: '',
      technologies: '',
      startDate: '',
      endDate: '',
      isPresent: false
    };

    this.projects.push(newProject);
    this.renderProjects();
    this.emitChange();
  }

  getData() {
    return this.projects;
  }

  setData(projects) {
    this.projects = projects || [];
    this.renderProjects();
  }

  validate() {
    let isValid = true;
    const projectItems = this.querySelectorAll('project-item');
    
    projectItems.forEach(item => {
      if (!item.validate()) {
        isValid = false;
      }
    });

    return isValid;
  }

  emitChange() {
    this.dispatchEvent(new CustomEvent('data-changed', {
      bubbles: true,
      detail: { section: 'projects', data: this.projects }
    }));
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.attachEventListeners();
    }
  }
}

// ProjectItem - Molecular component for individual projects
class ProjectItem extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const index = this.getAttribute('index') || '0';
    const data = this.getAttribute('data') ? JSON.parse(this.getAttribute('data')) : {};

    this.innerHTML = `
      <div class="card mb-3 project-item" data-index="${index}">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">
            <i class="bi bi-code-slash me-2"></i>
            Project ${parseInt(index) + 1}
          </h6>
          <button type="button" class="btn btn-outline-danger btn-sm" data-action="remove">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <div class="card-body">
          <form-field 
            label="Project Name" 
            field-id="name-${index}"
            value="${data.name || ''}"
            required
          ></form-field>

          <form-field 
            label="Description" 
            field-id="description-${index}"
            type="textarea"
            value="${data.description || ''}"
            rows="3"
            placeholder="Describe what the project does and your role..."
            required
          ></form-field>

          <div class="row">
            <div class="col-md-6">
              <form-field 
                label="Project URL" 
                field-id="url-${index}"
                type="url"
                value="${data.url || ''}"
                placeholder="https://github.com/username/project"
              ></form-field>
            </div>
            <div class="col-md-6">
              <form-field 
                label="Technologies Used" 
                field-id="technologies-${index}"
                value="${data.technologies || ''}"
                placeholder="React, Node.js, MongoDB, etc."
              ></form-field>
            </div>
          </div>

          <date-range-picker 
            field-id="dates-${index}"
            start-label="Start Date"
            end-label="End Date"
            start-value="${data.startDate || ''}"
            end-value="${data.endDate || ''}"
            show-present
          ></date-range-picker>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const index = this.getAttribute('index');
    
    // Remove button
    const removeBtn = this.querySelector('[data-action="remove"]');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('project-removed', {
          bubbles: true,
          detail: { index: this.getAttribute('index') }
        }));
        this.remove();
      });
    }

    // Listen for field changes
    this.addEventListener('field-changed', (e) => {
      this.dispatchEvent(new CustomEvent('project-changed', {
        bubbles: true,
        detail: { 
          index: this.getAttribute('index'),
          field: e.detail.field,
          value: e.detail.value
        }
      }));
    });

    // Listen for date range changes
    this.addEventListener('date-range-changed', (e) => {
      this.dispatchEvent(new CustomEvent('project-changed', {
        bubbles: true,
        detail: { 
          index: this.getAttribute('index'),
          field: 'dates',
          value: e.detail.value
        }
      }));
    });
  }

  getData() {
    const index = this.getAttribute('index');
    const nameField = this.querySelector(`#name-${index}`);
    const descriptionField = this.querySelector(`#description-${index}`);
    const urlField = this.querySelector(`#url-${index}`);
    const technologiesField = this.querySelector(`#technologies-${index}`);
    const dateRange = this.querySelector(`date-range-picker`);

    return {
      name: nameField ? nameField.getValue() : '',
      description: descriptionField ? descriptionField.getValue() : '',
      url: urlField ? urlField.getValue() : '',
      technologies: technologiesField ? technologiesField.getValue() : '',
      startDate: dateRange ? dateRange.getValue().startDate : '',
      endDate: dateRange ? dateRange.getValue().endDate : '',
      isPresent: dateRange ? dateRange.getValue().isPresent : false
    };
  }

  setData(data) {
    const index = this.getAttribute('index');
    
    if (data.name) {
      const nameField = this.querySelector(`#name-${index}`);
      if (nameField) nameField.setValue(data.name);
    }
    
    if (data.description) {
      const descriptionField = this.querySelector(`#description-${index}`);
      if (descriptionField) descriptionField.setValue(data.description);
    }
    
    if (data.url) {
      const urlField = this.querySelector(`#url-${index}`);
      if (urlField) urlField.setValue(data.url);
    }
    
    if (data.technologies) {
      const technologiesField = this.querySelector(`#technologies-${index}`);
      if (technologiesField) technologiesField.setValue(data.technologies);
    }
    
    if (data.startDate || data.endDate || data.isPresent !== undefined) {
      const dateRange = this.querySelector(`date-range-picker`);
      if (dateRange) {
        dateRange.setValue({
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          isPresent: data.isPresent || false
        });
      }
    }
  }

  validate() {
    const index = this.getAttribute('index');
    const nameField = this.querySelector(`#name-${index}`);
    const descriptionField = this.querySelector(`#description-${index}`);
    const dateRange = this.querySelector(`date-range-picker`);

    let isValid = true;

    if (nameField && !nameField.validate()) {
      isValid = false;
    }

    if (descriptionField && !descriptionField.validate()) {
      isValid = false;
    }

    if (dateRange && !dateRange.validateDateRange()) {
      isValid = false;
    }

    return isValid;
  }

  static get observedAttributes() {
    return ['index', 'data'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      // Don't call attachEventListeners() here to avoid infinite loop
    }
  }
}

customElements.define('projects-form', ProjectsForm);
customElements.define('project-item', ProjectItem);

