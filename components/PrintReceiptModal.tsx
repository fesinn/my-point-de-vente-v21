
import React from 'react';
import { CartItem, VatBreakdownMap, EstablishmentDetails } from '../types';
import Icon from './Icon';

interface PrintReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discountPercentage: number;
  sellerName: string;
  establishment: EstablishmentDetails;
  invoiceId: string;
  currentDate: Date;
}

const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  discountPercentage,
  sellerName,
  establishment,
  invoiceId,
  currentDate,
}) => {
  if (!isOpen) return null;

  const formatCurrency = (value: number) => `${value.toFixed(2).replace('.', ',')} ${establishment.currency.symbol}`;

  const calculateSubTotalTTC = () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const subTotalTTC = calculateSubTotalTTC();
  const discountAmount = subTotalTTC * (discountPercentage / 100);
  const totalTTCAfterDiscount = subTotalTTC - discountAmount;

  const itemsWithFinalPricing = cartItems.map(item => {
    const originalItemTotalTTC = item.product.price * item.quantity;
    const itemDiscountProportion = discountPercentage / 100;
    const discountedItemTotalTTC = originalItemTotalTTC * (1 - itemDiscountProportion);
    
    const finalPriceHT = discountedItemTotalTTC / (1 + item.product.vatRate);
    const finalVAT = discountedItemTotalTTC - finalPriceHT;
    return { ...item, finalTotalTTC: discountedItemTotalTTC, finalTotalHT: finalPriceHT, finalTotalVAT: finalVAT };
  });
  
  const totalHTAfterDiscount = itemsWithFinalPricing.reduce((sum, item) => sum + item.finalTotalHT, 0);
  const totalVATAfterDiscount = itemsWithFinalPricing.reduce((sum, item) => sum + item.finalTotalVAT, 0);

  const vatBreakdown: VatBreakdownMap = {};
  itemsWithFinalPricing.forEach(item => {
    const rateKey = (item.product.vatRate * 100).toFixed(1);
    if (!vatBreakdown[rateKey]) vatBreakdown[rateKey] = { ht: 0, tva: 0 };
    vatBreakdown[rateKey].ht += item.finalTotalHT;
    vatBreakdown[rateKey].tva += item.finalTotalVAT;
  });

  const totalArticles = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handlePrint = () => {
    const printableArea = document.getElementById('printable-receipt-area');
    if (printableArea) {
        const printContents = printableArea.innerHTML;
        const printWindow = window.open('', '_blank', 'height=800,width=400');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Ticket</title>');
            printWindow.document.write(`
                <style>
                    body { font-family: 'Courier New', Courier, monospace; margin: 0; padding: 10px; color: #000; background: #fff; }
                    .receipt-container { width: 300px; margin: auto; }
                    .header, .footer { text-align: center; }
                    .header img { max-width: 100px; max-height: 80px; margin: 0 auto 5px; }
                    .header h1 { font-size: 1.1em; margin: 5px 0; font-weight: bold; }
                    .header p, .info p, .footer p { font-size: 0.8em; margin: 2px 0; }
                    .items-table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 0.8em; }
                    .items-table th, .items-table td { text-align: left; padding: 2px; }
                    .items-table .qty, .items-table .price, .items-table .total { text-align: right; }
                    .items-table th { border-bottom: 1px dashed #000; }
                    .totals div { display: flex; justify-content: space-between; font-size: 0.8em; margin: 1px 0; }
                    .totals .grand-total { font-weight: bold; font-size: 0.9em; margin-top: 5px; border-top: 1px dashed #000; padding-top: 5px; }
                    .dashed-line { border-top: 1px dashed #000; margin: 5px 0; }
                    .vat-breakdown p { font-size: 0.75em; margin: 1px 0; }
                    .no-print-in-modal { display: none !important; } 
                </style>
            `);
            printWindow.document.write('</head><body>');
            printWindow.document.write(printContents);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250); 
        } else {
            alert("Could not open print window. Please check your browser's popup blocker settings.");
        }
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md md:max-w-sm transform transition-all">
        <div id="printable-receipt-area" className="p-6 text-xs text-black receipt-container" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 no-print-in-modal z-10 md:hidden">
            <Icon name="CancelIcon" className="w-6 h-6" />
          </button>
          <div className="header text-center">
            {establishment.logoUrl && <img src={establishment.logoUrl} alt="Logo" />}
            <h1 className="font-bold text-sm">{establishment.name.toUpperCase()}</h1>
            <p>{establishment.address1}</p>
            <p>{establishment.address2}</p>
            <p>Tel: {establishment.tel}</p>
            <p>TVA: {establishment.tvaNumber} - ICE: {establishment.iceNumber}</p>
            <p className="mt-1">{establishment.welcomeMessage}</p>
          </div>

          <div className="dashed-line my-2"></div>

          <div className="info text-xs">
            <p>Ticket: {invoiceId}</p>
            <p>Date: {currentDate.toLocaleDateString('fr-FR')} {currentDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
            <p>Vendeur: {sellerName}</p>
          </div>

          <div className="dashed-line my-2"></div>

          <table className="items-table w-full text-xs my-1">
            <thead>
              <tr>
                <th className="qty text-left">Qte</th>
                <th className="desc text-left">Description</th>
                <th className="price text-right">Prix U.</th>
                <th className="total text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.product.id}>
                  <td className="qty text-left">{item.quantity}</td>
                  <td className="desc text-left">{item.product.name}</td>
                  <td className="price text-right">{item.product.price.toFixed(2).replace('.', ',')}</td>
                  <td className="total text-right">{(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="dashed-line my-2"></div>
          
          <div className="totals text-xs space-y-0.5">
            <div>
              <span>NB ARTICLES:</span>
              <span>{totalArticles}</span>
            </div>
            {discountPercentage > 0 && (
              <>
                <div>
                  <span>SOUS-TOTAL:</span>
                  <span>{formatCurrency(subTotalTTC)}</span>
                </div>
                <div>
                  <span>REDUCTION ({discountPercentage.toFixed(1).replace('.',',')}%):</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              </>
            )}
             <div>
              <span>TOTAL HT:</span>
              <span>{formatCurrency(totalHTAfterDiscount)}</span>
            </div>
            <div>
              <span>TOTAL TVA:</span>
              <span>{formatCurrency(totalVATAfterDiscount)}</span>
            </div>
            <div className="grand-total font-bold text-sm pt-1 mt-1 border-t border-dashed border-black">
              <span>TOTAL A PAYER:</span>
              <span>{formatCurrency(totalTTCAfterDiscount)}</span>
            </div>
          </div>

          {Object.keys(vatBreakdown).length > 0 && (
            <div className="vat-breakdown mt-2 text-xs">
              <div className="dashed-line my-1"></div>
              {Object.entries(vatBreakdown).map(([rate, values]) => (
                <p key={rate}>
                  TVA {rate.replace('.',',')}%: HT {values.ht.toFixed(2).replace('.', ',')} / TVA {values.tva.toFixed(2).replace('.', ',')}
                </p>
              ))}
            </div>
          )}
          
          <div className="footer text-center mt-3 text-xs">
            <p>{establishment.thankYouMessage}</p>
            <p>{establishment.footerNote1}</p>
            <p>{establishment.footerNote2}</p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 no-print-in-modal">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 text-sm font-medium"
          >
            Fermer
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm font-medium flex items-center"
          >
            <Icon name="PrintIcon" className="w-4 h-4 mr-2" />
            Imprimer ce Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintReceiptModal;
