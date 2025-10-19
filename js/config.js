// Clerk configuration
export const CLERK_CONFIG = {
  publishableKey: 'pk_test_cG9wdWxhci1tb25rZmlzaC04My5jbGVyay5hY2NvdW50cy5kZXYk', // Replace with your actual key
  frontendApi: 'popular-monkfish-83.clerk.accounts.dev' // e.g., 'clerk.your-app.123.lcl.dev'
};

// LocalStorage keys
export const STORAGE_KEYS = {
  RESUME_DATA: 'resume_data_', // Will append userId
  SETTINGS: 'resume_settings_',
  THEME: 'resume_theme_' // Will append userId
};

// Constants
export const CONSTANTS = {
  MAX_WORK_EXPERIENCE: 10,
  MAX_EDUCATION: 5,
  MAX_SKILLS: 50,
  SUMMARY_MIN_CHARS: 150,
  SUMMARY_MAX_CHARS: 300,
  MAX_PROJECTS: 8,
  MAX_CERTIFICATIONS: 10
};

// Default resume data structure
export const DEFAULT_RESUME_DATA = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    professionalTitle: '',
    location: '',
    linkedin: '',
    portfolio: '',
    summary: ''
  },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: []
};

// Validation rules
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/.+/,
  required: (value) => value && value.trim().length > 0,
  minLength: (value, min) => value && value.length >= min,
  maxLength: (value, max) => !value || value.length <= max
};
