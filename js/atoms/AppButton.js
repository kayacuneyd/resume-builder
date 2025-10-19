// AppButton - Atomic component for buttons
class AppButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'md';
    const text = this.getAttribute('text') || 'Button';
    const icon = this.getAttribute('icon') || '';
    const type = this.getAttribute('type') || 'button';
    const disabled = this.hasAttribute('disabled');
    const loading = this.hasAttribute('loading');

    const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
    const disabledClass = disabled || loading ? 'disabled' : '';
    const loadingText = loading ? 'Loading...' : text;

    this.innerHTML = `
      <button 
        class="btn btn-${variant} ${sizeClass} ${disabledClass} btn-custom" 
        type="${type}"
        ${disabled || loading ? 'disabled' : ''}
      >
        ${loading ? '<span class="spinner-border spinner-border-sm me-2" role="status"></span>' : ''}
        ${icon ? `<i class="bi bi-${icon} me-2"></i>` : ''}
        ${loadingText}
      </button>
    `;
  }

  attachEventListeners() {
    const button = this.querySelector('button');
    if (button) {
      button.addEventListener('click', (e) => {
        if (!this.hasAttribute('disabled') && !this.hasAttribute('loading')) {
          this.dispatchEvent(new CustomEvent('app-click', { 
            bubbles: true, 
            detail: { originalEvent: e } 
          }));
        }
      });
    }
  }

  setLoading(loading) {
    if (loading) {
      this.setAttribute('loading', '');
    } else {
      this.removeAttribute('loading');
    }
    this.render();
    this.attachEventListeners();
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

  static get observedAttributes() {
    return ['variant', 'size', 'text', 'icon', 'type', 'disabled', 'loading'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      // Don't call attachEventListeners() here to avoid infinite loop
    }
  }
}

customElements.define('app-button', AppButton);

