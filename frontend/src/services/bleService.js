// Web Bluetooth API Service Interface for browser GATT connectivity

export const bleService = {
  isSupported: () => typeof navigator !== 'undefined' && 'bluetooth' in navigator,

  requestDevice: async () => {
    if (!bleService.isSupported()) {
      throw new Error('Web Bluetooth API is not supported in this browser.');
    }

    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'AURORA_' }],
      optionalServices: ['0000180d-0000-1000-8000-00805f9b34fb'],
    });

    return device;
  },

  connectAndSendSync: async (device, syncPayload) => {
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('0000180d-0000-1000-8000-00805f9b34fb');
    const characteristic = await service.getCharacteristic('00002a37-0000-1000-8000-00805f9b34fb');

    // Send 512-byte payload chunks
    const encoder = new TextEncoder();
    const jsonBytes = encoder.encode(JSON.stringify(syncPayload));

    await characteristic.writeValue(jsonBytes);
    server.disconnect();
    return true;
  },
};
