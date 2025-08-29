import React from 'react';
import { Search } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import UserAvatar from '@/components/layout/UserAvatar';

interface MenuNavbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filteredItemsCount: number;
}

const MenuNavbar: React.FC<MenuNavbarProps> = ({
  searchTerm,
  onSearchChange,
  filteredItemsCount
}) => {
  return (
    <>
      <div className="ipad-status-bar">
        <div className="status-center">
          <div className="notch"></div>
        </div>
      </div>

      <nav className="ipad-navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <Logo />
            <div className="navbar-title">
              <h1>esporahub</h1>
              <span className="app-count">{filteredItemsCount} aplicaciones</span>
            </div>
          </div>

          <div className="navbar-center">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar aplicaciones..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="navbar-right">
            <UserAvatar showName size="md" />
          </div>
        </div>
      </nav>
    </>
  );
};

export default MenuNavbar;