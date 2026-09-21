import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import {
  db,
  hydrateClientReplica,
  enqueueMutation,
  getPendingMutationCount,
  getPendingMutations,
} from '../services/indexedDBStore';

const OperationalStateContext = createContext(null);

export function OperationalStateProvider({ children }) {
  const [isOnline, setIsConnected] = useState(navigator.onLine);
  const [isCheckingHealth, setIsChecking] = useState(true);
  const [hasLocalData, setHasLocalData] = useState(false);
  const [pendingQueueCount, setPendingQueueCount] = useState(0);

  const [missions, setMissions] = useState([]);
  const [cargoList, setCargoList] = useState([]);
  const [impactSet, setImpactSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load state from local IndexedDB client replica
  const loadFromIndexedDB = useCallback(async () => {
    try {
      const localMissions = await db.missions.toArray();
      const localCargo = await db.cargo.toArray();
      const queueCount = await getPendingMutationCount();

      setMissions(localMissions);
      setCargoList(localCargo);
      setPendingQueueCount(queueCount);
      setHasLocalData(localMissions.length > 0 || localCargo.length > 0);
      return { localMissions, localCargo, queueCount };
    } catch (err) {
      console.error('Error loading from IndexedDB replica:', err);
      return { localMissions: [], localCargo: [], queueCount: 0 };
    }
  }, []);

  // Main data sync & hydration lifecycle
  const syncOperationalState = useCallback(async () => {
    setIsChecking(true);
    try {
      await api.getHealth();
      setIsConnected(true);

      const queueCount = await getPendingMutationCount();
      setPendingQueueCount(queueCount);

      // Hydrate from backend ONLY if no pending unsynced offline mutations exist
      if (queueCount === 0) {
        const [backendMissions, backendCargo] = await Promise.all([
          api.getMissions(),
          api.getCargoList(),
        ]);

        await hydrateClientReplica({
          missions: backendMissions,
          cargoList: backendCargo,
        });

        setMissions(backendMissions);
        setCargoList(backendCargo);
        setHasLocalData(true);
      } else {
        // If pending mutations exist, load local replica state to preserve queued changes
        await loadFromIndexedDB();
      }

      setError(null);
    } catch (err) {
      console.warn('Backend API unreachable. Falling back to local IndexedDB replica:', err);
      setIsConnected(false);

      const { localMissions, localCargo } = await loadFromIndexedDB();
      if (localMissions.length === 0 && localCargo.length === 0) {
        setError('Backend API unreachable and no local replica available.');
      } else {
        setError(null);
      }
    } finally {
      setIsChecking(false);
      setLoading(false);
    }
  }, [loadFromIndexedDB]);

  useEffect(() => {
    syncOperationalState();

    const handleOnline = () => syncOperationalState();
    const handleOffline = () => {
      setIsConnected(false);
      loadFromIndexedDB();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncOperationalState, loadFromIndexedDB]);

  // Supported Offline Mutation: Update Cargo Delay & Status
  const updateCargoStatusOffline = async (cargoId, updatePayload) => {
    // 1. Update local IndexedDB cargo record
    await db.cargo.update(cargoId, updatePayload);

    // 2. Append to IndexedDB mutation queue
    await enqueueMutation({
      entity_type: 'CARGO',
      entity_id: cargoId,
      action: 'UPDATE',
      payload: updatePayload,
    });

    // 3. Update React UI state & pending queue count
    const updatedList = await db.cargo.toArray();
    const queueCount = await getPendingMutationCount();

    setCargoList(updatedList);
    setPendingQueueCount(queueCount);

    // If online, try updating backend directly as well
    if (isOnline) {
      try {
        await api.updateCargo(cargoId, updatePayload);
      } catch (e) {
        console.warn('Backend update failed, queued locally in IndexedDB.', e);
      }
    }
  };

  // Supported Offline Mutation: Create New Mission
  const createMissionOffline = async (missionPayload) => {
    const id = missionPayload.id || `mission_local_${Date.now()}`;
    const newMission = {
      ...missionPayload,
      id,
      created_at: new Date().toISOString(),
    };

    // 1. Write to local IndexedDB
    await db.missions.add(newMission);

    // 2. Queue mutation
    await enqueueMutation({
      entity_type: 'MISSION',
      entity_id: id,
      action: 'CREATE',
      payload: newMission,
    });

    // 3. Update UI state
    const updatedMissions = await db.missions.toArray();
    const queueCount = await getPendingMutationCount();

    setMissions(updatedMissions);
    setPendingQueueCount(queueCount);

    if (isOnline) {
      try {
        await api.createMission(missionPayload);
      } catch (e) {
        console.warn('Backend mission creation failed, queued locally.', e);
      }
    }
    return newMission;
  };

  // Disruption simulation (online API call)
  const simulateDisruption = async (disruptionPayload) => {
    if (!isOnline) {
      throw new Error('Deterministic graph impact analysis requires backend core connectivity.');
    }
    const result = await api.simulateDisruption(disruptionPayload);
    setImpactSet(result);

    // Update cargo list
    const updatedCargo = await api.getCargoList();
    setCargoList(updatedCargo);
    await hydrateClientReplica({ cargoList: updatedCargo });
    return result;
  };

  const resetSystemState = async () => {
    if (isOnline) {
      await api.resetSystem();
      await db.mutation_queue.clear();
      await syncOperationalState();
      setImpactSet(null);
    }
  };

  return (
    <OperationalStateContext.Provider
      value={{
        isOnline,
        isCheckingHealth,
        hasLocalData,
        pendingQueueCount,
        missions,
        cargoList,
        impactSet,
        loading,
        error,
        updateCargoStatusOffline,
        createMissionOffline,
        simulateDisruption,
        resetSystemState,
        reloadState: syncOperationalState,
      }}
    >
      {children}
    </OperationalStateContext.Provider>
  );
}

export function useOperationalState() {
  const context = useContext(OperationalStateContext);
  if (!context) {
    throw new Error('useOperationalState must be used within OperationalStateProvider');
  }
  return context;
}
