// ResumePreview - Organism component for live resume preview
class ResumePreview extends HTMLElement {
  constructor() {
    super();
    this.resumeData = {};
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
    this.initializeTheme();
  }

  render() {
    this.innerHTML = `
      <div class="card sticky-top" style="top: 20px;">
        <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
          <h5 class="mb-0">
            <i class="bi bi-eye me-2"></i>
            Live Preview
          </h5>
          <app-button 
            text="Download PDF" 
            variant="light" 
            size="sm"
            icon="download"
            data-action="download-pdf"
          ></app-button>
        </div>
        <div class="card-body p-0">
          <div class="alert alert-warning m-3" role="alert">
            <strong>Why Plain Design?</strong><br>
            It is generally better to keep your resume plain and simple, as most employers and recruiters prefer clear, easy-to-read documents that highlight your skills and experience without unnecessary design flourishes.
          </div>
          <div id="resume-content" class="p-4 bg-white resume-themed" style="min-height: 800px;">
            <!-- Resume content will be rendered here -->
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const downloadBtn = this.querySelector('[data-action="download-pdf"]');
    if (downloadBtn) {
      downloadBtn.addEventListener('app-click', () => {
        this.exportPDF();
      });
    }

    // Listen for theme changes
    document.addEventListener('theme-changed', (e) => {
      console.log('🎨 ResumePreview - Theme changed:', e.detail.theme);
      this.updatePreview();
    });
  }

  initializeTheme() {
    // Load and apply current theme
    import('../utils/themeManager.js').then(({ themeManager }) => {
      const currentTheme = themeManager.getCurrentTheme();
      console.log('🎨 ResumePreview - Initializing with theme:', currentTheme);
      this.updatePreview();
    });
  }

  updatePreview(data) {
    console.log('👁️ ResumePreview updating with data:', data);
    this.resumeData = data || {};
    const content = this.querySelector('#resume-content');
    
    console.log('🔍 ResumePreview - Content element found:', !!content);
    console.log('🔍 ResumePreview - Education data:', data?.education);
    console.log('🔍 ResumePreview - Education data details:', JSON.stringify(data?.education, null, 2));
    
    if (!content) {
      console.log('❌ Resume content not found');
      return;
    }

    console.log('✅ Resume content found, generating HTML...');
    const html = this.generateResumeHTML();
    console.log('🔍 ResumePreview - Generated HTML length:', html.length);
    content.innerHTML = html;
    console.log('✅ Resume HTML generated and updated');
  }

  generateResumeHTML() {
    const data = this.resumeData;
    const personalInfo = data.personalInfo || {};
    const workExperience = data.workExperience || [];
    const education = data.education || [];
    const skills = data.skills || [];
    const projects = data.projects || [];
    const certifications = data.certifications || [];

    return `
      <div class="resume-preview">
        <!-- Header -->
        <div class="text-center mb-4">
          <h2 class="fw-bold mb-1">${personalInfo.fullName || 'Your Name'}</h2>
          <p class="text-muted mb-2">${personalInfo.professionalTitle || 'Professional Title'}</p>
          <p class="small">
            ${personalInfo.email || 'email@example.com'} | 
            ${personalInfo.phone || '(123) 456-7890'} | 
            ${personalInfo.location || 'City, State'}
          </p>
          ${personalInfo.linkedin || personalInfo.portfolio ? `
            <p class="small">
              ${personalInfo.linkedin ? `<a href="${personalInfo.linkedin}" target="_blank">LinkedIn</a>` : ''}
              ${personalInfo.linkedin && personalInfo.portfolio ? ' | ' : ''}
              ${personalInfo.portfolio ? `<a href="${personalInfo.portfolio}" target="_blank">Portfolio</a>` : ''}
            </p>
          ` : ''}
        </div>

        <!-- Summary -->
        ${personalInfo.summary ? `
          <div class="mb-4">
            <h5 class="border-bottom pb-2 mb-3">PROFESSIONAL SUMMARY</h5>
            <p>${personalInfo.summary}</p>
          </div>
        ` : ''}

        <!-- Skills -->
        ${skills.length ? `
          <div class="mb-4">
            <h5 class="border-bottom pb-2 mb-3">SKILLS</h5>
            <p>${skills.join(' • ')}</p>
          </div>
        ` : ''}

        <!-- Work Experience -->
        ${workExperience.length ? `
          <div class="mb-4">
            <h5 class="border-bottom pb-2 mb-3">WORK EXPERIENCE</h5>
            ${workExperience.map(exp => `
              <div class="mb-3">
                <div class="d-flex justify-content-between">
                  <strong>${exp.title || 'Job Title'}</strong>
                  <span class="text-muted">${this.formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}</span>
                </div>
                <div class="text-muted">${exp.company || 'Company'} | ${exp.location || 'Location'}</div>
                ${exp.description ? `<p class="mt-2">${exp.description}</p>` : ''}
                ${exp.achievements ? `<p class="mt-2"><strong>Key Achievements:</strong> ${exp.achievements}</p>` : ''}
                ${exp.technologies ? `<p class="mt-2"><strong>Technologies:</strong> ${exp.technologies}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Education -->
        ${education.length ? `
          <div class="mb-4">
            <h5 class="border-bottom pb-2 mb-3">EDUCATION</h5>
            ${education.map(edu => `
              <div class="mb-3">
                <div class="d-flex justify-content-between">
                  <strong>${edu.degree || 'Degree'}</strong>
                  <span class="text-muted">${this.formatDateRange(edu.startDate, edu.endDate, edu.isPresent)}</span>
                </div>
                <div class="text-muted">${edu.institution || 'Institution'} | ${edu.location || 'Location'}</div>
                ${edu.field ? `<div class="text-muted">${edu.field}</div>` : ''}
                ${edu.gpa ? `<div class="text-muted">GPA: ${edu.gpa}</div>` : ''}
                ${edu.honors ? `<div class="text-muted">${edu.honors}</div>` : ''}
                ${edu.coursework ? `<p class="mt-2"><strong>Relevant Coursework:</strong> ${edu.coursework}</p>` : ''}
                ${edu.activities ? `<p class="mt-2"><strong>Activities:</strong> ${edu.activities}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Projects -->
        ${projects.length ? `
          <div class="mb-4">
            <h5 class="border-bottom pb-2 mb-3">PROJECTS</h5>
            ${projects.map(project => `
              <div class="mb-3">
                <div class="d-flex justify-content-between">
                  <strong>${project.name || 'Project Name'}</strong>
                  <span class="text-muted">${this.formatDateRange(project.startDate, project.endDate, project.isPresent)}</span>
                </div>
                ${project.description ? `<p class="mt-2">${project.description}</p>` : ''}
                ${project.technologies ? `<p class="mt-2"><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
                ${project.url ? `<p class="mt-2"><strong>URL:</strong> <a href="${project.url}" target="_blank">${project.url}</a></p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Certifications -->
        ${certifications.length ? `
          <div class="mb-4">
            <h5 class="border-bottom pb-2 mb-3">CERTIFICATIONS</h5>
            ${certifications.map(cert => `
              <div class="mb-3">
                <div class="d-flex justify-content-between">
                  <strong>${cert.name || 'Certification Name'}</strong>
                  <span class="text-muted">${this.formatDate(cert.date)}</span>
                </div>
                <div class="text-muted">${cert.issuer || 'Issuing Organization'}</div>
                ${cert.credentialId ? `<div class="text-muted">Credential ID: ${cert.credentialId}</div>` : ''}
                ${cert.url ? `<p class="mt-2"><strong>Verification:</strong> <a href="${cert.url}" target="_blank">${cert.url}</a></p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  formatDateRange(startDate, endDate, isPresent) {
    const start = this.formatDate(startDate);
    const end = isPresent ? 'Present' : this.formatDate(endDate);
    return `${start} - ${end}`;
  }

  async exportPDF() {
    const downloadBtn = this.querySelector('[data-action="download-pdf"]');
    if (downloadBtn) {
      downloadBtn.setLoading(true);
    }

    try {
      const resumeContent = this.querySelector('#resume-content');
      if (!resumeContent) {
        throw new Error('Resume content not found');
      }

      // Use html2canvas to capture the resume content
      const canvas = await html2canvas(resumeContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `resume-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      // Show success message
      this.showNotification('PDF downloaded successfully!', 'success');

    } catch (error) {
      console.error('Error generating PDF:', error);
      this.showNotification('Error generating PDF. Please try again.', 'danger');
    } finally {
      if (downloadBtn) {
        downloadBtn.setLoading(false);
      }
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
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

customElements.define('resume-preview', ResumePreview);

