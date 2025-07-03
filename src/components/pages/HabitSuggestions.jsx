import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import SuggestionCard from '@/components/molecules/SuggestionCard';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { suggestionService } from '@/services/api/suggestionService';

const HabitSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filterOptions = [
    { value: 'all', label: 'All Suggestions', icon: 'Grid' },
    { value: 'morning', label: 'Morning', icon: 'Sunrise' },
    { value: 'afternoon', label: 'Afternoon', icon: 'Sun' },
    { value: 'evening', label: 'Evening', icon: 'Sunset' },
    { value: 'easy', label: 'Easy', icon: 'Zap' },
    { value: 'medium', label: 'Medium', icon: 'TrendingUp' },
    { value: 'hard', label: 'Advanced', icon: 'Target' }
  ];

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await suggestionService.generateSuggestions(15);
      setSuggestions(data);
    } catch (err) {
      setError('Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await suggestionService.generateSuggestions(15);
      setSuggestions(data);
      toast.success('Suggestions refreshed!');
    } catch (err) {
      toast.error('Failed to refresh suggestions');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAcceptSuggestion = async (suggestionId) => {
    try {
      await suggestionService.acceptSuggestion(suggestionId);
      setSuggestions(prev => prev.filter(s => s.Id !== suggestionId));
      return true;
    } catch (error) {
      throw error;
    }
  };

  const handleDismissSuggestion = async (suggestionId) => {
    try {
      await suggestionService.dismissSuggestion(suggestionId);
      setSuggestions(prev => prev.filter(s => s.Id !== suggestionId));
      return true;
    } catch (error) {
      throw error;
    }
  };

  const filteredSuggestions = suggestions.filter(suggestion => {
    if (filter === 'all') return true;
    if (['morning', 'afternoon', 'evening'].includes(filter)) {
      return suggestion.timeOfDay === filter;
    }
    if (['easy', 'medium', 'hard'].includes(filter)) {
      return suggestion.difficulty === filter;
    }
    return true;
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSuggestions} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Lightbulb" size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
            Habit Suggestions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Personalized habit recommendations based on your current routines and goals
          </p>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="text-center mb-8">
            <div className="flex items-center justify-center space-x-8">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {suggestions.length}
                </div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div>
                <div className="text-2xl font-bold text-accent">
                  {filteredSuggestions.length}
                </div>
                <div className="text-sm text-gray-600">Filtered</div>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2"
              >
                <ApperIcon 
                  name="RefreshCw" 
                  size={16} 
                  className={refreshing ? 'animate-spin' : ''} 
                />
                <span>Refresh</span>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter(option.value)}
                className="flex items-center space-x-2"
              >
                <ApperIcon name={option.icon} size={16} />
                <span>{option.label}</span>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Suggestions Grid */}
        {filteredSuggestions.length === 0 ? (
          <Empty message="No suggestions match your current filter" />
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SuggestionCard
                  suggestion={suggestion}
                  onAccept={handleAcceptSuggestion}
                  onDismiss={handleDismissSuggestion}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HabitSuggestions;