// AppHeader - Organism component for navigation header
class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.isClerkLoaded = false;
  }

  async connectedCallback() {
    await this.waitForClerk();
    this.render();
    this.attachEventListeners();
  }

  async waitForClerk() {
    // Wait for Clerk to be available
    while (!window.Clerk) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Wait for Clerk to be loaded
    await window.Clerk.load();
    this.isClerkLoaded = true;
  }

  render() {
    if (!this.isClerkLoaded) {
      this.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
          <div class="container-fluid">
            <a class="navbar-brand fw-bold" href="#">
              <i class="bi bi-file-earmark-text me-2"></i>
              Resume Builder
            </a>
            <div class="d-flex align-items-center">
              <div class="spinner-border spinner-border-sm me-3" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </nav>
      `;
      return;
    }

    if (window.Clerk.user) {
      this.renderAuthenticatedHeader();
    } else {
      this.renderUnauthenticatedHeader();
    }
  }

  renderAuthenticatedHeader() {
    this.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div class="container-fluid">
          <a class="navbar-brand fw-bold" href="#">
            <i class="bi bi-file-earmark-text me-2"></i>
            Resume Builder
          </a>
          <div class="d-flex align-items-center">
            <span class="me-3 text-muted small">
              <i class="bi bi-clock-history me-1"></i>
              <span id="save-status">Saved</span>
            </span>
            <div id="user-button"></div>
          </div>
        </div>
      </nav>
    `;

    // Mount Clerk UserButton
    try {
      window.Clerk.mountUserButton(
        document.getElementById('user-button'),
        { 
          afterSignOutUrl: '/',
          appearance: {
            elements: {
              userButtonAvatarBox: 'w-10 h-10'
            }
          }
        }
      );
    } catch (error) {
      console.error('Error mounting Clerk UserButton:', error);
    }
  }

  renderUnauthenticatedHeader() {
    this.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div class="container-fluid">
          <a class="navbar-brand fw-bold" href="#">
            <i class="bi bi-file-earmark-text me-2"></i>
            Resume Builder
          </a>
          <div class="d-flex align-items-center">
            <app-button 
              text="Sign In" 
              variant="outline-primary" 
              size="sm"
              data-action="sign-in"
            ></app-button>
          </div>
        </div>
      </nav>
    `;
  }

  attachEventListeners() {
    // Sign in button
    const signInBtn = this.querySelector('[data-action="sign-in"]');
    if (signInBtn) {
      signInBtn.addEventListener('app-click', () => {
        this.handleSignIn();
      });
    }

    // Listen for Clerk user changes (only add listener once)
    if (window.Clerk && !this.clerkListenerAdded) {
      this.clerkListenerAdded = true;
      window.Clerk.addListener(({ user }) => {
        this.render();
        // Don't call attachEventListeners() here to avoid infinite loop
      });
    }
  }

  async handleSignIn() {
    try {
      await window.Clerk.openSignIn();
    } catch (error) {
      console.error('Error opening sign in:', error);
    }
  }

  updateSaveStatus(status) {
    const statusEl = this.querySelector('#save-status');
    if (statusEl) {
      statusEl.textContent = status;
      
      // Add visual feedback
      statusEl.className = status === 'Saving...' ? 'text-warning' : 
                          status === 'Saved' ? 'text-success' : 
                          status === 'Error' ? 'text-danger' : 'text-muted';
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 80px; right: 20px; z-index: 1050; min-width: 300px;';
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
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

customElements.define('app-header', AppHeader);

