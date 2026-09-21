import Dexie from 'dexie';

// Initialize Dexie IndexedDB client replica store
export const db = new Dexie('AuroraClientReplica');

db.version(1).stores({
  stations: 'id, name',
  missions: 'id, title, priority, status, station_id',
  cargo: 'id, item_name, category, status, priority_class',
  assets: 'id, name, category, status',
  personnel: 'id, name, role, station_id',
  mutation_queue: '++id, op_id, device_id, entity_type, entity_id, synced',
});

// Device GUID persistence for sync sequencing
export function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem('aurora_device_id');
  if (!deviceId) {
    deviceId = `device_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
    localStorage.setItem('aurora_device_id', deviceId);
  }
  return deviceId;
}

// Hydrate IndexedDB with backend authoritative state when online
export async function hydrateClientReplica({ stations = [], missions = [], cargoList = [], assets = [], personnel = [] }) {
  await db.transaction('rw', [db.stations, db.missions, db.cargo, db.assets, db.personnel], async () => {
    if (stations.length > 0) {
      await db.stations.clear();
      await db.stations.bulkAdd(stations);
    }
    if (missions.length > 0) {
      await db.missions.clear();
      await db.missions.bulkAdd(missions);
    }
    if (cargoList.length > 0) {
      await db.cargo.clear();
      await db.cargo.bulkAdd(cargoList);
    }
    if (assets.length > 0) {
      await db.assets.clear();
      await db.assets.bulkAdd(assets);
    }
    if (personnel.length > 0) {
      await db.personnel.clear();
      await db.personnel.bulkAdd(personnel);
    }
  });
}

// Append mutation to local IndexedDB queue
export async function enqueueMutation({ entity_type, entity_id, action, payload }) {
  const device_id = getOrCreateDeviceId();
  const op_id = `op_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp_utc = new Date().toISOString();

  const changeRecord = {
    op_id,
    device_id,
    timestamp_utc,
    entity_type,
    entity_id,
    action, // "UPDATE", "CREATE", "DELETE"
    payload,
    synced: 0, // Integer flag 0 = unsynced, 1 = synced
    created_at: Date.now(),
  };

  await db.mutation_queue.add(changeRecord);
  return changeRecord;
}

// Get pending offline mutation count
export async function getPendingMutationCount() {
  const allMutations = await db.mutation_queue.toArray();
  return allMutations.filter((m) => m.synced === 0 || m.synced === false).length;
}

// Read pending queued mutations
export async function getPendingMutations() {
  const allMutations = await db.mutation_queue.toArray();
  return allMutations.filter((m) => m.synced === 0 || m.synced === false);
}
