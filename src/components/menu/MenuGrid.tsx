import React from 'react';
import { Search } from 'lucide-react';
import { type MenuItem } from './useMenuItems';

interface DragState {
  isDragging: boolean;
  draggedItem: MenuItem | null;
  dragOffset: { x: number; y: number };
  dragPosition: { x: number; y: number };
}

interface MenuGridProps {
  filteredItems: MenuItem[];
  isVisible: boolean;
  dragState: DragState;
  onMouseDown: (e: React.MouseEvent, item: MenuItem) => void;
  onDragEnd: () => void;
  onItemClick: (item: MenuItem) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({
  filteredItems,
  isVisible,
  dragState,
  onMouseDown,
  onDragEnd,
  onItemClick
}) => {
  return (
    <main className="ipad-main">
      <div className={`apps-container ${isVisible ? 'visible' : ''}`}>
        <div className="apps-grid">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={`app-item ${item.status} ${dragState.isDragging && dragState.draggedItem?.id === item.id ? 'dragging' : ''}`}
              style={{
                animationDelay: `${index * 0.05}s`
              }}
              draggable={false}
              onMouseDown={(e) => onMouseDown(e, item)}
              onDragEnd={onDragEnd}
              onClick={() => onItemClick(item)}
            >
              <div className="app-icon-container">
                <div
                  className="app-icon"
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
              </div>
              <div className="app-info">
                <h3 className="app-name">{item.label}</h3>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="empty-state">
            <Search size={64} className="empty-icon" />
            <h3>No se encontraron aplicaciones</h3>
            <p>Intenta con otros términos de búsqueda o cambia la categoría</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MenuGrid;