// Clerk configuration
export const CLERK_CONFIG = {
  publishableKey: 'pk_live_Y2xlcmsucmVzdW1lLmtheWFjdW5leXQuY29tJA', // Production publishable key
  frontendApi: 'clerk.resume.kayacuneyt.com' // Production frontend API
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
