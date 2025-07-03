import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import HabitCard from '@/components/molecules/HabitCard';
import ProgressRing from '@/components/molecules/ProgressRing';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { habitService } from '@/services/api/habitService';
import { format } from 'date-fns';

const TodayDashboard = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedHabits, setCompletedHabits] = useState(new Set());

  useEffect(() => {
    loadTodayHabits();
  }, []);

  const loadTodayHabits = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await habitService.getTodayHabits();
      setHabits(data);
    } catch (err) {
      setError('Failed to load today\'s habits');
    } finally {
      setLoading(false);
    }
  };

  const handleHabitComplete = (habitId) => {
    setCompletedHabits(prev => new Set([...prev, habitId]));
    setHabits(prev => prev.map(habit => 
      habit.Id === habitId 
        ? { ...habit, currentStreak: habit.currentStreak + 1 }
        : habit
    ));
  };

  const handleHabitSkip = (habitId) => {
    setCompletedHabits(prev => new Set([...prev, habitId]));
  };

  const getCompletionStats = () => {
    const total = habits.length;
    const completed = completedHabits.size;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTodayHabits} />;
  if (habits.length === 0) return <Empty />;

  const stats = getCompletionStats();
  const activeHabits = habits.filter(habit => !completedHabits.has(habit.Id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <Card className="text-center">
            <ProgressRing progress={stats.percentage} size={100}>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">
                  {stats.percentage}%
                </div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </ProgressRing>
            <p className="mt-4 text-sm text-gray-600">
              {stats.completed} of {stats.total} habits done
            </p>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-yellow-400 flex items-center justify-center">
              <ApperIcon name="Flame" size={32} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {habits.reduce((sum, habit) => sum + habit.currentStreak, 0)}
            </div>
            <p className="text-sm text-gray-600">Total Streak Days</p>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-success to-green-400 flex items-center justify-center">
              <ApperIcon name="Calendar" size={32} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {format(new Date(), 'MMM dd')}
            </div>
<p className="text-sm text-gray-600">Today's Focus</p>
          </Card>
        </motion.div>

        {/* Habit Suggestions */}
        <HabitSuggestionsSection />

        {/* Today's Habits */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-gray-800">
              Today's Habits
            </h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadTodayHabits}
            >
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Refresh
            </Button>
          </div>

          {/* Active Habits */}
          {activeHabits.length > 0 ? (
            <div className="space-y-4">
              {activeHabits.map((habit, index) => (
                <motion.div
                  key={habit.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HabitCard
                    habit={habit}
                    onComplete={handleHabitComplete}
                    onSkip={handleHabitSkip}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-success to-green-400 flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                All Done! 🎉
              </h3>
              <p className="text-gray-600">
                You've completed all your habits for today. Great job!
              </p>
            </Card>
          )}

          {/* Completed Habits */}
          {completedHabits.size > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-display font-semibold text-gray-700">
                Completed Today ({completedHabits.size})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {habits
                  .filter(habit => completedHabits.has(habit.Id))
                  .map((habit, index) => (
                    <motion.div
                      key={habit.Id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-gradient-to-br from-success to-green-400 text-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <ApperIcon name="Check" size={20} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{habit.title}</h4>
                            <p className="text-sm text-white/80">
                              {habit.currentStreak} day streak
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}
        </div>
</div>
    </div>
  );
};

const HabitSuggestionsSection = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const { suggestionService } = await import('@/services/api/suggestionService');
      const data = await suggestionService.generateSuggestions(3);
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || suggestions.length === 0) return null;

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <ApperIcon name="Lightbulb" size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Suggested Habits
              </h3>
              <p className="text-sm text-gray-600">
                Personalized recommendations for you
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/suggestions'}
            className="text-primary border-primary hover:bg-primary hover:text-white"
          >
            <ApperIcon name="ArrowRight" size={16} className="mr-2" />
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.Id}
              className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <ApperIcon
                  name={suggestion.iconName || 'Plus'}
                  size={16}
                  className="text-white"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 truncate">
                  {suggestion.title}
                </h4>
                <p className="text-sm text-gray-600 truncate">
                  {suggestion.description}
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ApperIcon name="Clock" size={14} />
                <span>{suggestion.estimatedDuration}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
export default TodayDashboard;