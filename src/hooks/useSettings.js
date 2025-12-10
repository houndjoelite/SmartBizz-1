import { useState, useEffect, useCallback } from 'react';
import SettingsService from '../services/settingsService';

/**
 * Hook personnalisé pour gérer les paramètres
 */
export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [devices, setDevices] = useState([]);
  const [accountStats, setAccountStats] = useState(null);
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Charger les paramètres
   */
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await SettingsService.getUserSettings();
      
      if (result.success) {
        setSettings(result.settings);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Erreur dans useSettings:', err);
      setError('Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Charger les notifications
   */
  const loadNotifications = useCallback(async () => {
    const result = await SettingsService.getNotifications();
    if (result.success) {
      setNotifications(result.notifications);
    }
  }, []);

  /**
   * Charger les appareils
   */
  const loadDevices = useCallback(async () => {
    const result = await SettingsService.getConnectedDevices();
    if (result.success) {
      setDevices(result.devices);
    }
  }, []);

  /**
   * Charger les statistiques
   */
  const loadAccountStats = useCallback(async () => {
    const result = await SettingsService.getAccountStats();
    if (result.success) {
      setAccountStats(result.stats);
    }
  }, []);

  /**
   * Charger les sauvegardes
   */
  const loadBackups = useCallback(async () => {
    const result = await SettingsService.getBackups();
    if (result.success) {
      setBackups(result.backups);
    }
  }, []);

  /**
   * Rafraîchir toutes les données
   */
  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      loadSettings(),
      loadNotifications(),
      loadDevices(),
      loadAccountStats(),
      loadBackups(),
    ]);
    setRefreshing(false);
  }, [loadSettings, loadNotifications, loadDevices, loadAccountStats, loadBackups]);

  /**
   * Mettre à jour les paramètres
   */
  const updateSettings = useCallback(async (updates) => {
    const result = await SettingsService.updateSettings(updates);
    
    if (result.success) {
      await loadSettings();
    }
    
    return result;
  }, [loadSettings]);

  /**
   * Marquer notification comme lue
   */
  const markNotificationAsRead = useCallback(async (notificationId) => {
    const result = await SettingsService.markNotificationAsRead(notificationId);
    
    if (result.success) {
      await loadNotifications();
    }
    
    return result;
  }, [loadNotifications]);

  /**
   * Supprimer notification
   */
  const deleteNotification = useCallback(async (notificationId) => {
    const result = await SettingsService.deleteNotification(notificationId);
    
    if (result.success) {
      await loadNotifications();
    }
    
    return result;
  }, [loadNotifications]);

  /**
   * Déconnecter appareil
   */
  const disconnectDevice = useCallback(async (deviceId) => {
    const result = await SettingsService.disconnectDevice(deviceId);
    
    if (result.success) {
      await loadDevices();
    }
    
    return result;
  }, [loadDevices]);

  /**
   * Créer sauvegarde
   */
  const createBackup = useCallback(async () => {
    const result = await SettingsService.createBackup();
    
    if (result.success) {
      await loadBackups();
      await loadSettings(); // Pour mettre à jour lastBackup
    }
    
    return result;
  }, [loadBackups, loadSettings]);

  /**
   * Upload logo
   */
  const uploadLogo = useCallback(async (imageUri) => {
    const result = await SettingsService.uploadLogo(imageUri);
    
    if (result.success) {
      await loadSettings();
    }
    
    return result;
  }, [loadSettings]);

  /**
   * Charger au montage
   */
  useEffect(() => {
    loadSettings();
    loadNotifications();
    loadAccountStats();
  }, [loadSettings, loadNotifications, loadAccountStats]);

  return {
    // Données
    settings,
    notifications,
    devices,
    accountStats,
    backups,
    
    // États
    loading,
    refreshing,
    error,
    
    // Actions
    updateSettings,
    uploadLogo,
    markNotificationAsRead,
    deleteNotification,
    disconnectDevice,
    createBackup,
    loadDevices,
    loadBackups,
    refreshAll,
  };
};

export default useSettings;


