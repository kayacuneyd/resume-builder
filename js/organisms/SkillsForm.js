// SkillsForm - Organism component for skills management
class SkillsForm extends HTMLElement {
  constructor() {
    super();
    this.skills = [];
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.innerHTML = `
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <button class="btn btn-link text-white text-decoration-none p-0 w-100 text-start collapsed" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#skillsCollapse" 
                  aria-expanded="false" 
                  aria-controls="skillsCollapse">
            <h5 class="mb-0">
              <i class="bi bi-star me-2"></i>
              Skills
              <i class="bi bi-chevron-down float-end"></i>
            </h5>
          </button>
        </div>
        <div class="collapse" id="skillsCollapse">
          <div class="card-body">
          <div class="mb-3">
            <div class="d-flex gap-2">
              <div class="flex-grow-1">
                <app-input 
                  id="skill-input"
                  placeholder="Type a skill and press Enter..."
                  data-action="skill-input"
                ></app-input>
              </div>
              <app-button 
                text="Add" 
                variant="primary" 
                icon="plus-lg"
                data-action="add-skill"
              ></app-button>
            </div>
            <div class="form-text">
              Add your technical and soft skills. Press Enter or click Add to add each skill.
            </div>
          </div>
          <div id="skills-container" class="d-flex flex-wrap">
            ${this.skills.length === 0 ? `
              <div class="text-center text-muted w-100 py-3">
                <i class="bi bi-star display-6 mb-2"></i>
                <p class="mb-0">No skills added yet.</p>
                <small>Start typing above to add your skills.</small>
              </div>
            ` : ''}
          </div>
          </div>
        </div>
      </div>
    `;

    this.renderSkills();
  }

  renderSkills() {
    const container = this.querySelector('#skills-container');
    if (!container) return;

    if (this.skills.length === 0) {
      container.innerHTML = `
        <div class="text-center text-muted w-100 py-3">
          <i class="bi bi-star display-6 mb-2"></i>
          <p class="mb-0">No skills added yet.</p>
          <small>Start typing above to add your skills.</small>
        </div>
      `;
      return;
    }

    container.innerHTML = this.skills.map(skill => 
      `<skill-tag skill="${skill}" removable></skill-tag>`
    ).join('');
  }

  attachEventListeners() {
    const skillInput = this.querySelector('#skill-input');
    const addBtn = this.querySelector('[data-action="add-skill"]');

    if (skillInput) {
      // Add skill on Enter key
      skillInput.addEventListener('keydown', (e) => {
        if (e.detail.key === 'Enter') {
          e.preventDefault();
          this.addSkill();
        }
      });

      // Add skill on value change (for paste events)
      skillInput.addEventListener('value-changed', (e) => {
        const value = e.detail.value;
        if (value.includes(',')) {
          // Handle comma-separated skills
          const skills = value.split(',').map(s => s.trim()).filter(s => s);
          skills.forEach(skill => {
            if (skill && !this.skills.includes(skill)) {
              this.skills.push(skill);
            }
          });
          skillInput.setValue('');
          this.renderSkills();
          this.emitChange();
        }
      });
    }

    if (addBtn) {
      addBtn.addEventListener('app-click', () => {
        this.addSkill();
      });
    }

    // Listen for skill removal
    this.addEventListener('skill-removed', (e) => {
      const skill = e.detail.skill;
      this.skills = this.skills.filter(s => s !== skill);
      this.renderSkills();
      this.emitChange();
    });

    // Note: field-changed events are handled by FormField components
    // which then emit value-changed events that we listen to above

    // Listen for skill clicks (for editing)
    this.addEventListener('skill-clicked', (e) => {
      const skill = e.detail.skill;
      const skillInput = this.querySelector('#skill-input');
      if (skillInput) {
        skillInput.setValue(skill);
        skillInput.focus();
      }
    });
  }

  addSkill() {
    const skillInput = this.querySelector('#skill-input');
    if (!skillInput) return;

    const skill = skillInput.getValue().trim();
    if (skill && !this.skills.includes(skill)) {
      this.skills.push(skill);
      skillInput.setValue('');
      this.renderSkills();
      this.emitChange();
    }
  }

  getData() {
    return this.skills;
  }

  setData(skills) {
    this.skills = skills || [];
    this.renderSkills();
  }

  addSkills(skills) {
    const newSkills = skills.filter(skill => 
      skill && skill.trim() && !this.skills.includes(skill.trim())
    );
    this.skills.push(...newSkills);
    this.renderSkills();
    this.emitChange();
  }

  removeSkill(skill) {
    this.skills = this.skills.filter(s => s !== skill);
    this.renderSkills();
    this.emitChange();
  }

  clearSkills() {
    this.skills = [];
    this.renderSkills();
    this.emitChange();
  }

  emitChange() {
    console.log('⭐ Skills form emitting change:', this.skills);
    this.dispatchEvent(new CustomEvent('data-changed', {
      bubbles: true,
      detail: { section: 'skills', data: this.skills }
    }));
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

customElements.define('skills-form', SkillsForm);

