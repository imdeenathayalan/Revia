// src/components/Finance/AddInvestmentModal.jsx
import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useInvestment } from '../../context/InvestmentContext';
import { INVESTMENT_TYPES, INVESTMENT_TYPE_LABELS } from '../../utils/investmentTypes';

function AddInvestmentModal({ show, handleClose }) {
  const [formData, setFormData] = useState({
    name: '',
    type: INVESTMENT_TYPES.STOCK,
    investedAmount: '',
    quantity: '1',
    purchaseDate: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const { addInvestment } = useInvestment();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.investedAmount) {
      setError('Please fill in name and invested amount');
      return;
    }

    const amount = parseFloat(formData.investedAmount);
    const quantity = parseFloat(formData.quantity) || 1;

    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    addInvestment({
      name: formData.name,
      type: formData.type,
      investedAmount: amount,
      quantity: quantity,
      purchaseDate: formData.purchaseDate
    });

    // Reset form and close
    setFormData({
      name: '',
      type: INVESTMENT_TYPES.STOCK,
      investedAmount: '',
      quantity: '1',
      purchaseDate: new Date().toISOString().split('T')[0]
    });
    setError('');
    handleClose();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      contentClassName="w-full"
      dialogClassName="w-full max-w-2xl mx-auto px-4 xl:px-6 2xl:px-8"
    >
      <div className="bg-gradient-to-br from-[#243447] to-[#141d26] border border-[#3a506b] rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-[#3a506b] px-6 py-4">
          <h5 className="text-white font-semibold font-poppins text-lg">
            <i className="bi bi-plus-circle me-2"></i>
            Add Investment
          </h5>
          <button 
            type="button" 
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <Form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-200 font-medium font-poppins mb-2">
                Investment Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Reliance Industries"
                required
                className="w-full bg-[#2c3e50] border border-[#3a506b] rounded-md px-3 py-2 text-white font-poppins focus:ring-2 focus:ring-[#ff5252] focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-200 font-medium font-poppins mb-2">
                Investment Type
              </label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                className="w-full bg-[#2c3e50] border border-[#3a506b] rounded-md px-3 py-2 text-white font-poppins focus:ring-2 focus:ring-[#ff5252] focus:border-transparent"
              >
                {Object.entries(INVESTMENT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-200 font-medium font-poppins mb-2">
                Invested Amount (₹) *
              </label>
              <input
                type="number"
                name="investedAmount"
                value={formData.investedAmount}
                onChange={handleChange}
                placeholder="10000"
                step="0.01"
                min="0.01"
                required
                className="w-full bg-[#2c3e50] border border-[#3a506b] rounded-md px-3 py-2 text-white font-poppins focus:ring-2 focus:ring-[#ff5252] focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-200 font-medium font-poppins mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Number of units"
                step="0.001"
                min="0.001"
                className="w-full bg-[#2c3e50] border border-[#3a506b] rounded-md px-3 py-2 text-white font-poppins focus:ring-2 focus:ring-[#ff5252] focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-200 font-medium font-poppins mb-2">
                Purchase Date
              </label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="w-full bg-[#2c3e50] border border-[#3a506b] rounded-md px-3 py-2 text-white font-poppins focus:ring-2 focus:ring-[#ff5252] focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="border-t border-[#3a506b] px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-[#2c3e50] border border-[#3a506b] text-white font-semibold font-poppins rounded-md hover:bg-[#3a506b] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-[#ff5252] to-[#ff7b46] text-white font-semibold font-poppins rounded-md hover:opacity-90 transition-opacity"
            >
              Add Investment
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

export default AddInvestmentModal;