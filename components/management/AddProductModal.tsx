import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types';
import Modal from '../Modal'; 
import Icon from '../Icon';
import { TVA_RATE_REDUCED, TVA_RATE_STANDARD } from '../../constants';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (productData: Omit<Product, 'id'>) => void;
  onUpdateProduct?: (productData: Product) => void; // For editing
  categories: Category[];
  productToEdit?: Product | null; // For editing
}

const AddProductModal: React.FC<AddProductModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddProduct, 
  onUpdateProduct, 
  categories, 
  productToEdit 
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [stock, setStock] = useState('');
  const [imageBase64, setImageBase64] = useState<string>(''); // Stores base64 string
  const [vatRate, setVatRate] = useState<number>(TVA_RATE_REDUCED);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!productToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && productToEdit) {
        setName(productToEdit.name);
        setPrice(productToEdit.price.toString());
        setCategoryId(productToEdit.category);
        setStock(productToEdit.stock.toString());
        setImageBase64(productToEdit.imageUrl); // Assuming imageUrl now stores base64
        setVatRate(productToEdit.vatRate);
      } else {
        setName('');
        setPrice('');
        setCategoryId(categories[0]?.id || '');
        setStock('');
        setImageBase64('');
        setVatRate(TVA_RATE_REDUCED); // Default to 10%
      }
      setError(null);
    }
  }, [isOpen, productToEdit, isEditMode, categories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageBase64(''); // Clear if no file selected or selection is cancelled
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Le nom du produit est requis.");
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("Le prix doit être un nombre positif.");
      return;
    }
    const parsedStock = parseInt(stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      setError("Le stock doit être un nombre positif ou zéro.");
      return;
    }
    if (!categoryId) {
        setError("Veuillez sélectionner une catégorie.");
        return;
    }

    const productData = {
      name: name.trim(),
      price: parsedPrice,
      category: categoryId,
      stock: parsedStock,
      imageUrl: imageBase64, // Use base64 string
      vatRate: vatRate,
    };

    if (isEditMode && productToEdit && onUpdateProduct) {
      onUpdateProduct({ ...productData, id: productToEdit.id });
    } else {
      onAddProduct(productData);
    }
    
    if (!isEditMode) {
        setName('');
        setPrice('');
        setCategoryId(categories[0]?.id || '');
        setStock('');
        setImageBase64('');
        setVatRate(TVA_RATE_REDUCED);
    }
    onClose(); 
  };
  
  const vatOptions = [
    { label: `Réduit (${(TVA_RATE_REDUCED * 100).toFixed(0)}%)`, value: TVA_RATE_REDUCED }, // 10%
    { label: `Standard (${(TVA_RATE_STANDARD * 100).toFixed(0)}%)`, value: TVA_RATE_STANDARD }, // 20%
  ];
  
  const handleClose = () => {
    if (!isEditMode) {
        setName('');
        setPrice('');
        setCategoryId(categories[0]?.id || '');
        setStock('');
        setImageBase64('');
        setVatRate(TVA_RATE_REDUCED);
    }
    setError(null);
    onClose();
  };


  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEditMode ? "Modifier le Produit" : "Ajouter un Nouveau Produit"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm bg-red-100 p-2 rounded">{error}</p>}
        
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Nom du Produit <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="productName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">Prix (TTC) <span className="text-red-500">*</span></label>
          <input
            type="number"
            id="productPrice"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700">Catégorie <span className="text-red-500">*</span></label>
          <select
            id="productCategory"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            required
          >
            <option value="" disabled>Sélectionner une catégorie</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">Stock <span className="text-red-500">*</span></label>
          <input
            type="number"
            id="productStock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            min="0"
            step="1"
            required
          />
        </div>
        
        <div>
          <label htmlFor="productVatRate" className="block text-sm font-medium text-gray-700">Taux de TVA <span className="text-red-500">*</span></label>
          <select
            id="productVatRate"
            value={vatRate}
            onChange={(e) => setVatRate(parseFloat(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            required
          >
            {vatOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="productImageFile" className="block text-sm font-medium text-gray-700">Image du Produit</label>
          <input
            type="file"
            id="productImageFile"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
          />
          {imageBase64 && (
            <div className="mt-2">
              <img src={imageBase64} alt="Prévisualisation" className="h-20 w-20 object-cover rounded border border-gray-300" />
            </div>
          )}
        </div>


        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            className={`px-4 py-2 text-sm font-medium text-white rounded-md flex items-center ${
              isEditMode 
                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                : 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-500'
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            <Icon name={isEditMode ? "CheckIcon" : "PlusCircleIcon"} className="w-5 h-5 mr-2" />
            {isEditMode ? "Sauvegarder" : "Ajouter Produit"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProductModal;