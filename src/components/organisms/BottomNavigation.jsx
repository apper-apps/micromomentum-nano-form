import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const BottomNavigation = () => {
const navItems = [
    { path: '/', icon: 'Home', label: 'Today' },
    { path: '/goals', icon: 'Target', label: 'Goals' },
    { path: '/suggestions', icon: 'Lightbulb', label: 'Suggestions' },
    { path: '/progress', icon: 'TrendingUp', label: 'Progress' },
    { path: '/profile', icon: 'User', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center space-y-1 py-2 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ApperIcon 
                      name={item.icon} 
                      size={20} 
                      className={isActive ? 'text-primary' : 'text-gray-500'} 
                    />
                  </motion.div>
                  <span className="text-xs font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;