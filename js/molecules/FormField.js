// FormField - Molecular component combining label, input, and validation
class FormField extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const label = this.getAttribute('label') || 'Label';
    const type = this.getAttribute('type') || 'text';
    const fieldId = this.getAttribute('field-id');
    const fieldName = this.getAttribute('field-name') || fieldId?.split('-')[0] || 'field';
    
    // Generate a unique but simpler ID
    let id;
    if (fieldId) {
      // Use provided field-id with a simple random suffix
      id = `${fieldId}-${Math.random().toString(36).substr(2, 6)}`;
    } else {
      // Generate unique ID with field name
      id = `${fieldName}-${Math.random().toString(36).substr(2, 6)}`;
    }
    
    const required = this.hasAttribute('required');
    const helpText = this.getAttribute('help') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    const value = this.getAttribute('value') || '';
    const disabled = this.hasAttribute('disabled');
    const readonly = this.hasAttribute('readonly');
    const maxlength = this.getAttribute('maxlength') || '';
    const pattern = this.getAttribute('pattern') || '';
    const rows = this.getAttribute('rows') || '3';

    // Store the ID for later use
    this._fieldId = id;

    const inputComponent = type === 'textarea' ? 'app-textarea' : 'app-input';
    const inputAttributes = [
      `id="${id}"`,
      `data-field-name="${fieldName}"`,
      `type="${type}"`,
      `placeholder="${placeholder}"`,
      `value="${value}"`,
      required ? 'required' : '',
      disabled ? 'disabled' : '',
      readonly ? 'readonly' : '',
      maxlength ? `maxlength="${maxlength}"` : '',
      pattern ? `pattern="${pattern}"` : '',
      type === 'textarea' ? `rows="${rows}"` : ''
    ].filter(attr => attr).join(' ');

    this.innerHTML = `
      <div class="mb-3">
        <app-label 
          for="${id}" 
          text="${label}" 
          ${required ? 'required' : ''}
          help="${helpText}"
        ></app-label>
        <${inputComponent} ${inputAttributes}></${inputComponent}>
        <div class="invalid-feedback" id="error-${id}"></div>
      </div>
    `;
  }

  attachEventListeners() {
    const input = this.querySelector('app-input, app-textarea');
    if (input) {
      // Listen for value changes
      input.addEventListener('value-changed', (e) => {
        this.clearError();
        this.dispatchEvent(new CustomEvent('field-changed', {
          bubbles: true,
          detail: { 
            field: this.getAttribute('field-id'),
            value: e.detail.value 
          }
        }));
      });

      // Listen for blur events for validation
      input.addEventListener('field-blur', (e) => {
        this.validate();
      });
    }
  }

  getValue() {
    const input = this.querySelector('app-input, app-textarea');
    return input ? input.getValue() : '';
  }

  setValue(value) {
    const input = this.querySelector('app-input, app-textarea');
    if (input) {
      input.setValue(value);
    }
  }

  validate() {
    const input = this.querySelector('app-input, app-textarea');
    if (!input) return false;

    const isValid = input.checkValidity();
    if (!isValid) {
      this.showError(input.validationMessage);
    } else {
      this.clearError();
    }
    return isValid;
  }

  showError(message) {
    const errorDiv = this.querySelector('.invalid-feedback');
    const input = this.querySelector('app-input, app-textarea');
    
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
    
    if (input) {
      input.classList.add('is-invalid');
    }
  }

  clearError() {
    const errorDiv = this.querySelector('.invalid-feedback');
    const input = this.querySelector('app-input, app-textarea');
    
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
    
    if (input) {
      input.classList.remove('is-invalid');
    }
  }

  setCustomValidity(message) {
    const input = this.querySelector('app-input, app-textarea');
    if (input) {
      input.setCustomValidity(message);
    }
  }

  focus() {
    const input = this.querySelector('app-input, app-textarea');
    if (input) {
      input.focus();
    }
  }

  setDisabled(disabled) {
    if (disabled) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
    this.render();
    this.attachEventListeners();
  }

  setRequired(required) {
    if (required) {
      this.setAttribute('required', '');
    } else {
      this.removeAttribute('required');
    }
    this.render();
    this.attachEventListeners();
  }

  static get observedAttributes() {
    return ['label', 'type', 'field-id', 'required', 'help', 'placeholder', 'value', 'disabled', 'readonly', 'maxlength', 'pattern', 'rows'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      // Don't call attachEventListeners() here to avoid infinite loop
    }
  }
}

customElements.define('form-field', FormField);

