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
    danger: "bg-red-600 hover:bg-red-700 text-white border border-red-700",
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white"
  };

  return (
    <Modal show={show} onHide={onHide} centered size={size} contentClassName="bg-gray-800 text-white"> {/* Dark theme */}
      <Modal.Header closeButton className="border-b border-red-700 bg-gray-900"> {/* Dark header */}
        <Modal.Title className="text-lg font-semibold text-red-400"> {/* Dark red title */}
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-6 py-4 bg-gray-800"> {/* Dark body */}
        <p className="text-gray-300 leading-relaxed"> {/* Light gray text */}
          {message}
        </p>
      </Modal.Body>
      <Modal.Footer className="border-t border-red-700 px-6 py-4 bg-gray-900"> {/* Dark footer */}
        <Button 
          variant="outline-secondary" 
          onClick={onHide}
          className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors" // Dark button
        >
          {cancelText}
        </Button>
        <Button 
          variant={variant} 
          onClick={onConfirm}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${buttonClasses[variant]}`} // Colored button
        >
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;