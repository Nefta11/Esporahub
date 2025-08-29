// Mapeo de nombres de clientes a IDs de cuenta
export const getAccountIdFromClientName = (clientName: string): number | null => {
  // Extraer solo el nombre del cliente (sin la posición)
  const cleanClientName = clientName.split(' - ')[0].trim();
  
  const accountMapping: { [key: string]: number } = {
    'Juan Pérez': 1,
    'María García': 2, 
    'Carlos López': 3,
    'Ana Martínez': 4,
    'Roberto Silva': 5,
    'Laura Hernández': 6
  };
  
  return accountMapping[cleanClientName] || null;
};

// Mapeo inverso de ID de cuenta a nombre de cliente
export const getClientNameFromAccountId = (accountId: number): string | null => {
  const clientMapping: { [key: number]: string } = {
    1: 'Juan Pérez - Alcalde',
    2: 'María García - Gobernadora',
    3: 'Carlos López - Diputado', 
    4: 'Ana Martínez - Senadora',
    5: 'Roberto Silva - Presidente Municipal',
    6: 'Laura Hernández - Diputada Local'
  };
  
  return clientMapping[accountId] || null;
};

// Obtener información completa de la cuenta
export const getAccountInfo = (accountId: number) => {
  const accounts = [
    { id: 1, name: 'Juan Pérez', position: 'Alcalde', color: 'text-blue-500', isActive: true },
    { id: 2, name: 'María García', position: 'Gobernadora', color: 'text-emerald-500', isActive: true },
    { id: 3, name: 'Carlos López', position: 'Diputado', color: 'text-purple-500', isActive: false },
    { id: 4, name: 'Ana Martínez', position: 'Senadora', color: 'text-red-500', isActive: true },
    { id: 5, name: 'Roberto Silva', position: 'Presidente Municipal', color: 'text-yellow-500', isActive: false },
    { id: 6, name: 'Laura Hernández', position: 'Diputada Local', color: 'text-teal-500', isActive: true }
  ];
  
  return accounts.find(account => account.id === accountId) || null;
};