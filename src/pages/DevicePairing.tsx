import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Battery, Bluetooth, CheckCircle, HelpCircle, RefreshCw, WifiOff, X } from 'lucide-react';
import { Button } from '../components/Button';
import { DeviceContext } from '../contexts/DeviceContext';

interface DiscoveredDevice {
  id: string;
  name: string;
  signalStrength: number; // 0-100
}

const DevicePairing = () => {
  const { device, deviceStatus, connectToDevice, disconnectDevice, pairDevice } = useContext(DeviceContext);
  
  const [scanning, setScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<DiscoveredDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [pairingStatus, setPairingStatus] = useState<'idle' | 'pairing' | 'success' | 'failed'>('idle');
  
  const startScan = () => {
    setScanning(true);
    setDiscoveredDevices([]);
    
    // Simulate device discovery
    setTimeout(() => {
      const mockDevices: DiscoveredDevice[] = [
        { id: 'SH-2025-X1', name: 'SpineHealth Pro', signalStrength: 85 },
        { id: 'SH-2024-A2', name: 'SpineHealth Comfort', signalStrength: 68 },
        { id: 'SH-2023-B5', name: 'SpineHealth Basic', signalStrength: 42 }
      ];
      
      setDiscoveredDevices(mockDevices);
      setScanning(false);
    }, 3000);
  };
  
  const stopScan = () => {
    setScanning(false);
  };
  
  const handlePair = async (deviceId: string) => {
    try {
      setPairingStatus('pairing');
      setSelectedDevice(deviceId);
      
      await pairDevice(deviceId);
      
      setPairingStatus('success');
    } catch (error) {
      console.error('Pairing error:', error);
      setPairingStatus('failed');
    }
  };
  
  const handleDisconnect = () => {
    disconnectDevice();
  };
  
  useEffect(() => {
    if (!device) {
      startScan();
    }
  }, []);
  
  const getSignalIcon = (strength: number) => {
    if (strength >= 80) return <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center"><Bluetooth className="h-4 w-4 text-success" /></div>;
    if (strength >= 40) return <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center"><Bluetooth className="h-4 w-4 text-amber-500" /></div>;
    return <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"><Bluetooth className="h-4 w-4 text-gray-400" /></div>;
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Device Management</h1>
      
      {device ? (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Connected Device</h2>
            <span className="px-2 py-1 bg-success/10 text-success text-sm rounded-full flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Connected
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center p-4 border rounded-lg">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{device.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {device.id}</p>
              </div>
            </div>
            
            <div className="md:ml-auto grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mr-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Model</p>
                  <p className="text-sm font-medium">{device.model}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mr-2">
                  <Battery className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Battery</p>
                  <p className={`text-sm font-medium ${device.batteryLevel > 20 ? 'text-success' : 'text-destructive'}`}>
                    {device.batteryLevel}%
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-6">
            <h3 className="font-semibold mb-3">Device Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Firmware Version</p>
                <p>{device.firmwareVersion}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Connected</p>
                <p>{new Date(device.lastConnected).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={handleDisconnect}>
                <WifiOff className="mr-2 h-4 w-4" />
                Disconnect Device
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Available Devices</h2>
            
            {scanning ? (
              <Button variant="outline" size="sm" onClick={stopScan}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={startScan}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Scan for Devices
              </Button>
            )}
          </div>
          
          {scanning ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-muted-foreground">Scanning for nearby devices...</p>
            </div>
          ) : discoveredDevices.length > 0 ? (
            <div className="space-y-3">
              {discoveredDevices.map(discoveredDevice => (
                <motion.div 
                  key={discoveredDevice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border rounded-lg flex justify-between items-center"
                >
                  <div className="flex items-center">
                    {getSignalIcon(discoveredDevice.signalStrength)}
                    <div className="ml-3">
                      <p className="font-medium">{discoveredDevice.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {discoveredDevice.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-xs px-2 py-1 bg-muted rounded-full">
                      Signal: {discoveredDevice.signalStrength}%
                    </div>
                    
                    {pairingStatus === 'pairing' && selectedDevice === discoveredDevice.id ? (
                      <Button size="sm" disabled>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Pairing...
                      </Button>
                    ) : pairingStatus === 'success' && selectedDevice === discoveredDevice.id ? (
                      <Button size="sm" variant="outline" className="text-success" disabled>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Connected
                      </Button>
                    ) : pairingStatus === 'failed' && selectedDevice === discoveredDevice.id ? (
                      <Button size="sm" variant="destructive" onClick={() => handlePair(discoveredDevice.id)}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => handlePair(discoveredDevice.id)}>
                        Connect
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <WifiOff className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-6">No devices found. Make sure your device is turned on and in pairing mode.</p>
              <Button onClick={startScan}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Scan for Devices
              </Button>
            </div>
          )}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Pairing Instructions</h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
              <span className="font-bold">1</span>
            </div>
            <div>
              <p className="font-medium">Turn on your SpineHealth device</p>
              <p className="text-sm text-muted-foreground">Press and hold the power button for 3 seconds until the LED lights up.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
              <span className="font-bold">2</span>
            </div>
            <div>
              <p className="font-medium">Put device in pairing mode</p>
              <p className="text-sm text-muted-foreground">Press the pairing button (small button next to power) until the LED flashes blue.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
              <span className="font-bold">3</span>
            </div>
            <div>
              <p className="font-medium">Scan for devices</p>
              <p className="text-sm text-muted-foreground">Click "Scan for Devices" button above to find your device.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
              <span className="font-bold">4</span>
            </div>
            <div>
              <p className="font-medium">Connect to your device</p>
              <p className="text-sm text-muted-foreground">Select your device from the list and click "Connect".</p>
            </div>
          </div>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="flex items-start">
            <HelpCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Need help?</p>
              <p className="text-sm text-muted-foreground mb-2">
                If you're having trouble connecting your device, try these troubleshooting steps:
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Ensure your device battery is charged</li>
                <li>Move closer to your device</li>
                <li>Restart your device by turning it off and on</li>
                <li>Refresh the browser and try connecting again</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevicePairing;