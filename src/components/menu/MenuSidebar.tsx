import React from 'react';

interface Category {
  id: string;
  label: string;
}

interface MenuSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  menuItems: Array<{ category: string }>;
}

const MenuSidebar: React.FC<MenuSidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  menuItems
}) => {
  return (
    <div className="ipad-sidebar">
      <div className="sidebar-header">
        <h2>Categorías</h2>
      </div>
      <div className="sidebar-categories">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
          >
            <span className="category-label">{category.label}</span>
            <span className="category-count">
              {category.id === 'all'
                ? menuItems.length
                : menuItems.filter(item => item.category === category.id).length
              }
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuSidebar;