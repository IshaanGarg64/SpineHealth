import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Award, ChevronLeft, ChevronRight, Info, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DeviceContext } from '../contexts/DeviceContext';
import { Button } from '../components/Button';
import { Slider } from '../components/Slider';
import { Switch } from '../components/Switch';
import { formatTime } from '../lib/utils';

interface PressureSetting {
  upperSpine: number;
  midSpine: number;
  lowerSpine: number;
  leftShoulder: number;
  rightShoulder: number;
  pelvis: number;
}

interface TreatmentPreset {
  id: string;
  name: string;
  mode: 'remedy' | 'comfort';
  settings: Partial<PressureSetting>;
  description: string;
  duration: number;
}

const TreatmentControl = () => {
  const { device, deviceStatus, connectToDevice, sendCommand } = useContext(DeviceContext);
  
  // Treatment mode - either "remedy" or "comfort"
  const [mode, setMode] = useState<'remedy' | 'comfort'>('remedy');
  
  // Body areas and their pressure levels (0-100)
  const [pressureSettings, setPressureSettings] = useState<PressureSetting>({
    upperSpine: 50,
    midSpine: 50,
    lowerSpine: 50,
    leftShoulder: 50,
    rightShoulder: 50,
    pelvis: 50,
  });
  
  // Selected treatment areas
  const [selectedAreas, setSelectedAreas] = useState<(keyof PressureSetting)[]>([]);
  
  // Treatment session status
  const [isActive, setIsActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(20); // minutes
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timer | null>(null);
  
  // Treatment presets
  const [presets, setPresets] = useState<TreatmentPreset[]>([
    {
      id: '1',
      name: 'Full Spine Alignment',
      mode: 'remedy',
      settings: {
        upperSpine: 60,
        midSpine: 65,
        lowerSpine: 70,
        pelvis: 55
      },
      description: 'Targets the full spine from top to bottom for comprehensive alignment',
      duration: 20
    },
    {
      id: '2',
      name: 'Lower Back Relief',
      mode: 'remedy',
      settings: {
        lowerSpine: 75,
        pelvis: 65
      },
      description: 'Focused pressure on lower spine and pelvis to relieve back pain',
      duration: 15
    },
    {
      id: '3',
      name: 'Neck & Shoulder Relief',
      mode: 'remedy',
      settings: {
        upperSpine: 70,
        leftShoulder: 60,
        rightShoulder: 60
      },
      description: 'Targets upper spine and shoulders to alleviate tension',
      duration: 15
    },
    {
      id: '4',
      name: 'Relaxation Program',
      mode: 'comfort',
      settings: {
        upperSpine: 40,
        midSpine: 45,
        lowerSpine: 50,
        leftShoulder: 35,
        rightShoulder: 35
      },
      description: 'Gentle whole-body massage program for stress relief',
      duration: 30
    },
    {
      id: '5',
      name: 'Deep Tissue',
      mode: 'comfort',
      settings: {
        midSpine: 65,
        lowerSpine: 70
      },
      description: 'Deeper pressure for mid and lower back muscle tension',
      duration: 20
    }
  ]);
  
  // Filtering presets based on selected mode
  const filteredPresets = presets.filter(preset => preset.mode === mode);
  
  // Mock diagnostic data
  const diagnosticData = {
    recommendedPressure: {
      upperSpine: 60,
      midSpine: 65,
      lowerSpine: 70,
      pelvis: 55
    }
  };
  
  useEffect(() => {
    // Initialize pressure settings based on diagnostic data if in remedy mode
    if (mode === 'remedy' && diagnosticData && diagnosticData.recommendedPressure) {
      setPressureSettings({
        ...pressureSettings,
        ...diagnosticData.recommendedPressure
      });
      
      setSelectedAreas(Object.keys(diagnosticData.recommendedPressure) as (keyof PressureSetting)[]);
    } else if (mode === 'comfort') {
      // Reset selections for comfort mode
      if (selectedAreas.length === 0) {
        setSelectedAreas(['upperSpine', 'midSpine', 'lowerSpine']);
      }
    }
    
    // Check device connection
    if (deviceStatus !== 'connected') {
      connectToDevice();
    }
    
    // Clean up timer on unmount
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      // Stop any active treatment when leaving screen
      if (isActive) {
        handleStopTreatment();
      }
    };
  }, [mode]);
  
  const handleStartTreatment = async () => {
    if (deviceStatus !== 'connected') {
      alert('Please ensure your device is connected before starting treatment.');
      return;
    }
    
    try {
      // Send command to start treatment with current settings
      await sendCommand({
        action: 'startTreatment',
        mode,
        pressureSettings: selectedAreas.reduce((settings, area) => {
          settings[area] = pressureSettings[area];
          return settings;
        }, {} as Partial<PressureSetting>),
        duration: sessionDuration
      });
      
      setIsActive(true);
      
      // Start timer
      const interval = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          if (newTime >= sessionDuration * 60) {
            handleStopTreatment();
            return 0;
          }
          return newTime;
        });
      }, 1000);
      
      setTimerInterval(interval);
      
    } catch (error) {
      alert('Failed to start treatment. Please try again.');
      console.error('Treatment start error:', error);
    }
  };
  
  const handleStopTreatment = async () => {
    try {
      // Send command to stop treatment
      await sendCommand({ action: 'stopTreatment' });
      
      // Clear timer
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      
      // Save treatment session data
      if (elapsedTime > 60) { // Only save if session lasted more than a minute
        // In a real app, you would save this to a database
        console.log('Treatment session completed', {
          mode,
          pressureSettings: selectedAreas.reduce((settings, area) => {
            settings[area] = pressureSettings[area];
            return settings;
          }, {} as Partial<PressureSetting>),
          duration: elapsedTime,
          timestamp: new Date().toISOString()
        });
      }
      
      setIsActive(false);
      setElapsedTime(0);
      
    } catch (error) {
      alert('Failed to stop treatment properly. Please restart your device.');
      console.error('Treatment stop error:', error);
    }
  };
  
  const handleAreaSelection = (area: keyof PressureSetting) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter(a => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };
  
  const handlePressureChange = (area: keyof PressureSetting, value: number[]) => {
    setPressureSettings({
      ...pressureSettings,
      [area]: value[0]
    });
    
    // If treatment is active, send updates to device in real-time
    if (isActive) {
      sendCommand({
        action: 'adjustPressure',
        area,
        value: value[0]
      });
    }
  };
  
  const loadPreset = (preset: TreatmentPreset) => {
    const newSettings = { ...pressureSettings, ...preset.settings };
    setPressureSettings(newSettings);
    setSelectedAreas(Object.keys(preset.settings) as (keyof PressureSetting)[]);
    setSessionDuration(preset.duration);
  };
  
  const handleDurationChange = (change: number) => {
    const newDuration = Math.max(5, Math.min(60, sessionDuration + change));
    setSessionDuration(newDuration);
  };
  
  // Format display name for body areas
  const formatAreaName = (area: string) => {
    return area
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Treatment Control</h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
              deviceStatus === 'connected' ? 'bg-success' : 'bg-warning'
            }`}></span>
            <span>{deviceStatus === 'connected' ? 'Device Connected' : 'Device Disconnected'}</span>
          </div>
          
          {deviceStatus !== 'connected' && (
            <Button size="sm" onClick={connectToDevice}>
              Connect
            </Button>
          )}
          
          <Link to="/analytics">
            <Button variant="outline" size="sm">
              <Award className="mr-2 h-4 w-4" />
              View Progress
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Mode selector */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Treatment Mode</h2>
        
        <div className="flex justify-center items-center space-x-6">
          <div className={`px-6 py-4 rounded-lg flex flex-col items-center cursor-pointer transition-colors ${
            mode === 'remedy' ? 'bg-primary/10 border-2 border-primary' : 'bg-muted hover:bg-muted/80'
          }`} onClick={() => !isActive && setMode('remedy')}>
            <Activity 
              size={32} 
              className={mode === 'remedy' ? 'text-primary' : 'text-muted-foreground'} 
            />
            <span className={`mt-2 font-medium ${mode === 'remedy' ? 'text-primary' : 'text-muted-foreground'}`}>
              Remedy
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Medical treatment based on diagnosis
            </span>
          </div>
          
          <div className={`px-6 py-4 rounded-lg flex flex-col items-center cursor-pointer transition-colors ${
            mode === 'comfort' ? 'bg-accent/10 border-2 border-accent' : 'bg-muted hover:bg-muted/80'
          }`} onClick={() => !isActive && setMode('comfort')}>
            <Star 
              size={32} 
              className={mode === 'comfort' ? 'text-accent' : 'text-muted-foreground'} 
            />
            <span className={`mt-2 font-medium ${mode === 'comfort' ? 'text-accent' : 'text-muted-foreground'}`}>
              Comfort
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Relaxation and comfort massage
            </span>
          </div>
        </div>
        
        {mode === 'remedy' && (
          <div className="mt-4 flex items-start p-3 bg-primary/5 rounded-md text-sm">
            <Info className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
            <p>Remedy mode uses personalized settings based on your diagnostic scan results for optimal spine correction.</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Body map visualization */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Treatment Areas</h2>
          
          <div className="relative mx-auto w-56 h-80 bg-muted/30 rounded-lg">
            {/* Body outline - in real app you would use a proper SVG */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <svg viewBox="0 0 50 100" width="160" height="280">
                <path d="M25,10 C35,10 35,15 35,20 C35,25 30,30 30,35 C30,45 35,55 35,65 C35,75 30,80 25,90 C20,80 15,75 15,65 C15,55 20,45 20,35 C20,30 15,25 15,20 C15,15 15,10 25,10 Z" 
                  fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
            
            {/* Interactive pressure points */}
            <motion.div
              className={`absolute w-12 h-12 -ml-6 -mt-6 cursor-pointer rounded-full flex items-center justify-center
                ${selectedAreas.includes('upperSpine') ? 'bg-primary/20 border-2 border-primary' : 'bg-muted hover:bg-muted/80'}`}
              style={{ left: '50%', top: '20%' }}
              whileHover={{ scale: 1.1 }}
              onClick={() => !isActive && handleAreaSelection('upperSpine')}
            >
              <span className="text-xs font-medium">Upper<br />Spine</span>
            </motion.div>
            
            <motion.div
              className={`absolute w-12 h-12 -ml-6 -mt-6 cursor-pointer rounded-full flex items-center justify-center
                ${selectedAreas.includes('midSpine') ? 'bg-primary/20 border-2 border-primary' : 'bg-muted hover:bg-muted/80'}`}
              style={{ left: '50%', top: '40%' }}
              whileHover={{ scale: 1.1 }}
              onClick={() => !isActive && handleAreaSelection('midSpine')}
            >
              <span className="text-xs font-medium">Mid<br />Spine</span>
            </motion.div>
            
            <motion.div
              className={`absolute w-12 h-12 -ml-6 -mt-6 cursor-pointer rounded-full flex items-center justify-center
                ${selectedAreas.includes('lowerSpine') ? 'bg-primary/20 border-2 border-primary' : 'bg-muted hover:bg-muted/80'}`}
              style={{ left: '50%', top: '60%' }}
              whileHover={{ scale: 1.1 }}
              onClick={() => !isActive && handleAreaSelection('lowerSpine')}
            >
              <span className="text-xs font-medium">Lower<br />Spine</span>
            </motion.div>
            
            <motion.div
              className={`absolute w-12 h-12 -ml-6 -mt-6 cursor-pointer rounded-full flex items-center justify-center
                ${selectedAreas.includes('leftShoulder') ? 'bg-primary/20 border-2 border-primary' : 'bg-muted hover:bg-muted/80'}`}
              style={{ left: '30%', top: '25%' }}
              whileHover={{ scale: 1.1 }}
              onClick={() => !isActive && handleAreaSelection('leftShoulder')}
            >
              <span className="text-xs font-medium">Left<br />Shoulder</span>
            </motion.div>
            
            <motion.div
              className={`absolute w-12 h-12 -ml-6 -mt-6 cursor-pointer rounded-full flex items-center justify-center
                ${selectedAreas.includes('rightShoulder') ? 'bg-primary/20 border-2 border-primary' : 'bg-muted hover:bg-muted/80'}`}
              style={{ left: '70%', top: '25%' }}
              whileHover={{ scale: 1.1 }}
              onClick={() => !isActive && handleAreaSelection('rightShoulder')}
            >
              <span className="text-xs font-medium">Right<br />Shoulder</span>
            </motion.div>
            
            <motion.div
              className={`absolute w-12 h-12 -ml-6 -mt-6 cursor-pointer rounded-full flex items-center justify-center
                ${selectedAreas.includes('pelvis') ? 'bg-primary/20 border-2 border-primary' : 'bg-muted hover:bg-muted/80'}`}
              style={{ left: '50%', top: '80%' }}
              whileHover={{ scale: 1.1 }}
              onClick={() => !isActive && handleAreaSelection('pelvis')}
            >
              <span className="text-xs font-medium">Pelvis</span>
            </motion.div>
          </div>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {selectedAreas.length === 0 ? (
              <p>Select treatment areas on the body map</p>
            ) : (
              <p>{selectedAreas.length} areas selected</p>
            )}
          </div>
        </div>
        
        {/* Treatment presets */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Treatment Presets</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredPresets.map(preset => (
              <motion.div
                key={preset.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedAreas.length > 0 && 
                  Object.keys(preset.settings).every(setting => 
                    selectedAreas.includes(setting as keyof PressureSetting) &&
                    pressureSettings[setting as keyof PressureSetting] === preset.settings[setting as keyof PressureSetting]
                  )
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/30'
                }`}
                onClick={() => !isActive && loadPreset(preset)}
              >
                <h3 className="font-medium">{preset.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-muted-foreground">Duration: {preset.duration} min</span>
                  <span className="text-muted-foreground">
                    {Object.keys(preset.settings).length} areas
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Pressure Settings</h2>
            
            {selectedAreas.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>Please select treatment areas first</p>
              </div>
            ) : (
              <div className="space-y-6">
                {selectedAreas.map(area => (
                  <div key={area} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">
                        {formatAreaName(area)}
                      </label>
                      <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {pressureSettings[area]}%
                      </span>
                    </div>
                    <Slider
                      value={[pressureSettings[area]]}
                      min={0}
                      max={100}
                      step={1}
                      disabled={isActive && mode === 'remedy'}
                      onValueChange={(value) => handlePressureChange(area, value)}
                    />
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Session Duration</h2>
              
              <div className="flex items-center justify-center space-x-6">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleDurationChange(-5)}
                  disabled={sessionDuration <= 5 || isActive}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="text-center">
                  <div className="text-3xl font-bold">{sessionDuration}</div>
                  <div className="text-sm text-muted-foreground">minutes</div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleDurationChange(5)}
                  disabled={sessionDuration >= 60 || isActive}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Treatment control panel */}
      <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
        {isActive && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Treatment in Progress</h3>
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">Session Time:</span>
              <span className="font-medium">{formatTime(elapsedTime)} / {formatTime(sessionDuration * 60)}</span>
            </div>
            
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${(elapsedTime / (sessionDuration * 60)) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${deviceStatus === 'connected' ? 'bg-success animate-pulse-slow' : 'bg-destructive'}`}></span>
            <span className="text-sm">{deviceStatus === 'connected' ? `${device?.name || 'Device'} connected` : 'No device connected'}</span>
          </div>
          
          <Button
            size="lg"
            variant={isActive ? "destructive" : "default"}
            onClick={isActive ? handleStopTreatment : handleStartTreatment}
            disabled={deviceStatus !== 'connected' || selectedAreas.length === 0}
          >
            {isActive ? 'STOP TREATMENT' : 'START TREATMENT'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TreatmentControl;