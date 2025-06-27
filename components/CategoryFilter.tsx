
import React from 'react';
import { Category } from '../types';
import CategoryPill from './CategoryPill';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategoryId, onSelectCategory }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Catégories</h3>
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-150 ease-in-out shadow-sm whitespace-nowrap ${
            selectedCategoryId === null ? 'bg-sky-500 text-white ring-2 ring-offset-1 ring-black' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Tous
        </button>
        {categories.map((category) => (
          <CategoryPill
            key={category.id}
            category={category}
            isSelected={selectedCategoryId === category.id}
            onSelectCategory={() => onSelectCategory(category.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
