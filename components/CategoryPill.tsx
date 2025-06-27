
import React from 'react';
import { Category } from '../types';
import Icon from './Icon'; // Assuming Icon for placeholder

interface CategoryPillProps {
  category: Category;
  isSelected: boolean;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ category, isSelected, onSelectCategory }) => {
  const baseStyle = "px-3 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-150 ease-in-out shadow-sm whitespace-nowrap flex items-center";
  const selectedStyle = `${category.color} text-white ring-2 ring-offset-1 ring-black`;
  const unselectedStyle = `bg-gray-200 text-gray-700 hover:bg-gray-300`;

  return (
    <button
      onClick={() => onSelectCategory(category.id)}
      className={`${baseStyle} ${isSelected ? selectedStyle : unselectedStyle}`}
      aria-pressed={isSelected}
      title={category.name}
    >
      {category.imageUrl ? (
        <img 
          src={category.imageUrl} 
          alt="" // Alt text is decorative here as category name is present
          className="w-5 h-5 mr-2 rounded-full object-cover" 
        />
      ) : (
        // Optional: show a default icon if no image
        <span className="w-5 h-5 mr-2 flex items-center justify-center">
           {/* Placeholder or default icon, e.g. first letter of category or a generic icon */}
           {/* <Icon name="TagIcon" className="w-4 h-4 text-gray-500" /> */}
        </span>
      )}
      <span className="truncate max-w-[120px]">{category.name}</span>
    </button>
  );
};

export default CategoryPill;
