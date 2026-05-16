import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, CheckCircle, HelpCircle, Loader2, Waves, X } from 'lucide-react';
import { DeviceContext } from '../contexts/DeviceContext';
import { Button } from '../components/Button';

interface DiagnosticResult {
  date: string;
  overallScore: number;
  areas: {
    [key: string]: {
      score: number;
      issue: string | null;
      recommendedPressure: number;
    }
  };
  recommendations: string[];
}

const DiagnosticScreen = () => {
  const { device, deviceStatus, connectToDevice, sendCommand } = useContext(DeviceContext);
  
  const [scanStage, setScanStage] = useState<'ready' | 'instructions' | 'scanning' | 'results'>('ready');
  const [scanProgress, setScanProgress] = useState(0);
  const [currentArea, setCurrentArea] = useState<string>('');
  const [results, setResults] = useState<DiagnosticResult | null>(null);
  
  const bodyAreas = [
    { id: 'upperSpine', name: 'Upper Spine', time: 4 },
    { id: 'midSpine', name: 'Mid Spine', time: 4 },
    { id: 'lowerSpine', name: 'Lower Spine', time: 4 },
    { id: 'leftShoulder', name: 'Left Shoulder', time: 3 },
    { id: 'rightShoulder', name: 'Right Shoulder', time: 3 },
    { id: 'pelvis', name: 'Pelvis', time: 4 },
  ];
  
  const totalScanTime = bodyAreas.reduce((total, area) => total + area.time, 0);
  
  const startScan = async () => {
    if (deviceStatus !== 'connected') {
      alert('Please connect your device before starting the diagnostic scan.');
      return;
    }
    
    setScanStage('scanning');
    setScanProgress(0);
    
    try {
      // Send command to start diagnostic scan
      await sendCommand({ action: 'startDiagnostic' });
      
      // Simulate scanning process
      let elapsed = 0;
      
      for (const area of bodyAreas) {
        setCurrentArea(area.name);
        
        for (let i = 0; i < area.time; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          elapsed += 1;
          setScanProgress(Math.round((elapsed / totalScanTime) * 100));
        }
      }
      
      // Generate mock results
      const mockResults: DiagnosticResult = {
        date: new Date().toISOString(),
        overallScore: 78,
        areas: {
          upperSpine: { score: 85, issue: null, recommendedPressure: 40 },
          midSpine: { score: 72, issue: 'Slight misalignment', recommendedPressure: 60 },
          lowerSpine: { score: 65, issue: 'Compression detected', recommendedPressure: 70 },
          leftShoulder: { score: 82, issue: null, recommendedPressure: 45 },
          rightShoulder: { score: 80, issue: null, recommendedPressure: 50 },
          pelvis: { score: 75, issue: 'Minor imbalance', recommendedPressure: 55 }
        },
        recommendations: [
          'Focus treatment on lower spine area',
          'Maintain consistent daily sessions',
          'Incorporate gentle stretching exercises',
          'Consider increasing hydration'
        ]
      };
      
      setResults(mockResults);
      setScanStage('results');
      
    } catch (error) {
      alert('There was an error during the diagnostic scan. Please try again.');
      console.error('Diagnostic scan error:', error);
      setScanStage('ready');
    }
  };
  
  const cancelScan = async () => {
    try {
      await sendCommand({ action: 'cancelDiagnostic' });
      setScanStage('ready');
    } catch (error) {
      console.error('Error cancelling scan:', error);
    }
  };
  
  useEffect(() => {
    // Connect to device if available
    if (deviceStatus !== 'connected' && localStorage.getItem('spinehealth_device')) {
      connectToDevice();
    }
  }, []);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-amber-500';
    return 'text-destructive';
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Diagnostic Scan</h1>
        
        {scanStage === 'ready' && (
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
          </div>
        )}
      </div>
      
      {scanStage === 'ready' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center py-6">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Activity className="h-10 w-10 text-primary" />
            </div>
            
            <h2 className="text-xl font-semibold mb-2">Start a New Diagnostic Scan</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Perform a comprehensive analysis of your spine and posture to identify potential issues and create a personalized treatment plan.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
              <Button 
                size="lg"
                onClick={() => setScanStage('instructions')}
                disabled={deviceStatus !== 'connected'}
              >
                Start Scan
              </Button>
              
              <Link to="/analytics">
                <Button variant="outline" size="lg">
                  View Previous Results
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-8 border-t pt-6">
            <h3 className="font-semibold mb-3">What to Expect</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <span className="font-bold">1</span>
                  </div>
                  <h4 className="font-medium">Preparation</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ensure the device is properly worn and you're in a comfortable, neutral position.
                </p>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <span className="font-bold">2</span>
                  </div>
                  <h4 className="font-medium">Scanning</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  The device will analyze different areas of your spine and posture for about 20 minutes.
                </p>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <span className="font-bold">3</span>
                  </div>
                  <h4 className="font-medium">Results & Plan</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Review your personalized analysis and start a targeted treatment session.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {scanStage === 'instructions' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Before We Begin</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-success mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Wear the device properly</p>
                <p className="text-sm text-muted-foreground">Ensure the device is securely attached following the placement guide.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-success mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Find a comfortable position</p>
                <p className="text-sm text-muted-foreground">Sit or stand in a neutral, relaxed position that feels natural to you.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-success mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Stay still during scanning</p>
                <p className="text-sm text-muted-foreground">Try to remain relatively still when each area is being scanned.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-success mr-3 mt-0.5" />
              <div>
                <p className="font-medium">The scan will take approximately 22 minutes</p>
                <p className="text-sm text-muted-foreground">The device will analyze each area of your spine and surrounding muscles.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-6">
            <div className="flex items-start">
              <HelpCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Important Note</p>
                <p className="text-sm text-amber-700">For the most accurate results, avoid sudden movements during the scanning process. You can continue light activities like reading or watching TV.</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setScanStage('ready')}>
              Back
            </Button>
            <Button onClick={startScan}>
              Begin Scan
            </Button>
          </div>
        </div>
      )}
      
      {scanStage === 'scanning' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center mb-6">
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4"
            >
              <Activity className="h-10 w-10 text-primary" />
            </motion.div>
            
            <h2 className="text-xl font-semibold mb-2">Diagnostic Scan in Progress</h2>
            <p className="text-muted-foreground mb-8">
              Currently scanning: <span className="font-medium">{currentArea}</span>
            </p>
            
            <div className="max-w-md mx-auto mb-8">
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: '0%' }}
                  animate={{ width: `${scanProgress}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{scanProgress}%</span>
              </div>
            </div>
            
            <div className="relative max-w-xs mx-auto h-72 bg-muted/30 rounded-lg mb-8">
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <svg viewBox="0 0 50 100" width="120" height="240">
                  <path d="M25,10 C35,10 35,15 35,20 C35,25 30,30 30,35 C30,45 35,55 35,65 C35,75 30,80 25,90 C20,80 15,75 15,65 C15,55 20,45 20,35 C20,30 15,25 15,20 C15,15 15,10 25,10 Z" 
                    fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>
              
              {bodyAreas.map((area, index) => {
                // Calculate positions based on area
                let left = '50%';
                let top = '20%';
                
                switch(area.id) {
                  case 'upperSpine': top = '20%'; break;
                  case 'midSpine': top = '40%'; break;
                  case 'lowerSpine': top = '60%'; break;
                  case 'leftShoulder': left = '30%'; top = '25%'; break;
                  case 'rightShoulder': left = '70%'; top = '25%'; break;
                  case 'pelvis': top = '80%'; break;
                }
                
                const isActive = currentArea === area.name;
                
                return (
                  <motion.div
                    key={area.id}
                    className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center text-xs
                      ${isActive ? 'bg-primary text-primary-foreground animate-pulse-slow' : 'bg-muted/60'}`}
                    style={{ left, top }}
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {index + 1}
                  </motion.div>
                );
              })}
              
              <motion.div 
                className="absolute -bottom-2 left-0 w-full h-2"
                style={{ 
                  background: 'linear-gradient(90deg, rgba(59,130,246,0) 0%, rgba(59,130,246,0.3) 50%, rgba(59,130,246,0) 100%)' 
                }}
                animate={{ 
                  y: [-10, 240, -10],
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Please remain still while the scan is in progress.
              <br />This will take approximately {totalScanTime} seconds to complete.
            </p>
            
            <Button variant="outline" onClick={cancelScan}>
              <X className="mr-2 h-4 w-4" />
              Cancel Scan
            </Button>
          </div>
        </div>
      )}
      
      {scanStage === 'results' && results && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold">Diagnostic Results</h2>
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {formatDate(results.date)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Comprehensive analysis of your spine and posture
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-2">
                <Link to="/analytics">
                  <Button variant="outline" size="sm">
                    View Analytics
                  </Button>
                </Link>
                <Link to="/treatment">
                  <Button size="sm">
                    Start Treatment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row mb-6">
              <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={results.overallScore > 70 ? "#22C55E" : results.overallScore > 40 ? "#F59E0B" : "#EF4444"}
                      strokeWidth="8"
                      strokeDasharray={`${results.overallScore * 2.82} 282`}
                      strokeDashoffset="0"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{results.overallScore}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>
                <p className="font-medium mt-3">Overall Health Score</p>
              </div>
              
              <div className="md:w-2/3 md:pl-6">
                <h3 className="font-semibold mb-2">Recommendations</h3>
                <ul className="space-y-2">
                  {results.recommendations.map((recommendation, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <CheckCircle className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                      <span>{recommendation}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-4">Detailed Analysis by Area</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(results.areas).map(([areaId, data]) => (
                <motion.div
                  key={areaId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{areaId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                      {data.issue ? (
                        <p className="text-sm text-amber-600">{data.issue}</p>
                      ) : (
                        <p className="text-sm text-success">No issues detected</p>
                      )}
                    </div>
                    <div className={`text-lg font-bold ${getScoreColor(data.score)}`}>
                      {data.score}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>Health score</span>
                      <span className="font-medium">{data.score}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          data.score >= 80 ? 'bg-success' : 
                          data.score >= 60 ? 'bg-amber-500' : 
                          'bg-destructive'
                        }`}
                        style={{ width: `${data.score}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>Recommended pressure</span>
                      <span className="font-medium">{data.recommendedPressure}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary"
                        style={{ width: `${data.recommendedPressure}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Link to="/treatment">
                <Button>
                  Apply These Settings in Treatment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticScreen;