// Test main.js - Simplified version
console.log('Test main.js loaded');

// Test basic import
import { CLERK_CONFIG } from './config.js';
console.log('Config imported:', CLERK_CONFIG);

// Test component import
import './atoms/AppButton.js';
console.log('AppButton imported');

// Test if component is registered
setTimeout(() => {
  if (customElements.get('app-button')) {
    console.log('✅ app-button component is registered');
  } else {
    console.log('❌ app-button component not registered');
  }
}, 1000);

// Test creating the app
const appContainer = document.getElementById('app');
if (appContainer) {
  appContainer.innerHTML = '<div class="container"><h1>Test App</h1><app-button text="Test Button" variant="primary"></app-button></div>';
  console.log('✅ App container updated');
} else {
  console.log('❌ App container not found');
}

