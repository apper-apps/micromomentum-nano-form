import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  className = '', 
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';
  
  const stateClasses = error
    ? 'border-error focus:border-error focus:ring-error/50'
    : 'border-gray-200 focus:border-primary focus:ring-primary/50';
    
  const disabledClasses = disabled
    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
    : 'bg-white hover:border-gray-300';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <motion.input
        ref={ref}
        type={type}
        className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
        disabled={disabled}
        whileFocus={{ scale: 1.01 }}
        {...props}
      />
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;