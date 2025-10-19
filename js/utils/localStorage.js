// LocalStorage utility functions
import { STORAGE_KEYS, DEFAULT_RESUME_DATA } from '../config.js';

export class LocalStorageManager {
  constructor() {
    this.userId = null;
  }

  setUserId(userId) {
    this.userId = userId;
  }

  getStorageKey(key) {
    return this.userId ? `${key}${this.userId}` : key;
  }

  // Resume data operations
  saveResumeData(data) {
    try {
      const key = this.getStorageKey(STORAGE_KEYS.RESUME_DATA);
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving resume data:', error);
      return false;
    }
  }

  loadResumeData() {
    try {
      const key = this.getStorageKey(STORAGE_KEYS.RESUME_DATA);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : { ...DEFAULT_RESUME_DATA };
    } catch (error) {
      console.error('Error loading resume data:', error);
      return { ...DEFAULT_RESUME_DATA };
    }
  }

  clearResumeData() {
    try {
      const key = this.getStorageKey(STORAGE_KEYS.RESUME_DATA);
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error clearing resume data:', error);
      return false;
    }
  }

  // Settings operations
  saveSettings(settings) {
    try {
      const key = this.getStorageKey(STORAGE_KEYS.SETTINGS);
      localStorage.setItem(key, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  loadSettings() {
    try {
      const key = this.getStorageKey(STORAGE_KEYS.SETTINGS);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading settings:', error);
      return {};
    }
  }

  // Auto-save functionality
  startAutoSave(callback, interval = 5000) {
    this.autoSaveInterval = setInterval(() => {
      if (this.userId && callback) {
        const data = callback();
        if (data) {
          this.saveResumeData(data);
        }
      }
    }, interval);
  }

  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  // Export/Import functionality
  exportData() {
    const data = this.loadResumeData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          this.saveResumeData(data);
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }
}

// Create singleton instance
export const storageManager = new LocalStorageManager();


