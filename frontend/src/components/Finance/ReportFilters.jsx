import { useState, useEffect } from 'react';

function ReportFilters({ filters, setFilters }) {
  // Sample categories
  const indianCategories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare'];
  
  const [localFilters, setLocalFilters] = useState({
    ...filters,
    startDate: filters.startDate ? filters.startDate.toISOString().split('T')[0] : '',
    endDate: filters.endDate ? filters.endDate.toISOString().split('T')[0] : '',
    dateRange: 'all'
  });
  const [error, setError] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters({
      ...filters,
      startDate: filters.startDate ? filters.startDate.toISOString().split('T')[0] : '',
      endDate: filters.endDate ? filters.endDate.toISOString().split('T')[0] : '',
      dateRange: filters.startDate || filters.endDate ? 'custom' : 'all'
    });
  }, [filters]);

  // Check screen size for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleApplyFilters = () => {
    // Validate custom date range
    if (localFilters.dateRange === 'custom') {
      if (!localFilters.startDate || !localFilters.endDate) {
        setError('Please select both start and end dates for custom range');
        return;
      }
      if (new Date(localFilters.startDate) > new Date(localFilters.endDate)) {
        setError('Start date cannot be after end date');
        return;
      }
    }

    const appliedFilters = {
      ...localFilters,
      startDate: localFilters.startDate ? new Date(localFilters.startDate) : null,
      endDate: localFilters.endDate ? new Date(localFilters.endDate) : null
    };
    
    // Clear any preset dates if not using custom range
    if (localFilters.dateRange !== 'custom') {
      appliedFilters.startDate = null;
      appliedFilters.endDate = null;
    }
    
    setFilters(appliedFilters);
    setError('');
  };

  const handleReset = () => {
    const resetFilters = {
      startDate: null,
      endDate: null,
      categories: [],
      type: 'all',
      dateRange: 'all'
    };
    setLocalFilters({
      ...resetFilters,
      startDate: '',
      endDate: ''
    });
    setFilters(resetFilters);
    setError('');
  };

  const handleCategoryToggle = (category) => {
    setLocalFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleDateRangeChange = (range) => {
    setLocalFilters(prev => ({ 
      ...prev, 
      dateRange: range,
      // Clear dates when switching from custom range
      ...(range !== 'custom' && { startDate: '', endDate: '' })
    }));
    if (error) setError('');
  };

  const handleDateChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const isCustomRange = localFilters.dateRange === 'custom';
  const selectedCategoriesCount = localFilters.categories.length;

  return (
    <div className="w-full px-4 xl:px-6 2xl:px-8 mx-auto mb-6 font-poppins">
      <div className="w-full bg-gradient-to-br from-[#243447] to-[#141d26] border border-[#3a506b] rounded-xl shadow-lg p-4 sm:p-6">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center mb-2 sm:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#ff7b46]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filter Reports
              {selectedCategoriesCount > 0 && (
                <span className="bg-gradient-to-r from-[#ff5252] to-[#ff7b46] text-white font-semibold ml-2 px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full">
                  {selectedCategoriesCount}
                </span>
              )}
            </h3>
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="border border-[#3a506b] text-gray-300 hover:bg-[#3a506b] font-semibold sm:hidden flex items-center self-start px-3 py-1 rounded-md"
            >
              {showCategories ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
              Categories
            </button>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 rounded-lg p-3 mb-4 sm:mb-6 animate-shake text-sm sm:text-base flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Date Range Selection */}
            <div className="w-full xs:col-span-2 lg:col-span-1">
              <label className="block text-gray-300 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Time Period</label>
              <select
                value={localFilters.dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                className="w-full bg-[#2c3e50] border border-[#3a506b] text-white rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-[#ff7b46] focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Custom Date Range Inputs */}
            <div className="w-full xs:col-span-2 lg:col-span-1">
              <label className="block text-gray-300 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                {isCustomRange ? 'Custom Date Range*' : 'Date Range'}
              </label>
              <div className="flex flex-col xs:flex-row gap-2 items-stretch">
                <input
                  type="date"
                  value={localFilters.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="w-full bg-[#2c3e50] border border-[#3a506b] text-white rounded-lg p-2 text-sm sm:text-base focus:ring-2 focus:ring-[#ff7b46] focus:border-transparent disabled:opacity-50 date-input-field"
                  disabled={!isCustomRange}
                  required={isCustomRange}
                />
                <span className="text-gray-500 text-sm hidden xs:flex items-center px-1">to</span>
                <input
                  type="date"
                  value={localFilters.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  className="w-full bg-[#2c3e50] border border-[#3a506b] text-white rounded-lg p-2 text-sm sm:text-base focus:ring-2 focus:ring-[#ff7b46] focus:border-transparent disabled:opacity-50 date-input-field"
                  disabled={!isCustomRange}
                  required={isCustomRange}
                />
              </div>
              {isCustomRange && (
                <div className="text-[#ff7b46] text-xs mt-1">
                  * Required for custom range
                </div>
              )}
            </div>

            {/* Transaction Type */}
            <div className="w-full xs:col-span-1 lg:col-span-1">
              <label className="block text-gray-300 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Transaction Type</label>
              <select
                value={localFilters.type}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full bg-[#2c3e50] border border-[#3a506b] text-white rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-[#ff7b46] focus:border-transparent"
              >
                <option value="all">All Transactions</option>
                <option value="income">Income Only</option>
                <option value="expense">Expenses Only</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="w-full xs:col-span-1 lg:col-span-1 flex flex-col justify-end">
              <div className="flex gap-2 sm:gap-3 h-full items-end">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-gradient-to-r from-[#ff5252] to-[#ff7b46] border-0 text-white font-semibold py-2 sm:py-3 rounded-lg hover:brightness-110 transition-all duration-200 flex items-center justify-center text-sm sm:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Apply
                </button>
                <button
                  onClick={handleReset}
                  className="border border-[#3a506b] text-gray-300 hover:bg-[#3a506b] font-semibold p-2 sm:p-3 rounded-lg transition-all duration-200 flex items-center justify-center"
                  title="Reset all filters"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 01111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className={`border-t border-[#3a506b] pt-4 sm:pt-6 ${showCategories || !isMobile ? 'block' : 'hidden'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
              <label className="block text-gray-300 font-medium mb-2 sm:mb-0 text-sm sm:text-base">Categories</label>
              <div className="text-gray-500 text-xs sm:text-sm">
                {selectedCategoriesCount > 0 
                  ? `${selectedCategoriesCount} category${selectedCategoriesCount !== 1 ? 's' : ''} selected`
                  : 'Select categories to filter'
                }
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {indianCategories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`rounded-full px-3 py-1 sm:px-4 sm:py-2 font-medium transition-all duration-200 text-xs sm:text-sm flex items-center ${
                    localFilters.categories.includes(category) 
                      ? 'bg-gradient-to-r from-[#ff5252] to-[#ff7b46] border-0 text-white' 
                      : 'border border-[#3a506b] text-gray-300 hover:bg-[#3a506b] hover:text-white'
                  }`}
                >
                  {category}
                  {localFilters.categories.includes(category) && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportFilters;