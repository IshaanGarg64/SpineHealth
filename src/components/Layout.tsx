import { useContext, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Activity, Sliders, User, Award, Bluetooth, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import { DeviceContext } from '../contexts/DeviceContext';
import { Button } from './Button';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const { device, deviceStatus } = useContext(DeviceContext);
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-primary font-bold text-xl flex items-center">
                <Activity className="mr-2" size={24} />
                {!isSidebarCollapsed && "SpineHealth"}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {device ? (
                <div className="flex items-center text-sm">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    deviceStatus === 'connected' ? 'bg-success' : 'bg-warning'
                  }`}></span>
                  <span className="hidden sm:inline">{device.name}</span>
                </div>
              ) : (
                <NavLink 
                  to="/device" 
                  className="text-sm text-muted-foreground flex items-center hover:text-primary"
                >
                  <Bluetooth size={16} className="mr-1" />
                  <span className="hidden sm:inline">Connect Device</span>
                </NavLink>
              )}
              
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <span className="text-primary text-sm font-medium">{user?.name?.charAt(0)}</span>
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 hidden group-hover:block">
                  <NavLink 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </NavLink>
                  <NavLink 
                    to="/subscription" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Subscription
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow bg-background pt-16">
        <div className={`px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-300 ${
          isSidebarCollapsed ? 'sm:ml-20' : 'sm:ml-64'
        }`}>
          <Outlet />
        </div>
      </main>
      
      {/* Mobile navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 sm:hidden">
        <div className="grid grid-cols-5 h-16">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center ${isActive ? 'text-primary' : 'text-gray-500'}`
            }
          >
            <LayoutGrid size={20} />
            <span className="text-xs mt-1">Home</span>
          </NavLink>
          
          <NavLink 
            to="/diagnostic" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center ${isActive ? 'text-primary' : 'text-gray-500'}`
            }
          >
            <Activity size={20} />
            <span className="text-xs mt-1">Diagnosis</span>
          </NavLink>
          
          <NavLink 
            to="/treatment" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center ${isActive ? 'text-primary' : 'text-gray-500'}`
            }
          >
            <Sliders size={20} />
            <span className="text-xs mt-1">Treatment</span>
          </NavLink>
          
          <NavLink 
            to="/analytics" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center ${isActive ? 'text-primary' : 'text-gray-500'}`
            }
          >
            <Award size={20} />
            <span className="text-xs mt-1">Progress</span>
          </NavLink>
          
          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              `flex flex-col items-center justify-center ${isActive ? 'text-primary' : 'text-gray-500'}`
            }
          >
            <User size={20} />
            <span className="text-xs mt-1">Profile</span>
          </NavLink>
        </div>
      </nav>
      
      {/* Desktop sidebar */}
      <nav className={`hidden sm:block fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 pb-10 transition-all duration-300 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-2 bg-white border shadow-sm"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>

        <div className="px-4 py-6">
          <ul className="space-y-1">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 text-sm rounded-md ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <LayoutGrid size={18} className="flex-shrink-0" />
                {!isSidebarCollapsed && <span className="ml-3">Dashboard</span>}
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/diagnostic" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 text-sm rounded-md ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Activity size={18} className="flex-shrink-0" />
                {!isSidebarCollapsed && <span className="ml-3">Diagnostic Scan</span>}
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/treatment" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 text-sm rounded-md ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Sliders size={18} className="flex-shrink-0" />
                {!isSidebarCollapsed && <span className="ml-3">Treatment Control</span>}
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/analytics" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 text-sm rounded-md ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Award size={18} className="flex-shrink-0" />
                {!isSidebarCollapsed && <span className="ml-3">Analytics & Progress</span>}
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/device" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 text-sm rounded-md ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Bluetooth size={18} className="flex-shrink-0" />
                {!isSidebarCollapsed && <span className="ml-3">Device Management</span>}
              </NavLink>
            </li>
          </ul>
          
          {!isSidebarCollapsed && (
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Account
              </h3>
              <ul className="mt-3 space-y-1">
                <li>
                  <NavLink 
                    to="/profile" 
                    className={({ isActive }) => 
                      `flex items-center px-4 py-3 text-sm rounded-md ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <User size={18} className="flex-shrink-0" />
                    <span className="ml-3">Profile</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/subscription" 
                    className={({ isActive }) => 
                      `flex items-center px-4 py-3 text-sm rounded-md ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <Award size={18} className="flex-shrink-0" />
                    <span className="ml-3">Subscription</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Layout;