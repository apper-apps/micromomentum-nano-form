import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ProgressRing from '@/components/molecules/ProgressRing';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { progressService } from '@/services/api/progressService';
import { format, subDays } from 'date-fns';

const Progress = () => {
  const [progressData, setProgressData] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeFrame, setTimeFrame] = useState('week');

  useEffect(() => {
    loadProgressData();
    loadBadges();
  }, [timeFrame]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await progressService.getProgressData(timeFrame);
      setProgressData(data);
    } catch (err) {
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const loadBadges = async () => {
    try {
      const data = await progressService.getBadges();
      setBadges(data);
    } catch (err) {
      console.error('Failed to load badges:', err);
    }
  };

  const getWeeklyData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      days.push({
        date: format(date, 'EEE'),
        completion: Math.floor(Math.random() * 100) + 1
      });
    }
    return days;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProgressData} />;

  const weeklyData = getWeeklyData();
  const earnedBadges = badges.filter(badge => badge.earned);
  const availableBadges = badges.filter(badge => !badge.earned);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-800">
              Progress Overview
            </h1>
            <p className="text-gray-600 mt-2">
              Track your journey and celebrate achievements
            </p>
          </div>
          
          <div className="flex gap-2">
            {['week', 'month', 'year'].map((period) => (
              <Button
                key={period}
                variant={timeFrame === period ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTimeFrame(period)}
                className="capitalize"
              >
                {period}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="text-center">
            <ProgressRing progress={78} size={80}>
              <div className="text-center">
                <div className="text-lg font-bold gradient-text">78%</div>
              </div>
            </ProgressRing>
            <h3 className="font-semibold text-gray-800 mt-3">Weekly Average</h3>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <ApperIcon name="Flame" size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800">23</div>
            <p className="text-sm text-gray-600">Current Streak</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-success to-green-400 flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800">147</div>
            <p className="text-sm text-gray-600">Total Completions</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-accent to-yellow-400 flex items-center justify-center">
              <ApperIcon name="Award" size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{earnedBadges.length}</div>
            <p className="text-sm text-gray-600">Badges Earned</p>
          </Card>
        </motion.div>

        {/* Weekly Progress Chart */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h3 className="text-xl font-display font-bold text-gray-800 mb-6">
              Weekly Progress
            </h3>
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={day.date} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">
                    {day.date}
                  </div>
                  <div className="flex-1 relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        className="h-3 rounded-full bg-gradient-to-r from-primary to-secondary"
                        initial={{ width: 0 }}
                        animate={{ width: `${day.completion}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-sm font-medium text-gray-800">
                    {day.completion}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Badges Section */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Earned Badges */}
          <div>
            <h3 className="text-xl font-display font-bold text-gray-800 mb-4">
              Earned Badges ({earnedBadges.length})
            </h3>
            {earnedBadges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {earnedBadges.map((badge) => (
                  <Badge
                    key={badge.Id}
                    {...badge}
                    earned={true}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <ApperIcon name="Award" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No badges earned yet. Keep building those habits!</p>
              </Card>
            )}
          </div>

          {/* Available Badges */}
          <div>
            <h3 className="text-xl font-display font-bold text-gray-800 mb-4">
              Available Badges
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {availableBadges.map((badge) => (
                <Badge
                  key={badge.Id}
                  {...badge}
                  earned={false}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Progress;