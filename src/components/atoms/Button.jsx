import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'gradient-button text-white shadow-lg hover:shadow-xl focus:ring-primary/50',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    success: 'bg-gradient-to-r from-success to-green-400 text-white shadow-lg hover:shadow-xl focus:ring-success/50',
    warning: 'bg-gradient-to-r from-warning to-yellow-400 text-white shadow-lg hover:shadow-xl focus:ring-warning/50',
    error: 'bg-gradient-to-r from-error to-red-400 text-white shadow-lg hover:shadow-xl focus:ring-error/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer';

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;