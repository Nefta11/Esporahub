import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { hasPermission } from '@/data/users';
import LogoutDialog from '@/components/modals/LogoutDialog';
import AccessDeniedModal from '@/components/modals/AccessDeniedModal';
import EsporaIA from '@/components/generals/EsporaIA';
import MenuNavbar from '@/components/menu/MenuNavbar';
import MenuSidebar from '@/components/menu/MenuSidebar';
import MenuGrid from '@/components/menu/MenuGrid';
import MenuDock from '@/components/menu/MenuDock';
import { useMenuItems, type MenuItem } from '@/components/menu/useMenuItems';
import '@/styles/menu/menu.css';

interface DragState {
  isDragging: boolean;
  draggedItem: MenuItem | null;
  dragOffset: { x: number; y: number };
  dragPosition: { x: number; y: number };
}
const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
  const [deniedFeature, setDeniedFeature] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dockedItems, setDockedItems] = useState<MenuItem[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    dragOffset: { x: 0, y: 0 },
    dragPosition: { x: 0, y: 0 }
  });
  const [isDockHighlighted, setIsDockHighlighted] = useState(false);
  const [isEsporaIAOpen, setIsEsporaIAOpen] = useState(false);
  const [draggedItemElement, setDraggedItemElement] = useState<HTMLElement | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.body.classList.contains('dark-theme')
  );
  const { user } = useAuthStore();
  const menuItems = useMenuItems();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains('dark-theme'));
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Load docked items from localStorage (dock starts empty if nothing saved)
  useEffect(() => {
    const savedDockedItems = localStorage.getItem('dockedItems');
    if (savedDockedItems) {
      try {
        const parsed = JSON.parse(savedDockedItems);
        // Re-assign icons by looking up from menuItems array
        const dockedItemsWithIcons = parsed.map((savedItem: Omit<MenuItem, 'icon'>) => {
          const fullMenuItem = menuItems.find(item => item.id === savedItem.id);
          return fullMenuItem || savedItem;
        });
        setDockedItems(dockedItemsWithIcons);
      } catch (error) {
        console.error('Error loading docked items:', error);
      }
    } else {
      setDockedItems([]); // dock starts empty
    }
  }, [menuItems]);

  // Save docked items to localStorage (save even if empty)
  useEffect(() => {
    // Remove icon property before saving to avoid circular references
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const serializableDockedItems = dockedItems.map(({ icon, ...item }) => item);
    localStorage.setItem('dockedItems', JSON.stringify(serializableDockedItems));
  }, [dockedItems]);
  const handleThemeToggle = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
  };

  const handleMenuItemClick = (item: MenuItem) => {
    // Don't navigate if we're dragging
    if (dragState.isDragging) return;

    if (item.id === 'overview' && (!user || !hasPermission(user, 'create_accounts'))) {
      setDeniedFeature('Gestión de Cuentas');
      setShowAccessDeniedModal(true);
      return;
    }

    if (item.path) {
      navigate(item.path);
    } else {
      navigate('/construction');
    }
  };

  const handleMouseDown = (e: React.MouseEvent, item: MenuItem) => {
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDragState({
      isDragging: true,
      draggedItem: item,
      dragOffset: { x: offsetX, y: offsetY },
      dragPosition: { x: e.clientX, y: e.clientY }
    });

    // Create visual clone for dragging
    const clone = e.currentTarget.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.top = `${e.clientY - offsetY}px`;
    clone.style.left = `${e.clientX - offsetX}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.pointerEvents = 'none';
    clone.style.zIndex = '1000';
    clone.style.opacity = '0.8';
    clone.style.transform = 'rotate(3deg) scale(1.05)';
    clone.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
    clone.classList.add('dragged-item-overlay');

    document.body.appendChild(clone);
    setDraggedItemElement(clone);

    // Add global mouse move and mouse up listeners
    const handleMouseMove = (e: MouseEvent) => {
      if (clone) {
        clone.style.left = `${e.clientX - offsetX}px`;
        clone.style.top = `${e.clientY - offsetY}px`;
      }

      setDragState(prev => ({
        ...prev,
        dragPosition: { x: e.clientX, y: e.clientY }
      }));
    };

    const handleMouseUp = (e: MouseEvent) => {
      // Check if dropped on dock
      const dockElement = document.querySelector('.dock-apps');
      if (dockElement) {
        const dockRect = dockElement.getBoundingClientRect();
        const isOverDock = (
          e.clientX >= dockRect.left &&
          e.clientX <= dockRect.right &&
          e.clientY >= dockRect.top &&
          e.clientY <= dockRect.bottom
        );

        if (isOverDock) {
          handleDockDrop(item);
        }
      }

      // Cleanup
      if (clone && clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
      setDraggedItemElement(null);
      setDragState({
        isDragging: false,
        draggedItem: null,
        dragOffset: { x: 0, y: 0 },
        dragPosition: { x: 0, y: 0 }
      });
      setIsDockHighlighted(false);

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDockDrop = (item: MenuItem) => {
    const isAlreadyDocked = dockedItems.some(dockedItem => dockedItem.id === item.id);
    if (!isAlreadyDocked && dockedItems.length < 8) { // Increase limit to 8
      setDockedItems(prev => [...prev, item]);
    }
  };

  const handleDockDropEvent = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDockHighlighted(false);
    // This function handles the drop event but the actual drop logic 
    // is handled by mouse events in handleMouseDown/handleMouseUp
  };

  // Mouse move handler for dock highlighting
  useEffect(() => {
    if (!dragState.isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dockElement = document.querySelector('.dock-apps');
      if (dockElement) {
        const dockRect = dockElement.getBoundingClientRect();
        const isOverDock = (
          e.clientX >= dockRect.left &&
          e.clientX <= dockRect.right &&
          e.clientY >= dockRect.top &&
          e.clientY <= dockRect.bottom
        );

        // Only update if the state actually changes
        setIsDockHighlighted(prev => prev !== isOverDock ? isOverDock : prev);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [dragState.isDragging]);

  const handleDragEnd = () => {
    setDragState({
      isDragging: false,
      draggedItem: null,
      dragOffset: { x: 0, y: 0 },
      dragPosition: { x: 0, y: 0 }
    });
    setIsDockHighlighted(false);

    if (draggedItemElement && draggedItemElement.parentNode) {
      draggedItemElement.parentNode.removeChild(draggedItemElement);
    }
    setDraggedItemElement(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (draggedItemElement && draggedItemElement.parentNode) {
        draggedItemElement.parentNode.removeChild(draggedItemElement);
      }
    };
  }, [draggedItemElement]);

  // Remove item from dock (by id)
  const handleDockItemRemove = (itemId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDockedItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Drag out from dock: start dragging a docked app
  const handleDockItemMouseDown = (e: React.MouseEvent, item: MenuItem) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDragState({
      isDragging: true,
      draggedItem: item,
      dragOffset: { x: offsetX, y: offsetY },
      dragPosition: { x: e.clientX, y: e.clientY }
    });

    // Visual clone for dragging
    const clone = e.currentTarget.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.top = `${e.clientY - offsetY}px`;
    clone.style.left = `${e.clientX - offsetX}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.pointerEvents = 'none';
    clone.style.zIndex = '1000';
    clone.style.opacity = '0.8';
    clone.style.transform = 'rotate(-3deg) scale(1.05)';
    clone.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
    clone.classList.add('dragged-item-overlay');
    document.body.appendChild(clone);
    setDraggedItemElement(clone);

    // Mouse move and up listeners
    const handleMouseMove = (e: MouseEvent) => {
      if (clone) {
        clone.style.left = `${e.clientX - offsetX}px`;
        clone.style.top = `${e.clientY - offsetY}px`;
      }
      setDragState(prev => ({
        ...prev,
        dragPosition: { x: e.clientX, y: e.clientY }
      }));
    };
    const handleMouseUp = (e: MouseEvent) => {
      // If dropped outside dock, remove from dock
      const dockElement = document.querySelector('.dock-apps');
      let isOverDock = false;
      if (dockElement) {
        const dockRect = dockElement.getBoundingClientRect();
        isOverDock = (
          e.clientX >= dockRect.left &&
          e.clientX <= dockRect.right &&
          e.clientY >= dockRect.top &&
          e.clientY <= dockRect.bottom
        );
      }
      if (!isOverDock) {
        handleDockItemRemove(item.id);
      }
      // Cleanup
      if (clone && clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
      setDraggedItemElement(null);
      setDragState({
        isDragging: false,
        draggedItem: null,
        dragOffset: { x: 0, y: 0 },
        dragPosition: { x: 0, y: 0 }
      });
      setIsDockHighlighted(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDockDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDockHighlighted(true);
  };

  const handleDockDragLeave = () => {
    setIsDockHighlighted(false);
  };

  const handleDockItemClick = (item: MenuItem) => {
    handleMenuItemClick(item);
  };

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'operativas', label: 'Operativas' },
    { id: 'organizativas', label: 'Organizativas' },
    { id: 'recursos', label: 'Recursos adicionales' }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`ipad-menu ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <MenuNavbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filteredItemsCount={filteredItems.length}
      />

      <MenuSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        menuItems={menuItems}
      />

      <MenuGrid
        filteredItems={filteredItems}
        isVisible={isVisible}
        dragState={dragState}
        onMouseDown={handleMouseDown}
        onDragEnd={handleDragEnd}
        onItemClick={handleMenuItemClick}
      />

      <MenuDock
        dockedItems={dockedItems}
        isDockHighlighted={isDockHighlighted}
        isDarkMode={isDarkMode}
        onDragOver={handleDockDragOver}
        onDragLeave={handleDockDragLeave}
        onDrop={handleDockDropEvent}
        onItemClick={handleDockItemClick}
        onItemRemove={handleDockItemRemove}
        onItemMouseDown={handleDockItemMouseDown}
        onThemeToggle={handleThemeToggle}
        onLogoutClick={() => setShowLogoutDialog(true)}
      />


      {/* Floating Espora IA Button */}
      <button
        className="floating-espora-ia-button"
        onClick={() => setIsEsporaIAOpen(true)}
        title="Espora IA - Asistente Inteligente"
      >
        <Bot size={20} />
        <span className="espora-ia-text">Espora IA</span>
      </button>

      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
      />

      <AccessDeniedModal
        isOpen={showAccessDeniedModal}
        onClose={() => setShowAccessDeniedModal(false)}
        featureName={deniedFeature}
      />

      <EsporaIA
        isOpen={isEsporaIAOpen}
        onClose={() => setIsEsporaIAOpen(false)}
      />
    </div>
  );
};

export default MenuPage;