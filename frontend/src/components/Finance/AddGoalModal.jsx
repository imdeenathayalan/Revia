import { useState } from 'react';
import { useGoal } from '../../context/GoalContext';

function AddGoalModal({ show, handleClose }) {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    description: ''
  });
  const [error, setError] = useState('');
  const { createGoal } = useGoal();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount) {
      setError('Please fill in goal name and target amount');
      return;
    }

    const targetAmount = parseFloat(formData.targetAmount);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      setError('Please enter a valid target amount');
      return;
    }

    if (formData.targetDate && new Date(formData.targetDate) < new Date()) {
      setError('Target date cannot be in the past');
      return;
    }

    createGoal({
      name: formData.name,
      targetAmount: targetAmount,
      targetDate: formData.targetDate || null,
      description: formData.description || ''
    });

    setFormData({ name: '', targetAmount: '', targetDate: '', description: '' });
    handleClose();
    setError('');
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 rounded-2xl shadow-xl border border-navy-600 w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-navy-600">
          <h2 className="text-xl font-bold text-white flex items-center">
            <div className="w-8 h-8 bg-light-orange rounded-lg flex items-center justify-center mr-3">
              <i className="bi bi-trophy text-navy-900"></i>
            </div>
            Create New Goal
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
                <i className="bi bi-bullseye text-light-orange mr-2"></i>
                Goal Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., New Laptop, Vacation, Emergency Fund"
                className="w-full p-3 bg-navy-600 border border-navy-500 rounded-lg text-white placeholder-beige-300 focus:border-light-orange focus:ring-2 focus:ring-light-orange transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-beige-200 mb-2 flex items-center">
                <i className="bi bi-currency-rupee text-light-orange mr-2"></i>
                Target Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-beige-300">
                  ₹
                </span>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  placeholder="Enter target amount"
                  step="0.01"
                  min="1"
                  className="w-full pl-10 p-3 bg-navy-600 border border-navy-500 rounded-lg text-white placeholder-beige-300 focus:border-light-orange focus:ring-2 focus:ring-light-orange transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-beige-200 mb-2 flex items-center">
                <i className="bi bi-calendar text-light-orange mr-2"></i>
                Target Date (Optional)
              </label>
              <input
                type="date"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                min={getMinDate()}
                className="w-full p-3 bg-navy-600 border border-navy-500 rounded-lg text-white focus:border-light-orange focus:ring-2 focus:ring-light-orange transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-beige-200 mb-2 flex items-center">
                <i className="bi bi-text-paragraph text-light-orange mr-2"></i>
                Description (Optional)
              </label>
              <textarea
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your goal..."
                className="w-full p-3 bg-navy-600 border border-navy-500 rounded-lg text-white placeholder-beige-300 focus:border-light-orange focus:ring-2 focus:ring-light-orange transition-colors"
              />
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
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddGoalModal;