/* eslint-disable @typescript-eslint/no-explicit-any */
// Structured Data Validation Utility
// Validates JSON-LD structured data for SEO best practices

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface StructuredDataItem {
  '@context'?: string | string[] | object;
  '@type'?: string | string[];
  '@id'?: string;
  [key: string]: any;
}

export class StructuredDataValidator {
  private errors: string[] = [];
  private warnings: string[] = [];

  validate(data: any): ValidationResult {
    this.errors = [];
    this.warnings = [];

    try {
      // Parse if string
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;

      // Check if it's a graph or single item
      if (parsed['@graph']) {
        this.validateGraph(parsed);
      } else if (Array.isArray(parsed)) {
        parsed.forEach((item, index) => this.validateItem(item, `Item ${index}`));
      } else {
        this.validateItem(parsed);
      }
    } catch (error) {
      this.errors.push(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
    };
  }

  private validateGraph(data: any): void {
    if (!data['@context']) {
      this.errors.push('Graph missing @context');
    }

    if (!Array.isArray(data['@graph'])) {
      this.errors.push('@graph must be an array');
      return;
    }

    data['@graph'].forEach((item: any, index: number) => {
      this.validateItem(item, `Graph item ${index}`);
    });
  }

  private validateItem(item: StructuredDataItem, context: string = 'Root'): void {
    // Check required fields
    if (!item['@type']) {
      this.errors.push(`${context}: Missing @type`);
    }

    // Validate based on type
    const type = item['@type'];
    if (typeof type === 'string') {
      this.validateByType(item, type, context);
    } else if (Array.isArray(type)) {
      type.forEach((t) => this.validateByType(item, t, context));
    }

    // Check for common issues
    this.checkCommonIssues(item, context);
  }

  private validateByType(item: StructuredDataItem, type: string, context: string): void {
    switch (type) {
      case 'Organization':
      case 'LocalBusiness':
      case 'ProfessionalService':
        this.validateOrganization(item, context);
        break;
      case 'WebSite':
        this.validateWebSite(item, context);
        break;
      case 'FAQPage':
        this.validateFAQPage(item, context);
        break;
      case 'Service':
        this.validateService(item, context);
        break;
      case 'BreadcrumbList':
        this.validateBreadcrumb(item, context);
        break;
      case 'HowTo':
        this.validateHowTo(item, context);
        break;
      case 'Person':
        this.validatePerson(item, context);
        break;
    }
  }

  private validateOrganization(item: any, context: string): void {
    const required = ['name', 'url'];
    const recommended = ['logo', 'description', 'contactPoint', 'sameAs'];

    required.forEach((field) => {
      if (!item[field]) {
        this.errors.push(`${context}: Organization missing required field: ${field}`);
      }
    });

    recommended.forEach((field) => {
      if (!item[field]) {
        this.warnings.push(`${context}: Organization missing recommended field: ${field}`);
      }
    });

    // Validate logo
    if (item.logo) {
      if (typeof item.logo === 'string') {
        if (!this.isValidUrl(item.logo)) {
          this.errors.push(`${context}: Invalid logo URL`);
        }
      } else if (item.logo['@type'] === 'ImageObject') {
        if (!item.logo.url || !this.isValidUrl(item.logo.url)) {
          this.errors.push(`${context}: Invalid logo ImageObject URL`);
        }
        if (!item.logo.width || !item.logo.height) {
          this.warnings.push(`${context}: Logo ImageObject should include width and height`);
        }
      }
    }

    // Validate contact point
    if (item.contactPoint) {
      const cp = Array.isArray(item.contactPoint) ? item.contactPoint[0] : item.contactPoint;
      if (!cp.telephone && !cp.email) {
        this.errors.push(`${context}: ContactPoint must have telephone or email`);
      }
    }
  }

  private validateWebSite(item: any, context: string): void {
    const required = ['url', 'name'];

    required.forEach((field) => {
      if (!item[field]) {
        this.errors.push(`${context}: WebSite missing required field: ${field}`);
      }
    });

    if (item.url && !this.isValidUrl(item.url)) {
      this.errors.push(`${context}: Invalid WebSite URL`);
    }
  }

  private validateFAQPage(item: any, context: string): void {
    if (!item.mainEntity || !Array.isArray(item.mainEntity)) {
      this.errors.push(`${context}: FAQPage must have mainEntity array`);
      return;
    }

    if (item.mainEntity.length === 0) {
      this.errors.push(`${context}: FAQPage mainEntity cannot be empty`);
    }

    item.mainEntity.forEach((qa: any, index: number) => {
      if (qa['@type'] !== 'Question') {
        this.errors.push(`${context}: FAQ item ${index} must be @type Question`);
      }
      if (!qa.name) {
        this.errors.push(`${context}: FAQ item ${index} missing question text (name)`);
      }
      if (!qa.acceptedAnswer) {
        this.errors.push(`${context}: FAQ item ${index} missing acceptedAnswer`);
      } else {
        if (qa.acceptedAnswer['@type'] !== 'Answer') {
          this.errors.push(`${context}: FAQ item ${index} acceptedAnswer must be @type Answer`);
        }
        if (!qa.acceptedAnswer.text) {
          this.errors.push(`${context}: FAQ item ${index} answer missing text`);
        }
      }
    });
  }

  private validateService(item: any, context: string): void {
    const required = ['name', 'provider'];

    required.forEach((field) => {
      if (!item[field]) {
        this.errors.push(`${context}: Service missing required field: ${field}`);
      }
    });

    if (!item.description) {
      this.warnings.push(`${context}: Service should include description`);
    }
  }

  private validateBreadcrumb(item: any, context: string): void {
    if (!item.itemListElement || !Array.isArray(item.itemListElement)) {
      this.errors.push(`${context}: BreadcrumbList must have itemListElement array`);
      return;
    }

    item.itemListElement.forEach((crumb: any, index: number) => {
      if (!crumb.position || crumb.position !== index + 1) {
        this.errors.push(`${context}: Breadcrumb item ${index} has incorrect position`);
      }
      if (!crumb.name) {
        this.errors.push(`${context}: Breadcrumb item ${index} missing name`);
      }
      if (!crumb.item && index < item.itemListElement.length - 1) {
        this.errors.push(`${context}: Breadcrumb item ${index} missing item URL`);
      }
    });
  }

  private validateHowTo(item: any, context: string): void {
    const required = ['name', 'step'];

    required.forEach((field) => {
      if (!item[field]) {
        this.errors.push(`${context}: HowTo missing required field: ${field}`);
      }
    });

    if (!item.description) {
      this.warnings.push(`${context}: HowTo should include description`);
    }

    if (item.step && Array.isArray(item.step)) {
      item.step.forEach((step: any, index: number) => {
        if (!step.name || !step.text) {
          this.errors.push(`${context}: HowTo step ${index} missing name or text`);
        }
      });
    }
  }

  private validatePerson(item: any, context: string): void {
    if (!item.name) {
      this.errors.push(`${context}: Person missing required field: name`);
    }
  }

  private checkCommonIssues(item: any, context: string): void {
    // Check for trailing slashes in URLs
    const urlFields = ['url', 'image', 'logo', 'sameAs'];
    urlFields.forEach((field) => {
      if (item[field]) {
        const urls = Array.isArray(item[field]) ? item[field] : [item[field]];
        urls.forEach((url: any) => {
          const urlStr = typeof url === 'string' ? url : url.url;
          if (urlStr && urlStr.endsWith('//')) {
            this.warnings.push(`${context}: URL has double slash at end: ${field}`);
          }
        });
      }
    });

    // Check for common typos
    const typos: Record<string, string> = {
      decription: 'description',
      adress: 'address',
      emial: 'email',
      telephoen: 'telephone',
    };

    Object.keys(item).forEach((key) => {
      if (typos[key]) {
        this.errors.push(`${context}: Typo detected - "${key}" should be "${typos[key]}"`);
      }
    });

    // Check for empty strings
    Object.entries(item).forEach(([key, value]) => {
      if (value === '') {
        this.warnings.push(`${context}: Empty string for field: ${key}`);
      }
    });
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

// Helper function to validate structured data in components
export function validateStructuredData(data: any): ValidationResult {
  const validator = new StructuredDataValidator();
  return validator.validate(data);
}

// Test helper for development
export function logStructuredDataValidation(data: any, componentName: string): void {
  if (process.env.NODE_ENV === 'development') {
    const result = validateStructuredData(data);

    if (!result.valid || result.warnings.length > 0) {
      console.group(`📋 Structured Data Validation: ${componentName}`);

      if (result.errors.length > 0) {
        console.error('❌ Errors:', result.errors);
      }

      if (result.warnings.length > 0) {
        console.warn('⚠️ Warnings:', result.warnings);
      }

      console.groupEnd();
    }
  }
}

/* eslint-enable @typescript-eslint/no-explicit-any */
