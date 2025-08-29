import { storage } from '@/utils/storage';

// Servicio para manejar almacenamiento específico por cuenta
export class AccountStorageService {
  
  // Obtener clave de almacenamiento específica para una cuenta
  private static getAccountKey(baseKey: string, accountId: number): string {
    return `${baseKey}-account-${accountId}`;
  }

  // Obtener datos específicos de una cuenta
  static getAccountData<T>(baseKey: string, accountId: number): T | null {
    try {
      const accountKey = this.getAccountKey(baseKey, accountId);
      return storage.getItem<T>(accountKey);
    } catch (error) {
      console.error(`Error getting account data for key ${baseKey}, account ${accountId}:`, error);
      return null;
    }
  }

  // Guardar datos específicos de una cuenta
  static setAccountData<T>(baseKey: string, accountId: number, data: T): void {
    try {
      const accountKey = this.getAccountKey(baseKey, accountId);
      storage.setItem(accountKey, data);
    } catch (error) {
      console.error(`Error setting account data for key ${baseKey}, account ${accountId}:`, error);
    }
  }

  // Eliminar datos específicos de una cuenta
  static removeAccountData(baseKey: string, accountId: number): void {
    try {
      const accountKey = this.getAccountKey(baseKey, accountId);
      storage.removeItem(accountKey);
    } catch (error) {
      console.error(`Error removing account data for key ${baseKey}, account ${accountId}:`, error);
    }
  }

  // Obtener todas las cuentas que tienen datos para una clave base
  static getAccountsWithData(baseKey: string): number[] {
    try {
      const allKeys = storage.getAllKeys();
      const accountIds: number[] = [];
      const prefix = `${baseKey}-account-`;
      
      allKeys.forEach(key => {
        if (key.startsWith(prefix)) {
          const accountIdStr = key.replace(prefix, '');
          const accountId = parseInt(accountIdStr, 10);
          if (!isNaN(accountId)) {
            accountIds.push(accountId);
          }
        }
      });
      
      return accountIds.sort((a, b) => a - b);
    } catch (error) {
      console.error(`Error getting accounts with data for key ${baseKey}:`, error);
      return [];
    }
  }

  // Claves específicas para el sistema EHO
  static readonly KEYS = {
    SELECTED_ITEMS: 'selectedItems',
    FORM_DATA: 'formData',
    COMPLETED_ITEMS: 'completedItems',
    FIELD_VALUES: 'fieldValues',
    TASK_ASSIGNMENTS: 'taskAssignments',
    DUE_DATES: 'dueDates'
  } as const;
}

// Hook personalizado para usar el storage por cuenta
export const useAccountStorage = (accountId: number | null) => {
  const getSelectedItems = () => {
    if (!accountId) return {};
    return AccountStorageService.getAccountData<{ [key: string]: boolean }>(
      AccountStorageService.KEYS.SELECTED_ITEMS, 
      accountId
    ) || {};
  };

  const setSelectedItems = (items: { [key: string]: boolean }) => {
    if (!accountId) return;
    AccountStorageService.setAccountData(
      AccountStorageService.KEYS.SELECTED_ITEMS, 
      accountId, 
      items
    );
  };

  const getFormData = () => {
    if (!accountId) return null;
    return AccountStorageService.getAccountData<{ [key: string]: any[] }>(
      AccountStorageService.KEYS.FORM_DATA, 
      accountId
    );
  };

  const setFormData = (data: { [key: string]: any[] }) => {
    if (!accountId) return;
    AccountStorageService.setAccountData(
      AccountStorageService.KEYS.FORM_DATA, 
      accountId, 
      data
    );
  };

  const getCompletedItems = () => {
    if (!accountId) return {};
    return AccountStorageService.getAccountData<{ [key: string]: boolean }>(
      AccountStorageService.KEYS.COMPLETED_ITEMS, 
      accountId
    ) || {};
  };

  const setCompletedItems = (items: { [key: string]: boolean }) => {
    if (!accountId) return;
    AccountStorageService.setAccountData(
      AccountStorageService.KEYS.COMPLETED_ITEMS, 
      accountId, 
      items
    );
  };

  const getFieldValues = () => {
    if (!accountId) return {};
    return AccountStorageService.getAccountData<{ [key: string]: string }>(
      AccountStorageService.KEYS.FIELD_VALUES, 
      accountId
    ) || {};
  };

  const setFieldValues = (values: { [key: string]: string }) => {
    if (!accountId) return;
    AccountStorageService.setAccountData(
      AccountStorageService.KEYS.FIELD_VALUES, 
      accountId, 
      values
    );
  };

  return {
    getSelectedItems,
    setSelectedItems,
    getFormData,
    setFormData,
    getCompletedItems,
    setCompletedItems,
    getFieldValues,
    setFieldValues
  };
};

export default AccountStorageService;