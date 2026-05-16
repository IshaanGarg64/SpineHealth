import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, Clock, Edit, Save, User, X } from 'lucide-react';
import { Button } from '../components/Button';
import { AuthContext } from '../contexts/AuthContext';
import { SubscriptionContext } from '../contexts/SubscriptionContext';
import { formatDate } from '../lib/utils';

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const { subscription } = useContext(SubscriptionContext);
  
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    notifications: true,
    reminderTime: '08:00',
    sessionsPerWeek: 5,
  });
  
  const handleFormChange = (field: string, value: string | boolean | number) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const saveProfile = () => {
    // In a real app, this would save to a database
    setEditing(false);
  };
  
  const cancelEditing = () => {
    // Reset form data to original values
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      notifications: true,
      reminderTime: '08:00',
      sessionsPerWeek: 5,
    });
    setEditing(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        
        <div className="flex space-x-2">
          {editing ? (
            <>
              <Button onClick={saveProfile}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={cancelEditing}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 overflow-hidden mb-4">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                )}
              </div>
              
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="text-xl font-semibold text-center w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <h2 className="text-xl font-semibold text-center">{user?.name}</h2>
              )}
              
              <p className="text-sm text-muted-foreground text-center mt-1">{user?.email}</p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Subscription Status</h3>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Plan</span>
                <span className={`font-medium ${subscription.tier ? 'text-success' : 'text-destructive'}`}>
                  {subscription.tier ? subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1) : 'No active plan'}
                </span>
              </div>
              
              {subscription.expiresAt && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">Expires</span>
                  <span className="font-medium">{formatDate(subscription.expiresAt)}</span>
                </div>
              )}
            </div>
            
            <div className="pt-2">
              <Button variant="outline" className="w-full" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Account Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p>{user?.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p>{user?.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Since
                </label>
                <p>January 15, 2025</p>
              </div>
              
              {editing && (
                <div className="pt-2">
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Treatment Preferences</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Preferences
                </label>
                {editing ? (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.notifications}
                      onChange={(e) => handleFormChange('notifications', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="ml-2">Enable treatment reminders</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Bell className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>Treatment reminders are enabled</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder Time
                </label>
                {editing ? (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <input
                      type="time"
                      value={formData.reminderTime}
                      onChange={(e) => handleFormChange('reminderTime', e.target.value)}
                      className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>8:00 AM daily</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weekly Goal
                </label>
                {editing ? (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    <select
                      value={formData.sessionsPerWeek}
                      onChange={(e) => handleFormChange('sessionsPerWeek', parseInt(e.target.value))}
                      className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {[2, 3, 4, 5, 6, 7].map(num => (
                        <option key={num} value={num}>{num} sessions per week</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>5 sessions per week</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Privacy & Data</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Analytics Data Collection</h3>
                  <p className="text-sm text-muted-foreground">Allow anonymous usage data collection to improve our services</p>
                </div>
                {editing ? (
                  <input
                    type="checkbox"
                    checked={true}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                ) : (
                  <span className="text-sm bg-success/10 text-success px-2 py-1 rounded-full">Enabled</span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Treatment Data Sharing</h3>
                  <p className="text-sm text-muted-foreground">Share treatment data with your healthcare providers</p>
                </div>
                {editing ? (
                  <input
                    type="checkbox"
                    checked={true}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                ) : (
                  <span className="text-sm bg-success/10 text-success px-2 py-1 rounded-full">Enabled</span>
                )}
              </div>
              
              <div className="pt-2">
                <Button variant="outline" size="sm">
                  Download My Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;