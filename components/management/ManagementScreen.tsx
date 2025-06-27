
import React from 'react';
import { Product, Category, User, EstablishmentDetails, Currency, UserRole } from '../../types';
import Icon from '../Icon';
import EstablishmentSettingsForm from './EstablishmentSettingsForm';

interface ManagementScreenProps {
  products: Product[];
  categories: Category[];
  users: User[]; 
  establishmentDetails: EstablishmentDetails;
  currencies: Currency[];
  onEstablishmentDetailsChange: (details: EstablishmentDetails) => void;
  onOpenAddProductModal: () => void;
  onOpenEditProductModal: (product: Product) => void;
  onOpenAddCategoryModal: () => void; 
  onOpenEditCategoryModal: (category: Category) => void;
  onOpenAddUserModal: () => void;
}

const EditIcon: React.FC<{className?: string}> = ({className = "w-4 h-4"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);


const ManagementScreen: React.FC<ManagementScreenProps> = ({ 
    products, categories, users, establishmentDetails, currencies,
    onEstablishmentDetailsChange, onOpenAddProductModal, onOpenEditProductModal,
    onOpenAddCategoryModal, onOpenEditCategoryModal, onOpenAddUserModal
}) => {
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.Admin: return 'Administrateur';
      case UserRole.Manager: return 'Gérant';
      case UserRole.Cashier: return 'Caissier';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="p-4 flex-1 overflow-y-auto pb-[80px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Données</h1>
      </div>
      
      {/* Establishment Settings Section */}
      <div className="mb-8">
        <div className="p-4 bg-white rounded-lg shadow">
           <h2 className="text-xl font-semibold text-sky-700 mb-4">Paramètres de l'Établissement</h2>
           <EstablishmentSettingsForm 
                details={establishmentDetails}
                onDetailsChange={onEstablishmentDetailsChange}
                currencies={currencies}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Section */}
        <div className="p-4 bg-white rounded-lg shadow flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-sky-700">Catégories ({categories.length})</h2>
            <button onClick={onOpenAddCategoryModal} className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center">
                <Icon name="PlusCircleIcon" className="w-4 h-4 mr-1" /> Ajouter
            </button>
          </div>
          {categories.length > 0 ? (
            <div className="flex-grow overflow-y-auto max-h-72 pr-1">
              <ul className="space-y-2 text-sm">
                  {categories.map(cat => (
                      <li key={cat.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                          <div className="flex items-center">
                            {cat.imageUrl ? <img src={cat.imageUrl} alt="" className="w-6 h-6 mr-2 rounded-full object-cover"/>
                            : <span className="w-6 h-6 mr-2 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">?</span>}
                            <span className={`px-1.5 py-0.5 text-xs rounded-full text-white ${cat.color || 'bg-gray-400'}`}>{cat.name}</span>
                          </div>
                          <button onClick={() => onOpenEditCategoryModal(cat)} className="p-1 text-gray-500 hover:text-sky-600 transition-colors" title="Modifier la catégorie">
                            <EditIcon className="w-5 h-5" />
                          </button>
                      </li>
                  ))}
              </ul>
            </div>
          ) : <p className="text-sm text-gray-500 text-center py-4">Aucune catégorie.</p>}
        </div>

        {/* Products Section */}
        <div className="p-4 bg-white rounded-lg shadow flex flex-col">
          <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-sky-700">Produits ({products.length})</h2>
              <button onClick={onOpenAddProductModal} className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 text-sm flex items-center">
                  <Icon name="PlusCircleIcon" className="w-4 h-4 mr-1" /> Ajouter
              </button>
          </div>
          {products.length > 0 ? (
            <div className="flex-grow overflow-y-auto max-h-72 pr-1">
              <ul className="space-y-2 text-sm">
                  {products.map(prod => (
                    <li key={prod.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                      <div className="flex items-center">
                         {prod.imageUrl ? <img src={prod.imageUrl} alt={prod.name} className="w-8 h-8 mr-2 rounded object-cover"/>
                         : <span className="w-8 h-8 mr-2 rounded bg-gray-200 flex items-center justify-center text-gray-500 text-xs">?</span>}
                         <div>
                            {prod.name} - <span className="font-semibold">{prod.price.toFixed(2)}{establishmentDetails.currency.symbol}</span>
                            <span className="text-xs text-gray-500 ml-2 block">(Stock: {prod.stock}, TVA: {(prod.vatRate * 100).toFixed(0)}%)</span>
                         </div>
                      </div>
                       <button onClick={() => onOpenEditProductModal(prod)} className="p-1 text-gray-500 hover:text-green-600 transition-colors" title="Modifier le produit">
                            <EditIcon className="w-5 h-5" />
                        </button>
                    </li>
                  ))}
              </ul>
            </div>
          ) : <p className="text-sm text-gray-500 text-center py-4">Aucun produit.</p>}
        </div>

         {/* Users Section */}
        <div className="p-4 bg-white rounded-lg shadow flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-sky-700">Utilisateurs ({users.length})</h2>
            <button onClick={onOpenAddUserModal} className="px-3 py-1.5 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm flex items-center">
                <Icon name="PlusCircleIcon" className="w-4 h-4 mr-1" /> Ajouter
            </button>
          </div>
          {users.length > 0 ? (
            <div className="flex-grow overflow-y-auto max-h-72 pr-1">
                <ul className="space-y-2 text-sm">
                    {users.map(user => (
                      <li key={user.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                        <span>{user.name}</span>
                        <span className="font-semibold text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">{getRoleLabel(user.role)}</span>
                      </li>
                    ))}
                </ul>
            </div>
          ) : <p className="text-sm text-gray-500 text-center py-4">Aucun utilisateur.</p>}
        </div>
      </div>

       <p className="mt-8 text-center text-sm text-gray-500">
        Les modifications sont sauvegardées automatiquement.
      </p>
    </div>
  );
};

export default ManagementScreen;