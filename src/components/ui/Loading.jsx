import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center space-x-2">
          <motion.div
            className="w-4 h-4 bg-gradient-to-br from-primary to-secondary rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1] 
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="w-4 h-4 bg-gradient-to-br from-secondary to-accent rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1] 
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2
            }}
          />
          <motion.div
            className="w-4 h-4 bg-gradient-to-br from-accent to-primary rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1] 
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4
            }}
          />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold gradient-text">
            Loading Your Progress
          </h2>
          <p className="text-gray-600">
            Building momentum, one habit at a time...
          </p>
        </div>

        {/* Skeleton Content */}
        <div className="max-w-2xl mx-auto space-y-4 mt-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;