
import React, { useMemo, useState } from 'react';
import { CompletedTransaction, EstablishmentDetails, UserRole } from '../../types';
import Icon from '../Icon';

interface ProductReportItem {
  id: string;
  code: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalSalesTTC: number;
}

interface FinancialScreenProps {
    completedTransactions: CompletedTransaction[];
    establishmentDetails: EstablishmentDetails;
    userRole: UserRole;
    onDeleteTransaction: (docId: string) => void;
}

const formatDateForInput = (date: Date): string => date.toISOString().split('T')[0];

const FinancialScreen: React.FC<FinancialScreenProps> = ({ completedTransactions, establishmentDetails, userRole, onDeleteTransaction }) => {
  const [activeTab, setActiveTab] = useState<'main_courante' | 'produits'>('main_courante');
  const today = new Date();
  const [startDate, setStartDate] = useState(formatDateForInput(today));
  const [endDate, setEndDate] = useState(formatDateForInput(today));

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printFormat, setPrintFormat] = useState<'A4' | 'Ticket'>('A4');

  const filteredTransactions = useMemo(() => {
    if (!completedTransactions) return [];
    const start = new Date(startDate); start.setHours(0, 0, 0, 0);
    const end = new Date(endDate); end.setHours(23, 59, 59, 999);
    return completedTransactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= start && txDate <= end;
    });
  }, [completedTransactions, startDate, endDate]);

  const paymentMethodTotals = useMemo(() => filteredTransactions.reduce((acc, tx) => {
    const method = tx.paymentMethod || 'Inconnu';
    acc[method] = (acc[method] || 0) + tx.totalTTC;
    return acc;
  }, {} as Record<string, number>), [filteredTransactions]);

  const productSalesReport: ProductReportItem[] = useMemo(() => {
    const productMap: Record<string, ProductReportItem> = {};
    filteredTransactions.forEach(tx => {
      tx.items.forEach(item => {
        const { product, quantity } = item;
        const itemTotal = product.price * quantity;
        if (!productMap[product.id]) {
          productMap[product.id] = {
            id: product.id, code: product.id.slice(0, 8).toUpperCase(), name: product.name,
            quantity: 0, unitPrice: product.price, totalSalesTTC: 0,
          };
        }
        productMap[product.id].quantity += quantity;
        productMap[product.id].totalSalesTTC += itemTotal;
      });
    });
    return Object.values(productMap).sort((a, b) => b.totalSalesTTC - a.totalSalesTTC);
  }, [filteredTransactions]);

  const totalProductSales = useMemo(() => productSalesReport.reduce((sum, item) => sum + item.totalSalesTTC, 0), [productSalesReport]);
  const currencySymbol = establishmentDetails.currency.symbol;

  const handleDeleteClick = (docId: string, invoiceId: string, total: number) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la facture N° ${invoiceId} d'un montant de ${total.toFixed(2)} ${currencySymbol} ?\nCette action est irréversible.`)) {
      onDeleteTransaction(docId);
    }
  };

  const handlePrint = () => {
    const reportId = activeTab === 'main_courante' ? 'main-courante-report' : 'ventes-produit-report';
    const printContents = document.getElementById(reportId)?.innerHTML;
    const printStyle = printFormat === 'A4' ? getA4PrintStyles() : getTicketPrintStyles();

    if (printContents) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`<html><head><title>Rapport</title><style>${printStyle}</style></head><body>${printContents}</body></html>`);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
      }
    }
    setIsPrintModalOpen(false);
  };
  
  const ReportHeader = () => (
    <div className="report-header">
        {establishmentDetails.logoUrl && <img src={establishmentDetails.logoUrl} alt="Logo" className="logo"/>}
        <h1>{establishmentDetails.name}</h1>
        <p>Rapport Financier - {activeTab === 'main_courante' ? "Main Courante" : "Ventes par Produit"}</p>
        <p>Période du {new Date(startDate).toLocaleDateString('fr-FR')} au {new Date(endDate).toLocaleDateString('fr-FR')}</p>
    </div>
  );
  
  const renderMainCourante = (isForPrint = false) => (
    <div className="bg-white p-4 rounded-lg shadow-md" id="main-courante-report">
       {isForPrint && <ReportHeader />}
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Rapport Main Courante</h2>
          {!isForPrint && <button onClick={() => setIsPrintModalOpen(true)} className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm flex items-center"><Icon name="PrintIcon" className="w-4 h-4 mr-1"/>Imprimer</button>}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">N° Facture</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">N° Chambre</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Utilisateur</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Montant Facture</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mode de Règlement</th>
              { !isForPrint && (userRole === UserRole.Admin || userRole === UserRole.Manager) && <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th> }
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(tx => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b border-gray-200">{tx.invoiceId}</td>
                <td className="px-4 py-2 border-b border-gray-200">{tx.roomNumber || '-'}</td>
                <td className="px-4 py-2 border-b border-gray-200">{tx.sellerName}</td>
                <td className="px-4 py-2 border-b border-gray-200 text-right">{tx.totalTTC.toFixed(2)} {currencySymbol}</td>
                <td className="px-4 py-2 border-b border-gray-200">{tx.paymentMethod}</td>
                 { !isForPrint && (userRole === UserRole.Admin || userRole === UserRole.Manager) &&
                    <td className="px-4 py-2 border-b border-gray-200 text-center">
                        <button onClick={() => handleDeleteClick(tx.id, tx.invoiceId, tx.totalTTC)} title="Annuler la facture" className="text-red-500 hover:text-red-700 p-1">
                            <Icon name="TrashIcon" className="w-5 h-5"/>
                        </button>
                    </td>
                 }
              </tr>
            ))}
             {filteredTransactions.length === 0 && <tr><td colSpan={userRole === UserRole.Admin || userRole === UserRole.Manager ? 6 : 5} className="text-center py-4 text-gray-500">Aucune transaction.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700">Total par mode de règlement</h3>
        <div className="mt-2 p-3 bg-gray-50 rounded space-y-2 max-w-sm">
          {Object.keys(paymentMethodTotals).length > 0 ? Object.entries(paymentMethodTotals).map(([method, total]) => (
                <div key={method} className="flex justify-between text-sm"><span className="font-medium">{method}:</span><span className="font-semibold">{total.toFixed(2)} {currencySymbol}</span></div>
            )) : <p className="text-sm text-gray-500">Aucun règlement.</p>}
        </div>
      </div>
    </div>
  );

  const renderVentesProduits = (isForPrint = false) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200" id="ventes-produit-report" style={{ fontFamily: 'sans-serif' }}>
        {isForPrint && <ReportHeader />}
        <div className="text-center mb-4 pb-4 border-b-2 border-black header-print">
            <p className="text-lg font-semibold rounded-full border-2 border-black inline-block px-4 py-1 my-2">Vente / Prestation</p>
            <div className="text-sm text-gray-600 flex justify-between max-w-lg mx-auto mt-2">
                <span>Date d'édition: {new Date().toLocaleString('fr-FR')}</span>
                <span>Période: {new Date(startDate).toLocaleDateString('fr-FR')} au {new Date(endDate).toLocaleDateString('fr-FR')}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Point de Vente: {establishmentDetails.pointOfSaleName}</p>
        </div>
        {!isForPrint && <div className="flex justify-end mb-4"><button onClick={() => setIsPrintModalOpen(true)} className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm flex items-center"><Icon name="PrintIcon" className="w-4 h-4 mr-1"/>Imprimer</button></div>}
        <table className="min-w-full text-sm">
            <thead ><tr className="border-b border-black"><th className="py-2 px-2 text-left">Code</th><th className="py-2 px-2 text-left">Produit</th><th className="py-2 px-2 text-right">Quantité</th><th className="py-2 px-2 text-right">P.U</th><th className="py-2 px-2 text-right">Total</th></tr></thead>
            <tbody>
                {productSalesReport.map(item => (<tr key={item.id} className="border-b border-gray-200"><td className="py-2 px-2">{item.code}</td><td className="py-2 px-2">{item.name}</td><td className="py-2 px-2 text-right">{item.quantity}</td><td className="py-2 px-2 text-right">{item.unitPrice.toFixed(2)}</td><td className="py-2 px-2 text-right">{item.totalSalesTTC.toFixed(2)}</td></tr>))}
                {productSalesReport.length === 0 && <tr><td colSpan={5} className="text-center py-4 text-gray-500">Aucune vente.</td></tr>}
            </tbody>
            <tfoot><tr className="border-t-2 border-black font-bold"><td colSpan={4} className="py-2 px-2 text-right text-lg">TOTAL :</td><td className="py-2 px-2 text-right text-lg">{totalProductSales.toFixed(2)} {currencySymbol}</td></tr></tfoot>
        </table>
    </div>
  );
  
  return (
    <div className="p-4 md:p-6 flex-1 overflow-y-auto pb-[80px] bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Rapports Financiers</h1>
      <div className="p-4 bg-white rounded-lg shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
          <div><label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Du</label><input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border border-gray-300 rounded-md"/></div>
          <div><label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">Au</label><input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border border-gray-300 rounded-md"/></div>
      </div>
      <div className="flex border-b border-gray-200 mb-6">
        <button onClick={() => setActiveTab('main_courante')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'main_courante' ? 'border-b-2 border-sky-500 text-sky-600' : 'text-gray-500 hover:text-gray-700'}`}>Rapport Main Courante</button>
        <button onClick={() => setActiveTab('produits')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'produits' ? 'border-b-2 border-sky-500 text-sky-600' : 'text-gray-500 hover:text-gray-700'}`}>Ventes par Produit</button>
      </div>
      <div>{activeTab === 'main_courante' ? renderMainCourante() : renderVentesProduits()}</div>
      {isPrintModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                  <h3 className="text-lg font-semibold mb-4">Options d'Impression</h3>
                  <div className="mb-4">
                      <label htmlFor="print-format" className="block text-sm font-medium text-gray-700">Format:</label>
                      <select id="print-format" value={printFormat} onChange={e => setPrintFormat(e.target.value as any)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                          <option value="A4">Format A4</option>
                          <option value="Ticket">Format Ticket</option>
                      </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                      <button onClick={() => setIsPrintModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md">Annuler</button>
                      <button onClick={handlePrint} className="px-4 py-2 bg-sky-500 text-white rounded-md">Imprimer</button>
                  </div>
              </div>
          </div>
      )}
      <div style={{ display: 'none' }}>{renderMainCourante(true)}{renderVentesProduits(true)}</div>
    </div>
  );
};
const getA4PrintStyles = () => `
  @page { size: A4; margin: 20mm; }
  body { font-family: Arial, sans-serif; font-size: 10pt; color: #333; }
  .report-header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
  .report-header .logo { max-height: 80px; margin-bottom: 10px; }
  h1 { font-size: 16pt; margin: 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
  th { background-color: #f2f2f2; font-weight: bold; }
  .header-print { display: none; }
  button { display: none; }
`;
const getTicketPrintStyles = () => `
  @page { size: 80mm auto; margin: 2mm; }
  body { font-family: 'Courier New', monospace; font-size: 9pt; color: #000; }
  .report-header { text-align: center; margin-bottom: 10px; }
  .report-header .logo { max-width: 60mm; max-height: 40mm; }
  h1 { font-size: 11pt; margin: 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 8pt; }
  th, td { padding: 3px 2px; text-align: left; }
  .text-right { text-align: right; }
  th { border-bottom: 1px dashed #000; }
  .header-print { display: none; }
  button { display: none; }
`;
export default FinancialScreen;
