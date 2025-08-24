// src/components/User/DataManagement.jsx
import { useState } from 'react';
import { Button, Card, Alert, ProgressBar } from 'react-bootstrap';
import { getTransactions, saveTransactions } from '../../utils/storage';
import { useFinance } from '../../context/FinanceContext';
import { useBudget } from '../../context/BudgetContext';
import { useGoal } from '../../context/GoalContext';

function DataManagement() {
  const [message, setMessage] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { refreshTransactions } = useFinance();
  const { refreshBudgets } = useBudget();
  const { refreshGoals } = useGoal();

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const data = {
        transactions: getTransactions(),
        budgets: JSON.parse(localStorage.getItem('budgets') || '[]'),
        goals: JSON.parse(localStorage.getItem('goals') || '[]'),
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `revia-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      setMessage('Data exported successfully!');
    } catch (error) {
      setMessage('Error exporting data. Please try again.');
    } finally {
      setIsExporting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.transactions) {
          saveTransactions(data.transactions);
        }
        if (data.budgets) {
          localStorage.setItem('budgets', JSON.stringify(data.budgets));
        }
        if (data.goals) {
          localStorage.setItem('goals', JSON.stringify(data.goals));
        }

        // Refresh all contexts
        refreshTransactions();
        refreshBudgets();
        refreshGoals();
        
        setMessage('Data imported successfully!');
      } catch (error) {
        setMessage('Invalid backup file. Please ensure you are importing a valid Revia backup.');
      } finally {
        setIsImporting(false);
        setTimeout(() => setMessage(''), 3000);
        event.target.value = ''; // Reset file input
      }
    };
    
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('transactions');
      localStorage.removeItem('budgets');
      localStorage.removeItem('goals');
      
      refreshTransactions();
      refreshBudgets();
      refreshGoals();
      
      setMessage('All data has been cleared.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">
        <i className="bi bi-database me-2"></i>
        Data Management
      </h2>

      {message && (
        <Alert variant={message.includes('Error') ? 'danger' : 'success'} className="mb-4">
          <i className={`bi ${message.includes('Error') ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
          {message}
        </Alert>
      )}

      <Card className="bg-grey-medium border border-maroon mb-4">
        <Card.Body className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            <i className="bi bi-download me-2"></i>
            Export Data
          </h3>
          <p className="text-gray-400 mb-3">
            Download a backup of all your financial data including transactions, budgets, and goals.
          </p>
          <Button 
            onClick={handleExportData}
            disabled={isExporting}
            className="bg-maroon hover:bg-maroon-dark border-maroon"
          >
            {isExporting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Exporting...
              </>
            ) : (
              <>
                <i className="bi bi-download me-2"></i>
                Export Data
              </>
            )}
          </Button>
        </Card.Body>
      </Card>

      <Card className="bg-grey-medium border border-maroon mb-4">
        <Card.Body className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            <i className="bi bi-upload me-2"></i>
            Import Data
          </h3>
          <p className="text-gray-400 mb-3">
            Restore your data from a previously exported backup file.
          </p>
          <div className="d-flex gap-2">
            <input
              type="file"
              id="import-file"
              accept=".json"
              onChange={handleImportData}
              className="d-none"
              disabled={isImporting}
            />
            <label htmlFor="import-file" className="btn btn-outline-light border-maroon text-white">
              <i className="bi bi-upload me-2"></i>
              Choose File
            </label>
            {isImporting && (
              <div className="flex-grow-1">
                <ProgressBar animated now={100} className="h-2" />
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      <Card className="bg-grey-medium border border-maroon">
        <Card.Body className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3 text-danger">
            <i className="bi bi-trash me-2"></i>
            Danger Zone
          </h3>
          <p className="text-gray-400 mb-3">
            Permanently delete all your data. This action cannot be undone.
          </p>
          <Button 
            variant="outline-danger"
            onClick={handleClearData}
          >
            <i className="bi bi-trash me-2"></i>
            Clear All Data
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default DataManagement;