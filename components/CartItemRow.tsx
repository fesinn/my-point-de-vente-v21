
import React from 'react';
import { CartItem } from '../types';
import Icon from './Icon';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  currencySymbol: string;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, onUpdateQuantity, onRemoveItem, currencySymbol }) => {
  const handleIncrease = () => {
    onUpdateQuantity(item.product.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.product.id, item.quantity - 1);
    } else {
      onRemoveItem(item.product.id); // Or set quantity to 0 and filter out in parent
    }
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
      <div className="flex-grow">
        <p className="font-medium text-gray-700">{item.product.name}</p>
        <p className="text-xs text-gray-500">{item.product.price.toFixed(2)} {currencySymbol} x {item.quantity}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={handleDecrease} className="p-1 text-red-500 hover:text-red-700">
          <Icon name="MinusCircleIcon" className="w-5 h-5" />
        </button>
        <span className="w-8 text-center text-sm">{item.quantity}</span>
        <button onClick={handleIncrease} className="p-1 text-green-500 hover:text-green-700">
          <Icon name="PlusCircleIcon" className="w-5 h-5" />
        </button>
      </div>
      <p className="w-20 text-right font-semibold text-gray-800">
        {(item.product.price * item.quantity).toFixed(2)} {currencySymbol}
      </p>
      <button onClick={() => onRemoveItem(item.product.id)} className="ml-2 p-1 text-gray-400 hover:text-red-600">
        <Icon name="TrashIcon" className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CartItemRow;
