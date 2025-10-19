// SkillTag - Atomic component for skill tags
class SkillTag extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const skill = this.getAttribute('skill') || 'Skill';
    const removable = this.hasAttribute('removable');
    const size = this.getAttribute('size') || 'md';
    const variant = this.getAttribute('variant') || 'secondary';

    const sizeClass = size === 'sm' ? 'badge-sm' : size === 'lg' ? 'badge-lg' : '';
    const removeButton = removable ? `
      <button type="button" class="btn-close btn-close-white ms-2" style="font-size: 0.6rem;" aria-label="Remove skill"></button>
    ` : '';

    this.innerHTML = `
      <span class="badge bg-${variant} d-inline-flex align-items-center me-2 mb-2 ${sizeClass}">
        ${skill}
        ${removeButton}
      </span>
    `;
  }

  attachEventListeners() {
    const removeBtn = this.querySelector('.btn-close');
    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('skill-removed', {
          bubbles: true,
          detail: { skill: this.getAttribute('skill') }
        }));
        this.remove();
      });
    }

    // Click to edit functionality
    this.addEventListener('click', (e) => {
      if (!e.target.classList.contains('btn-close')) {
        this.dispatchEvent(new CustomEvent('skill-clicked', {
          bubbles: true,
          detail: { skill: this.getAttribute('skill') }
        }));
      }
    });
  }

  setSkill(skill) {
    this.setAttribute('skill', skill);
  }

  setRemovable(removable) {
    if (removable) {
      this.setAttribute('removable', '');
    } else {
      this.removeAttribute('removable');
    }
  }

  setSize(size) {
    this.setAttribute('size', size);
  }

  setVariant(variant) {
    this.setAttribute('variant', variant);
  }

  static get observedAttributes() {
    return ['skill', 'removable', 'size', 'variant'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      // Don't call attachEventListeners() here to avoid infinite loop
    }
  }
}

customElements.define('skill-tag', SkillTag);

