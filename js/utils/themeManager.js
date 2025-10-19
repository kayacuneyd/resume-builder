// ThemeManager - Utility for managing resume theme customization
class ThemeManager {
  constructor() {
    this.defaultTheme = {
      colors: {
        primary: '#0d6efd',
        heading: '#333333',
        text: '#333333',
        border: '#333333',
        background: '#ffffff'
      },
      typography: {
        fontFamily: 'Times New Roman, serif',
        fontSize: '14px',
        headingSize: '18px',
        lineHeight: '1.4'
      },
      spacing: {
        base: '1rem',
        section: '1.5rem',
        compact: '0.75rem',
        spacious: '2rem'
      }
    };
    
    this.currentTheme = { ...this.defaultTheme };
    this.init();
  }

  init() {
    // Load saved theme from localStorage
    this.loadTheme();
    // Apply the loaded theme
    this.applyTheme(this.currentTheme);
  }

  applyTheme(themeConfig) {
    this.currentTheme = { ...themeConfig };
    
    // Update CSS custom properties
    const root = document.documentElement;
    
    // Apply color variables
    root.style.setProperty('--resume-primary-color', themeConfig.colors.primary);
    root.style.setProperty('--resume-heading-color', themeConfig.colors.heading);
    root.style.setProperty('--resume-text-color', themeConfig.colors.text);
    root.style.setProperty('--resume-border-color', themeConfig.colors.border);
    root.style.setProperty('--resume-background-color', themeConfig.colors.background);
    
    // Apply typography variables
    root.style.setProperty('--resume-font-family', themeConfig.typography.fontFamily);
    root.style.setProperty('--resume-font-size', themeConfig.typography.fontSize);
    root.style.setProperty('--resume-heading-size', themeConfig.typography.headingSize);
    root.style.setProperty('--resume-line-height', themeConfig.typography.lineHeight);
    
    // Apply spacing variables
    root.style.setProperty('--resume-spacing-base', themeConfig.spacing.base);
    root.style.setProperty('--resume-spacing-section', themeConfig.spacing.section);
    root.style.setProperty('--resume-spacing-compact', themeConfig.spacing.compact);
    root.style.setProperty('--resume-spacing-spacious', themeConfig.spacing.spacious);
    
    // Emit theme-changed event
    document.dispatchEvent(new CustomEvent('theme-changed', {
      detail: { theme: this.currentTheme }
    }));
    
    console.log('🎨 Theme applied:', this.currentTheme);
  }

  saveTheme(themeConfig = this.currentTheme) {
    try {
      const userId = this.getCurrentUserId();
      const storageKey = `resume_theme_${userId}`;
      localStorage.setItem(storageKey, JSON.stringify(themeConfig));
      console.log('💾 Theme saved to localStorage');
      return true;
    } catch (error) {
      console.error('❌ Error saving theme:', error);
      return false;
    }
  }

  loadTheme() {
    try {
      const userId = this.getCurrentUserId();
      const storageKey = `resume_theme_${userId}`;
      const savedTheme = localStorage.getItem(storageKey);
      
      if (savedTheme) {
        this.currentTheme = { ...this.defaultTheme, ...JSON.parse(savedTheme) };
        console.log('📂 Theme loaded from localStorage:', this.currentTheme);
      } else {
        this.currentTheme = { ...this.defaultTheme };
        console.log('📂 Using default theme');
      }
      
      return this.currentTheme;
    } catch (error) {
      console.error('❌ Error loading theme:', error);
      this.currentTheme = { ...this.defaultTheme };
      return this.currentTheme;
    }
  }

  resetToDefault() {
    this.currentTheme = { ...this.defaultTheme };
    this.applyTheme(this.currentTheme);
    this.saveTheme();
    console.log('🔄 Theme reset to default');
  }

  getCurrentTheme() {
    return { ...this.currentTheme };
  }

  getCurrentUserId() {
    // Get user ID from Clerk or use anonymous
    if (window.Clerk && window.Clerk.user) {
      return window.Clerk.user.id;
    }
    return 'anonymous';
  }

  // Theme presets for quick selection
  getPresets() {
    return {
      professional: {
        colors: {
          primary: '#0d6efd',
          heading: '#333333',
          text: '#333333',
          border: '#333333',
          background: '#ffffff'
        },
        typography: {
          fontFamily: 'Times New Roman, serif',
          fontSize: '14px',
          headingSize: '18px',
          lineHeight: '1.4'
        },
        spacing: {
          base: '1rem',
          section: '1.5rem',
          compact: '0.75rem',
          spacious: '2rem'
        }
      },
      modern: {
        colors: {
          primary: '#6c757d',
          heading: '#212529',
          text: '#495057',
          border: '#dee2e6',
          background: '#ffffff'
        },
        typography: {
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          headingSize: '16px',
          lineHeight: '1.6'
        },
        spacing: {
          base: '1.2rem',
          section: '1.8rem',
          compact: '0.8rem',
          spacious: '2.2rem'
        }
      },
      minimal: {
        colors: {
          primary: '#000000',
          heading: '#000000',
          text: '#666666',
          border: '#cccccc',
          background: '#ffffff'
        },
        typography: {
          fontFamily: 'Helvetica, sans-serif',
          fontSize: '13px',
          headingSize: '15px',
          lineHeight: '1.5'
        },
        spacing: {
          base: '1.5rem',
          section: '2rem',
          compact: '1rem',
          spacious: '2.5rem'
        }
      }
    };
  }

  applyPreset(presetName) {
    const presets = this.getPresets();
    if (presets[presetName]) {
      this.applyTheme(presets[presetName]);
      this.saveTheme();
      console.log(`🎨 Applied preset: ${presetName}`);
    }
  }
}

// Create singleton instance
const themeManager = new ThemeManager();

export { themeManager };
