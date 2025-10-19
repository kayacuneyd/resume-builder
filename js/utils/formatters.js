// Formatter utility functions
export class Formatters {
  static formatPhone(phone) {
    if (!phone) return '';
    
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Format based on length
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    
    return phone; // Return original if can't format
  }

  static formatDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  static formatDateShort(date) {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  }

  static formatDateRange(startDate, endDate) {
    const start = this.formatDateShort(startDate);
    const end = endDate ? this.formatDateShort(endDate) : 'Present';
    return `${start} - ${end}`;
  }

  static formatURL(url) {
    if (!url) return '';
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    
    return url;
  }

  static formatLinkedIn(linkedin) {
    if (!linkedin) return '';
    
    // Extract username from various LinkedIn URL formats
    const patterns = [
      /linkedin\.com\/in\/([^\/\?]+)/,
      /linkedin\.com\/pub\/([^\/\?]+)/,
      /linkedin\.com\/company\/([^\/\?]+)/
    ];
    
    for (const pattern of patterns) {
      const match = linkedin.match(pattern);
      if (match) {
        return `https://linkedin.com/in/${match[1]}`;
      }
    }
    
    return this.formatURL(linkedin);
  }

  static formatPortfolio(portfolio) {
    return this.formatURL(portfolio);
  }

  static formatName(name) {
    if (!name) return '';
    
    // Capitalize first letter of each word
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  static formatTitle(title) {
    if (!title) return '';
    
    // Capitalize first letter of each word, but keep common words lowercase
    const lowercaseWords = ['and', 'or', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    
    return title
      .toLowerCase()
      .split(' ')
      .map((word, index) => {
        if (index === 0 || !lowercaseWords.includes(word)) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      })
      .join(' ');
  }

  static formatLocation(location) {
    if (!location) return '';
    
    // Format as "City, State" or "City, Country"
    return location
      .split(',')
      .map(part => part.trim())
      .map(part => this.formatName(part))
      .join(', ');
  }

  static formatSkills(skills) {
    if (!skills || !Array.isArray(skills)) return [];
    
    return skills
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
      .map(skill => this.formatTitle(skill));
  }

  static formatSummary(summary) {
    if (!summary) return '';
    
    // Ensure proper sentence structure
    let formatted = summary.trim();
    
    // Ensure it ends with a period
    if (formatted && !formatted.endsWith('.') && !formatted.endsWith('!') && !formatted.endsWith('?')) {
      formatted += '.';
    }
    
    return formatted;
  }

  static formatDescription(description) {
    if (!description) return '';
    
    // Format bullet points and paragraphs
    return description
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Convert bullet points
        if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
          return `• ${line.substring(1).trim()}`;
        }
        return line;
      })
      .join('\n');
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static formatCurrency(amount, currency = 'USD') {
    if (typeof amount !== 'number') return '';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  static formatPercentage(value, decimals = 1) {
    if (typeof value !== 'number') return '';
    
    return `${(value * 100).toFixed(decimals)}%`;
  }

  static formatDuration(startDate, endDate) {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);
    
    if (diffYears > 0) {
      const remainingMonths = diffMonths % 12;
      return remainingMonths > 0 ? `${diffYears}y ${remainingMonths}m` : `${diffYears}y`;
    } else if (diffMonths > 0) {
      return `${diffMonths}m`;
    } else {
      return `${diffDays}d`;
    }
  }
}


