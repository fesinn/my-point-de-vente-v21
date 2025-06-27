
import React, { useCallback } from 'react';
import { EstablishmentDetails, Currency } from '../../types';

interface EstablishmentSettingsFormProps {
  details: EstablishmentDetails;
  onDetailsChange: (newDetails: EstablishmentDetails) => void;
  currencies: Currency[];
}

const EstablishmentSettingsForm: React.FC<EstablishmentSettingsFormProps> = ({ details, onDetailsChange, currencies }) => {

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onDetailsChange({ ...details, [name]: value });
  }, [details, onDetailsChange]);

  const handleCurrencyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = currencies.find(c => c.code === e.target.value);
    if (selectedCurrency) {
        onDetailsChange({ ...details, currency: selectedCurrency });
    }
  }, [details, onDetailsChange, currencies]);

  const handleLogoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onDetailsChange({ ...details, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }, [details, onDetailsChange]);

  const renderInput = (id: keyof EstablishmentDetails, label: string) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <input type="text" id={id} name={id} value={details[id] as string} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500" />
    </div>
  );

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">Logo</label>
                <div className="mt-1 flex items-center space-x-4">
                    {details.logoUrl && <img src={details.logoUrl} alt="Logo" className="h-16 w-16 object-contain rounded-md border p-1" />}
                    <input type="file" id="logoUrl" accept="image/*" onChange={handleLogoChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"/>
                </div>
            </div>
            {renderInput("name", "Nom de l'Établissement")}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput("address1", "Adresse Ligne 1")}
            {renderInput("address2", "Adresse Ligne 2")}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderInput("tel", "Téléphone")}
            {renderInput("tvaNumber", "N° TVA")}
            {renderInput("iceNumber", "N° ICE")}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderInput("pointOfSaleName", "Nom du Point de Vente")}
            <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Devise</label>
                <select id="currency" value={details.currency.code} onChange={handleCurrencyChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500">
                    {currencies.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
                </select>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput("welcomeMessage", "Message de Bienvenue (Ticket)")}
            {renderInput("thankYouMessage", "Message de Remerciement (Ticket)")}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput("footerNote1", "Note de Bas de Page 1 (Ticket)")}
            {renderInput("footerNote2", "Note de Bas de Page 2 (Ticket)")}
        </div>
    </div>
  );
};

export default EstablishmentSettingsForm;
