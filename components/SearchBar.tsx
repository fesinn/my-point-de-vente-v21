
import React from 'react';
import Icon from './Icon';

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchTermChange }) => {
  return (
    <div className="mb-4 relative">
      <input
        type="text"
        placeholder="Rechercher un produit..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 transition-colors"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon name="SearchIcon" className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};

export default SearchBar;
