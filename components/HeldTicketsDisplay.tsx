
import React from 'react';
import { HeldTicket } from '../types';
import Icon from './Icon';

interface HeldTicketsDisplayProps {
  tickets: HeldTicket[];
  onRetrieveTicket: (ticketId: string) => void;
  onCancel: () => void;
}

const HeldTicketsDisplay: React.FC<HeldTicketsDisplayProps> = ({ tickets, onRetrieveTicket, onCancel }) => {
  return (
    <div className="flex flex-col flex-grow bg-gray-50 p-4 rounded-lg shadow-inner">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-xl font-semibold text-gray-800">Tickets en Attente</h3>
        <button onClick={onCancel} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm">
          Retour
        </button>
      </div>
      <div className="flex-grow overflow-y-auto pr-1">
        {tickets.length > 0 ? (
          <ul className="space-y-2">
            {tickets.map(ticket => (
              <li key={ticket.id} className="p-3 border rounded-lg hover:bg-white bg-gray-100 shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-semibold">Ticket #{ticket.invoiceId ? ticket.invoiceId.substring(4) : 'N/A'}</p>
                  <p className="text-sm text-gray-600">{ticket.items.length} article(s)</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Mis en attente à {new Date(ticket.timestamp).toLocaleTimeString('fr-FR')} par {ticket.sellerName || 'N/A'}
                  </p>
                </div>
                <button 
                  onClick={() => onRetrieveTicket(ticket.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-600 flex items-center"
                >
                  <Icon name="RetrieveIcon" className="w-4 h-4 mr-2" />
                  Récupérer
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Aucun ticket en attente.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeldTicketsDisplay;
