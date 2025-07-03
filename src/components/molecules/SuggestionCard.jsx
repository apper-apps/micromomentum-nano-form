import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const SuggestionCard = ({ suggestion, onAccept, onDismiss }) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await onAccept(suggestion.Id);
      toast.success(`Added "${suggestion.title}" to your habits!`);
    } catch (error) {
      toast.error('Failed to add habit');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDismiss = async () => {
    setIsDismissing(true);
    try {
      await onDismiss(suggestion.Id);
      toast.info('Suggestion dismissed');
    } catch (error) {
      toast.error('Failed to dismiss suggestion');
    } finally {
      setIsDismissing(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeOfDayIcon = (timeOfDay) => {
    switch (timeOfDay) {
      case 'morning': return 'Sunrise';
      case 'afternoon': return 'Sun';
      case 'evening': return 'Sunset';
      default: return 'Clock';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
            <ApperIcon 
              name={suggestion.iconName || 'Plus'} 
              size={24} 
              className="text-white" 
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {suggestion.title}
              </h3>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getDifficultyColor(suggestion.difficulty)}`}
                >
                  {suggestion.difficulty}
                </Badge>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <ApperIcon name={getTimeOfDayIcon(suggestion.timeOfDay)} size={16} />
                  <span className="capitalize">{suggestion.timeOfDay}</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {suggestion.description}
            </p>
            
            <div className="bg-primary/5 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <ApperIcon name="Lightbulb" size={16} className="text-primary" />
                <span className="text-sm font-medium text-primary">Why this works for you:</span>
              </div>
              <p className="text-sm text-gray-700">{suggestion.rationale}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Clock" size={16} />
                  <span>{suggestion.estimatedDuration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Tag" size={16} />
                  <span className="capitalize">{suggestion.category}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDismiss}
                  disabled={isDismissing || isAccepting}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {isDismissing ? (
                    <ApperIcon name="Loader" size={16} className="animate-spin" />
                  ) : (
                    <ApperIcon name="X" size={16} />
                  )}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAccept}
                  disabled={isAccepting || isDismissing}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  {isAccepting ? (
                    <ApperIcon name="Loader" size={16} className="animate-spin mr-2" />
                  ) : (
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                  )}
                  Add Habit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SuggestionCard;