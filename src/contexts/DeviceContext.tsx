import { createContext, useState, useEffect, ReactNode } from 'react';

interface Device {
  id: string;
  name: string;
  model: string;
  firmwareVersion: string;
  batteryLevel: number;
  lastConnected: string;
}

interface DeviceContextType {
  device: Device | null;
  deviceStatus: 'connected' | 'disconnected' | 'pairing' | 'error';
  connectToDevice: (deviceId?: string) => Promise<void>;
  disconnectDevice: () => void;
  pairDevice: (deviceId: string) => Promise<void>;
  sendCommand: (command: any) => Promise<void>;
}

export const DeviceContext = createContext<DeviceContextType>({
  device: null,
  deviceStatus: 'disconnected',
  connectToDevice: async () => {},
  disconnectDevice: () => {},
  pairDevice: async () => {},
  sendCommand: async () => {},
});

export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const [device, setDevice] = useState<Device | null>(null);
  const [deviceStatus, setDeviceStatus] = useState<'connected' | 'disconnected' | 'pairing' | 'error'>('disconnected');

  // Mock device data
  const mockDevice: Device = {
    id: 'SH-2025-X1',
    name: 'SpineHealth Pro',
    model: 'X1-2025',
    firmwareVersion: '2.1.0',
    batteryLevel: 87,
    lastConnected: new Date().toISOString(),
  };

  useEffect(() => {
    // Check for previously connected device
    const savedDevice = localStorage.getItem('spinehealth_device');
    
    if (savedDevice) {
      setDevice(JSON.parse(savedDevice));
      setDeviceStatus('connected');
    }
  }, []);

  const connectToDevice = async (deviceId?: string) => {
    try {
      setDeviceStatus('pairing');
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would use Web Bluetooth API or similar
      // to connect to a physical device
      setDevice(mockDevice);
      setDeviceStatus('connected');
      localStorage.setItem('spinehealth_device', JSON.stringify(mockDevice));
    } catch (error) {
      console.error('Device connection error:', error);
      setDeviceStatus('error');
    }
  };

  const disconnectDevice = () => {
    setDevice(null);
    setDeviceStatus('disconnected');
    localStorage.removeItem('spinehealth_device');
  };

  const pairDevice = async (deviceId: string) => {
    try {
      setDeviceStatus('pairing');
      
      // Simulate pairing process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const pairedDevice = { ...mockDevice, id: deviceId };
      setDevice(pairedDevice);
      setDeviceStatus('connected');
      localStorage.setItem('spinehealth_device', JSON.stringify(pairedDevice));
    } catch (error) {
      console.error('Device pairing error:', error);
      setDeviceStatus('error');
      throw new Error('Failed to pair device');
    }
  };

  const sendCommand = async (command: any) => {
    if (deviceStatus !== 'connected') {
      throw new Error('Device not connected');
    }

    try {
      // Simulate sending command to device
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Command sent to device:', command);
      
      // Return mock response
      return { success: true, message: 'Command executed successfully' };
    } catch (error) {
      console.error('Error sending command to device:', error);
      throw new Error('Failed to send command to device');
    }
  };

  return (
    <DeviceContext.Provider 
      value={{ 
        device, 
        deviceStatus, 
        connectToDevice, 
        disconnectDevice, 
        pairDevice, 
        sendCommand 
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};