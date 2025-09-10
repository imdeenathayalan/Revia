import { Modal, Button } from 'react-bootstrap';
import './ConfirmationModal.css'; // Import our enhanced CSS

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
    danger: "btn-confirm-danger",
    primary: "btn-confirm-primary", 
    secondary: "btn-confirm-secondary",
    success: "btn-confirm-success",
    warning: "btn-confirm-warning"
  };

  const iconClasses = {
    danger: "bi-exclamation-triangle",
    primary: "bi-info-circle", 
    secondary: "bi-question-circle",
    success: "bi-check-circle",
    warning: "bi-exclamation-circle"
  };

  const iconColors = {
    danger: "#ff5252",
    primary: "#3498db",
    secondary: "#95a5a6", 
    success: "#2ecc71",
    warning: "#f39c12"
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      size={size} 
      contentClassName="confirmation-modal-content animate-scale-in" 
      backdropClassName="modal-backdrop-enhanced"
      dialogClassName="w-full mx-auto px-4 xl:px-6 2xl:px-8"
    >
      <Modal.Header closeButton className="modal-header-enhanced">
        <Modal.Title className="modal-title font-poppins font-semibold">
          <div className="title-icon" style={{ color: iconColors[variant] }}>
            <i className={`bi ${iconClasses[variant] || 'bi-question-circle'}`}></i>
          </div>
          <span>{title}</span>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="modal-body-enhanced">
        <div className="message-container">
          <p className="message-text font-poppins font-medium">
            {message}
          </p>
        </div>
      </Modal.Body>
      
      <Modal.Footer className="modal-footer-enhanced">
        <Button 
          variant="outline-secondary" 
          onClick={onHide}
          className="btn-cancel font-poppins font-semibold"
          disabled={isLoading}
        >
          <i className="bi bi-x-circle me-2"></i>
          {cancelText}
        </Button>
        
        <Button 
          className={`btn-confirm ${buttonClasses[variant]} font-poppins font-semibold`}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner me-2"></span>
              Processing...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              {confirmText}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;