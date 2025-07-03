import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import HabitCard from '@/components/molecules/HabitCard';
import ProgressRing from '@/components/molecules/ProgressRing';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { goalService } from '@/services/api/goalService';
import { habitService } from '@/services/api/habitService';
import { progressService } from '@/services/api/progressService';
import { formatDistanceToNow, differenceInDays, format } from 'date-fns';

const GoalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progressViewType, setProgressViewType] = useState('circle');
  const [progressHistory, setProgressHistory] = useState([]);
  const [progressLoading, setProgressLoading] = useState(false);

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
      
      // Load progress history after goal data is loaded
      if (goalData) {
        loadProgressHistory(goalData);
      }
    } catch (err) {
      setError('Failed to load goal details');
    } finally {
      setLoading(false);
    }
  };

  const loadProgressHistory = async (goalData) => {
    try {
      setProgressLoading(true);
      const createdDate = new Date(goalData.createdAt);
      const targetDate = new Date(goalData.targetDate);
      const totalDays = differenceInDays(targetDate, createdDate);
      const daysPassed = differenceInDays(new Date(), createdDate);
      
      // Generate mock progress data showing journey over time
      const progressData = [];
      for (let i = 0; i <= Math.min(daysPassed, totalDays); i += Math.ceil(totalDays / 20)) {
        const date = new Date(createdDate);
        date.setDate(date.getDate() + i);
        const progress = Math.min((i / totalDays) * calculateProgress(), calculateProgress());
        progressData.push({
          date: format(date, 'MMM dd'),
          progress: Math.round(progress + Math.random() * 10), // Add some variation
          habits: Math.floor(habits.length * (progress / 100))
        });
      }
      
      setProgressHistory(progressData);
    } catch (err) {
      console.error('Failed to load progress history:', err);
    } finally {
      setProgressLoading(false);
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

  const calculateTimeProgress = () => {
    if (!goal) return 0;
    const createdDate = new Date(goal.createdAt);
    const targetDate = new Date(goal.targetDate);
    const currentDate = new Date();
    const totalDays = differenceInDays(targetDate, createdDate);
    const daysPassed = differenceInDays(currentDate, createdDate);
    return totalDays > 0 ? Math.round((daysPassed / totalDays) * 100) : 0;
  };

  const getProgressChartOptions = () => ({
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '60%',
        distributed: false
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 0
    },
    xaxis: {
      categories: progressHistory.map(item => item.date),
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        },
        formatter: (val) => `${val}%`
      },
      max: 100
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        gradientToColors: ['#EC4899'],
        inverseColors: false,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100]
      }
    },
    colors: ['#6B46C1'],
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${val}% Complete`
      }
    }
  });

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

        {/* Progress Journey */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <ApperIcon name="TrendingUp" size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-display font-bold text-gray-800">
                  Progress Journey
                </h2>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={progressViewType === 'circle' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setProgressViewType('circle')}
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="Circle" size={14} />
                  <span className="hidden sm:inline">Circle</span>
                </Button>
                <Button
                  variant={progressViewType === 'chart' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setProgressViewType('chart')}
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="BarChart3" size={14} />
                  <span className="hidden sm:inline">Chart</span>
                </Button>
              </div>
            </div>

            {progressViewType === 'circle' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-display font-semibold text-gray-800 mb-2">
                      Goal Completion
                    </h3>
                    <ProgressRing progress={calculateProgress()} size={140}>
                      <div className="text-center">
                        <div className="text-3xl font-bold gradient-text">
                          {calculateProgress()}%
                        </div>
                        <div className="text-sm text-gray-500">Complete</div>
                      </div>
                    </ProgressRing>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-display font-semibold text-gray-800 mb-2">
                      Time Progress
                    </h3>
                    <ProgressRing progress={calculateTimeProgress()} size={140} strokeColor="#F59E0B">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-500">
                          {calculateTimeProgress()}%
                        </div>
                        <div className="text-sm text-gray-500">Time Elapsed</div>
                      </div>
                    </ProgressRing>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-display font-semibold text-gray-800 mb-2">
                    Progress Over Time
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your journey from {format(new Date(goal.createdAt), 'MMM dd, yyyy')} to {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                
                {progressLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loading />
                  </div>
                ) : progressHistory.length > 0 ? (
                  <div className="progress-chart-container">
                    <Chart
                      options={getProgressChartOptions()}
                      series={[{
                        name: 'Progress',
                        data: progressHistory.map(item => item.progress)
                      }]}
                      type="bar"
                      height={300}
                    />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ApperIcon name="BarChart3" size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      Progress data will appear as you work on your habits
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {differenceInDays(new Date(), new Date(goal.createdAt))}
                    </div>
                    <div className="text-sm text-gray-600">Days In</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.max(0, differenceInDays(new Date(goal.targetDate), new Date()))}
                    </div>
                    <div className="text-sm text-gray-600">Days Left</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {habits.filter(h => h.currentStreak > 0).length}
                    </div>
                    <div className="text-sm text-gray-600">Active Habits</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.max(...habits.map(h => h.currentStreak), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Best Streak</div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* AI Analysis */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
          transition={{ delay: 0.3 }}
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
          transition={{ delay: 0.4 }}
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