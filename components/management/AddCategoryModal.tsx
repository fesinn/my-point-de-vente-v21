
import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import Modal from '../Modal';
import Icon from '../Icon';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (categoryData: Omit<Category, 'id'>) => void;
  onUpdateCategory?: (categoryData: Category) => void; // For editing
  categoryToEdit?: Category | null; // For editing
}

const tailwindColors = [
  'bg-slate-500', 'bg-gray-500', 'bg-zinc-500', 'bg-neutral-500', 'bg-stone-500',
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500',
  'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500',
  'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
  'bg-pink-500', 'bg-rose-500'
];

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddCategory,
  onUpdateCategory,
  categoryToEdit
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(tailwindColors[5]);
  const [imageBase64, setImageBase64] = useState<string>(''); // Stores base64 string
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!categoryToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && categoryToEdit) {
        setName(categoryToEdit.name);
        setColor(categoryToEdit.color);
        setImageBase64(categoryToEdit.imageUrl || '');
      } else {
        setName('');
        setColor(tailwindColors[5]); // Default color
        setImageBase64('');
      }
      setError(null);
    }
  }, [isOpen, categoryToEdit, isEditMode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageBase64('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Le nom de la catégorie est requis.");
      return;
    }
    if (!color) {
        setError("Veuillez sélectionner une couleur.");
        return;
    }
    
    const categoryData = {
      name: name.trim(),
      color: color,
      imageUrl: imageBase64,
    };

    if (isEditMode && categoryToEdit && onUpdateCategory) {
      onUpdateCategory({ ...categoryData, id: categoryToEdit.id });
    } else {
      onAddCategory(categoryData);
    }

    if (!isEditMode) {
        setName('');
        setColor(tailwindColors[5]);
        setImageBase64('');
    }
    onClose(); 
  };

  const handleClose = () => {
    if (!isEditMode) {
        setName('');
        setColor(tailwindColors[5]);
        setImageBase64('');
    }
    setError(null);
    onClose();
  };


  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEditMode ? "Modifier la Catégorie" : "Ajouter une Nouvelle Catégorie"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm bg-red-100 p-2 rounded">{error}</p>}
        
        <div>
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Nom de la Catégorie <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="categoryName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            required
          />
        </div>

        <div>
            <label htmlFor="categoryColor" className="block text-sm font-medium text-gray-700">Couleur <span className="text-red-500">*</span></label>
            <div className="mt-1 grid grid-cols-7 gap-2">
                {tailwindColors.map(bgColorClass => (
                    <button
                        type="button"
                        key={bgColorClass}
                        onClick={() => setColor(bgColorClass)}
                        className={`w-8 h-8 rounded-full border-2 ${color === bgColorClass ? 'ring-2 ring-offset-1 ring-black' : 'border-gray-300'} ${bgColorClass} transition-all`}
                        aria-label={`Select color ${bgColorClass}`}
                    />
                ))}
            </div>
            <div className="mt-2 text-sm">Couleur sélectionnée: <span className={`px-2 py-1 rounded text-white text-xs ${color || 'bg-transparent'}`}>{color}</span></div>
        </div>


        <div>
          <label htmlFor="categoryImageFile" className="block text-sm font-medium text-gray-700">Icône de la Catégorie</label>
          <input
            type="file"
            id="categoryImageFile"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
          />
           {imageBase64 && (
            <div className="mt-2">
              <img src={imageBase64} alt="Prévisualisation" className="h-10 w-10 object-cover rounded-full border border-gray-300" />
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
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            <Icon name={isEditMode ? "CheckIcon" : "PlusCircleIcon"} className="w-5 h-5 mr-2" />
            {isEditMode ? "Sauvegarder" : "Ajouter Catégorie"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;
