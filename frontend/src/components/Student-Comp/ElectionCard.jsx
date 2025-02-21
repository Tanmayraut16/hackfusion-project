import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

const ElectionCard = ({ election, onClick, type }) => {
  const formatDate = (date) => 
    new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(date));

  const getStatusColor = () => {
    switch (type) {
      case 'ongoing':
        return 'bg-green-500 bg-opacity-20 text-green-800';
      case 'upcoming':
        return 'bg-blue-500 bg-opacity-20 text-blue-800';
      case 'done':
        return 'bg-gray-500 bg-opacity-20 text-gray-800';
      default:
        return '';
    }
  };

  return (
    <div 
      onClick={onClick}
      role="button"
      aria-label={`View details for ${election.title}`}
      className="bg-white w-full rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{election.title}</h3>
          <div className="flex items-center mt-2 text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span className="text-sm">{formatDate(election.startDate)} - {formatDate(election.endDate)}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {election.positions.length} Position{election.positions.length !== 1 ? 's' : ''}
        </span>
        <ChevronRight size={20} className="text-gray-400" />
      </div>
    </div>
  );
};

export default ElectionCard;
