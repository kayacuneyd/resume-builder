# Resume Builder - Vanilla JavaScript Web Components

A modern, component-based resume builder built with pure Vanilla JavaScript, Web Components, and Bootstrap 5. No build tools, no frameworks - just clean, modern JavaScript that runs directly in the browser.

## 🚀 Features

- **Pure Vanilla JavaScript** - No build tools or frameworks required
- **Web Components Architecture** - Following Atomic Design principles
- **Real-time Preview** - See your resume update as you type
- **PDF Export** - Download your resume as a professional PDF
- **Authentication** - Secure user accounts with Clerk
- **Auto-save** - Your progress is automatically saved
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Form Validation** - Built-in validation for all fields
- **Local Storage** - Data persists between sessions

## 🏗️ Architecture

### Tech Stack
- **JavaScript**: Vanilla JS (ES6+ modules) with Web Components
- **HTML/CSS**: Semantic HTML5 + Bootstrap 5 (via CDN)
- **Authentication**: Clerk (via CDN
- **Storage**: Browser localStorage for resume data
- **PDF Generation**: jsPDF and html2canvas (via CDN)
- **Icons**: Bootstrap Icons (via CDN)

### Project Structure (Atomic Design)
```
resume-builder/
├── index.html                          # Main HTML file
├── styles/
│   └── custom.css                      # Custom styles (Bootstrap overrides)
├── js/
│   ├── main.js                         # App initialization
│   ├── config.js                       # Clerk config & constants
│   ├── utils/
│   │   ├── localStorage.js             # LocalStorage helpers
│   │   ├── validation.js               # Form validation
│   │   └── formatters.js               # Phone, date formatters
│   ├── atoms/                          # Basic building blocks
│   │   ├── AppButton.js
│   │   ├── AppInput.js
│   │   ├── AppTextarea.js
│   │   ├── AppLabel.js
│   │   └── SkillTag.js
│   ├── molecules/                      # Combinations of atoms
│   │   ├── FormField.js                # Label + Input + Validation
│   │   ├── DateRangePicker.js          # Start + End date
│   │   ├── ExperienceItem.js           # Single work experience
│   │   └── EducationItem.js            # Single education entry
│   ├── organisms/                      # Complex components
│   │   ├── AppHeader.js                # Nav with Clerk UserButton
│   │   ├── PersonalInfoForm.js         # Personal info section
│   │   ├── WorkExperienceForm.js       # Work experience list
│   │   ├── EducationForm.js            # Education list
│   │   ├── SkillsForm.js               # Skills with tags
│   │   ├── ProjectsForm.js             # Projects (optional)
│   │   ├── CertificationsForm.js       # Certifications (optional)
│   │   └── ResumePreview.js            # Live preview panel
│   ├── templates/
│   │   ├── LandingPage.js              # Sign in/up page
│   │   └── ResumeBuilderTemplate.js    # Main app layout
│   └── pages/
│       └── ResumeBuilderApp.js         # Main app orchestrator
└── README.md
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd resume-builder
```

### 2. Set Up Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Get your publishable key and frontend API URL
4. Update `js/config.js` with your Clerk credentials:

```javascript
export const CLERK_CONFIG = {
  publishableKey: 'pk_test_YOUR_CLERK_PUBLISHABLE_KEY',
  frontendApi: 'YOUR_FRONTEND_API'
};
```

5. Update the Clerk script in `index.html`:

```html
<script
  async
  crossorigin="anonymous"
  data-clerk-publishable-key="YOUR_CLERK_PUBLISHABLE_KEY"
  src="https://YOUR_FRONTEND_API.clerk.accounts.dev/npm/@clerk/clerk-js@latest/dist/clerk.browser.js"
  type="text/javascript"
></script>
```

### 3. Run the Application

Since this is a pure vanilla JavaScript application, you can run it in several ways:

#### Option 1: Local HTTP Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

#### Option 2: Direct File Opening
Simply open `index.html` in your browser (some features may not work due to CORS restrictions).

### 4. Deploy to Production

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

#### Netlify
1. Drag and drop the project folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your Git repository

#### GitHub Pages
1. Push to GitHub
2. Go to repository Settings > Pages
3. Select source branch and folder

## 🧩 Web Components Architecture

### What are Web Components?
Custom HTML elements built with vanilla JavaScript using:
- **Custom Elements**: `customElements.define()`
- **Shadow DOM**: Encapsulated styling (optional for this project)
- **HTML Templates**: `<template>` tags for reusable markup

### Why Web Components?
- ✅ Native browser support (no framework needed)
- ✅ Reusable, encapsulated components
- ✅ Clean separation of concerns
- ✅ Perfect for Atomic Design
- ✅ Works with any library/framework

### Component Hierarchy

#### Atoms (Basic Building Blocks)
- `AppButton` - Customizable button component
- `AppInput` - Form input with validation
- `AppTextarea` - Textarea with auto-resize
- `AppLabel` - Label with help text
- `SkillTag` - Removable skill tags

#### Molecules (Combined Components)
- `FormField` - Label + Input + Validation
- `DateRangePicker` - Start/End date with "Present" option
- `ExperienceItem` - Complete work experience entry
- `EducationItem` - Complete education entry

#### Organisms (Complex Components)
- `AppHeader` - Navigation with Clerk integration
- `PersonalInfoForm` - Personal information section
- `WorkExperienceForm` - Work experience management
- `EducationForm` - Education management
- `SkillsForm` - Skills with tag management
- `ProjectsForm` - Projects management
- `CertificationsForm` - Certifications management
- `ResumePreview` - Live preview with PDF export

#### Templates (Page Layouts)
- `LandingPage` - Unauthenticated landing page
- `ResumeBuilderTemplate` - Main app layout

#### Pages (App Orchestrators)
- `ResumeBuilderApp` - Main application logic

## 🔧 Configuration

### Clerk Configuration
Update `js/config.js` with your Clerk settings:

```javascript
export const CLERK_CONFIG = {
  publishableKey: 'pk_test_YOUR_CLERK_PUBLISHABLE_KEY',
  frontendApi: 'YOUR_FRONTEND_API'
};
```

### Storage Configuration
The app uses localStorage with user-specific keys:

```javascript
export const STORAGE_KEYS = {
  RESUME_DATA: 'resume_data_', // Will append userId
  SETTINGS: 'resume_settings_'
};
```

### Validation Rules
Customize validation in `js/utils/validation.js`:

```javascript
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/.+/,
  // ... more rules
};
```

## 🎨 Customization

### Styling
- **Bootstrap 5**: Main CSS framework (via CDN)
- **Custom CSS**: `styles/custom.css` for overrides
- **Component Styling**: Each component can have custom styles

### Adding New Components
1. Create the component file in the appropriate directory
2. Define the custom element
3. Import it in `main.js`
4. Use it in your templates

### Example Component
```javascript
class MyComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div>Hello World</div>`;
  }
}

customElements.define('my-component', MyComponent);
```

## 📱 Features

### Authentication
- Secure user accounts with Clerk
- Automatic data synchronization
- User profile integration

### Resume Building
- **Personal Information**: Name, contact, professional title
- **Work Experience**: Job history with achievements
- **Education**: Academic background
- **Skills**: Technical and soft skills
- **Projects**: Portfolio projects (optional)
- **Certifications**: Professional credentials (optional)

### Data Management
- **Auto-save**: Every 10 seconds
- **Manual Save**: Save button
- **Export/Import**: JSON data backup
- **Clear All**: Reset resume data

### PDF Export
- **High Quality**: 2x scale for crisp text
- **Multi-page**: Automatic page breaks
- **Professional Layout**: Clean, ATS-friendly design

### Form Validation
- **Real-time**: Validation as you type
- **Required Fields**: Marked with asterisks
- **Format Validation**: Email, phone, URL formats
- **Character Limits**: Summary and description limits

## 🚀 Deployment

### Static Hosting
This app is designed for static hosting platforms:

- **Vercel**: Zero-config deployment
- **Netlify**: Drag-and-drop or Git integration
- **GitHub Pages**: Free hosting for public repos
- **AWS S3**: Static website hosting
- **Firebase Hosting**: Google's hosting platform

### Environment Variables
For production, update the Clerk configuration in `js/config.js`:

```javascript
export const CLERK_CONFIG = {
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY || 'pk_live_...',
  frontendApi: process.env.CLERK_FRONTEND_API || 'clerk.your-app.com'
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify Clerk configuration
3. Ensure all CDN resources are loading
4. Check network connectivity

## 🔮 Future Enhancements

- **Multiple Resume Templates**: Different design options
- **Resume Analytics**: Track views and downloads
- **Collaboration**: Share resumes with others
- **Integration**: LinkedIn, GitHub integration
- **Advanced Export**: Word, LaTeX formats
- **Resume Scoring**: ATS optimization suggestions

---

Built with ❤️ using Vanilla JavaScript and Web Components


