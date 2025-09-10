import { useState } from 'react';
import { indianCategories } from '../../utils/storage.js';

function AddTransactionModal({ show, handleClose, addTransaction }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount) {
      setError('Please fill in all fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) {
      setError('Please enter a valid amount');
      return;
    }

    const transaction = {
      id: Date.now(),
      description: formData.description,
      amount: formData.type === 'income' ? amount : -amount,
      category: formData.category || 'Other Expense',
      date: new Date()
    };

    addTransaction(transaction);
    handleClose();
    setFormData({ description: '', amount: '', type: 'expense', category: '' });
    setError('');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 rounded-2xl shadow-xl border border-navy-600 w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-navy-600">
          <h2 className="text-xl font-bold text-white flex items-center">
            <div className="w-8 h-8 bg-light-orange rounded-lg flex items-center justify-center mr-3">
              <i className="bi bi-plus-circle text-navy-900"></i>
            </div>
            Add New Transaction
          </h2>
          <button
            onClick={handleClose}
            className="text-beige-200 hover:text-white transition-colors"
          >
            <i className="bi bi-x-lg text-xl"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-800 border border-red-700 rounded-lg text-red-200 flex items-center">
              <i className="bi bi-exclamation-triangle-fill mr-2"></i>
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-beige-200 mb-2 flex items-center">
                <i className="bi bi-text-paragraph text-light-orange mr-2"></i>
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description (e.g., Groceries, Salary, etc.)"
                className="w-full p-3 bg-navy-600 border border-navy-500 rounded-lg text-white placeholder-beige-300 focus:border-light-orange focus:ring-2 focus:ring-light-orange transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-beige-200 mb-2 flex items-center">
                <i className="bi bi-currency-rupee text-light-orange mr-2"></i>
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-beige-300">
                  ₹
                </span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount in rupees"
                  step="0.01"
                  className="w-full pl-10 p-3 bg-navy-600 border border-navy-500 rounded-lg text-white placeholder-beige-300 focus:border-light-orange focus:ring-2 focus:ring-light-orange transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-beige-200 mb-2 flex items-center">
                <i className="bi bi-arrow-left-right text-light-orange mr-2"></i>
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 bg-navy-600 border border-navy-500 rounded-lg text-white focus:border-light-orange focus:ring-2 focus:ring-light-orange transition-colors"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-beige-200 mb-2 flex items-center">
                <i className="bi bi-tag text-light-orange mr-2"></i>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 bg-navy-600 border border-navy-500 rounded-lg text-white focus:border-light-orange focus:ring-2 focus:ring-light-orange transition-colors"
              >
                <option value="">Select category</option>
                {indianCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-navy-600">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-navy-500 text-beige-200 rounded-lg hover:bg-navy-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-light-orange text-navy-900 rounded-lg hover:bg-light-orange-dark transition-all duration-200 flex items-center"
            >
              <i className="bi bi-check-circle mr-2"></i>
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionModal;