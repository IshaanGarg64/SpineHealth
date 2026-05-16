import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Badge, CheckCircle, CreditCard, Gift, ShieldCheck, X, Clock } from 'lucide-react';
import { Button } from '../components/Button';
import { SubscriptionContext } from '../contexts/SubscriptionContext';
import { formatDate } from '../lib/utils';

const SubscriptionScreen = () => {
  const { 
    subscription, 
    hasActiveSubscription,
    isInTrialPeriod,
    daysLeftInTrial,
    subscribeToPlan, 
    cancelSubscription,
    startFreeTrial,
    availablePlans
  } = useContext(SubscriptionContext);
  
  const [selectedPlan, setSelectedPlan] = useState(
    hasActiveSubscription ? subscription.tier + '-monthly' : 'premium-monthly'
  );
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<'month' | 'year'>('month');
  
  const YEARLY_DISCOUNT = 0.2; // 20% discount for yearly plans
  
  const handleSubscribe = async () => {
    try {
      setPaymentProcessing(true);
      await subscribeToPlan(selectedPlan);
    } catch (error) {
      alert('Failed to process subscription. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleStartTrial = async () => {
    try {
      setPaymentProcessing(true);
      await startFreeTrial();
    } catch (error) {
      alert('Failed to start trial. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };
  
  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      try {
        await cancelSubscription();
      } catch (error) {
        alert('Failed to cancel subscription. Please try again.');
      }
    }
  };
  
  const getFeatureAvailability = (planName: string, feature: string) => {
    const plan = availablePlans.find(p => p.name.toLowerCase() === planName);
    return plan?.features.includes(feature);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Subscription Management</h1>
      
      {(hasActiveSubscription || isInTrialPeriod) && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center">
                <h2 className="text-lg font-semibold">Current Plan</h2>
                {isInTrialPeriod ? (
                  <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Trial Active
                  </span>
                ) : (
                  <span className="ml-2 px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {isInTrialPeriod 
                  ? `${daysLeftInTrial} days left in your free trial` 
                  : 'Your subscription details and billing information'}
              </p>
            </div>
            
            <Button variant="outline" size="sm" onClick={handleCancelSubscription}>
              Cancel {isInTrialPeriod ? 'Trial' : 'Subscription'}
            </Button>
          </div>
          
          <div className="border-t border-b py-4 my-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="font-medium">{subscription.tier?.charAt(0).toUpperCase() + subscription.tier?.slice(1)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{isInTrialPeriod ? 'Trial Period' : 'Active Subscription'}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">
                  {isInTrialPeriod ? 'Trial Ends' : 'Next Billing Date'}
                </p>
                <p className="font-medium">
                  {subscription.expiresAt ? formatDate(subscription.expiresAt) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          {!isInTrialPeriod && (
            <div className="mt-4">
              <h3 className="font-semibold mb-3">Payment Information</h3>
              <div className="flex items-center">
                <div className="p-2 bg-muted/30 rounded-md mr-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/26</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  Update
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {!hasActiveSubscription && !isInTrialPeriod && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Try Premium Features Free for 7 Days</h2>
            <p className="text-muted-foreground mb-6">
              Experience all premium features with no commitment. Cancel anytime during the trial period.
            </p>
            <Button size="lg" onClick={handleStartTrial} isLoading={paymentProcessing}>
              Start Free Trial
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              No credit card required for trial
            </p>
          </div>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Subscription Plans</h2>
        <p className="text-muted-foreground mb-6">Choose the plan that works best for you</p>
        
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-muted rounded-lg p-1">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedInterval === 'month' 
                  ? 'bg-white shadow' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setSelectedInterval('month')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedInterval === 'year' 
                  ? 'bg-white shadow' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setSelectedInterval('year')}
            >
              Yearly
              <span className="ml-1 text-xs bg-success/20 text-success px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availablePlans.map((plan) => {
            const isCurrentPlan = hasActiveSubscription && plan.name.toLowerCase() === subscription.tier;
            const isSelected = selectedPlan === `${plan.name.toLowerCase()}-${selectedInterval}`;
            const price = selectedInterval === 'year' 
              ? plan.price * 12 * (1 - YEARLY_DISCOUNT) 
              : plan.price;
            
            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -5 }}
                className={`border-2 rounded-lg overflow-hidden ${
                  isSelected ? 'border-primary' : 'border-muted'
                }`}
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-2 mb-4">
                    <span className="text-3xl font-bold">${price.toFixed(2)}</span>
                    <span className="text-muted-foreground text-sm">/{selectedInterval}</span>
                  </div>
                  
                  <button
                    className={`w-full py-2 px-4 rounded-md transition-colors ${
                      isCurrentPlan
                        ? 'bg-success/10 text-success border border-success cursor-default'
                        : isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                    onClick={() => setSelectedPlan(`${plan.name.toLowerCase()}-${selectedInterval}`)}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? (
                      <span className="flex items-center justify-center">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Current Plan
                      </span>
                    ) : (
                      'Select Plan'
                    )}
                  </button>
                  
                  <ul className="mt-6 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-success mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-10">
          <h3 className="font-semibold mb-4">Feature Comparison</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Feature</th>
                  <th className="py-3 px-4 text-center text-sm font-medium text-muted-foreground">Basic</th>
                  <th className="py-3 px-4 text-center text-sm font-medium text-muted-foreground">Premium</th>
                  <th className="py-3 px-4 text-center text-sm font-medium text-muted-foreground">Professional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 text-sm">Basic diagnostic scans</td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm">Advanced diagnostic scans</td>
                  <td className="py-3 px-4 text-center">
                    <X className="h-5 w-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm">Custom treatment presets</td>
                  <td className="py-3 px-4 text-center">
                    <X className="h-5 w-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm">Detailed analytics and reporting</td>
                  <td className="py-3 px-4 text-center">
                    <X className="h-5 w-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm">Multiple device support</td>
                  <td className="py-3 px-4 text-center">
                    <X className="h-5 w-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <X className="h-5 w-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm">AI-powered health insights</td>
                  <td className="py-3 px-4 text-center">
                    <X className="h-5 w-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <X className="h-5 w-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm">Priority support</td>
                  <td className="py-3 px-4 text-center">
                    <X className="h-5 w-5 text-muted-foreground mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CheckCircle className="h-5 w-5 text-success mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {!hasActiveSubscription && !isInTrialPeriod && (
          <div className="mt-8 text-center">
            <Button 
              size="lg" 
              onClick={handleSubscribe}
              isLoading={paymentProcessing}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Subscribe Now
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              Secure payment processing. Cancel anytime.
            </p>
            <div className="flex items-center justify-center mt-4">
              <ShieldCheck className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">SSL Encrypted</span>
              <span className="mx-2 text-muted-foreground">•</span>
              <Badge className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">Money-back Guarantee</span>
            </div>
          </div>
        )}
        
        <div className="mt-10 bg-muted/30 p-4 rounded-lg">
          <div className="flex items-start">
            <Gift className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Referral Program</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Share SpineHealth with friends and family! For each person who subscribes using your referral code, 
                you'll receive one month of Premium service for free.
              </p>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <div className="bg-white border rounded-md px-3 py-2 flex-grow mb-2 sm:mb-0">
                  <code className="text-sm">FRIEND-JOHNDOE-2025</code>
                </div>
                <Button variant="outline" size="sm">Copy Code</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionScreen;