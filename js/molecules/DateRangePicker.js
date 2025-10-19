// DateRangePicker - Molecular component for date ranges
class DateRangePicker extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const startLabel = this.getAttribute('start-label') || 'Start Date';
    const endLabel = this.getAttribute('end-label') || 'End Date';
    const startValue = this.getAttribute('start-value') || '';
    const endValue = this.getAttribute('end-value') || '';
    const required = this.hasAttribute('required');
    const showPresent = this.hasAttribute('show-present');
    const fieldId = this.getAttribute('field-id');
    const id = fieldId ? `${fieldId}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` : `daterange-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    this.innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <app-label 
              for="${id}-start" 
              text="${startLabel}" 
              ${required ? 'required' : ''}
            ></app-label>
            <app-input 
              id="${id}-start" 
              data-field-name="startDate"
              type="date" 
              value="${startValue}"
              ${required ? 'required' : ''}
            ></app-input>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <app-label 
              for="${id}-end" 
              text="${endLabel}"
            ></app-label>
            <app-input 
              id="${id}-end" 
              data-field-name="endDate"
              type="date" 
              value="${endValue}"
            ></app-input>
            ${showPresent ? `
              <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox" id="${id}-present" data-field-name="isPresent">
                <label class="form-check-label" for="${id}-present">
                  Currently working/studying here
                </label>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const startInput = this.querySelector(`#${this.getAttribute('field-id') || 'daterange'}-start`);
    const endInput = this.querySelector(`#${this.getAttribute('field-id') || 'daterange'}-end`);
    const presentCheckbox = this.querySelector(`#${this.getAttribute('field-id') || 'daterange'}-present`);

    if (startInput) {
      startInput.addEventListener('value-changed', (e) => {
        this.validateDateRange();
        this.emitChange();
      });
    }

    if (endInput) {
      endInput.addEventListener('value-changed', (e) => {
        this.validateDateRange();
        this.emitChange();
      });
    }

    if (presentCheckbox) {
      presentCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          endInput.setValue('');
          endInput.setAttribute('disabled', '');
        } else {
          endInput.removeAttribute('disabled');
        }
        this.emitChange();
      });
    }
  }

  validateDateRange() {
    const startInput = this.querySelector(`#${this.getAttribute('field-id') || 'daterange'}-start`);
    const endInput = this.querySelector(`#${this.getAttribute('field-id') || 'daterange'}-end`);
    const presentCheckbox = this.querySelector(`#${this.getAttribute('field-id') || 'daterange'}-present`);

    if (!startInput || !endInput) return;

    const startDate = startInput.getValue();
    const endDate = endInput.getValue();
    const isPresent = presentCheckbox ? presentCheckbox.checked : false;

    // Clear previous errors
    this.clearErrors();

    if (startDate && endDate && !isPresent) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        this.showError('Start date cannot be after end date');
        return false;
      }
    }

    return true;
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback d-block';
    errorDiv.textContent = message;
    
    const container = this.querySelector('.row');
    if (container) {
      container.appendChild(errorDiv);
    }
  }

  clearErrors() {
    const errorDiv = this.querySelector('.invalid-feedback');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  getValue() {
    // Use data attributes to find fields instead of IDs
    const startInput = this.querySelector('[data-field-name="startDate"]');
    const endInput = this.querySelector('[data-field-name="endDate"]');
    const presentCheckbox = this.querySelector('[data-field-name="isPresent"]');

    return {
      startDate: startInput ? startInput.getValue() : '',
      endDate: endInput ? endInput.getValue() : '',
      isPresent: presentCheckbox ? presentCheckbox.checked : false
    };
  }

  setValue(value) {
    const startInput = this.querySelector(`#${this.getAttribute('field-id') || 'daterange'}-start`);
    const endInput = this.querySelector(`#${this.getAttribute('field-id') || 'daterange'}-end`);
    const presentCheckbox = this.querySelector(`#${this.getAttribute('field-id') || 'daterange'}-present`);

    if (startInput && value.startDate) {
      startInput.setValue(value.startDate);
    }
    if (endInput && value.endDate) {
      endInput.setValue(value.endDate);
    }
    if (presentCheckbox && value.isPresent !== undefined) {
      presentCheckbox.checked = value.isPresent;
      if (value.isPresent) {
        endInput.setValue('');
        endInput.setAttribute('disabled', '');
      } else {
        endInput.removeAttribute('disabled');
      }
    }
  }

  emitChange() {
    this.dispatchEvent(new CustomEvent('date-range-changed', {
      bubbles: true,
      detail: { 
        field: this.getAttribute('field-id'),
        value: this.getValue() 
      }
    }));
  }

  static get observedAttributes() {
    return ['start-label', 'end-label', 'start-value', 'end-value', 'required', 'show-present', 'field-id'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      // Don't call attachEventListeners() here to avoid infinite loop
    }
  }
}

customElements.define('date-range-picker', DateRangePicker);

