import { badgeData } from '@/services/mockData/badges.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const progressService = {
  async getProgressData(timeFrame = 'week') {
    await delay(350);
    
    const mockData = {
      week: {
        totalHabits: 12,
        completedHabits: 8,
        completionRate: 67,
        streakDays: 23,
        weeklyData: [
          { day: 'Mon', completed: 3, total: 4 },
          { day: 'Tue', completed: 4, total: 4 },
          { day: 'Wed', completed: 2, total: 4 },
          { day: 'Thu', completed: 4, total: 4 },
          { day: 'Fri', completed: 3, total: 4 },
          { day: 'Sat', completed: 2, total: 4 },
          { day: 'Sun', completed: 3, total: 4 }
        ]
      },
      month: {
        totalHabits: 48,
        completedHabits: 32,
        completionRate: 67,
        streakDays: 23,
        monthlyData: Array.from({ length: 30 }, (_, i) => ({
          day: i + 1,
          completed: Math.floor(Math.random() * 5),
          total: 4
        }))
      },
      year: {
        totalHabits: 576,
        completedHabits: 384,
        completionRate: 67,
        streakDays: 23,
        yearlyData: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(0, i).toLocaleDateString('en', { month: 'short' }),
          completed: Math.floor(Math.random() * 100) + 50,
          total: 120
        }))
      }
    };

    return mockData[timeFrame];
  },

  async getBadges() {
    await delay(200);
    return [...badgeData];
  },

  async getWeeklySummary() {
    await delay(300);
    return {
      completedHabits: 8,
      totalHabits: 12,
      completionRate: 67,
      streakDays: 23,
      topPerformingHabits: [
        { name: 'Morning Meditation', completionRate: 100 },
        { name: 'Read 15 minutes', completionRate: 86 },
        { name: 'Exercise 30 minutes', completionRate: 71 }
      ],
      weeklyGoal: 'Complete 10 habits this week',
      nextWeekFocus: 'Focus on consistency with evening routines'
    };
  }
};