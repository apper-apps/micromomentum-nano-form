import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Header = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Today';
      case '/goals':
        return 'Goals';
      case '/goals/new':
        return 'New Goal';
      case '/progress':
        return 'Progress';
      case '/profile':
        return 'Profile';
      default:
        if (location.pathname.startsWith('/goals/')) {
          return 'Goal Details';
        }
        return 'MicroMomentum';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <motion.header 
      className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Zap" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold gradient-text">
                  {location.pathname === '/' ? getGreeting() : getPageTitle()}
                </h1>
                {location.pathname === '/' && (
                  <p className="text-sm text-gray-500">Ready to build momentum?</p>
                )}
              </div>
            </motion.div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ApperIcon name="Bell" size={20} className="text-gray-600" />
            </motion.button>
            
            <motion.div
              className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ApperIcon name="User" size={16} className="text-white" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;