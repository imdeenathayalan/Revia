import React from 'react';
import { Button } from 'react-bootstrap';
import { formatIndianCurrency } from '../../utils/storage';
import './TransactionTable.css';

function TransactionTable({ transactions, deleteTransaction }) {
  return (
    <div className="w-full px-3 sm:px-4 xl:px-6 2xl:px-8 mx-auto">
      {/* Title Section */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-white font-semibold text-xl md:text-2xl font-poppins">
          Transaction List
        </h2>
        <span className="text-gray-300 font-medium font-poppins text-sm md:text-base">
          {transactions?.length || 0} transactions
        </span>
      </div>

      {(!transactions || transactions.length === 0) ? (
        <div className="empty-state-content text-center bg-gradient-to-br from-[#243447] to-[#141d26] border border-[#3a506b] rounded-xl shadow-lg p-6">
          <i className="bi bi-emoji-frown empty-state-icon text-[#3a506b] text-5xl"></i>
          <h3 className="text-white font-semibold mt-3 font-poppins">No Transactions</h3>
          <p className="text-gray-300 font-medium mt-2 font-poppins">
            <i className="bi bi-info-circle me-1"></i>
            You haven't added any transactions yet.
          </p>
          <Button
            className="create-transaction-btn bg-gradient-to-r from-[#ff5252] to-[#ff7b46] border-0 font-semibold mt-4 font-poppins"
            onClick={() => alert('Open Add Transaction Modal')}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Transaction
          </Button>
        </div>
      ) : (
        <div className="overflow-auto bg-gradient-to-br from-[#243447] to-[#141d26] border border-[#3a506b] rounded-xl shadow-lg">
          {/* Mobile Card View */}
          <div className="block md:hidden">
            {transactions.map((txn) => (
              <div key={txn.id} className="p-4 border-b border-[#3a506b]">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold font-poppins text-base truncate">{txn.description}</h3>
                    <p className="text-gray-300 font-poppins text-sm mt-1">
                      {new Date(txn.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    className="btn-transaction-delete border border-red-500 text-red-400 hover:bg-red-900/30 font-semibold rounded-full p-2 font-poppins ml-2 flex-shrink-0"
                    onClick={() => deleteTransaction(txn.id)}
                  >
                    <i className="bi bi-trash text-xs"></i>
                  </Button>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="category-badge bg-gradient-to-r from-[#ff5252] to-[#ff7b46] text-white font-semibold px-3 py-1 rounded-full text-xs font-poppins">
                    {txn.category}
                  </span>
                  
                  <span
                    className={`amount-badge px-3 py-1 rounded-full font-semibold text-xs inline-flex items-center font-poppins ${
                      txn.amount > 0 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-red-900/30 text-red-400'
                    }`}
                  >
                    <i
                      className={`bi ${
                        txn.amount > 0 ? 'bi-arrow-up-circle' : 'bi-arrow-down-circle'
                      } me-1`}
                    ></i>
                    {formatIndianCurrency(txn.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop Table View */}
          <table className="w-full hidden md:table">
            <thead>
              <tr className="bg-[#2c3e50]">
                <th className="text-white font-semibold p-3 md:p-4 border-b border-[#3a506b] font-poppins">Date</th>
                <th className="text-white font-semibold p-3 md:p-4 border-b border-[#3a506b] font-poppins">Description</th>
                <th className="text-white font-semibold p-3 md:p-4 border-b border-[#3a506b] font-poppins">Category</th>
                <th className="text-white font-semibold p-3 md:p-4 border-b border-[#3a506b] font-poppins">Amount</th>
                <th className="text-white font-semibold p-3 md:p-4 border-b border-[#3a506b] text-center font-poppins">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-[#2c3e50] transition-colors">
                  <td className="text-white p-3 md:p-4 border-b border-[#3a506b] font-poppins whitespace-nowrap">
                    {new Date(txn.date).toLocaleDateString()}
                  </td>
                  <td className="text-white p-3 md:p-4 border-b border-[#3a506b] font-poppins max-w-[150px] lg:max-w-xs truncate">
                    {txn.description}
                  </td>
                  <td className="p-3 md:p-4 border-b border-[#3a506b]">
                    <span className="category-badge bg-gradient-to-r from-[#ff5252] to-[#ff7b46] text-white font-semibold px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-poppins whitespace-nowrap">
                      {txn.category}
                    </span>
                  </td>
                  <td className="p-3 md:p-4 border-b border-[#3a506b]">
                    <span
                      className={`amount-badge px-2 py-1 md:px-3 md:py-1 rounded-full font-semibold text-xs md:text-sm inline-flex items-center font-poppins whitespace-nowrap ${
                        txn.amount > 0 
                          ? 'bg-green-900/30 text-green-400' 
                          : 'bg-red-900/30 text-red-400'
                      }`}
                    >
                      <i
                        className={`bi ${
                          txn.amount > 0 ? 'bi-arrow-up-circle' : 'bi-arrow-down-circle'
                        } me-1`}
                      ></i>
                      {formatIndianCurrency(txn.amount)}
                    </span>
                  </td>
                  <td className="p-3 md:p-4 border-b border-[#3a506b] text-center">
                    <Button
                      className="btn-transaction-delete border border-red-500 text-red-400 hover:bg-red-900/30 font-semibold rounded-full p-1 md:p-2 font-poppins"
                      onClick={() => deleteTransaction(txn.id)}
                    >
                      <i className="bi bi-trash text-xs md:text-base"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TransactionTable;