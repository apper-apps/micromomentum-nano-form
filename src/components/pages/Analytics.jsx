import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { analyticsService } from '@/services/api/analyticsService';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await analyticsService.getOverallAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAnalytics} />;
  if (!analytics) return <Error message="No analytics data available" onRetry={loadAnalytics} />;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'correlations', label: 'Correlations', icon: 'GitBranch' },
    { id: 'patterns', label: 'Patterns', icon: 'Calendar' },
    { id: 'performance', label: 'Performance', icon: 'TrendingUp' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-800">
                Habit Analytics
              </h1>
              <p className="text-gray-600 mt-2">
                Discover patterns and correlations in your habit data
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={loadAnalytics}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="RefreshCw" size={16} />
              <span>Refresh</span>
            </Button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 flex-1 ${
                  activeTab === tab.id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <OverviewTab analytics={analytics} />}
          {activeTab === 'correlations' && <CorrelationsTab analytics={analytics} />}
          {activeTab === 'patterns' && <PatternsTab analytics={analytics} />}
          {activeTab === 'performance' && <PerformanceTab analytics={analytics} />}
        </motion.div>
      </div>
    </div>
  );
};

const OverviewTab = ({ analytics }) => {
  const { insights, clusters } = analytics;

  return (
    <div className="space-y-8">
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <ApperIcon name="Target" size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{insights.totalHabits}</div>
          <p className="text-sm text-gray-600">Total Habits</p>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-success to-green-400 flex items-center justify-center">
            <ApperIcon name="Flame" size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {Math.round(insights.averageStreak)}
          </div>
          <p className="text-sm text-gray-600">Avg Streak</p>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-yellow-400 flex items-center justify-center">
            <ApperIcon name="Calendar" size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {insights.peakDay.day}
          </div>
          <p className="text-sm text-gray-600">Peak Day</p>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <ApperIcon name="Clock" size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {insights.preferredTime}
          </div>
          <p className="text-sm text-gray-600">Preferred Time</p>
        </Card>
      </div>

      {/* Habit Clusters */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-6">Habit Performance Clusters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(clusters.clusterSizes).map(([cluster, count]) => (
            <div key={cluster} className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-gray-800 mb-2">{count}</div>
              <div className="text-sm font-medium text-gray-600 mb-2 capitalize">
                {cluster.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-xs text-gray-500">
                {clusters.recommendations[cluster]}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const CorrelationsTab = ({ analytics }) => {
  const { correlations } = analytics;
  
  const heatmapOptions = {
    chart: { type: 'heatmap', toolbar: { show: false } },
    dataLabels: { enabled: false },
    colors: ['#8B5CF6'],
    xaxis: { categories: correlations.habits },
    yaxis: { categories: correlations.habits },
    title: { text: 'Habit Correlation Heatmap', style: { fontSize: '16px', fontWeight: '600' } }
  };

  const heatmapSeries = correlations.habits.map((habit, index) => ({
    name: habit,
    data: correlations.matrix[index].map((value, colIndex) => ({
      x: correlations.habits[colIndex],
      y: value
    }))
  }));

  return (
    <div className="space-y-8">
      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-6">Habit Correlations</h3>
        <Chart
          options={heatmapOptions}
          series={heatmapSeries}
          type="heatmap"
          height={400}
        />
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-6">Strongest Correlations</h3>
        <div className="space-y-4">
          {correlations.correlations.slice(0, 5).map((correlation, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-gray-800">
                  {correlation.habit1} + {correlation.habit2}
                </div>
                <div className="text-sm text-gray-600">
                  {correlation.sharedDays} shared completion days
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {Math.round(correlation.correlation * 100)}%
                </div>
                <div className="text-xs text-gray-500">correlation</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const PatternsTab = ({ analytics }) => {
  const { dayPatterns, timeDistribution } = analytics;

  const dayPatternOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 8, columnWidth: '60%' } },
    colors: ['#8B5CF6'],
    xaxis: { categories: dayPatterns.chartData.map(d => d.x) },
    title: { text: 'Completions by Day of Week', style: { fontSize: '16px', fontWeight: '600' } }
  };

  const timeDistributionOptions = {
    chart: { type: 'donut', toolbar: { show: false } },
    labels: timeDistribution.labels,
    colors: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'],
    title: { text: 'Time of Day Distribution', style: { fontSize: '16px', fontWeight: '600' } },
    legend: { position: 'bottom' }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <Chart
            options={dayPatternOptions}
            series={[{ data: dayPatterns.chartData.map(d => d.y) }]}
            type="bar"
            height={300}
          />
        </Card>

        <Card>
          <Chart
            options={timeDistributionOptions}
            series={timeDistribution.chartData}
            type="donut"
            height={300}
          />
        </Card>
      </div>

      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-6">Pattern Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <ApperIcon name="Calendar" size={24} className="mx-auto mb-3 text-blue-600" />
            <div className="font-bold text-gray-800">{dayPatterns.peakDay.day}</div>
            <div className="text-sm text-gray-600">Most Active Day</div>
            <div className="text-xs text-blue-600 mt-1">
              {dayPatterns.peakDay.count} completions
            </div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-xl">
            <ApperIcon name="Clock" size={24} className="mx-auto mb-3 text-green-600" />
            <div className="font-bold text-gray-800">
              {timeDistribution.labels[timeDistribution.chartData.indexOf(Math.max(...timeDistribution.chartData))]}
            </div>
            <div className="text-sm text-gray-600">Preferred Time</div>
            <div className="text-xs text-green-600 mt-1">
              {Math.max(...timeDistribution.chartData)} completions
            </div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <ApperIcon name="TrendingUp" size={24} className="mx-auto mb-3 text-purple-600" />
            <div className="font-bold text-gray-800">{dayPatterns.totalCompletions}</div>
            <div className="text-sm text-gray-600">Total Completions</div>
            <div className="text-xs text-purple-600 mt-1">All habits combined</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const PerformanceTab = ({ analytics }) => {
  const { streaks } = analytics;

  const scatterOptions = {
    chart: { type: 'scatter', toolbar: { show: false } },
    colors: ['#8B5CF6'],
    xaxis: { 
      title: { text: 'Total Completions' },
      labels: { style: { fontSize: '12px' } }
    },
    yaxis: { 
      title: { text: 'Current Streak' },
      labels: { style: { fontSize: '12px' } }
    },
    title: { 
      text: 'Habit Performance: Completions vs Current Streak', 
      style: { fontSize: '16px', fontWeight: '600' } 
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const data = streaks.chartData[dataPointIndex];
        return `<div class="p-3 bg-white shadow-lg rounded-lg border">
          <div class="font-medium">${data.habitName}</div>
          <div class="text-sm text-gray-600">Completions: ${data.x}</div>
          <div class="text-sm text-gray-600">Current Streak: ${data.y}</div>
          <div class="text-sm text-gray-600">Longest Streak: ${data.z}</div>
          <div class="text-sm text-gray-600">Time: ${data.timeOfDay}</div>
        </div>`;
      }
    }
  };

  const scatterSeries = [{
    name: 'Habits',
    data: streaks.chartData.map(item => [item.x, item.y])
  }];

  return (
    <div className="space-y-8">
      <Card>
        <Chart
          options={scatterOptions}
          series={scatterSeries}
          type="scatter"
          height={400}
        />
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-6">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-success to-green-400 text-white rounded-xl">
            <ApperIcon name="Award" size={32} className="mx-auto mb-3" />
            <div className="text-2xl font-bold">{streaks.topPerformer?.name || 'N/A'}</div>
            <div className="text-sm opacity-90">Top Performer</div>
            <div className="text-xs opacity-75 mt-1">
              {streaks.topPerformer?.current || 0} day streak
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-primary to-accent text-white rounded-xl">
            <ApperIcon name="BarChart3" size={32} className="mx-auto mb-3" />
            <div className="text-2xl font-bold">{Math.round(streaks.averageStreak)}</div>
            <div className="text-sm opacity-90">Average Streak</div>
            <div className="text-xs opacity-75 mt-1">Across all habits</div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-accent to-yellow-400 text-white rounded-xl">
            <ApperIcon name="Target" size={32} className="mx-auto mb-3" />
            <div className="text-2xl font-bold">{streaks.totalCompletions}</div>
            <div className="text-sm opacity-90">Total Completions</div>
            <div className="text-xs opacity-75 mt-1">All time</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;