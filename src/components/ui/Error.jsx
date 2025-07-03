import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Error = ({ message = 'Something went wrong', onRetry, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center ${className}`}>
      <motion.div
        className="text-center space-y-6 max-w-md mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-error to-red-400 flex items-center justify-center">
          <ApperIcon name="AlertCircle" size={40} className="text-white" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-gray-800">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">
            {message}
          </p>
        </div>

        <div className="space-y-4">
          {onRetry && (
            <Button
              onClick={onRetry}
              className="gradient-button"
            >
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Try Again
            </Button>
          )}
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              If this problem persists, try these solutions:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Check your internet connection</li>
              <li>• Refresh the page</li>
              <li>• Clear your browser cache</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help? Contact support or check our status page.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Error;