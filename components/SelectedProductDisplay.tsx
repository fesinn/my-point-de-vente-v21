
import React from 'react';
import { Product, Category } from '../types';
import Icon from './Icon'; // Assuming Icon component can render a generic image icon

interface SelectedProductDisplayProps {
  product: Product | null;
  categories: Category[];
  currencySymbol: string;
}

const SelectedProductDisplay: React.FC<SelectedProductDisplayProps> = ({ product, categories, currencySymbol }) => {
  if (!product) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg shadow h-48 flex items-center justify-center text-gray-400">
        Aucun produit sélectionné
      </div>
    );
  }

  const category = categories.find(cat => cat.id === product.category);
  const categoryName = category ? category.name : 'Inconnue';
  const categoryColor = category ? category.color : 'bg-gray-200';

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-bold text-sky-700 mb-2">{product.name}</h3>
      <div className="flex items-center space-x-4">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-md border" />
        ) : (
          <div className="w-24 h-24 bg-gray-100 rounded-md border flex items-center justify-center">
            <Icon name="ImageIconPlaceholder" className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div>
          <p className="text-2xl font-semibold text-gray-800">{product.price.toFixed(2)} {currencySymbol}</p>
          <p className="text-sm text-gray-600">
            Famille: <span className={`px-2 py-0.5 rounded-full text-xs text-white ${categoryColor}`}>{categoryName}</span>
          </p>
          <p className="text-sm text-gray-500">Stock: {product.stock}</p>
        </div>
      </div>
    </div>
  );
};

export default SelectedProductDisplay;
