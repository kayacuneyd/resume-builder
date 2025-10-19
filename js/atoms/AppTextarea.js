// AppTextarea - Atomic component for textarea fields
class AppTextarea extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const id = this.getAttribute('id') || `textarea-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const placeholder = this.getAttribute('placeholder') || '';
    const value = this.getAttribute('value') || '';
    const required = this.hasAttribute('required');
    const disabled = this.hasAttribute('disabled');
    const readonly = this.hasAttribute('readonly');
    const rows = this.getAttribute('rows') || '3';
    const cols = this.getAttribute('cols') || '';
    const maxlength = this.getAttribute('maxlength') || '';
    const className = this.getAttribute('class') || 'form-control';

    // Store the ID for later use (but don't set it on the custom element)
    this._textareaId = id;
    // ✅ DON'T set this.id = id; - Let the internal <textarea> have the ID

    const textareaAttributes = [
      `id="${id}"`,
      `class="${className}"`,
      `placeholder="${placeholder}"`,
      `rows="${rows}"`,
      required ? 'required' : '',
      disabled ? 'disabled' : '',
      readonly ? 'readonly' : '',
      cols ? `cols="${cols}"` : '',
      maxlength ? `maxlength="${maxlength}"` : ''
    ].filter(attr => attr).join(' ');

    this.innerHTML = `<textarea ${textareaAttributes}>${value}</textarea>`;
  }

  attachEventListeners() {
    const textarea = this.querySelector('textarea');
    if (textarea) {
      // Emit value changes
      textarea.addEventListener('input', (e) => {
        this.dispatchEvent(new CustomEvent('value-changed', {
          bubbles: true,
          detail: { value: e.target.value, field: this.getAttribute('id') }
        }));
      });

      // Emit focus events
      textarea.addEventListener('focus', (e) => {
        this.dispatchEvent(new CustomEvent('field-focus', {
          bubbles: true,
          detail: { field: this.getAttribute('id') }
        }));
      });

      // Emit blur events
      textarea.addEventListener('blur', (e) => {
        this.dispatchEvent(new CustomEvent('field-blur', {
          bubbles: true,
          detail: { value: e.target.value, field: this.getAttribute('id') }
        }));
      });

      // Auto-resize functionality
      textarea.addEventListener('input', () => {
        this.autoResize();
      });

      // Initial resize
      this.autoResize();
    }
  }

  autoResize() {
    const textarea = this.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  getValue() {
    const textarea = this.querySelector('textarea');
    return textarea ? textarea.value : '';
  }

  setValue(value) {
    const textarea = this.querySelector('textarea');
    if (textarea) {
      textarea.value = value;
      this.autoResize();
      this.dispatchEvent(new CustomEvent('value-changed', {
        bubbles: true,
        detail: { value: value, field: this.getAttribute('id') }
      }));
    }
  }

  getValidity() {
    const textarea = this.querySelector('textarea');
    return textarea ? textarea.validity : null;
  }

  setCustomValidity(message) {
    const textarea = this.querySelector('textarea');
    if (textarea) {
      textarea.setCustomValidity(message);
    }
  }

  checkValidity() {
    const textarea = this.querySelector('textarea');
    return textarea ? textarea.checkValidity() : false;
  }

  focus() {
    const textarea = this.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  }

  blur() {
    const textarea = this.querySelector('textarea');
    if (textarea) {
      textarea.blur();
    }
  }

  static get observedAttributes() {
    return ['placeholder', 'value', 'required', 'disabled', 'readonly', 'rows', 'cols', 'maxlength', 'class'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      // Don't call attachEventListeners() here to avoid infinite loop
    }
  }
}

customElements.define('app-textarea', AppTextarea);

