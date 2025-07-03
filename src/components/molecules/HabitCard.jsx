import { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { formatDistanceToNow } from 'date-fns';

const HabitCard = ({ 
  habit, 
  onComplete, 
  onSkip,
  className = '' 
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const handleDragEnd = (event, info) => {
    const { offset, velocity } = info;
    
    if (offset.x > 150 || velocity.x > 500) {
      // Swipe right - complete
      setIsCompleted(true);
      setSwipeDirection('right');
      toast.success(`${habit.title} completed! 🎉`);
      onComplete?.(habit.Id);
    } else if (offset.x < -150 || velocity.x < -500) {
      // Swipe left - skip
      setSwipeDirection('left');
      toast.info(`${habit.title} skipped for today`);
      onSkip?.(habit.Id);
    }
  };

  const getTimeOfDayIcon = (timeOfDay) => {
    const icons = {
      morning: 'Sunrise',
      afternoon: 'Sun',
      evening: 'Sunset',
      anytime: 'Clock'
    };
    return icons[timeOfDay] || 'Clock';
  };

  const getStreakColor = (streak) => {
    if (streak >= 30) return 'from-purple-500 to-pink-500';
    if (streak >= 14) return 'from-blue-500 to-purple-500';
    if (streak >= 7) return 'from-green-500 to-blue-500';
    return 'from-gray-400 to-gray-500';
  };

  return (
    <motion.div
      className={`swipe-container relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Swipe Indicators */}
      <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none z-10">
        <div className="flex items-center space-x-2 text-success">
          <ApperIcon name="Check" size={20} />
          <span className="font-semibold">Complete</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <span className="font-semibold">Skip</span>
          <ApperIcon name="X" size={20} />
        </div>
      </div>

      <motion.div
        className={`habit-card rounded-2xl p-6 shadow-lg border-2 ${
          isCompleted ? 'completed' : 'border-gray-100'
        }`}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        whileHover={{ scale: 1.02 }}
        whileDrag={{ scale: 1.05, rotate: 2 }}
        animate={{
          x: swipeDirection === 'right' ? 300 : swipeDirection === 'left' ? -300 : 0,
          opacity: swipeDirection ? 0 : 1
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <ApperIcon 
                name={getTimeOfDayIcon(habit.timeOfDay)} 
                size={18} 
                className="text-white" 
              />
            </div>
            <div>
              <h3 className={`font-semibold ${isCompleted ? 'text-white' : 'text-gray-800'}`}>
                {habit.title}
              </h3>
              <p className={`text-sm ${isCompleted ? 'text-white/80' : 'text-gray-500'}`}>
                {habit.timeOfDay} • {habit.frequency}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className={`flex items-center space-x-1 ${isCompleted ? 'text-white' : 'text-gray-600'}`}>
                <ApperIcon name="Flame" size={16} />
                <span className="font-bold">{habit.currentStreak}</span>
              </div>
              <p className={`text-xs ${isCompleted ? 'text-white/80' : 'text-gray-500'}`}>
                day streak
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isCompleted ? 'text-white/80' : 'text-gray-500'}`}>
              Current Streak
            </span>
            <div className="flex items-center space-x-2">
              <div className={`w-16 h-2 rounded-full bg-gradient-to-r ${getStreakColor(habit.currentStreak)}`} />
              <span className={`text-xs font-medium ${isCompleted ? 'text-white' : 'text-gray-600'}`}>
                {habit.currentStreak} days
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-sm ${isCompleted ? 'text-white/80' : 'text-gray-500'}`}>
              Best Streak
            </span>
            <span className={`text-sm font-medium ${isCompleted ? 'text-white' : 'text-gray-600'}`}>
              {habit.longestStreak} days
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200/20">
          <div className="flex items-center justify-between">
            <span className={`text-xs ${isCompleted ? 'text-white/60' : 'text-gray-400'}`}>
              Swipe right to complete, left to skip
            </span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <div className="w-2 h-2 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HabitCard;