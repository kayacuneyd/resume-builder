// Validation utility functions
import { VALIDATION_RULES } from '../config.js';

export class Validator {
  static validateField(value, rules) {
    const errors = [];
    
    for (const rule of rules) {
      if (rule.required && !VALIDATION_RULES.required(value)) {
        errors.push(`${rule.field} is required`);
        continue;
      }
      
      if (rule.minLength && !VALIDATION_RULES.minLength(value, rule.minLength)) {
        errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
      }
      
      if (rule.maxLength && !VALIDATION_RULES.maxLength(value, rule.maxLength)) {
        errors.push(`${rule.field} must be no more than ${rule.maxLength} characters`);
      }
      
      if (rule.pattern && value && !rule.pattern.test(value)) {
        errors.push(`${rule.field} format is invalid`);
      }
    }
    
    return errors;
  }

  static validateEmail(email) {
    return VALIDATION_RULES.email.test(email);
  }

  static validatePhone(phone) {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    return VALIDATION_RULES.phone.test(cleanPhone);
  }

  static validateURL(url) {
    if (!url) return true; // URL is optional
    return VALIDATION_RULES.url.test(url);
  }

  static validatePersonalInfo(data) {
    const errors = [];
    
    // Required fields
    if (!data.fullName?.trim()) {
      errors.push('Full name is required');
    }
    
    if (!data.email?.trim()) {
      errors.push('Email is required');
    } else if (!this.validateEmail(data.email)) {
      errors.push('Email format is invalid');
    }
    
    if (!data.professionalTitle?.trim()) {
      errors.push('Professional title is required');
    }
    
    // Optional fields with format validation
    if (data.phone && !this.validatePhone(data.phone)) {
      errors.push('Phone number format is invalid');
    }
    
    if (data.linkedin && !this.validateURL(data.linkedin)) {
      errors.push('LinkedIn URL format is invalid');
    }
    
    if (data.portfolio && !this.validateURL(data.portfolio)) {
      errors.push('Portfolio URL format is invalid');
    }
    
    // Summary validation
    if (data.summary && data.summary.length < 150) {
      errors.push('Professional summary should be at least 150 characters');
    }
    
    return errors;
  }

  static validateWorkExperience(experience) {
    const errors = [];
    
    if (!experience.title?.trim()) {
      errors.push('Job title is required');
    }
    
    if (!experience.company?.trim()) {
      errors.push('Company name is required');
    }
    
    if (!experience.startDate) {
      errors.push('Start date is required');
    }
    
    if (experience.startDate && experience.endDate) {
      const start = new Date(experience.startDate);
      const end = new Date(experience.endDate);
      if (start > end) {
        errors.push('Start date cannot be after end date');
      }
    }
    
    return errors;
  }

  static validateEducation(education) {
    const errors = [];
    
    if (!education.institution?.trim()) {
      errors.push('Institution name is required');
    }
    
    if (!education.degree?.trim()) {
      errors.push('Degree is required');
    }
    
    if (!education.startDate) {
      errors.push('Start date is required');
    }
    
    return errors;
  }

  static validateProject(project) {
    const errors = [];
    
    if (!project.name?.trim()) {
      errors.push('Project name is required');
    }
    
    if (!project.description?.trim()) {
      errors.push('Project description is required');
    }
    
    if (project.url && !this.validateURL(project.url)) {
      errors.push('Project URL format is invalid');
    }
    
    return errors;
  }

  static validateCertification(certification) {
    const errors = [];
    
    if (!certification.name?.trim()) {
      errors.push('Certification name is required');
    }
    
    if (!certification.issuer?.trim()) {
      errors.push('Issuer is required');
    }
    
    if (!certification.date) {
      errors.push('Date is required');
    }
    
    if (certification.url && !this.validateURL(certification.url)) {
      errors.push('Certification URL format is invalid');
    }
    
    return errors;
  }

  static validateResumeData(data) {
    const errors = [];
    
    // Validate personal info
    const personalInfoErrors = this.validatePersonalInfo(data.personalInfo || {});
    errors.push(...personalInfoErrors.map(error => `Personal Info: ${error}`));
    
    // Validate work experience
    if (data.workExperience) {
      data.workExperience.forEach((exp, index) => {
        const expErrors = this.validateWorkExperience(exp);
        errors.push(...expErrors.map(error => `Work Experience ${index + 1}: ${error}`));
      });
    }
    
    // Validate education
    if (data.education) {
      data.education.forEach((edu, index) => {
        const eduErrors = this.validateEducation(edu);
        errors.push(...eduErrors.map(error => `Education ${index + 1}: ${error}`));
      });
    }
    
    // Validate projects
    if (data.projects) {
      data.projects.forEach((project, index) => {
        const projectErrors = this.validateProject(project);
        errors.push(...projectErrors.map(error => `Project ${index + 1}: ${error}`));
      });
    }
    
    // Validate certifications
    if (data.certifications) {
      data.certifications.forEach((cert, index) => {
        const certErrors = this.validateCertification(cert);
        errors.push(...certErrors.map(error => `Certification ${index + 1}: ${error}`));
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}


