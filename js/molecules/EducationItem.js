// EducationItem - Molecular component for education entries
class EducationItem extends HTMLElement {
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
    const uniqueId = `edu-${index}-${Date.now()}`;

    this.innerHTML = `
      <div class="card mb-3 education-item" data-index="${index}">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">
            <i class="bi bi-mortarboard me-2"></i>
            Education ${parseInt(index) + 1}
          </h6>
          <button type="button" class="btn btn-outline-danger btn-sm" data-action="remove">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <form-field 
                label="Institution" 
                field-id="institution-${uniqueId}"
                field-name="institution"
                value="${data.institution || ''}"
                required
              ></form-field>
            </div>
            <div class="col-md-6">
              <form-field 
                label="Degree" 
                field-id="degree-${uniqueId}"
                field-name="degree"
                value="${data.degree || ''}"
                required
              ></form-field>
            </div>
          </div>
          
          <div class="row">
            <div class="col-md-6">
              <form-field 
                label="Field of Study" 
                field-id="field-${uniqueId}"
                field-name="field"
                value="${data.field || ''}"
                placeholder="Computer Science, Business Administration, etc."
              ></form-field>
            </div>
            <div class="col-md-6">
              <form-field 
                label="Location" 
                field-id="location-${uniqueId}"
                field-name="location"
                value="${data.location || ''}"
                placeholder="City, State"
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

          <div class="row">
            <div class="col-md-6">
              <form-field 
                label="GPA (Optional)" 
                field-id="gpa-${uniqueId}"
                field-name="gpa"
                type="number"
                value="${data.gpa || ''}"
                step="0.01"
                min="0"
                max="4"
                placeholder="3.5"
              ></form-field>
            </div>
            <div class="col-md-6">
              <form-field 
                label="Honors/Awards" 
                field-id="honors-${uniqueId}"
                field-name="honors"
                value="${data.honors || ''}"
                placeholder="Magna Cum Laude, Dean's List, etc."
              ></form-field>
            </div>
          </div>

          <form-field 
            label="Relevant Coursework" 
            field-id="coursework-${uniqueId}"
            field-name="coursework"
            type="textarea"
            value="${data.coursework || ''}"
            rows="3"
            placeholder="List relevant courses you've taken..."
          ></form-field>

          <form-field 
            label="Activities/Organizations" 
            field-id="activities-${uniqueId}"
            field-name="activities"
            type="textarea"
            value="${data.activities || ''}"
            rows="2"
            placeholder="Student organizations, clubs, volunteer work, etc."
          ></form-field>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Remove button
    const removeBtn = this.querySelector('[data-action="remove"]');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('education-removed', {
          bubbles: true,
          detail: { index: this.getAttribute('index') }
        }));
        this.remove();
      });
    }

    // Listen for field changes
    this.addEventListener('field-changed', (e) => {
      this.dispatchEvent(new CustomEvent('education-changed', {
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
      this.dispatchEvent(new CustomEvent('education-changed', {
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
    const institutionField = this.querySelector('[data-field-name="institution"]');
    const degreeField = this.querySelector('[data-field-name="degree"]');
    const fieldField = this.querySelector('[data-field-name="field"]');
    const locationField = this.querySelector('[data-field-name="location"]');
    const gpaField = this.querySelector('[data-field-name="gpa"]');
    const honorsField = this.querySelector('[data-field-name="honors"]');
    const courseworkField = this.querySelector('[data-field-name="coursework"]');
    const activitiesField = this.querySelector('[data-field-name="activities"]');
    const dateRange = this.querySelector(`date-range-picker`);

    return {
      institution: institutionField ? institutionField.getValue() : '',
      degree: degreeField ? degreeField.getValue() : '',
      field: fieldField ? fieldField.getValue() : '',
      location: locationField ? locationField.getValue() : '',
      startDate: dateRange ? dateRange.getValue().startDate : '',
      endDate: dateRange ? dateRange.getValue().endDate : '',
      isPresent: dateRange ? dateRange.getValue().isPresent : false,
      gpa: gpaField ? gpaField.getValue() : '',
      honors: honorsField ? honorsField.getValue() : '',
      coursework: courseworkField ? courseworkField.getValue() : '',
      activities: activitiesField ? activitiesField.getValue() : ''
    };
  }

  setData(data) {
    const index = this.getAttribute('index');
    
    if (data.institution) {
      const institutionField = this.querySelector(`#institution-${index}`);
      if (institutionField) institutionField.setValue(data.institution);
    }
    
    if (data.degree) {
      const degreeField = this.querySelector(`#degree-${index}`);
      if (degreeField) degreeField.setValue(data.degree);
    }
    
    if (data.field) {
      const fieldField = this.querySelector(`#field-${index}`);
      if (fieldField) fieldField.setValue(data.field);
    }
    
    if (data.location) {
      const locationField = this.querySelector(`#location-${index}`);
      if (locationField) locationField.setValue(data.location);
    }
    
    if (data.gpa) {
      const gpaField = this.querySelector(`#gpa-${index}`);
      if (gpaField) gpaField.setValue(data.gpa);
    }
    
    if (data.honors) {
      const honorsField = this.querySelector(`#honors-${index}`);
      if (honorsField) honorsField.setValue(data.honors);
    }
    
    if (data.coursework) {
      const courseworkField = this.querySelector(`#coursework-${index}`);
      if (courseworkField) courseworkField.setValue(data.coursework);
    }
    
    if (data.activities) {
      const activitiesField = this.querySelector(`#activities-${index}`);
      if (activitiesField) activitiesField.setValue(data.activities);
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
    const institutionField = this.querySelector(`#institution-${index}`);
    const degreeField = this.querySelector(`#degree-${index}`);
    const dateRange = this.querySelector(`date-range-picker`);

    let isValid = true;

    if (institutionField && !institutionField.validate()) {
      isValid = false;
    }

    if (degreeField && !degreeField.validate()) {
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

customElements.define('education-item', EducationItem);

