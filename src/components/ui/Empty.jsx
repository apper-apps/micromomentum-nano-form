import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Empty = ({ 
  icon = 'Target',
  title = 'No habits for today',
  description = 'Start your journey by creating your first goal!',
  actionLabel = 'Create Your First Goal',
  actionTo = '/goals/new',
  className = ''
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center ${className}`}>
      <motion.div
        className="text-center space-y-6 max-w-md mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <ApperIcon name={icon} size={40} className="text-white" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-gray-800">
            {title}
          </h2>
          <p className="text-gray-600">
            {description}
          </p>
        </div>

        <div className="space-y-4">
          <Link to={actionTo}>
            <Button className="gradient-button">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              {actionLabel}
            </Button>
          </Link>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Transform your ambitious goals into daily micro-habits:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• AI breaks down big goals into small actions</li>
              <li>• Track streaks and build momentum</li>
              <li>• Get gentle reminders and celebrate wins</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Ready to build lasting habits? Start with just one small step today.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Empty;