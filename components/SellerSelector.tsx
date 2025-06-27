import React from 'react';
import { User } from '../types';

interface SellerSelectorProps {
  sellers: User[];
  selectedSellerId: string | null;
  onSelectSeller: (sellerId: string) => void;
}

const SellerSelector: React.FC<SellerSelectorProps> = ({ sellers, selectedSellerId, onSelectSeller }) => {
  return (
    <div className="p-3 bg-sky-50 rounded-lg shadow-sm mb-3">
      <h4 className="text-sm font-semibold text-sky-700 mb-2">Vendeur/Vendeuse:</h4>
      <div className="flex space-x-2 overflow-x-auto">
        {sellers.map((seller) => (
          <button
            key={seller.id}
            onClick={() => onSelectSeller(seller.id)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm whitespace-nowrap ${
              selectedSellerId === seller.id
                ? 'bg-sky-500 text-white ring-2 ring-sky-600 ring-offset-1'
                : 'bg-white text-sky-700 hover:bg-sky-100 border border-sky-300'
            }`}
          >
            {seller.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SellerSelector;
