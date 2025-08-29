import React from 'react';
import { LogOut } from 'lucide-react';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { type MenuItem } from './useMenuItems';

interface MenuDockProps {
  dockedItems: MenuItem[];
  isDockHighlighted: boolean;
  isDarkMode: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onItemClick: (item: MenuItem) => void;
  onItemRemove: (itemId: string, e?: React.MouseEvent) => void;
  onItemMouseDown: (e: React.MouseEvent, item: MenuItem) => void;
  onThemeToggle: () => void;
  onLogoutClick: () => void;
}

const MenuDock: React.FC<MenuDockProps> = ({
  dockedItems,
  isDockHighlighted,
  isDarkMode,
  onDragOver,
  onDragLeave,
  onDrop,
  onItemClick,
  onItemRemove,
  onItemMouseDown,
  onThemeToggle,
  onLogoutClick
}) => {
  return (
    <div
      className={`ipad-dock ${isDockHighlighted ? 'drag-over' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="dock-content">
        <div className={`dock-apps ${isDockHighlighted ? 'drag-over' : ''}`}>
          {dockedItems.length === 0 && (
            <div className="dock-empty-message">Arrastra tus apps favoritas aquí</div>
          )}
          
          {dockedItems.map((item) => (
            <div
              key={item.id}
              className="dock-app"
              onClick={() => onItemClick(item)}
              onContextMenu={(e) => {
                e.preventDefault();
                onItemRemove(item.id, e);
              }}
              onMouseDown={(e) => onItemMouseDown(e, item)}
              title={`${item.label} - Arrastra para sacar del dock o click derecho para quitar`}
              style={{ cursor: 'grab' }}
            >
              <div className="dock-icon" style={{ backgroundColor: item.color }}>
                {item.icon}
              </div>
            </div>
          ))}

          {dockedItems.length > 0 && <div className="dock-separator"></div>}
          
          <ThemeToggle
            isDarkMode={isDarkMode}
            onToggle={onThemeToggle}
          />
          
          <button
            className="dock-logout-button"
            onClick={onLogoutClick}
            title="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuDock;