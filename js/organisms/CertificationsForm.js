// CertificationsForm - Organism component for certifications management
class CertificationsForm extends HTMLElement {
  constructor() {
    super();
    this.certifications = [];
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
                  data-bs-target="#certificationsCollapse" 
                  aria-expanded="false" 
                  aria-controls="certificationsCollapse">
            <h5 class="mb-0">
              <i class="bi bi-award me-2"></i>
              Certifications
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
              data-action="add-certification"
            ></app-button>
          </div>
        </div>
        <div class="collapse" id="certificationsCollapse">
          <div class="card-body">
          <div id="certifications-container">
            ${this.certifications.length === 0 ? `
              <div class="text-center text-muted py-4">
                <i class="bi bi-award display-4 mb-3"></i>
                <p>No certifications added yet.</p>
                <p class="small">Click "Add Certification" to showcase your credentials.</p>
              </div>
            ` : ''}
          </div>
          </div>
        </div>
      </div>
    `;

    this.renderCertifications();
  }

  renderCertifications() {
    const container = this.querySelector('#certifications-container');
    if (!container) return;

    if (this.certifications.length === 0) {
      container.innerHTML = `
        <div class="text-center text-muted py-4">
          <i class="bi bi-award display-4 mb-3"></i>
          <p>No certifications added yet.</p>
          <p class="small">Click "Add Certification" to showcase your credentials.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.certifications.map((cert, index) => 
      `<certification-item index="${index}" data='${JSON.stringify(cert)}'></certification-item>`
    ).join('');
  }

  attachEventListeners() {
    // Add certification button
    const addBtn = this.querySelector('[data-action="add-certification"]');
    if (addBtn) {
      addBtn.addEventListener('app-click', () => {
        this.addCertification();
      });
    }

    // Listen for certification changes
    this.addEventListener('certification-changed', (e) => {
      const index = parseInt(e.detail.index);
      let field = e.detail.field;
      const value = e.detail.value;

      // Remove index suffix from field name (e.g., "name-0" -> "name")
      if (field.includes('-')) {
        field = field.split('-')[0];
      }

      this.certifications[index] = {
        ...this.certifications[index],
        [field]: value
      };

      this.emitChange();
    });

    // Listen for certification removal
    this.addEventListener('certification-removed', (e) => {
      const index = parseInt(e.detail.index);
      this.certifications.splice(index, 1);
      this.renderCertifications();
      this.emitChange();
    });

    // Note: field-changed and value-changed events are handled by CertificationItem
    // which then emits certification-changed events that we listen to above
  }

  addCertification() {
    const newCertification = {
      name: '',
      issuer: '',
      date: '',
      url: '',
      credentialId: ''
    };

    this.certifications.push(newCertification);
    this.renderCertifications();
    this.emitChange();
  }

  getData() {
    return this.certifications;
  }

  setData(certifications) {
    this.certifications = certifications || [];
    this.renderCertifications();
  }

  validate() {
    let isValid = true;
    const certificationItems = this.querySelectorAll('certification-item');
    
    certificationItems.forEach(item => {
      if (!item.validate()) {
        isValid = false;
      }
    });

    return isValid;
  }

  emitChange() {
    this.dispatchEvent(new CustomEvent('data-changed', {
      bubbles: true,
      detail: { section: 'certifications', data: this.certifications }
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

// CertificationItem - Molecular component for individual certifications
class CertificationItem extends HTMLElement {
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
      <div class="card mb-3 certification-item" data-index="${index}">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">
            <i class="bi bi-award me-2"></i>
            Certification ${parseInt(index) + 1}
          </h6>
          <button type="button" class="btn btn-outline-danger btn-sm" data-action="remove">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <form-field 
                label="Certification Name" 
                field-id="name-${index}"
                value="${data.name || ''}"
                required
              ></form-field>
            </div>
            <div class="col-md-6">
              <form-field 
                label="Issuing Organization" 
                field-id="issuer-${index}"
                value="${data.issuer || ''}"
                required
              ></form-field>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <form-field 
                label="Issue Date" 
                field-id="date-${index}"
                type="date"
                value="${data.date || ''}"
                required
              ></form-field>
            </div>
            <div class="col-md-6">
              <form-field 
                label="Credential ID (Optional)" 
                field-id="credentialId-${index}"
                value="${data.credentialId || ''}"
                placeholder="Certificate ID or verification code"
              ></form-field>
            </div>
          </div>

          <form-field 
            label="Verification URL" 
            field-id="url-${index}"
            type="url"
            value="${data.url || ''}"
            placeholder="https://credly.com/badges/..."
          ></form-field>
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
        this.dispatchEvent(new CustomEvent('certification-removed', {
          bubbles: true,
          detail: { index: this.getAttribute('index') }
        }));
        this.remove();
      });
    }

    // Listen for field changes
    this.addEventListener('field-changed', (e) => {
      this.dispatchEvent(new CustomEvent('certification-changed', {
        bubbles: true,
        detail: { 
          index: this.getAttribute('index'),
          field: e.detail.field,
          value: e.detail.value
        }
      }));
    });
  }

  getData() {
    const index = this.getAttribute('index');
    const nameField = this.querySelector(`#name-${index}`);
    const issuerField = this.querySelector(`#issuer-${index}`);
    const dateField = this.querySelector(`#date-${index}`);
    const urlField = this.querySelector(`#url-${index}`);
    const credentialIdField = this.querySelector(`#credentialId-${index}`);

    return {
      name: nameField ? nameField.getValue() : '',
      issuer: issuerField ? issuerField.getValue() : '',
      date: dateField ? dateField.getValue() : '',
      url: urlField ? urlField.getValue() : '',
      credentialId: credentialIdField ? credentialIdField.getValue() : ''
    };
  }

  setData(data) {
    const index = this.getAttribute('index');
    
    if (data.name) {
      const nameField = this.querySelector(`#name-${index}`);
      if (nameField) nameField.setValue(data.name);
    }
    
    if (data.issuer) {
      const issuerField = this.querySelector(`#issuer-${index}`);
      if (issuerField) issuerField.setValue(data.issuer);
    }
    
    if (data.date) {
      const dateField = this.querySelector(`#date-${index}`);
      if (dateField) dateField.setValue(data.date);
    }
    
    if (data.url) {
      const urlField = this.querySelector(`#url-${index}`);
      if (urlField) urlField.setValue(data.url);
    }
    
    if (data.credentialId) {
      const credentialIdField = this.querySelector(`#credentialId-${index}`);
      if (credentialIdField) credentialIdField.setValue(data.credentialId);
    }
  }

  validate() {
    const index = this.getAttribute('index');
    const nameField = this.querySelector(`#name-${index}`);
    const issuerField = this.querySelector(`#issuer-${index}`);
    const dateField = this.querySelector(`#date-${index}`);

    let isValid = true;

    if (nameField && !nameField.validate()) {
      isValid = false;
    }

    if (issuerField && !issuerField.validate()) {
      isValid = false;
    }

    if (dateField && !dateField.validate()) {
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

customElements.define('certifications-form', CertificationsForm);
customElements.define('certification-item', CertificationItem);

