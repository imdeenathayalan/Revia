// src/components/Finance/PDFTemplateSelector.jsx
import { Card, Form } from 'react-bootstrap';
import { PDF_TEMPLATES } from '../../utils/pdfTemplates';

function PDFTemplateSelector({ selectedTemplate, onTemplateChange }) {
  return (
    <div className="mb-4">
      <Form.Label className="text-white mb-3">
        <i className="bi bi-layout-wtf me-2"></i>
        Choose Report Template
      </Form.Label>
      
      <div className="row g-3">
        {Object.values(PDF_TEMPLATES).map(template => (
          <div key={template.id} className="col-md-6">
            <Card 
              className={`cursor-pointer h-100 border-2 ${
                selectedTemplate === template.id 
                  ? 'border-maroon bg-maroon-dark' 
                  : 'border-grey-light bg-grey-dark hover-border-maroon'
              } transition-all`}
              onClick={() => onTemplateChange(template.id)}
            >
              <Card.Body className="p-3">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0 me-3">
                    <i className={`bi bi-file-earmark-pdf fs-4 ${
                      selectedTemplate === template.id ? 'text-white' : 'text-maroon'
                    }`}></i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className={`mb-1 ${selectedTemplate === template.id ? 'text-white' : 'text-white'}`}>
                      {template.name}
                    </h6>
                    <p className={`mb-0 small ${selectedTemplate === template.id ? 'text-maroon-light' : 'text-maroon-light'}`}>
                      {template.description}
                    </p>
                    <div className="mt-2">
                      <small className="text-maroon-light">
                        <i className="bi bi-layout-sidebar me-1"></i>
                        {template.layout} • Includes: {template.includes.length} sections
                      </small>
                    </div>
                  </div>
                  {selectedTemplate === template.id && (
                    <i className="bi bi-check-circle-fill text-success"></i>
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PDFTemplateSelector;