
import React from 'react';

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onClear: () => void;
  currentValue: string;
}

const KeypadButton: React.FC<{ value: string; onClick: () => void; className?: string, children?: React.ReactNode }> = ({ value, onClick, className, children }) => {
  return (
    <button
      onClick={onClick}
      className={`text-xl font-semibold p-3 rounded-lg shadow-sm active:shadow-inner transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-sky-400 ${className || 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
    >
      {children || value}
    </button>
  );
};

const NumericKeypad: React.FC<NumericKeypadProps> = ({ onKeyPress, onEnter, onClear, currentValue }) => {
  const keys = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', 'Effacer'],
  ];

  return (
    <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
      <div className="mb-2 p-3 text-right text-2xl font-mono bg-gray-100 rounded-md h-12 overflow-x-auto">
        {currentValue || '0'}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {keys.flat().map((key) => {
          if (key === 'Effacer') {
            return <KeypadButton key={key} value={key} onClick={onClear} className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 col-span-1" />;
          }
          return <KeypadButton key={key} value={key} onClick={() => onKeyPress(key)} />;
        })}
         <KeypadButton value="Quantité" onClick={() => onKeyPress('Qty')} className="bg-sky-200 hover:bg-sky-300 text-sky-800 text-sm col-span-1">Quantité</KeypadButton>
         <KeypadButton value="Valider" onClick={onEnter} className="bg-green-500 hover:bg-green-600 text-white col-span-2">Valider</KeypadButton>
      </div>
    </div>
  );
};

export default NumericKeypad;
