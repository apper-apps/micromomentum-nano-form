import { habitService } from '@/services/api/habitService';
import { 
  calculateHabitCorrelations, 
  getDayOfWeekPatterns, 
  getTimeOfDayDistribution,
  getHabitStreakCorrelation,
  getCompletionTrends,
  getHabitClusters
} from '@/utils/habitUtils';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const analyticsService = {
  async getCorrelationMatrix() {
    await delay(300);
    const habits = await habitService.getAll();
    const correlations = calculateHabitCorrelations(habits);
    
    // Prepare heatmap data for ApexCharts
    const habitNames = [...new Set([
      ...correlations.map(c => c.habit1),
      ...correlations.map(c => c.habit2)
    ])];
    
    const matrix = habitNames.map(habit1 => 
      habitNames.map(habit2 => {
        if (habit1 === habit2) return 1;
        const correlation = correlations.find(c => 
          (c.habit1 === habit1 && c.habit2 === habit2) ||
          (c.habit1 === habit2 && c.habit2 === habit1)
        );
        return correlation ? correlation.correlation : 0;
      })
    );
    
    return {
      habits: habitNames,
      matrix,
      correlations
    };
  },

  async getDayPatternAnalysis() {
    await delay(300);
    const habits = await habitService.getAll();
    const dayPatterns = getDayOfWeekPatterns(habits);
    
    return {
      chartData: Object.entries(dayPatterns).map(([day, count]) => ({
        x: day,
        y: count
      })),
      totalCompletions: Object.values(dayPatterns).reduce((sum, count) => sum + count, 0),
      peakDay: Object.entries(dayPatterns).reduce((max, [day, count]) => 
        count > max.count ? { day, count } : max, { day: '', count: 0 })
    };
  },

  async getTimeDistributionAnalysis() {
    await delay(300);
    const habits = await habitService.getAll();
    const timeDistribution = getTimeOfDayDistribution(habits);
    
    return {
      chartData: Object.entries(timeDistribution).map(([time, count]) => count),
      labels: Object.keys(timeDistribution).map(time => 
        time.charAt(0).toUpperCase() + time.slice(1)
      ),
      totalCompletions: Object.values(timeDistribution).reduce((sum, count) => sum + count, 0)
    };
  },

async getStreakAnalysis() {
    await delay(300);
    const habits = await habitService.getAll();
    const streakData = getHabitStreakCorrelation(habits);
    
    if (!streakData || streakData.length === 0) {
      return {
        chartData: [],
        averageStreak: 0,
        totalCompletions: 0,
        topPerformer: null
      };
    }
    
    const chartData = streakData.map(habit => ({
      x: habit.completions,
      y: habit.current,
      z: habit.longest,
      habitName: habit.name,
      timeOfDay: habit.timeOfDay
    }));
    
    return {
      chartData,
      averageStreak: Math.round((streakData.reduce((sum, h) => sum + h.current, 0) / streakData.length) * 10) / 10,
      totalCompletions: streakData.reduce((sum, h) => sum + h.completions, 0),
      topPerformer: streakData[0] || null
    };
  },

async getCompletionTrendAnalysis() {
    await delay(300);
    const habits = await habitService.getAll();
    const trendData = getCompletionTrends(habits);
    
    if (!trendData.trends || !trendData.habitConsistency) {
      return {
        trends: [],
        consistencyRanking: [],
        averageConsistency: 0
      };
    }
    
    const consistencyData = trendData.habitConsistency
      .filter(habit => habit.consistency > 0)
      .sort((a, b) => b.consistency - a.consistency);
    
    return {
      trends: trendData.trends,
      consistencyRanking: consistencyData,
      averageConsistency: consistencyData.length > 0 ? 
        Math.round(consistencyData.reduce((sum, h) => sum + h.consistency, 0) / consistencyData.length) : 0
    };
  },

async getHabitClusterAnalysis() {
    await delay(300);
    const habits = await habitService.getAll();
    const clusters = getHabitClusters(habits);
    
    return {
      clusters,
      clusterSizes: {
        highPerformers: clusters.highPerformers?.length || 0,
        consistent: clusters.consistent?.length || 0,
        struggling: clusters.struggling?.length || 0,
        new: clusters.new?.length || 0
      },
      recommendations: {
        highPerformers: "Consider adding more challenging habits",
        consistent: "Great job! Keep maintaining your routine",
        struggling: "Focus on building smaller, easier habits first",
        new: "Start with simple, achievable daily goals"
      }
    };
  },

  async getOverallAnalytics() {
    await delay(400);
    const [correlations, dayPatterns, timeDistribution, streaks, clusters] = await Promise.all([
      this.getCorrelationMatrix(),
      this.getDayPatternAnalysis(),
      this.getTimeDistributionAnalysis(), 
      this.getStreakAnalysis(),
      this.getHabitClusterAnalysis()
    ]);
    
    return {
      correlations,
      dayPatterns,
      timeDistribution,
      streaks,
      clusters,
      insights: {
        strongestCorrelation: correlations.correlations[0],
        peakDay: dayPatterns.peakDay,
        preferredTime: timeDistribution.labels[timeDistribution.chartData.indexOf(Math.max(...timeDistribution.chartData))],
        averageStreak: streaks.averageStreak,
        totalHabits: clusters.clusterSizes.highPerformers + clusters.clusterSizes.consistent + 
                    clusters.clusterSizes.struggling + clusters.clusterSizes.new
      }
    };
  }
};