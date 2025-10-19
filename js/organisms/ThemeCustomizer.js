// ThemeCustomizer - Organism component for theme customization
class ThemeCustomizer extends HTMLElement {
  constructor() {
    super();
    this.currentTheme = null;
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
    this.loadCurrentTheme();
  }

  render() {
    this.innerHTML = `
      <div class="card mb-4">
        <div class="card-header bg-secondary text-white">
          <button class="btn btn-link text-white text-decoration-none p-0 w-100 text-start collapsed" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#themeCustomizerCollapse" 
                  aria-expanded="false" 
                  aria-controls="themeCustomizerCollapse">
            <h6 class="mb-0">
              <i class="bi bi-palette me-2"></i>
              Theme Customizer
              <i class="bi bi-chevron-down float-end"></i>
            </h6>
          </button>
        </div>
        <div class="collapse" id="themeCustomizerCollapse">
          <div class="card-body">
            
            <!-- Preset Themes -->
            <div class="mb-4">
              <label class="form-label fw-bold">Quick Themes</label>
              <div class="d-flex gap-2 flex-wrap">
                <button class="btn btn-outline-primary btn-sm" data-preset="professional">
                  Professional
                </button>
                <button class="btn btn-outline-primary btn-sm" data-preset="modern">
                  Modern
                </button>
                <button class="btn btn-outline-primary btn-sm" data-preset="minimal">
                  Minimal
                </button>
              </div>
            </div>

            <!-- Colors Section -->
            <div class="mb-4">
              <h6 class="fw-bold mb-3">Colors</h6>
              
              <div class="row g-3">
                <div class="col-6">
                  <label for="primary-color" class="form-label small">Primary Color</label>
                  <input type="color" class="form-control form-control-color" id="primary-color" 
                         value="#0d6efd" data-theme-property="colors.primary">
                </div>
                <div class="col-6">
                  <label for="heading-color" class="form-label small">Heading Color</label>
                  <input type="color" class="form-control form-control-color" id="heading-color" 
                         value="#333333" data-theme-property="colors.heading">
                </div>
                <div class="col-6">
                  <label for="text-color" class="form-label small">Text Color</label>
                  <input type="color" class="form-control form-control-color" id="text-color" 
                         value="#333333" data-theme-property="colors.text">
                </div>
                <div class="col-6">
                  <label for="border-color" class="form-label small">Border Color</label>
                  <input type="color" class="form-control form-control-color" id="border-color" 
                         value="#333333" data-theme-property="colors.border">
                </div>
              </div>
            </div>

            <!-- Typography Section -->
            <div class="mb-4">
              <h6 class="fw-bold mb-3">Typography</h6>
              
              <div class="mb-3">
                <label for="font-family" class="form-label small">Font Family</label>
                <select class="form-select form-select-sm" id="font-family" data-theme-property="typography.fontFamily">
                  <option value="Times New Roman, serif">Times New Roman (Serif)</option>
                  <option value="Georgia, serif">Georgia (Serif)</option>
                  <option value="Arial, sans-serif">Arial (Sans-serif)</option>
                  <option value="Helvetica, sans-serif">Helvetica (Sans-serif)</option>
                  <option value="Roboto, sans-serif">Roboto (Sans-serif)</option>
                  <option value="Courier New, monospace">Courier New (Monospace)</option>
                </select>
              </div>

              <div class="row g-3">
                <div class="col-6">
                  <label for="font-size" class="form-label small">Font Size</label>
                  <input type="range" class="form-range" id="font-size" min="10" max="18" value="14" 
                         data-theme-property="typography.fontSize" data-suffix="px">
                  <div class="form-text small" id="font-size-value">14px</div>
                </div>
                <div class="col-6">
                  <label for="heading-size" class="form-label small">Heading Size</label>
                  <input type="range" class="form-range" id="heading-size" min="14" max="24" value="18" 
                         data-theme-property="typography.headingSize" data-suffix="px">
                  <div class="form-text small" id="heading-size-value">18px</div>
                </div>
              </div>

              <div class="mb-3">
                <label for="line-height" class="form-label small">Line Height</label>
                <input type="range" class="form-range" id="line-height" min="1.2" max="2.0" step="0.1" value="1.4" 
                       data-theme-property="typography.lineHeight">
                <div class="form-text small" id="line-height-value">1.4</div>
              </div>
            </div>

            <!-- Spacing Section -->
            <div class="mb-4">
              <h6 class="fw-bold mb-3">Spacing</h6>
              
              <div class="mb-3">
                <label class="form-label small">Spacing Preset</label>
                <div class="btn-group w-100" role="group">
                  <input type="radio" class="btn-check" name="spacing-preset" id="spacing-compact" value="compact">
                  <label class="btn btn-outline-secondary btn-sm" for="spacing-compact">Compact</label>
                  
                  <input type="radio" class="btn-check" name="spacing-preset" id="spacing-standard" value="standard" checked>
                  <label class="btn btn-outline-secondary btn-sm" for="spacing-standard">Standard</label>
                  
                  <input type="radio" class="btn-check" name="spacing-preset" id="spacing-spacious" value="spacious">
                  <label class="btn btn-outline-secondary btn-sm" for="spacing-spacious">Spacious</label>
                </div>
              </div>

              <div class="mb-3">
                <label for="base-spacing" class="form-label small">Base Spacing</label>
                <input type="range" class="form-range" id="base-spacing" min="0.5" max="2.5" step="0.25" value="1.0" 
                       data-theme-property="spacing.base" data-suffix="rem">
                <div class="form-text small" id="base-spacing-value">1.0rem</div>
              </div>

              <div class="mb-3">
                <label for="section-spacing" class="form-label small">Section Spacing</label>
                <input type="range" class="form-range" id="section-spacing" min="1.0" max="3.0" step="0.25" value="1.5" 
                       data-theme-property="spacing.section" data-suffix="rem">
                <div class="form-text small" id="section-spacing-value">1.5rem</div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary btn-sm flex-fill" data-action="reset-theme">
                <i class="bi bi-arrow-clockwise me-1"></i>
                Reset to Default
              </button>
              <button class="btn btn-primary btn-sm flex-fill" data-action="save-theme">
                <i class="bi bi-check-lg me-1"></i>
                Apply Theme
              </button>
            </div>

          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Color pickers
    const colorInputs = this.querySelectorAll('input[type="color"]');
    colorInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        this.updateThemeProperty(e.target.dataset.themeProperty, e.target.value);
      });
    });

    // Font family selector
    const fontFamilySelect = this.querySelector('#font-family');
    if (fontFamilySelect) {
      fontFamilySelect.addEventListener('change', (e) => {
        this.updateThemeProperty(e.target.dataset.themeProperty, e.target.value);
      });
    }

    // Range sliders
    const rangeInputs = this.querySelectorAll('input[type="range"]');
    rangeInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const suffix = e.target.dataset.suffix || '';
        const value = e.target.value + suffix;
        this.updateThemeProperty(e.target.dataset.themeProperty, value);
        this.updateRangeDisplay(e.target.id, value);
      });
    });

    // Spacing presets
    const spacingPresets = this.querySelectorAll('input[name="spacing-preset"]');
    spacingPresets.forEach(input => {
      input.addEventListener('change', (e) => {
        this.applySpacingPreset(e.target.value);
      });
    });

    // Preset theme buttons
    const presetButtons = this.querySelectorAll('[data-preset]');
    presetButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const preset = e.target.dataset.preset;
        this.applyPreset(preset);
      });
    });

    // Action buttons
    const resetBtn = this.querySelector('[data-action="reset-theme"]');
    const saveBtn = this.querySelector('[data-action="save-theme"]');

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetToDefault();
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveCurrentTheme();
      });
    }
  }

  loadCurrentTheme() {
    // Import themeManager dynamically to avoid circular dependencies
    import('../utils/themeManager.js').then(({ themeManager }) => {
      this.currentTheme = themeManager.getCurrentTheme();
      this.updateFormValues();
    });
  }

  updateFormValues() {
    if (!this.currentTheme) return;

    // Update color inputs
    this.querySelector('#primary-color').value = this.currentTheme.colors.primary;
    this.querySelector('#heading-color').value = this.currentTheme.colors.heading;
    this.querySelector('#text-color').value = this.currentTheme.colors.text;
    this.querySelector('#border-color').value = this.currentTheme.colors.border;

    // Update font family
    this.querySelector('#font-family').value = this.currentTheme.typography.fontFamily;

    // Update range inputs
    this.updateRangeInput('font-size', this.currentTheme.typography.fontSize);
    this.updateRangeInput('heading-size', this.currentTheme.typography.headingSize);
    this.updateRangeInput('line-height', this.currentTheme.typography.lineHeight);
    this.updateRangeInput('base-spacing', this.currentTheme.spacing.base);
    this.updateRangeInput('section-spacing', this.currentTheme.spacing.section);
  }

  updateRangeInput(inputId, value) {
    const input = this.querySelector(`#${inputId}`);
    if (input) {
      const numericValue = parseFloat(value);
      input.value = numericValue;
      this.updateRangeDisplay(inputId, value);
    }
  }

  updateRangeDisplay(inputId, value) {
    const display = this.querySelector(`#${inputId}-value`);
    if (display) {
      display.textContent = value;
    }
  }

  updateThemeProperty(propertyPath, value) {
    if (!this.currentTheme) return;

    // Update nested property
    const keys = propertyPath.split('.');
    let current = this.currentTheme;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;

    // Apply theme immediately for real-time preview
    this.applyCurrentTheme();
  }

  applyCurrentTheme() {
    import('../utils/themeManager.js').then(({ themeManager }) => {
      themeManager.applyTheme(this.currentTheme);
    });
  }

  applySpacingPreset(preset) {
    const spacingValues = {
      compact: { base: '0.75rem', section: '1rem' },
      standard: { base: '1rem', section: '1.5rem' },
      spacious: { base: '1.5rem', section: '2rem' }
    };

    if (spacingValues[preset]) {
      this.currentTheme.spacing = { ...this.currentTheme.spacing, ...spacingValues[preset] };
      this.updateFormValues();
      this.applyCurrentTheme();
    }
  }

  applyPreset(presetName) {
    import('../utils/themeManager.js').then(({ themeManager }) => {
      themeManager.applyPreset(presetName);
      this.currentTheme = themeManager.getCurrentTheme();
      this.updateFormValues();
    });
  }

  resetToDefault() {
    import('../utils/themeManager.js').then(({ themeManager }) => {
      themeManager.resetToDefault();
      this.currentTheme = themeManager.getCurrentTheme();
      this.updateFormValues();
    });
  }

  saveCurrentTheme() {
    import('../utils/themeManager.js').then(({ themeManager }) => {
      themeManager.saveTheme(this.currentTheme);
      
      // Show success feedback
      const saveBtn = this.querySelector('[data-action="save-theme"]');
      const originalText = saveBtn.innerHTML;
      saveBtn.innerHTML = '<i class="bi bi-check-lg me-1"></i>Saved!';
      saveBtn.classList.add('btn-success');
      saveBtn.classList.remove('btn-primary');
      
      setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.classList.remove('btn-success');
        saveBtn.classList.add('btn-primary');
      }, 2000);
    });
  }
}

customElements.define('theme-customizer', ThemeCustomizer);
