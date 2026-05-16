import { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Award, Bell, CalendarClock, ChevronRight, Clock, Heart, TrendingUp, Zap } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { DeviceContext } from '../contexts/DeviceContext';
import { SubscriptionContext } from '../contexts/SubscriptionContext';
import { Button } from '../components/Button';
import { Progress } from '../components/Progress';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { device, deviceStatus, connectToDevice } = useContext(DeviceContext);
  const { hasActiveSubscription } = useContext(SubscriptionContext);
  
  const [healthScore, setHealthScore] = useState(78);
  const [upcomingSessions, setUpcomingSessions] = useState([
    {
      id: '1',
      type: 'remedy',
      scheduledFor: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      duration: 20,
    },
    {
      id: '2',
      type: 'comfort',
      scheduledFor: new Date(Date.now() + 86400000 * 3).toISOString(), // in 3 days
      duration: 30,
    }
  ]);
  
  const [recentSessions, setRecentSessions] = useState([
    {
      id: '3',
      type: 'remedy',
      completedAt: new Date(Date.now() - 86400000).toISOString(), // yesterday
      duration: 25,
      improvementScore: 2.1,
    },
    {
      id: '4',
      type: 'comfort',
      completedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      duration: 20,
      improvementScore: 1.8,
    }
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  useEffect(() => {
    // Auto-connect to device if available
    if (deviceStatus !== 'connected' && localStorage.getItem('spinehealth_device')) {
      connectToDevice();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-muted-foreground">Let's check your spine health today</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-2">
          {!device && (
            <Button onClick={() => connectToDevice()}>
              Connect Device
            </Button>
          )}
          
          {!hasActiveSubscription && (
            <Link to="/subscription">
              <Button variant="outline">
                Upgrade Plan
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Health status and options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-sm col-span-1"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-gray-700">Spine Health Score</h2>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex items-center justify-center my-4">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
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
                  stroke={healthScore > 70 ? "#22C55E" : healthScore > 40 ? "#F59E0B" : "#EF4444"}
                  strokeWidth="8"
                  strokeDasharray={`${healthScore * 2.82} 282`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{healthScore}</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center items-center space-x-2 text-sm text-muted-foreground mb-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span>+4 points since last check</span>
          </div>
          
          <div className="mt-4">
            <Link to="/analytics">
              <Button variant="outline" className="w-full">
                View Detailed Report
              </Button>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm col-span-1"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-gray-700">Quick Actions</h2>
            <Zap className="h-5 w-5 text-primary" />
          </div>
          
          <div className="space-y-4">
            <Link to="/diagnostic">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-left border border-muted p-3 h-auto"
              >
                <Activity className="h-5 w-5 mr-3 text-secondary" />
                <div>
                  <div className="font-medium">Run Diagnostic Scan</div>
                  <div className="text-xs text-muted-foreground">Analyze your spine condition</div>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto" />
              </Button>
            </Link>
            
            <Link to="/treatment">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-left border border-muted p-3 h-auto"
              >
                <Heart className="h-5 w-5 mr-3 text-destructive" />
                <div>
                  <div className="font-medium">Start Treatment</div>
                  <div className="text-xs text-muted-foreground">Begin your therapy session</div>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto" />
              </Button>
            </Link>
            
            <Link to="/device">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-left border border-muted p-3 h-auto"
              >
                <Bell className="h-5 w-5 mr-3 text-accent" />
                <div>
                  <div className="font-medium">Manage Device</div>
                  <div className="text-xs text-muted-foreground">Device settings and pairing</div>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto" />
              </Button>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm col-span-1"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-gray-700">Treatment Progress</h2>
            <Award className="h-5 w-5 text-primary" />
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Weekly Goal</span>
                <span className="text-sm font-medium">3 of 5 sessions</span>
              </div>
              <Progress value={60} />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Consistency</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <Progress value={85} indicatorColor="bg-success" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Current Streak</span>
                <span className="text-sm font-medium">4 days</span>
              </div>
              <Progress value={40} indicatorColor="bg-accent" />
            </div>
            
            <div className="pt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarClock className="h-4 w-4 mr-1 text-secondary" />
                <span>Next scheduled: {formatDate(upcomingSessions[0]?.scheduledFor)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Upcoming sessions */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
          <Link to="/treatment" className="text-sm text-primary flex items-center">
            Schedule new session
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {upcomingSessions.length > 0 ? (
          <div className="divide-y">
            {upcomingSessions.map(session => (
              <div key={session.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 rounded-full mr-3" style={{
                    backgroundColor: session.type === 'remedy' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)'
                  }}>
                    {session.type === 'remedy' ? 
                      <Activity className="h-5 w-5 text-primary" /> : 
                      <Heart className="h-5 w-5 text-accent" />
                    }
                  </div>
                  <div>
                    <div className="font-medium">{session.type === 'remedy' ? 'Remedy' : 'Comfort'} Session</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <CalendarClock className="h-3 w-3 mr-1" />
                      {formatDate(session.scheduledFor)} at {formatTime(session.scheduledFor)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground mr-4">{session.duration} min</span>
                  <Button size="sm">Start</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <CalendarClock className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No upcoming sessions scheduled</p>
            <Link to="/treatment" className="mt-3 inline-block">
              <Button size="sm">Schedule Now</Button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Recent activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Link to="/analytics" className="text-sm text-primary flex items-center">
            View all activity
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {recentSessions.length > 0 ? (
          <div className="divide-y">
            {recentSessions.map(session => (
              <div key={session.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 rounded-full mr-3" style={{
                    backgroundColor: session.type === 'remedy' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)'
                  }}>
                    {session.type === 'remedy' ? 
                      <Activity className="h-5 w-5 text-primary" /> : 
                      <Heart className="h-5 w-5 text-accent" />
                    }
                  </div>
                  <div>
                    <div className="font-medium">{session.type === 'remedy' ? 'Remedy' : 'Comfort'} Session Completed</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(session.completedAt)} • {session.duration} min
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-success/10 text-success text-sm py-1 px-2 rounded-full flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{session.improvementScore.toFixed(1)} pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No recent activity</p>
            <Link to="/treatment" className="mt-3 inline-block">
              <Button size="sm">Start a Session</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;