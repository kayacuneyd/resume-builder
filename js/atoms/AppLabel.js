// AppLabel - Atomic component for labels
class AppLabel extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const forAttr = this.getAttribute('for') || '';
    const text = this.getAttribute('text') || 'Label';
    const required = this.hasAttribute('required');
    const helpText = this.getAttribute('help') || '';
    const className = this.getAttribute('class') || 'form-label';

    // ✅ Smart targeting: Find the actual input/textarea inside custom elements
    let effectiveFor = forAttr;
    if (forAttr) {
      const target = document.getElementById(forAttr);
      if (target) {
        // ✅ If target is app-input, find the internal <input>
        if (target.tagName.toLowerCase() === 'app-input') {
          const internalInput = target.querySelector('input');
          if (internalInput) {
            effectiveFor = internalInput.id;
          }
        }
        // ✅ If target is app-textarea, find the internal <textarea>
        else if (target.tagName.toLowerCase() === 'app-textarea') {
          const internalTextarea = target.querySelector('textarea');
          if (internalTextarea) {
            effectiveFor = internalTextarea.id;
          }
        }
        // ✅ For native elements, use the original forAttr
      }
    }

    const labelAttributes = [
      `class="${className}"`,
      effectiveFor ? `for="${effectiveFor}"` : ''
    ].filter(attr => attr).join(' ');

    this.innerHTML = `
      <label ${labelAttributes}>
        ${text}
        ${required ? '<span class="text-danger ms-1">*</span>' : ''}
        ${helpText ? `<small class="form-text text-muted d-block">${helpText}</small>` : ''}
      </label>
    `;
  }

  setText(text) {
    this.setAttribute('text', text);
  }

  setRequired(required) {
    if (required) {
      this.setAttribute('required', '');
    } else {
      this.removeAttribute('required');
    }
  }

  setHelpText(helpText) {
    this.setAttribute('help', helpText);
  }

  static get observedAttributes() {
    return ['for', 'text', 'required', 'help', 'class'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      // AppLabel doesn't need attachEventListeners
    }
  }
}

customElements.define('app-label', AppLabel);

