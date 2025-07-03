import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = 'Search...', 
  onSearch, 
  className = '',
  ...props 
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(value);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        
        <motion.input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            isFocused 
              ? 'border-primary focus:border-primary focus:ring-primary/50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          animate={{ scale: isFocused ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
          {...props}
        />
        
        {value && (
          <motion.button
            type="button"
            onClick={() => {
              setValue('');
              onSearch?.('');
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <ApperIcon name="X" size={16} />
          </motion.button>
        )}
      </div>
    </motion.form>
  );
};

export default SearchBar;