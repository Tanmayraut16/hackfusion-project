import React from "react";
import { 
  Receipt, 
  AlertCircle, 
  Loader2, 
  FileText, 
  ExternalLink,
  DollarSign
} from 'lucide-react';

function ErrorMessage({ message }) {
  return (
    <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-sm rounded-xl p-4 mb-6 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-500" />
      <p className="text-red-200">{message}</p>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      <p className="text-purple-200">Loading expenses...</p>
    </div>
  );
}

function ExpenseTable({ expenses, isLoading, error }) {
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="rounded-xl overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        
      </div>
      
      {!expenses || expenses.length === 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-white mb-2">No Expenses Yet</h4>
          <p className="text-gray-400">Start tracking your expenses by adding your first entry</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400 border-b border-gray-700/50">Date</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400 border-b border-gray-700/50">Description</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400 border-b border-gray-700/50">Amount</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-400 border-b border-gray-700/50">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {expenses.map((expense) => (
                <tr 
                  key={expense._id} 
                  className="group transition-colors hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300">
                      {new Date(expense.spent_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white">
                      {expense.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-400">
                        {expense?.amount_spent ? expense.amount_spent.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }) : "0.00"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {expense.proof_url ? (
                        <a
                          href={expense.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-purple-400 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          View
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-500">No receipt</span>
                      )}
                    </div>
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

export default ExpenseTable;