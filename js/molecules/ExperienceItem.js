// ExperienceItem - Molecular component for work experience entries
class ExperienceItem extends HTMLElement {
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
    const uniqueId = `exp-${index}-${Date.now()}`;

    this.innerHTML = `
      <div class="card mb-3 experience-item" data-index="${index}">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">
            <i class="bi bi-briefcase me-2"></i>
            Work Experience ${parseInt(index) + 1}
          </h6>
          <button type="button" class="btn btn-outline-danger btn-sm" data-action="remove">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <form-field 
                label="Job Title" 
                field-id="title-${uniqueId}"
                field-name="title"
                value="${data.title || ''}"
                required
              ></form-field>
            </div>
            <div class="col-md-6">
              <form-field 
                label="Company" 
                field-id="company-${uniqueId}"
                field-name="company"
                value="${data.company || ''}"
                required
              ></form-field>
            </div>
          </div>
          
          <div class="row">
            <div class="col-md-6">
              <form-field 
                label="Location" 
                field-id="location-${uniqueId}"
                field-name="location"
                value="${data.location || ''}"
                placeholder="City, State"
              ></form-field>
            </div>
            <div class="col-md-6">
              <form-field 
                label="Employment Type" 
                field-id="type-${uniqueId}"
                field-name="type"
                value="${data.type || ''}"
                placeholder="Full-time, Part-time, Contract, etc."
              ></form-field>
            </div>
          </div>

          <date-range-picker 
            field-id="dates-${uniqueId}"
            start-label="Start Date"
            end-label="End Date"
            start-value="${data.startDate || ''}"
            end-value="${data.endDate || ''}"
            show-present
            required
          ></date-range-picker>

          <form-field 
            label="Job Description" 
            field-id="description-${uniqueId}"
            field-name="description"
            type="textarea"
            value="${data.description || ''}"
            rows="4"
            placeholder="Describe your key responsibilities and achievements..."
          ></form-field>

          <div class="row">
            <div class="col-md-6">
              <form-field 
                label="Key Achievements" 
                field-id="achievements-${uniqueId}"
                field-name="achievements"
                type="textarea"
                value="${data.achievements || ''}"
                rows="3"
                placeholder="List your key achievements and accomplishments..."
              ></form-field>
            </div>
            <div class="col-md-6">
              <form-field 
                label="Technologies Used" 
                field-id="technologies-${uniqueId}"
                field-name="technologies"
                value="${data.technologies || ''}"
                placeholder="JavaScript, React, Node.js, etc."
              ></form-field>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Remove button
    const removeBtn = this.querySelector('[data-action="remove"]');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('experience-removed', {
          bubbles: true,
          detail: { index: this.getAttribute('index') }
        }));
        this.remove();
      });
    }

    // Listen for field changes
    this.addEventListener('field-changed', (e) => {
      this.dispatchEvent(new CustomEvent('experience-changed', {
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
      this.dispatchEvent(new CustomEvent('experience-changed', {
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
    
    // Use data attributes to find fields instead of IDs
    const titleField = this.querySelector('[data-field-name="title"]');
    const companyField = this.querySelector('[data-field-name="company"]');
    const locationField = this.querySelector('[data-field-name="location"]');
    const typeField = this.querySelector('[data-field-name="type"]');
    const descriptionField = this.querySelector('[data-field-name="description"]');
    const achievementsField = this.querySelector('[data-field-name="achievements"]');
    const technologiesField = this.querySelector('[data-field-name="technologies"]');
    const dateRange = this.querySelector(`date-range-picker`);

    return {
      title: titleField ? titleField.getValue() : '',
      company: companyField ? companyField.getValue() : '',
      location: locationField ? locationField.getValue() : '',
      type: typeField ? typeField.getValue() : '',
      startDate: dateRange ? dateRange.getValue().startDate : '',
      endDate: dateRange ? dateRange.getValue().endDate : '',
      isPresent: dateRange ? dateRange.getValue().isPresent : false,
      description: descriptionField ? descriptionField.getValue() : '',
      achievements: achievementsField ? achievementsField.getValue() : '',
      technologies: technologiesField ? technologiesField.getValue() : ''
    };
  }

  setData(data) {
    const index = this.getAttribute('index');
    
    if (data.title) {
      const titleField = this.querySelector(`#title-${index}`);
      if (titleField) titleField.setValue(data.title);
    }
    
    if (data.company) {
      const companyField = this.querySelector(`#company-${index}`);
      if (companyField) companyField.setValue(data.company);
    }
    
    if (data.location) {
      const locationField = this.querySelector(`#location-${index}`);
      if (locationField) locationField.setValue(data.location);
    }
    
    if (data.type) {
      const typeField = this.querySelector(`#type-${index}`);
      if (typeField) typeField.setValue(data.type);
    }
    
    if (data.description) {
      const descriptionField = this.querySelector(`#description-${index}`);
      if (descriptionField) descriptionField.setValue(data.description);
    }
    
    if (data.achievements) {
      const achievementsField = this.querySelector(`#achievements-${index}`);
      if (achievementsField) achievementsField.setValue(data.achievements);
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
    const titleField = this.querySelector(`#title-${index}`);
    const companyField = this.querySelector(`#company-${index}`);
    const dateRange = this.querySelector(`date-range-picker`);

    let isValid = true;

    if (titleField && !titleField.validate()) {
      isValid = false;
    }

    if (companyField && !companyField.validate()) {
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

customElements.define('experience-item', ExperienceItem);

