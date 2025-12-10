import { useState, useEffect, useCallback } from 'react';
import ClientService from '../services/clientService';

/**
 * Hook personnalisé pour gérer les clients
 */
export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Charger les clients
   */
  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await ClientService.getUserClients();
      
      if (result.success) {
        const clientsData = result.clients || [];
        setClients(clientsData);
        
        // Calculer les statistiques
        const calculatedStats = ClientService.calculateClientStats(clientsData);
        setStats(calculatedStats);
      } else {
        setError(result.error);
        setClients([]);
        setStats(null);
      }
    } catch (err) {
      console.error('Erreur dans useClients:', err);
      setError('Une erreur inattendue est survenue');
      setClients([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Rafraîchir les données
   */
  const refreshClients = useCallback(async () => {
    setRefreshing(true);
    await loadClients();
    setRefreshing(false);
  }, [loadClients]);

  /**
   * Ajouter un client
   */
  const addClient = useCallback(async (clientData) => {
    const result = await ClientService.addClient(clientData);
    
    if (result.success) {
      await loadClients();
    }
    
    return result;
  }, [loadClients]);

  /**
   * Mettre à jour un client
   */
  const updateClient = useCallback(async (clientId, updates) => {
    const result = await ClientService.updateClient(clientId, updates);
    
    if (result.success) {
      await loadClients();
    }
    
    return result;
  }, [loadClients]);

  /**
   * Supprimer un client
   */
  const deleteClient = useCallback(async (clientId) => {
    const result = await ClientService.deleteClient(clientId);
    
    if (result.success) {
      await loadClients();
    }
    
    return result;
  }, [loadClients]);

  /**
   * Charger au montage
   */
  useEffect(() => {
    loadClients();
  }, [loadClients]);

  return {
    clients,
    stats,
    loading,
    refreshing,
    error,
    addClient,
    updateClient,
    deleteClient,
    refreshClients,
    loadClients,
  };
};

export default useClients;


