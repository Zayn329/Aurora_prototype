import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { db, getOrCreateDeviceId, getPendingMutations } from '../services/indexedDBStore';
import { useOperationalState } from './OperationalStateContext';

const SyncContext = createContext(null);

export function SyncProvider({ children }) {
  const { isOnline, reloadState } = useOperationalState();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  const flushMutationQueue = async () => {
    if (!isOnline || isSyncing) return;

    try {
      const pendingMutations = await getPendingMutations();
      if (pendingMutations.length === 0) return;

      setIsSyncing(true);
      const deviceId = getOrCreateDeviceId();

      const pushPayload = {
        device_id: deviceId,
        operations: pendingMutations.map((m) => ({
          op_id: m.op_id,
          device_id: m.device_id,
          device_seq_num: 1,
          timestamp_utc: m.timestamp_utc,
          entity_type: m.entity_type,
          entity_id: m.entity_id,
          action: m.action,
          payload: m.payload,
          field_revisions: {},
        })),
      };

      const syncResult = await api.pushSyncOperations(pushPayload);

      // Mark processed operations as synced in local IndexedDB
      if (syncResult.processed_op_ids && syncResult.processed_op_ids.length > 0) {
        await db.transaction('rw', db.mutation_queue, async () => {
          for (const opId of syncResult.processed_op_ids) {
            await db.mutation_queue.where('op_id').equals(opId).modify({ synced: true });
          }
        });
      }

      setLastSyncTime(new Date().toISOString());
      // Re-hydrate local state replica with fresh master state
      await reloadState();
    } catch (err) {
      console.error('Error during background mutation sync flush:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isOnline) {
      flushMutationQueue();
    }
  }, [isOnline]);

  return (
    <SyncContext.Provider
      value={{
        isSyncing,
        lastSyncTime,
        flushMutationQueue,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within SyncProvider');
  }
  return context;
}
