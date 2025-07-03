import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  padding = 'p-6',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-200';
  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';

  return (
    <motion.div
      className={`${baseClasses} ${hoverClasses} ${padding} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;