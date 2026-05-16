import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="flex items-center justify-center text-white">
          <motion.div
            animate={{ 
              rotate: 360,
              transition: { duration: 2, repeat: Infinity, ease: "linear" } 
            }}
          >
            <Activity size={60} className="text-white" />
          </motion.div>
        </div>
        
        <motion.h1 
          className="mt-6 text-3xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          SpineHealth
        </motion.h1>
        
        <motion.p 
          className="mt-2 text-primary-foreground/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Advanced spine therapy & monitoring
        </motion.p>
        
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;