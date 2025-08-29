import React from 'react';
import { ChevronDown, User } from 'lucide-react';

interface Account {
  id: number;
  name: string;
  position: string;
  color: string;
  isActive: boolean;
}

interface AccountSelectorProps {
  selectedAccount: Account | null;
  onAccountSelect: (account: Account) => void;
  isDarkMode: boolean;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({
  selectedAccount,
  onAccountSelect,
  isDarkMode
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const accounts: Account[] = [
    { id: 1, name: 'Juan Pérez', position: 'Alcalde', color: 'text-blue-500', isActive: true },
    { id: 2, name: 'María García', position: 'Gobernadora', color: 'text-emerald-500', isActive: true },
    { id: 3, name: 'Carlos López', position: 'Diputado', color: 'text-purple-500', isActive: false },
    { id: 4, name: 'Ana Martínez', position: 'Senadora', color: 'text-red-500', isActive: true },
    { id: 5, name: 'Roberto Silva', position: 'Presidente Municipal', color: 'text-yellow-500', isActive: false },
    { id: 6, name: 'Laura Hernández', position: 'Diputada Local', color: 'text-teal-500', isActive: true }
  ];

  const handleAccountClick = (account: Account) => {
    onAccountSelect(account);
    setIsOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Cerrar dropdown si se hace clic fuera
  React.useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div style={{ position: 'relative', zIndex: 9999 }}>
      <div 
        onClick={toggleDropdown}
        style={{
          minWidth: '280px',
          cursor: 'pointer',
          borderRadius: '16px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          background: isDarkMode ? 'rgba(44, 44, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          border: isDarkMode ? '0.5px solid rgba(84, 84, 88, 0.4)' : '0.5px solid rgba(0, 0, 0, 0.06)',
          backdropFilter: 'blur(20px)',
          boxShadow: isDarkMode 
            ? '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3)' 
            : '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #007aff 0%, #5ac8fa 100%)',
            color: 'white',
            borderRadius: '6px',
            padding: '4px',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={16} />
          </div>

          {selectedAccount ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: selectedAccount.isActive 
                  ? 'linear-gradient(135deg, #30d158 0%, #32d760 100%)' 
                  : 'linear-gradient(135deg, #ff453a 0%, #ff6961 100%)'
              }}></div>
              <div>
                <div style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: isDarkMode ? '#f5f5f7' : '#1d1d1f',
                  lineHeight: '1.2'
                }}>
                  {selectedAccount.name}
                </div>
                <div style={{
                  fontSize: '13px',
                  opacity: '0.7',
                  color: isDarkMode ? '#f5f5f7' : '#1d1d1f',
                  lineHeight: '1.2'
                }}>
                  {selectedAccount.position}
                </div>
              </div>
            </div>
          ) : (
            <span style={{
              fontSize: '15px',
              opacity: '0.7',
              color: isDarkMode ? '#f5f5f7' : '#1d1d1f'
            }}>
              Seleccionar cuenta
            </span>
          )}
        </div>
        
        <ChevronDown 
          size={16} 
          style={{ 
            opacity: '0.7',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        />
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          marginTop: '8px',
          borderRadius: '18px',
          background: isDarkMode ? 'rgba(44, 44, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          border: isDarkMode ? '0.5px solid rgba(84, 84, 88, 0.4)' : '0.5px solid rgba(0, 0, 0, 0.06)',
          backdropFilter: 'blur(20px)',
          boxShadow: isDarkMode 
            ? '0 10px 40px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)' 
            : '0 10px 40px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05)',
          maxHeight: '320px',
          overflowY: 'auto',
          zIndex: 10000
        }}>
          {accounts.map((account, index) => (
            <div
              key={account.id}
              onClick={(e) => {
                e.stopPropagation();
                handleAccountClick(account);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 18px',
                cursor: 'pointer',
                borderBottom: index < accounts.length - 1 
                  ? (isDarkMode ? '0.5px solid rgba(84, 84, 88, 0.15)' : '0.5px solid rgba(0, 0, 0, 0.04)')
                  : 'none',
                opacity: account.isActive ? 1 : 0.5,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode ? 'rgba(0, 122, 255, 0.15)' : 'rgba(0, 122, 255, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: account.isActive 
                  ? 'linear-gradient(135deg, #30d158 0%, #32d760 100%)' 
                  : 'linear-gradient(135deg, #ff453a 0%, #ff6961 100%)'
              }}></div>
              <div>
                <div style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: isDarkMode ? '#f5f5f7' : '#1d1d1f',
                  lineHeight: '1.2'
                }}>
                  {account.name}
                </div>
                <div style={{
                  fontSize: '13px',
                  opacity: '0.7',
                  color: isDarkMode ? '#f5f5f7' : '#1d1d1f',
                  lineHeight: '1.2'
                }}>
                  {account.position}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountSelector;