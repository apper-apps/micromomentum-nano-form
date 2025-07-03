import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Badge = ({ 
  type = 'streak', 
  title, 
  description, 
  icon, 
  earned = false,
  requirement,
  className = '',
  ...props 
}) => {
  const baseClasses = 'badge-shine rounded-2xl p-4 text-center transition-all duration-300';
  
  const typeClasses = {
    streak: earned 
      ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-lg'
      : 'bg-gray-100 text-gray-500 border-2 border-dashed border-gray-300',
    milestone: earned
      ? 'bg-gradient-to-br from-accent to-yellow-400 text-white shadow-lg'
      : 'bg-gray-100 text-gray-500 border-2 border-dashed border-gray-300',
    special: earned
      ? 'bg-gradient-to-br from-success to-green-400 text-white shadow-lg'
      : 'bg-gray-100 text-gray-500 border-2 border-dashed border-gray-300',
  };

  return (
    <motion.div
      className={`${baseClasses} ${typeClasses[type]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          earned ? 'bg-white/20' : 'bg-gray-200'
        }`}>
          <ApperIcon 
            name={icon} 
            size={24} 
            className={earned ? 'text-white' : 'text-gray-400'} 
          />
        </div>
        
        <div>
          <h3 className={`font-semibold text-sm ${earned ? 'text-white' : 'text-gray-600'}`}>
            {title}
          </h3>
          <p className={`text-xs ${earned ? 'text-white/80' : 'text-gray-500'}`}>
            {description}
          </p>
        </div>
        
        {!earned && requirement && (
          <div className="mt-2 text-xs text-gray-500">
            {requirement.type === 'streak' && `${requirement.days} day streak`}
            {requirement.type === 'completion' && `${requirement.count} completions`}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Badge;