import { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { SubscriptionContext } from './contexts/SubscriptionContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DiagnosticScreen from './pages/DiagnosticScreen';
import TreatmentControl from './pages/TreatmentControl';
import AnalyticsScreen from './pages/AnalyticsScreen';
import ProfileScreen from './pages/ProfileScreen';
import DevicePairing from './pages/DevicePairing';
import SubscriptionScreen from './pages/SubscriptionScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import SplashScreen from './pages/SplashScreen';

function App() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { hasActiveSubscription, loading: subLoading } = useContext(SubscriptionContext);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (initialLoading || authLoading || subLoading) {
    return <SplashScreen />;
  }

  // Protected route component
  const ProtectedRoute = ({ children, requireSubscription = false }: { 
    children: React.ReactNode;
    requireSubscription?: boolean; 
  }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (requireSubscription && !hasActiveSubscription) {
      return <Navigate to="/subscription" replace />;
    }

    return <>{children}</>;
  };

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginScreen />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterScreen />} />
      
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="device" element={<DevicePairing />} />
        <Route path="diagnostic" element={<ProtectedRoute requireSubscription><DiagnosticScreen /></ProtectedRoute>} />
        <Route path="treatment" element={<ProtectedRoute requireSubscription><TreatmentControl /></ProtectedRoute>} />
        <Route path="analytics" element={<ProtectedRoute requireSubscription><AnalyticsScreen /></ProtectedRoute>} />
        <Route path="profile" element={<ProfileScreen />} />
        <Route path="subscription" element={<SubscriptionScreen />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;