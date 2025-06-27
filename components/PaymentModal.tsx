
import React, { useState, useEffect, useMemo } from 'react';
import Icon from './Icon';
import { UserRole } from '../types';

interface PaymentMethod {
  id: string;
  label: string;
  requiresRoomNumber?: boolean;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  paymentMethods: PaymentMethod[];
  onSubmitPayment: (methodId: string, roomNumber?: string) => void;
  currencySymbol: string;
  userRole: UserRole;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  paymentMethods,
  onSubmitPayment,
  currencySymbol,
  userRole,
}) => {
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [roomNumber, setRoomNumber] = useState<string>('');
  const [isRoomNumberRequired, setIsRoomNumberRequired] = useState<boolean>(false);

  const availablePaymentMethods = useMemo(() => {
    return paymentMethods.filter(method => {
      if (method.id === 'gratuit') {
        return userRole === UserRole.Admin || userRole === UserRole.Manager;
      }
      return true;
    });
  }, [paymentMethods, userRole]);

  useEffect(() => {
    if (isOpen) {
      if (availablePaymentMethods.length > 0) {
        const defaultMethod = availablePaymentMethods[0];
        if (!selectedMethodId) { 
             setSelectedMethodId(defaultMethod.id);
             setIsRoomNumberRequired(!!defaultMethod.requiresRoomNumber);
             if (!defaultMethod.requiresRoomNumber) {
                setRoomNumber('');
             }
        }
      }
    } else {
      setSelectedMethodId(null);
      setRoomNumber('');
      setIsRoomNumberRequired(false);
    }
  }, [isOpen, availablePaymentMethods]);

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethodId(methodId);
    const selectedMethod = paymentMethods.find(m => m.id === methodId);
    setIsRoomNumberRequired(!!selectedMethod?.requiresRoomNumber);
    if (!selectedMethod?.requiresRoomNumber) {
      setRoomNumber(''); 
    }
  };

  const handleSubmit = () => {
    if (!selectedMethodId) {
      alert('Veuillez sélectionner un mode de règlement.');
      return;
    }
    if (isRoomNumberRequired && !roomNumber.trim()) {
      alert('Veuillez entrer le numéro de chambre.');
      return;
    }
    onSubmitPayment(selectedMethodId, roomNumber.trim());
  };

  if (!isOpen) return null;

  const isSubmitDisabled = !selectedMethodId || (isRoomNumberRequired && !roomNumber.trim());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Règlement</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Icon name="CancelIcon" className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 text-center">
          <p className="text-gray-600 text-lg">Total à payer:</p>
          <p className="text-sky-600 font-bold text-4xl">{totalAmount.toFixed(2).replace('.',',')} {currencySymbol}</p>
        </div>

        <div className="space-y-3 mb-6">
          <p className="font-medium text-gray-700">Choisissez un mode de règlement:</p>
          {availablePaymentMethods.map(method => (
            <div key={method.id}>
              <button
                onClick={() => handleMethodSelect(method.id)}
                className={`w-full text-left p-3 border rounded-lg transition-all duration-150
                            ${selectedMethodId === method.id 
                                ? 'bg-sky-500 text-white ring-2 ring-sky-300' 
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300'}`}
              >
                {method.label}
              </button>
              {selectedMethodId === method.id && method.requiresRoomNumber && (
                <div className="mt-2 pl-4">
                  <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-600 mb-1">
                    Numéro de chambre:
                  </label>
                  <input
                    type="text"
                    id="roomNumber"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Entrez le N° de chambre"
                    required
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors
                        ${isSubmitDisabled 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50'}`}
          >
            Solder la Facture
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;