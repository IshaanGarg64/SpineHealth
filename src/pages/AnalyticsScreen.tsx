import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Download, 
  FileText, 
  HelpCircle, 
  Share2, 
  TrendingUp 
} from 'lucide-react';
import { Button } from '../components/Button';
import { Progress } from '../components/Progress';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsScreen = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [chartType, setChartType] = useState<'progress' | 'sessions' | 'pressure'>('progress');
  const [healthScore, setHealthScore] = useState(78);
  
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  
  // Mock function to format a date relative to current date
  const getRelativeDates = (days: number[]) => {
    return days.map(day => {
      const date = new Date();
      date.setDate(date.getDate() - day);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
  };
  
  useEffect(() => {
    // Simulate loading analytics data
    setIsLoading(true);
    
    setTimeout(() => {
      // Generate mock data based on time range
      let labels, progressData, sessionsData, pressureData;
      
      if (timeRange === 'week') {
        labels = getRelativeDates([6, 5, 4, 3, 2, 1, 0]);
        progressData = [68, 70, 71, 73, 74, 76, 78];
        sessionsData = [1, 0, 1, 1, 0, 1, 1];
        pressureData = [72, 70, 68, 65, 63, 60, 58];
      } else if (timeRange === 'month') {
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        progressData = [65, 70, 74, 78];
        sessionsData = [3, 4, 3, 5];
        pressureData = [75, 68, 63, 58];
      } else {
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        progressData = [40, 45, 48, 52, 55, 58, 62, 65, 70, 72, 75, 78];
        sessionsData = [8, 10, 12, 15, 14, 16, 15, 16, 18, 20, 18, 15];
        pressureData = [85, 80, 78, 75, 72, 70, 68, 65, 62, 60, 58, 55];
      }
      
      setAnalyticsData({
        // Chart data
        progressData: {
          labels,
          datasets: [
            {
              label: 'Spine Alignment Score',
              data: progressData,
              fill: true,
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderColor: 'rgba(59, 130, 246, 1)',
              tension: 0.4,
            }
          ]
        },
        sessionsData: {
          labels,
          datasets: [
            {
              label: 'Treatment Sessions',
              data: sessionsData,
              backgroundColor: 'rgba(13, 148, 136, 0.8)',
              borderRadius: 6,
            }
          ]
        },
        pressureData: {
          labels,
          datasets: [
            {
              label: 'Average Pressure Required',
              data: pressureData,
              fill: false,
              borderColor: 'rgba(220, 38, 38, 0.8)',
              tension: 0.4,
            }
          ]
        },
        
        // Statistics
        sessionsCompleted: 15,
        totalHours: 9.5,
        improvementPercentage: 20,
        streak: 4,
        consistency: 0.85,
        
        // Comparison
        initialDate: '3 months ago',
        currentDate: 'Today',
        initialScore: 58,
        currentScore: 78,
        
        // Insights
        insights: [
          {
            title: 'Great progress in lower spine alignment',
            description: 'Your lower spine alignment has improved by 28% in the last month.',
            icon: 'trending-up',
            iconColor: '#22C55E'
          },
          {
            title: 'Reduced pressure requirements',
            description: 'You now need 15% less pressure for the same therapeutic effect.',
            icon: 'thumbs-up',
            iconColor: '#3B82F6'
          },
          {
            title: 'Consistency milestone reached',
            description: "You've maintained a 4-day streak. Keep it up for better results!",
            icon: 'award',
            iconColor: '#8B5CF6'
          }
        ]
      });
      
      setIsLoading(false);
    }, 1500);
  }, [timeRange]);
  
  const handleShareReport = () => {
    // In a real app, this would generate a shareable report
    alert('Report sharing functionality would be implemented here.');
  };
  
  const handleDownloadReport = () => {
    // In a real app, this would download a PDF report
    alert('Report download functionality would be implemented here.');
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 10,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(226, 232, 240, 0.5)',
        },
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
  };
  
  const renderChart = () => {
    if (!analyticsData) return null;
    
    switch (chartType) {
      case 'progress':
        return (
          <Line data={analyticsData.progressData} options={chartOptions} />
        );
      case 'sessions':
        return (
          <Bar data={analyticsData.sessionsData} options={chartOptions} />
        );
      case 'pressure':
        return (
          <Line data={analyticsData.pressureData} options={chartOptions} />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics & Progress</h1>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleShareReport}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading your progress data...</p>
        </div>
      ) : (
        <>
          {/* Health score */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-start mb-4 md:mb-0">
                <div className="relative w-24 h-24 md:w-28 md:h-28">
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
                      stroke={healthScore > 70 ? "#22C55E" : healthScore > 40 ? "#F59E0B" : "#EF4444"}
                      strokeWidth="8"
                      strokeDasharray={`${healthScore * 2.82} 282`}
                      strokeDashoffset="0"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{healthScore}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>
                
                <div className="ml-4 mt-2">
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold">Spine Health Score</h2>
                    <HelpCircle className="ml-2 h-4 w-4 text-muted-foreground cursor-help" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your overall spine health rating
                  </p>
                  <div className="flex items-center mt-2 text-sm text-success">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    Improved by 20 points in 3 months
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3 md:w-1/3">
                <div>
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span>Mobility</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} indicatorColor="bg-primary" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span>Alignment</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} indicatorColor="bg-accent" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span>Flexibility</span>
                    <span className="font-medium">72%</span>
                  </div>
                  <Progress value={72} indicatorColor="bg-secondary" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold">
                    {chartType === 'progress' ? 'Spine Alignment Progress' : 
                     chartType === 'sessions' ? 'Treatment Sessions' : 
                     'Pressure Requirements'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {chartType === 'progress' ? 'Your spine alignment score over time' : 
                     chartType === 'sessions' ? 'Number of completed sessions' : 
                     'Required pressure level trend'}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <select 
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
                    className="text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
              </div>
              
              <div className="h-64 mb-4">
                {renderChart()}
              </div>
              
              <div className="flex justify-center space-x-2 mt-6">
                <Button 
                  variant={chartType === 'progress' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('progress')}
                >
                  Progress
                </Button>
                <Button 
                  variant={chartType === 'sessions' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('sessions')}
                >
                  Sessions
                </Button>
                <Button 
                  variant={chartType === 'pressure' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartType('pressure')}
                >
                  Pressure
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-1">
              <h2 className="text-lg font-semibold mb-4">Statistics</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-primary/10 mr-3">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Sessions</div>
                    <div className="font-semibold">{analyticsData.sessionsCompleted} completed</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-secondary/10 mr-3">
                    <Clock className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Time</div>
                    <div className="font-semibold">{analyticsData.totalHours} hours</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-accent/10 mr-3">
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Improvement</div>
                    <div className="font-semibold">+{analyticsData.improvementPercentage}%</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-success/10 mr-3">
                    <Activity className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                    <div className="font-semibold">{analyticsData.streak} days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Comparison & Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Initial vs. Current State</h2>
              
              <div className="flex justify-between items-center p-4 mb-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Initial Assessment</div>
                  <div className="text-sm mb-2">{analyticsData.initialDate}</div>
                  <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-destructive">{analyticsData.initialScore}</span>
                  </div>
                </div>
                
                <div className="flex-1 px-4">
                  <div className="h-0.5 bg-muted relative">
                    <div className="absolute w-full flex justify-center -top-2">
                      <TrendingUp className="text-success" />
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Current State</div>
                  <div className="text-sm mb-2">{analyticsData.currentDate}</div>
                  <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-success">{analyticsData.currentScore}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-success/5 rounded-md">
                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    <span className="font-medium">Overall improvement of {analyticsData.currentScore - analyticsData.initialScore} points</span> in your spine health score, demonstrating significant progress in your treatment journey.
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full" onClick={handleDownloadReport}>
                  <FileText className="mr-2 h-4 w-4" />
                  Download Detailed Comparison
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Personalized Insights</h2>
              
              <div className="space-y-4">
                {analyticsData.insights.map((insight: any, index: number) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-md border border-muted"
                  >
                    <div className="flex items-start">
                      <div 
                        className="p-2 rounded-full mr-3 flex-shrink-0" 
                        style={{ backgroundColor: `${insight.iconColor}15` }}
                      >
                        <Activity className="h-5 w-5" style={{ color: insight.iconColor }} />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{insight.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Looking for more personalized guidance?
                </p>
                <Button>Schedule a Consultation</Button>
              </div>
            </div>
          </div>
          
          {/* Report export section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Generate Full Report</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Share detailed progress reports with your healthcare provider
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Button variant="outline" onClick={handleShareReport}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Report
                </Button>
                <Button onClick={handleDownloadReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsScreen;