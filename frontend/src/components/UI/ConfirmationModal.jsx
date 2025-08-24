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
    danger: "bg-red-600 hover:bg-red-700 text-white border border-red-700",
    primary: "bg-blue-600 hover:bg-blue-700 text-white border border-blue-700",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white border border-gray-700",
    success: "bg-green-600 hover:bg-green-700 text-white border border-green-700",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white border border-yellow-700"
  };

  const iconClasses = {
    danger: "🔴",
    primary: "🔵", 
    secondary: "⚫",
    success: "✅",
    warning: "⚠️"
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      size={size} 
      contentClassName="bg-gray-800 text-white border border-red-700" 
      backdrop="static"
    >
      <Modal.Header closeButton className="border-b border-red-700 bg-gray-900">
        <Modal.Title className="text-lg font-semibold text-red-400 flex items-center">
          <span className="mr-2">{iconClasses[variant] || "❓"}</span>
          {title}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-6 py-4 bg-gray-800">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 rounded-full bg-red-900 flex items-center justify-center mr-3">
              <span className="text-red-300 text-sm">!</span>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>
      </Modal.Body>
      
      <Modal.Footer className="border-t border-red-700 px-6 py-4 bg-gray-900">
        <Button 
          variant="outline-secondary" 
          onClick={onHide}
          className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        
        <Button 
          variant={variant} 
          onClick={onConfirm}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${buttonClasses[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="animate-spin inline-block mr-2">⏳</span>
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