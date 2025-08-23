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
  size = "md"
}) {
  const buttonClasses = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white"
  };

  return (
    <Modal show={show} onHide={onHide} centered size={size} className="shadow-2xl"> {/* Tailwind */}
      <Modal.Header closeButton className="border-b border-gray-200 px-6 py-4"> {/* Tailwind */}
        <Modal.Title className="text-lg font-semibold text-gray-800"> {/* Tailwind */}
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-6 py-4"> {/* Tailwind */}
        <p className="text-gray-700 leading-relaxed"> {/* Tailwind */}
          {message}
        </p>
      </Modal.Body>
      <Modal.Footer className="border-t border-gray-200 px-6 py-4"> {/* Tailwind */}
        <Button 
          variant="outline-secondary" 
          onClick={onHide}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors" // Tailwind
        >
          {cancelText}
        </Button>
        <Button 
          variant={variant} 
          onClick={onConfirm}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${buttonClasses[variant]}`} // Tailwind
        >
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;