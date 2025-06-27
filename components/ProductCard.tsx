
import React from 'react';
import { Product } from '../types';
import Icon from './Icon'; // Assuming Icon component can render a generic image icon

interface ProductCardProps {
  product: Product;
  onProductSelect: (product: Product) => void;
  categoryColor?: string;
  currencySymbol: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductSelect, categoryColor, currencySymbol }) => {
  return (
    <div
      onClick={() => onProductSelect(product)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
    >
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover" />
      ) : (
        <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
          <Icon name="ImageIconPlaceholder" className="w-16 h-16 text-gray-400" /> 
        </div>
      )}
      <div className="p-3 flex-grow flex flex-col">
        <h4 className="text-md font-semibold text-gray-800 truncate" title={product.name}>{product.name}</h4>
        <p className={`text-xs ${categoryColor ? 'text-white p-1 rounded mt-1 ' + categoryColor : 'text-gray-500 mt-1'}`}>{product.category}</p>
        <div className="mt-auto pt-2">
            <p className="text-lg font-bold text-sky-600">{product.price.toFixed(2)} {currencySymbol}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
