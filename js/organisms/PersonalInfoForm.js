// PersonalInfoForm - Organism component for personal information
class PersonalInfoForm extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    await this.waitForClerk();
    this.render();
    this.attachEventListeners();
  }

  async waitForClerk() {
    while (!window.Clerk) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    await window.Clerk.load();
  }

  render() {
    this.innerHTML = `
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">
            <button class="btn btn-link text-white text-decoration-none p-0 w-100 text-start" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#personalInfoCollapse" 
                    aria-expanded="true" 
                    aria-controls="personalInfoCollapse">
              <i class="bi bi-person-circle me-2"></i>
              Personal Information
              <i class="bi bi-chevron-down float-end"></i>
            </button>
          </h5>
        </div>
        <div class="collapse show" id="personalInfoCollapse">
          <div class="card-body">
          <div class="alert alert-info" role="alert">
            <i class="bi bi-info-circle me-2"></i>
            Name, email, and phone are synced from your account. 
            <a href="#" id="edit-account" class="alert-link">Edit in profile</a>
          </div>

          <form-field 
            label="Full Name" 
            field-id="fullName"
            field-name="fullName"
            required
          ></form-field>

          <form-field 
            label="Email" 
            field-id="email"
            field-name="email"
            type="email"
            required
          ></form-field>

          <form-field 
            label="Phone" 
            field-id="phone"
            field-name="phone"
            type="tel"
            help="Format: (123) 456-7890"
          ></form-field>

          <form-field 
            label="Professional Title" 
            field-id="professionalTitle"
            field-name="professionalTitle"
            help="e.g., Senior Software Engineer"
            required
          ></form-field>

          <form-field 
            label="Location" 
            field-id="location"
            field-name="location"
            help="e.g., San Francisco, CA"
          ></form-field>

          <div class="row">
            <div class="col-md-6">
              <form-field 
                label="LinkedIn" 
                field-id="linkedin"
                field-name="linkedin"
                type="url"
                help="Your LinkedIn profile URL"
              ></form-field>
            </div>
            <div class="col-md-6">
              <form-field 
                label="Portfolio/Website" 
                field-id="portfolio"
                field-name="portfolio"
                type="url"
              ></form-field>
            </div>
          </div>

          <div class="mb-3">
            <app-label 
              for="summary" 
              text="Professional Summary"
              help="Brief overview of your professional background and key strengths (150-300 characters recommended)"
            ></app-label>
            <app-textarea 
              id="summary"
              data-field-name="summary"
              rows="4"
              placeholder="Brief overview of your professional background and key strengths..."
              maxlength="300"
            ></app-textarea>
            <div class="form-text">
              <span id="char-count">0</span> / 300 characters
            </div>
          </div>
          </div>
        </div>
      </div>
    `;

    this.autoFillFromClerk();
    this.setupCharacterCounter();
  }

  autoFillFromClerk() {
    if (window.Clerk && window.Clerk.user) {
      const user = window.Clerk.user;
      
      // Auto-fill from Clerk user data
      const fullNameField = this.querySelector('#fullName');
      if (fullNameField) {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        fullNameField.setValue(fullName);
      }

      const emailField = this.querySelector('#email');
      if (emailField) {
        const email = user.primaryEmailAddress?.emailAddress || '';
        emailField.setValue(email);
      }

      const phoneField = this.querySelector('#phone');
      if (phoneField) {
        const phone = user.unsafeMetadata?.phone || '';
        phoneField.setValue(phone);
      }
    }
  }

  setupCharacterCounter() {
    const summary = this.querySelector('#summary');
    const charCount = this.querySelector('#char-count');
    
    if (summary && charCount) {
      summary.addEventListener('value-changed', (e) => {
        const count = e.detail.value.length;
        charCount.textContent = count;
        
        // Update color based on character count
        if (count >= 150 && count <= 300) {
          charCount.className = 'text-success';
        } else if (count > 300) {
          charCount.className = 'text-danger';
        } else {
          charCount.className = 'text-warning';
        }
      });
    }
  }

  attachEventListeners() {
    // Edit account link
    const editAccountLink = this.querySelector('#edit-account');
    if (editAccountLink) {
      editAccountLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.Clerk) {
          window.Clerk.openUserProfile();
        }
      });
    }

    // Listen for field changes
    this.addEventListener('field-changed', (e) => {
      this.dispatchEvent(new CustomEvent('data-changed', {
        bubbles: true,
        detail: { section: 'personalInfo', data: this.getData() }
      }));
    });

    // Listen for value changes from app-textarea
    this.addEventListener('value-changed', (e) => {
      this.dispatchEvent(new CustomEvent('data-changed', {
        bubbles: true,
        detail: { section: 'personalInfo', data: this.getData() }
      }));
    });
  }

  getData() {
    // Use data attributes to find fields instead of IDs
    const fullNameField = this.querySelector('[data-field-name="fullName"]');
    const emailField = this.querySelector('[data-field-name="email"]');
    const phoneField = this.querySelector('[data-field-name="phone"]');
    const professionalTitleField = this.querySelector('[data-field-name="professionalTitle"]');
    const locationField = this.querySelector('[data-field-name="location"]');
    const linkedinField = this.querySelector('[data-field-name="linkedin"]');
    const portfolioField = this.querySelector('[data-field-name="portfolio"]');
    const summaryField = this.querySelector('[data-field-name="summary"]');

    return {
      fullName: fullNameField ? fullNameField.getValue() : '',
      email: emailField ? emailField.getValue() : '',
      phone: phoneField ? phoneField.getValue() : '',
      professionalTitle: professionalTitleField ? professionalTitleField.getValue() : '',
      location: locationField ? locationField.getValue() : '',
      linkedin: linkedinField ? linkedinField.getValue() : '',
      portfolio: portfolioField ? portfolioField.getValue() : '',
      summary: summaryField ? summaryField.getValue() : ''
    };
  }

  setData(data) {
    if (!data) return;

    if (data.professionalTitle) {
      const professionalTitleField = this.querySelector('#professionalTitle');
      if (professionalTitleField) professionalTitleField.setValue(data.professionalTitle);
    }

    if (data.location) {
      const locationField = this.querySelector('#location');
      if (locationField) locationField.setValue(data.location);
    }

    if (data.linkedin) {
      const linkedinField = this.querySelector('#linkedin');
      if (linkedinField) linkedinField.setValue(data.linkedin);
    }

    if (data.portfolio) {
      const portfolioField = this.querySelector('#portfolio');
      if (portfolioField) portfolioField.setValue(data.portfolio);
    }

    if (data.summary) {
      const summaryField = this.querySelector('#summary');
      if (summaryField) summaryField.setValue(data.summary);
    }
  }

  validate() {
    const fields = [
      this.querySelector('#fullName'),
      this.querySelector('#email'),
      this.querySelector('#professionalTitle')
    ];

    let isValid = true;
    fields.forEach(field => {
      if (field && !field.validate()) {
        isValid = false;
      }
    });

    return isValid;
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

customElements.define('personal-info-form', PersonalInfoForm);

