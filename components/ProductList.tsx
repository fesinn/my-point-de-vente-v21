
import React from 'react';
import { Product, Category } from '../types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  categories: Category[];
  onProductSelect: (product: Product) => void;
  currencySymbol: string;
}

const ProductList: React.FC<ProductListProps> = ({ products, categories, onProductSelect, currencySymbol }) => {
  if (products.length === 0) {
    return <p className="text-gray-500 text-center py-10">Aucun produit trouvé.</p>;
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : 'bg-gray-400';
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };


  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto flex-grow pr-1">
      {products.map((product) => (
        <ProductCard 
            key={product.id} 
            product={{...product, category: getCategoryName(product.category)}} 
            onProductSelect={onProductSelect}
            categoryColor={getCategoryColor(product.category)}
            currencySymbol={currencySymbol}
        />
      ))}
    </div>
  );
};

export default ProductList;
