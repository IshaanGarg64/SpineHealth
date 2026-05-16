import { createContext, useState, useEffect, ReactNode } from 'react';

export type SubscriptionTier = 'basic' | 'premium' | 'professional' | null;

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

interface SubscriptionData {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt: string | null;
  startedAt: string | null;
  isTrialActive: boolean;
  trialEndsAt: string | null;
}

interface SubscriptionContextType {
  subscription: SubscriptionData;
  hasActiveSubscription: boolean;
  loading: boolean;
  subscribeToPlan: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  startFreeTrial: () => Promise<void>;
  availablePlans: SubscriptionPlan[];
  isInTrialPeriod: boolean;
  daysLeftInTrial: number;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic-monthly',
    name: 'Basic',
    price: 9.99,
    interval: 'month',
    features: [
      'Basic diagnostic scans',
      'Treatment control',
      'Basic analytics',
      'Email support',
    ],
  },
  {
    id: 'premium-monthly',
    name: 'Premium',
    price: 19.99,
    interval: 'month',
    features: [
      'Advanced diagnostic scans',
      'Custom treatment presets',
      'Detailed analytics and reporting',
      'Priority email & chat support',
      'Data export',
    ],
  },
  {
    id: 'professional-monthly',
    name: 'Professional',
    price: 39.99,
    interval: 'month',
    features: [
      'Comprehensive diagnostic scans',
      'Multiple device support',
      'Unlimited treatment presets',
      'Advanced analytics with AI insights',
      'Export to medical providers',
      '24/7 dedicated support',
      'Personal health consultant',
    ],
  },
];

export const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: { 
    tier: null, 
    isActive: false, 
    expiresAt: null, 
    startedAt: null,
    isTrialActive: false,
    trialEndsAt: null
  },
  hasActiveSubscription: false,
  loading: true,
  subscribeToPlan: async () => {},
  cancelSubscription: async () => {},
  startFreeTrial: async () => {},
  availablePlans: SUBSCRIPTION_PLANS,
  isInTrialPeriod: false,
  daysLeftInTrial: 0,
});

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState<SubscriptionData>({
    tier: null,
    isActive: false,
    expiresAt: null,
    startedAt: null,
    isTrialActive: false,
    trialEndsAt: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing subscription or trial
    const checkSubscription = () => {
      try {
        const savedSubscription = localStorage.getItem('spinehealth_subscription');
        const savedTrial = localStorage.getItem('spinehealth_trial');
        
        if (savedSubscription) {
          const parsedSub = JSON.parse(savedSubscription);
          
          // Check if subscription is still valid
          if (parsedSub.expiresAt && new Date(parsedSub.expiresAt) > new Date()) {
            setSubscription(parsedSub);
          } else {
            // Subscription expired
            localStorage.removeItem('spinehealth_subscription');
          }
        } else if (savedTrial) {
          const parsedTrial = JSON.parse(savedTrial);
          if (new Date(parsedTrial.trialEndsAt) > new Date()) {
            setSubscription({
              ...parsedTrial,
              tier: 'premium', // Trial users get premium features
              isActive: true,
              isTrialActive: true
            });
          } else {
            // Trial expired
            localStorage.removeItem('spinehealth_trial');
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Subscription check error:', error);
        setLoading(false);
      }
    };

    checkSubscription();
  }, []);

  const startFreeTrial = async () => {
    setLoading(true);
    
    try {
      const now = new Date();
      const trialEnd = new Date();
      trialEnd.setDate(now.getDate() + 7); // 7-day trial
      
      const trialData = {
        isTrialActive: true,
        trialEndsAt: trialEnd.toISOString(),
        startedAt: now.toISOString(),
        tier: 'premium' as SubscriptionTier,
        isActive: true,
        expiresAt: trialEnd.toISOString()
      };
      
      setSubscription(trialData);
      localStorage.setItem('spinehealth_trial', JSON.stringify(trialData));
    } catch (error) {
      console.error('Trial start error:', error);
      throw new Error('Failed to start trial');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPlan = async (planId: string) => {
    setLoading(true);
    
    try {
      // Simulate payment process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) throw new Error('Invalid plan selected');
      
      const tier = plan.name.toLowerCase() as SubscriptionTier;
      const now = new Date();
      const expiresAt = new Date();
      
      // Set expiration date based on plan interval
      if (plan.interval === 'month') {
        expiresAt.setMonth(now.getMonth() + 1);
      } else {
        expiresAt.setFullYear(now.getFullYear() + 1);
      }
      
      const newSubscription: SubscriptionData = {
        tier,
        isActive: true,
        startedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        isTrialActive: false,
        trialEndsAt: null
      };
      
      setSubscription(newSubscription);
      localStorage.setItem('spinehealth_subscription', JSON.stringify(newSubscription));
      
      // Remove trial data if exists
      localStorage.removeItem('spinehealth_trial');
    } catch (error) {
      console.error('Subscription error:', error);
      throw new Error('Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    setLoading(true);
    
    try {
      // Simulate API call to cancel subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscription({
        tier: null,
        isActive: false,
        expiresAt: null,
        startedAt: null,
        isTrialActive: false,
        trialEndsAt: null
      });
      
      localStorage.removeItem('spinehealth_subscription');
      localStorage.removeItem('spinehealth_trial');
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw new Error('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  // Calculate trial status
  const isInTrialPeriod = subscription.isTrialActive && subscription.trialEndsAt !== null;
  const daysLeftInTrial = isInTrialPeriod 
    ? Math.max(0, Math.ceil((new Date(subscription.trialEndsAt!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <SubscriptionContext.Provider 
      value={{ 
        subscription,
        hasActiveSubscription: subscription.isActive,
        loading,
        subscribeToPlan,
        cancelSubscription,
        startFreeTrial,
        availablePlans: SUBSCRIPTION_PLANS,
        isInTrialPeriod,
        daysLeftInTrial
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};