import { Modal, Button } from 'react-bootstrap';

function ConfirmationModal({
  show,
  onHide,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  size = "md",
  isLoading = false
}) {
  const buttonClasses = {
    danger: "bg-maroon hover:bg-maroon-dark text-white border border-maroon",
    primary: "bg-maroon hover:bg-maroon-dark text-white border border-maroon",
    secondary: "bg-grey-medium hover:bg-grey-light text-white border border-grey-medium",
    success: "bg-green-600 hover:bg-green-700 text-white border border-green-600",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white border border-yellow-600"
  };

  const iconClasses = {
    danger: "bi-exclamation-triangle",
    primary: "bi-info-circle", 
    secondary: "bi-question-circle",
    success: "bi-check-circle",
    warning: "bi-exclamation-circle"
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      size={size} 
      contentClassName="bg-grey-dark border border-maroon" 
      backdrop="static"
    >
      <Modal.Header closeButton className="border-b border-maroon bg-grey-medium">
        <Modal.Title className="text-lg font-semibold text-white">
          <i className={`bi ${iconClasses[variant] || 'bi-question-circle'} me-2`}></i>
          {title}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-6 py-4 bg-grey-dark">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 rounded-full bg-maroon flex items-center justify-center mr-3">
              <span className="text-white text-sm">!</span>
            </div>
          </div>
          <p className="text-white leading-relaxed">
            {message}
          </p>
        </div>
      </Modal.Body>
      
      <Modal.Footer className="border-t border-maroon px-6 py-4 bg-grey-medium">
        <Button 
          variant="outline-secondary" 
          onClick={onHide}
          className="px-4 py-2 rounded-lg border border-grey-light text-white hover:bg-grey-light transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          <i className="bi bi-x-circle me-2"></i>
          {cancelText}
        </Button>
        
        <Button 
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${buttonClasses[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Processing...
            </>
          ) : (
            confirmText
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;