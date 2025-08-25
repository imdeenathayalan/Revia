// src/utils/pdfTemplates.js
export const PDF_TEMPLATES = {
  STANDARD: {
    id: 'standard',
    name: 'Standard Report',
    description: 'Comprehensive financial overview with charts and tables',
    includes: ['summary', 'transactions', 'budgets', 'goals', 'charts'],
    layout: 'portrait'
  },
  MINIMAL: {
    id: 'minimal',
    name: 'Minimal Summary',
    description: 'Clean, concise financial summary',
    includes: ['summary', 'transactions'],
    layout: 'portrait'
  },
  DETAILED: {
    id: 'detailed',
    name: 'Detailed Analysis',
    description: 'In-depth financial analysis with category breakdowns',
    includes: ['summary', 'transactions', 'category_analysis', 'trends'],
    layout: 'landscape'
  },
  TAX: {
    id: 'tax',
    name: 'Tax Preparation',
    description: 'Year-end report for tax purposes',
    includes: ['yearly_summary', 'category_totals', 'tax_categories'],
    layout: 'portrait'
  }
};

export const getTemplateConfig = (templateId) => {
  return PDF_TEMPLATES[templateId] || PDF_TEMPLATES.STANDARD;
};