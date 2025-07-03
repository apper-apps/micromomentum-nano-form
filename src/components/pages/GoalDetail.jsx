import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import HabitCard from '@/components/molecules/HabitCard';
import ProgressRing from '@/components/molecules/ProgressRing';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { goalService } from '@/services/api/goalService';
import { habitService } from '@/services/api/habitService';
import { formatDistanceToNow } from 'date-fns';

const GoalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGoalData();
  }, [id]);

  const loadGoalData = async () => {
    try {
      setLoading(true);
      setError('');
      const [goalData, habitData] = await Promise.all([
        goalService.getById(parseInt(id)),
        habitService.getByGoalId(parseInt(id))
      ]);
      setGoal(goalData);
      setHabits(habitData);
    } catch (err) {
      setError('Failed to load goal details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await goalService.update(goal.Id, { ...goal, status: newStatus });
      setGoal(prev => ({ ...prev, status: newStatus }));
      toast.success(`Goal ${newStatus}!`);
    } catch (err) {
      toast.error('Failed to update goal status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalService.delete(goal.Id);
        toast.success('Goal deleted successfully');
        navigate('/goals');
      } catch (err) {
        toast.error('Failed to delete goal');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'from-success to-green-400',
      paused: 'from-warning to-yellow-400',
      completed: 'from-primary to-secondary'
    };
    return colors[status] || 'from-gray-400 to-gray-500';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: 'Play',
      paused: 'Pause',
      completed: 'CheckCircle'
    };
    return icons[status] || 'Circle';
  };

  const calculateProgress = () => {
    const totalHabits = habits.length;
    const completedHabits = habits.filter(habit => habit.currentStreak > 0).length;
    return totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadGoalData} />;
  if (!goal) return <Error message="Goal not found" onRetry={() => navigate('/goals')} />;

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/goals')}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" size={20} />
              <span>Back to Goals</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getStatusColor(goal.status)}`}>
                <ApperIcon name={getStatusIcon(goal.status)} size={14} className="inline mr-1" />
                {goal.status}
              </div>
              
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {}}
                >
                  <ApperIcon name="MoreVertical" size={16} />
                </Button>
              </div>
            </div>
          </div>

          <Card>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-display font-bold text-gray-800 mb-4">
                  {goal.title}
                </h1>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Calendar" size={16} />
                    <span>Target: {formatDistanceToNow(new Date(goal.targetDate), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Clock" size={16} />
                    <span>Created {formatDistanceToNow(new Date(goal.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {goal.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-4">
                <ProgressRing progress={progress} size={120}>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">
                      {progress}%
                    </div>
                    <div className="text-sm text-gray-500">Complete</div>
                  </div>
                </ProgressRing>
                
                <div className="text-center">
                  <div className="text-sm text-gray-600">
                    {habits.filter(h => h.currentStreak > 0).length} of {habits.length} habits active
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Analysis */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <ApperIcon name="Brain" size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-display font-bold text-gray-800">
                AI Breakdown
              </h2>
            </div>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {goal.aiAnalysis}
              </pre>
            </div>
          </Card>
        </motion.div>

        {/* Habits */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-gray-800">
              Daily Habits ({habits.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('Add habit feature coming soon!')}
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Habit
            </Button>
          </div>

          {habits.length > 0 ? (
            <div className="space-y-4">
              {habits.map((habit, index) => (
                <motion.div
                  key={habit.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HabitCard
                    habit={habit}
                    onComplete={() => toast.success('Habit completed!')}
                    onSkip={() => toast.info('Habit skipped')}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <ApperIcon name="Target" size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                No habits have been created for this goal yet.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => toast.info('Add habit feature coming soon!')}
              >
                Create First Habit
              </Button>
            </Card>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex justify-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {goal.status === 'active' && (
            <Button
              variant="warning"
              onClick={() => handleStatusUpdate('paused')}
            >
              <ApperIcon name="Pause" size={16} className="mr-2" />
              Pause Goal
            </Button>
          )}
          
          {goal.status === 'paused' && (
            <Button
              variant="success"
              onClick={() => handleStatusUpdate('active')}
            >
              <ApperIcon name="Play" size={16} className="mr-2" />
              Resume Goal
            </Button>
          )}
          
          {goal.status !== 'completed' && (
            <Button
              variant="success"
              onClick={() => handleStatusUpdate('completed')}
            >
              <ApperIcon name="CheckCircle" size={16} className="mr-2" />
              Mark Complete
            </Button>
          )}
          
          <Button
            variant="error"
            onClick={handleDelete}
          >
            <ApperIcon name="Trash2" size={16} className="mr-2" />
            Delete Goal
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default GoalDetail;