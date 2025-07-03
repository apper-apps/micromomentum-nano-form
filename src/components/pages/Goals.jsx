import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { goalService } from '@/services/api/goalService';
import { formatDistanceToNow } from 'date-fns';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    filterGoals();
  }, [goals, searchTerm, statusFilter]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await goalService.getAll();
      setGoals(data);
    } catch (err) {
      setError('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const filterGoals = () => {
    let filtered = goals;

    if (searchTerm) {
      filtered = filtered.filter(goal =>
        goal.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(goal => goal.status === statusFilter);
    }

    setFilteredGoals(filtered);
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

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadGoals} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-800">
              Your Goals
            </h1>
            <p className="text-gray-600 mt-2">
              Transform your ambitions into daily habits
            </p>
          </div>
          
          <Link to="/goals/new">
            <Button className="gradient-button">
              <ApperIcon name="Plus" size={20} className="mr-2" />
              New Goal
            </Button>
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SearchBar
            placeholder="Search goals..."
            onSearch={setSearchTerm}
            className="flex-1"
          />
          
          <div className="flex gap-2">
            {['all', 'active', 'paused', 'completed'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Goals Grid */}
        {filteredGoals.length === 0 ? (
          <Empty 
            icon="Target"
            title="No goals found"
            description="Start by creating your first goal to build momentum!"
            actionLabel="Create Goal"
            actionTo="/goals/new"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal, index) => (
              <motion.div
                key={goal.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/goals/${goal.Id}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="space-y-4">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getStatusColor(goal.status)}`}>
                          <ApperIcon 
                            name={getStatusIcon(goal.status)} 
                            size={14} 
                            className="mr-1" 
                          />
                          {goal.status}
                        </div>
                        <ApperIcon name="MoreVertical" size={20} className="text-gray-400" />
                      </div>

                      {/* Goal Title */}
                      <h3 className="text-xl font-display font-bold text-gray-800 line-clamp-2">
                        {goal.title}
                      </h3>

                      {/* AI Analysis Preview */}
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {goal.aiAnalysis}
                      </p>

                      {/* Target Date */}
                      <div className="flex items-center text-sm text-gray-500">
                        <ApperIcon name="Calendar" size={16} className="mr-2" />
                        Target: {formatDistanceToNow(new Date(goal.targetDate), { addSuffix: true })}
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Progress</span>
                          <span className="text-sm font-medium text-gray-700">
                            {goal.status === 'completed' ? '100%' : '45%'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${getStatusColor(goal.status)}`}
                            style={{ width: goal.status === 'completed' ? '100%' : '45%' }}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;