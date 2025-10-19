// LandingPage - Template component for unauthenticated users
class LandingPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.innerHTML = `
      <div class="container-fluid vh-100 d-flex align-items-center">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8 text-center">
              <div class="mb-5">
                <i class="bi bi-file-earmark-text display-1 text-primary mb-4"></i>
                <h1 class="display-4 fw-bold mb-4">Build Your Perfect Resume</h1>
                <p class="lead mb-4">
                  Create professional resumes in minutes with our easy-to-use resume builder. 
                  No design skills required - just focus on your content.
                </p>
              </div>

              <div class="row g-4 mb-5">
                <div class="col-md-4">
                  <div class="text-center">
                    <i class="bi bi-lightning-charge display-6 text-primary mb-3"></i>
                    <h5>Quick & Easy</h5>
                    <p class="text-muted">Build your resume in minutes, not hours</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center">
                    <i class="bi bi-eye display-6 text-primary mb-3"></i>
                    <h5>Live Preview</h5>
                    <p class="text-muted">See your resume update in real-time</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center">
                    <i class="bi bi-download display-6 text-primary mb-3"></i>
                    <h5>PDF Export</h5>
                    <p class="text-muted">Download your resume as a professional PDF</p>
                  </div>
                </div>
              </div>

              <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                <app-button 
                  text="Get Started" 
                  variant="primary" 
                  size="lg"
                  icon="arrow-right"
                  data-action="sign-up"
                ></app-button>
                <app-button 
                  text="Sign In" 
                  variant="outline-primary" 
                  size="lg"
                  data-action="sign-in"
                ></app-button>
              </div>

              <div class="mt-5">
                <p class="text-muted small">
                  <i class="bi bi-shield-check me-2"></i>
                  Secure authentication powered by Clerk
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const signUpBtn = this.querySelector('[data-action="sign-up"]');
    const signInBtn = this.querySelector('[data-action="sign-in"]');

    if (signUpBtn) {
      signUpBtn.addEventListener('app-click', () => {
        this.handleSignUp();
      });
    }

    if (signInBtn) {
      signInBtn.addEventListener('app-click', () => {
        this.handleSignIn();
      });
    }
  }

  async handleSignUp() {
    try {
      await window.Clerk.openSignUp();
    } catch (error) {
      console.error('Error opening sign up:', error);
    }
  }

  async handleSignIn() {
    try {
      await window.Clerk.openSignIn();
    } catch (error) {
      console.error('Error opening sign in:', error);
    }
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

customElements.define('landing-page', LandingPage);

