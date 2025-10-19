// AppInput - Atomic component for input fields
class AppInput extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const id = this.getAttribute('id') || `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const type = this.getAttribute('type') || 'text';
    const placeholder = this.getAttribute('placeholder') || '';
    const value = this.getAttribute('value') || '';
    const required = this.hasAttribute('required');
    const disabled = this.hasAttribute('disabled');
    const readonly = this.hasAttribute('readonly');
    const min = this.getAttribute('min') || '';
    const max = this.getAttribute('max') || '';
    const step = this.getAttribute('step') || '';
    const pattern = this.getAttribute('pattern') || '';
    const maxlength = this.getAttribute('maxlength') || '';
    const size = this.getAttribute('size') || '';
    const className = this.getAttribute('class') || 'form-control';

    // Store the ID for later use (but don't set it on the custom element)
    this._inputId = id;
    // ✅ DON'T set this.id = id; - Let the internal <input> have the ID

    const inputAttributes = [
      `id="${id}"`,
      `type="${type}"`,
      `class="${className}"`,
      `placeholder="${placeholder}"`,
      `value="${value}"`,
      required ? 'required' : '',
      disabled ? 'disabled' : '',
      readonly ? 'readonly' : '',
      min ? `min="${min}"` : '',
      max ? `max="${max}"` : '',
      step ? `step="${step}"` : '',
      pattern ? `pattern="${pattern}"` : '',
      maxlength ? `maxlength="${maxlength}"` : '',
      size ? `size="${size}"` : ''
    ].filter(attr => attr).join(' ');

    this.innerHTML = `<input ${inputAttributes}>`;
  }

  attachEventListeners() {
    const input = this.querySelector('input');
    if (input) {
      // Emit value changes
      input.addEventListener('input', (e) => {
        this.dispatchEvent(new CustomEvent('value-changed', {
          bubbles: true,
          detail: { value: e.target.value, field: this.getAttribute('id') }
        }));
      });

      // Emit focus events
      input.addEventListener('focus', (e) => {
        this.dispatchEvent(new CustomEvent('field-focus', {
          bubbles: true,
          detail: { field: this.getAttribute('id') }
        }));
      });

      // Emit blur events
      input.addEventListener('blur', (e) => {
        this.dispatchEvent(new CustomEvent('field-blur', {
          bubbles: true,
          detail: { value: e.target.value, field: this.getAttribute('id') }
        }));
      });

      // Emit key events
      input.addEventListener('keydown', (e) => {
        this.dispatchEvent(new CustomEvent('keydown', {
          bubbles: true,
          detail: { key: e.key, field: this.getAttribute('id') }
        }));
      });
    }
  }

  getValue() {
    const input = this.querySelector('input');
    return input ? input.value : '';
  }

  setValue(value) {
    const input = this.querySelector('input');
    if (input) {
      input.value = value;
      this.dispatchEvent(new CustomEvent('value-changed', {
        bubbles: true,
        detail: { value: value, field: this.getAttribute('id') }
      }));
    }
  }

  getValidity() {
    const input = this.querySelector('input');
    return input ? input.validity : null;
  }

  setCustomValidity(message) {
    const input = this.querySelector('input');
    if (input) {
      input.setCustomValidity(message);
    }
  }

  checkValidity() {
    const input = this.querySelector('input');
    return input ? input.checkValidity() : false;
  }

  focus() {
    const input = this.querySelector('input');
    if (input) {
      input.focus();
    }
  }

  blur() {
    const input = this.querySelector('input');
    if (input) {
      input.blur();
    }
  }

  static get observedAttributes() {
    return ['type', 'placeholder', 'value', 'required', 'disabled', 'readonly', 'min', 'max', 'step', 'pattern', 'maxlength', 'size', 'class'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      // Don't call attachEventListeners() here to avoid infinite loop
    }
  }
}

customElements.define('app-input', AppInput);

