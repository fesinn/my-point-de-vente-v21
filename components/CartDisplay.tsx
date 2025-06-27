
import React from 'react';
import { CartItem } from '../types';
import CartItemRow from './CartItemRow';

interface CartDisplayProps {
  cartItems: CartItem[];
  discountPercentage: number;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  currencySymbol: string;
}

const CartDisplay: React.FC<CartDisplayProps> = ({ cartItems, discountPercentage, onUpdateQuantity, onRemoveItem, currencySymbol }) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const subTotalTTC = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  const discountAmount = subTotalTTC * (discountPercentage / 100);
  const totalTTCBeforeDiscount = subTotalTTC;
  const totalTTCAfterDiscount = subTotalTTC - discountAmount;

  const totalHT = cartItems.reduce((sum, item) => {
    const priceHT = item.product.price / (1 + item.product.vatRate);
    return sum + priceHT * item.quantity;
  }, 0);
  
  const discountAmountHT = totalHT * (discountPercentage / 100);
  const totalHTAfterDiscount = totalHT - discountAmountHT;
  
  const totalVAT = totalTTCAfterDiscount - totalHTAfterDiscount;


  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-inner flex-grow flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Ticket en cours</h3>
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center flex-grow flex items-center justify-center">Votre panier est vide.</p>
      ) : (
        <div className="overflow-y-auto max-h-60 pr-1 mb-3">
          {cartItems.map((item) => (
            <CartItemRow
              key={item.product.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
              currencySymbol={currencySymbol}
            />
          ))}
        </div>
      )}
      <div className="mt-auto border-t border-gray-300 pt-3 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Nombre d'articles:</span>
          <span className="font-medium">{totalItems}</span>
        </div>
        <div className="flex justify-between">
          <span>Sous-total TTC:</span>
          <span className="font-medium">{totalTTCBeforeDiscount.toFixed(2)} {currencySymbol}</span>
        </div>
        {discountPercentage > 0 && (
           <>
            <div className="flex justify-between text-purple-600">
                <span>Réduction ({discountPercentage}%):</span>
                <span className="font-medium">- {discountAmount.toFixed(2)} {currencySymbol}</span>
            </div>
            <div className="flex justify-between font-bold text-purple-700">
                <span>Nouveau Total TTC:</span>
                <span>{totalTTCAfterDiscount.toFixed(2)} {currencySymbol}</span>
            </div>
           </>
        )}
        <div className="flex justify-between">
          <span>Total HT:</span>
          <span className="font-medium">{totalHTAfterDiscount.toFixed(2)} {currencySymbol}</span>
        </div>
        <div className="flex justify-between">
          <span>Total TVA:</span>
          <span className="font-medium">{totalVAT.toFixed(2)} {currencySymbol}</span>
        </div>
        <div className="flex justify-between text-2xl font-bold text-sky-600 pt-2 mt-2 border-t border-gray-300">
          <span>TOTAL TTC:</span>
          <span>{totalTTCAfterDiscount.toFixed(2)} {currencySymbol}</span>
        </div>
      </div>
    </div>
  );
};

export default CartDisplay;
