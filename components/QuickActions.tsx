
import React from 'react';
import Icon from './Icon';
import { QUICK_ACTION_BUTTONS_CONFIG } from '../constants';

export interface QuickActionsState {
  cartItemCount: number;
  numericInputValue: string;
}

interface QuickActionsProps {
  onAction: (actionId: string) => void;
  state: QuickActionsState;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction, state }) => {
  const { cartItemCount, numericInputValue } = state;

  const largeButtons = QUICK_ACTION_BUTTONS_CONFIG.filter(action => action.isLarge);
  const regularButtons = QUICK_ACTION_BUTTONS_CONFIG.filter(action => !action.isLarge);

  const getButtonClasses = (action: typeof QUICK_ACTION_BUTTONS_CONFIG[0], isDisabled: boolean) => {
    let classes = `flex items-center justify-center p-3 rounded-lg font-medium transition-colors duration-150 ease-in-out shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${action.color} `;
    
    if (action.isLarge) {
      classes += 'text-base font-bold h-14 w-full mb-2 ';
    } else {
      classes += 'flex-col text-xs h-20 ';
    }

    if (action.id === 'pay' || action.id === 'cancel' || action.id === 'print_receipt' || action.isLarge) {
      classes += 'text-white ';
    } else {
      classes += 'text-gray-800 ';
    }
    
    if (isDisabled) {
        classes += 'opacity-50 cursor-not-allowed ';
    }

    return classes;
  };

  const handleActionClick = (actionId: string, isDisabled: boolean) => {
    if (!isDisabled) {
        onAction(actionId);
    }
  };

  return (
    <div className="p-2 bg-gray-100 rounded-lg shadow">
      {largeButtons.map(action => {
        // "Nouvelle Facture" is never disabled by cart state, its internal logic handles confirmation if needed.
        const isDisabled = false; 
        return (
            <button
            key={action.id}
            onClick={() => handleActionClick(action.id, isDisabled)}
            className={getButtonClasses(action, isDisabled)}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            >
            <Icon name={action.icon} className="w-5 h-5 mr-2" />
            {action.label}
            </button>
        );
      })}
      <div className="grid grid-cols-3 gap-2">
        {regularButtons.map((action) => {
            let isDisabled = false;
            if (action.id === 'print_receipt' || action.id === 'pay' || action.id === 'hold' || action.id === 'discount') {
                isDisabled = cartItemCount === 0;
            } else if (action.id === 'cancel') {
                isDisabled = cartItemCount === 0 && numericInputValue.length === 0;
            }
            // 'retrieve' button is never disabled by cart state.

            return (
                <button
                    key={action.id}
                    onClick={() => handleActionClick(action.id, isDisabled)}
                    className={getButtonClasses(action, isDisabled)}
                    disabled={isDisabled}
                    aria-disabled={isDisabled}
                >
                    <Icon name={action.icon} className={`w-6 h-6 ${action.isLarge ? 'mr-2' : 'mb-1'}`} />
                    {action.label}
                </button>
            );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
