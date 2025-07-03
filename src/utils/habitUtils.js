export const calculateStreak = (completions) => {
  if (!completions || completions.length === 0) return 0;
  
  const sortedCompletions = [...completions].sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  let currentDate = new Date();
  
  for (const completion of sortedCompletions) {
    const completionDate = new Date(completion);
    const diffTime = Math.abs(currentDate - completionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      streak++;
      currentDate = completionDate;
    } else {
      break;
    }
  }
  
  return streak;
};

export const getCompletionRate = (completions, totalDays) => {
  if (!completions || totalDays === 0) return 0;
  return Math.round((completions.length / totalDays) * 100);
};

export const getWeeklyProgress = (habits) => {
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  
  const weeklyData = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    
    const dayCompletions = habits.filter(habit => 
      habit.completions.some(completion => 
        new Date(completion).toDateString() === date.toDateString()
      )
    ).length;
    
    weeklyData.push({
      date: date.toLocaleDateString('en', { weekday: 'short' }),
      completed: dayCompletions,
      total: habits.length
    });
  }
  
  return weeklyData;
};

export const getBadgeProgress = (habits, badgeRequirement) => {
  switch (badgeRequirement.type) {
    case 'streak':
      const maxStreak = Math.max(...habits.map(h => h.currentStreak));
      return Math.min(maxStreak / badgeRequirement.days, 1);
    
    case 'completion':
      const totalCompletions = habits.reduce((sum, h) => sum + h.completions.length, 0);
      return Math.min(totalCompletions / badgeRequirement.count, 1);
    
    case 'timeOfDay':
      const timeCompletions = habits
        .filter(h => h.timeOfDay === badgeRequirement.period)
        .reduce((sum, h) => sum + h.completions.length, 0);
      return Math.min(timeCompletions / badgeRequirement.count, 1);
    
default:
      return 0;
  }
};

export const analyzeHabitPatterns = (habits) => {
  const patterns = {
    preferredTimes: {},
    averageStreak: 0,
    consistencyScore: 0,
    activeGoals: new Set(),
    completionRate: 0
  };
  
  if (!habits || habits.length === 0) return patterns;
  
  // Analyze preferred times
  habits.forEach(habit => {
    patterns.preferredTimes[habit.timeOfDay] = (patterns.preferredTimes[habit.timeOfDay] || 0) + 1;
    patterns.activeGoals.add(habit.goalId);
  });
  
  // Calculate average streak
  patterns.averageStreak = habits.reduce((sum, h) => sum + h.currentStreak, 0) / habits.length;
  
  // Calculate consistency score (based on completion rate)
  const totalPossibleCompletions = habits.length * 30; // Last 30 days
  const actualCompletions = habits.reduce((sum, h) => sum + h.completions.length, 0);
  patterns.consistencyScore = actualCompletions / totalPossibleCompletions;
  
  return patterns;
};

export const findAvailableTimeSlots = (habits) => {
  const timeSlots = ['morning', 'afternoon', 'evening', 'anytime'];
  const usedSlots = habits.map(h => h.timeOfDay);
  const slotCount = {};
  
  timeSlots.forEach(slot => {
    slotCount[slot] = usedSlots.filter(used => used === slot).length;
  });
  
  // Return slots sorted by availability (least used first)
  return Object.entries(slotCount)
    .sort(([,a], [,b]) => a - b)
    .map(([slot]) => slot);
};

export const calculateHabitSimilarity = (habit1, habit2) => {
  let similarity = 0;
  
  // Same time of day
  if (habit1.timeOfDay === habit2.timeOfDay) similarity += 0.4;
  
  // Same goal
  if (habit1.goalId === habit2.goalId) similarity += 0.3;
  
  // Similar frequency
  if (habit1.frequency === habit2.frequency) similarity += 0.2;
  
  // Similar streak performance
  const streakDiff = Math.abs(habit1.currentStreak - habit2.currentStreak);
  if (streakDiff <= 5) similarity += 0.1;
  
  return similarity;
};

export const getHabitRecommendationScore = (suggestion, userHabits, userPatterns) => {
  let score = 0;
  
  // Prefer time slots that aren't overloaded
  const timeSlotUsage = userPatterns.preferredTimes[suggestion.timeOfDay] || 0;
  score += Math.max(0, 1 - (timeSlotUsage / 5)); // Penalize if more than 5 habits in same slot
  
  // Boost score for goals user is actively working on
  if (userPatterns.activeGoals.has(suggestion.goalId)) {
    score += 0.5;
  }
  
  // Consider user's consistency level
  if (userPatterns.consistencyScore > 0.7 && suggestion.difficulty === 'easy') {
    score += 0.3; // Consistent users can handle more habits
  } else if (userPatterns.consistencyScore < 0.5 && suggestion.difficulty === 'hard') {
    score -= 0.3; // Struggling users need easier habits
}
  
  return Math.max(0, Math.min(1, score));
};

// Advanced Analytics Functions
export const calculateHabitCorrelations = (habits) => {
  if (!habits || habits.length < 2) return [];
  
  const correlations = [];
  
  for (let i = 0; i < habits.length; i++) {
    for (let j = i + 1; j < habits.length; j++) {
      const habit1 = habits[i];
      const habit2 = habits[j];
      
      if (!habit1.completions || !habit2.completions) continue;
      
      // Calculate correlation based on completion overlap
      const habit1Dates = new Set(habit1.completions.map(c => new Date(c).toDateString()));
      const habit2Dates = new Set(habit2.completions.map(c => new Date(c).toDateString()));
      
      const intersection = new Set([...habit1Dates].filter(x => habit2Dates.has(x)));
      const union = new Set([...habit1Dates, ...habit2Dates]);
      
      const correlation = union.size > 0 ? intersection.size / union.size : 0;
      
      if (correlation > 0.1) { // Only include meaningful correlations
        correlations.push({
          habit1: habit1.name,
          habit2: habit2.name,
          correlation: Math.round(correlation * 100) / 100,
          strength: correlation > 0.7 ? 'strong' : correlation > 0.4 ? 'moderate' : 'weak'
        });
      }
    }
  }
  
  return correlations.sort((a, b) => b.correlation - a.correlation);
};

export const getDayOfWeekPatterns = (habits) => {
  if (!habits || habits.length === 0) return {};
  
  const dayPatterns = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0
  };
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let totalCompletions = 0;
  
  habits.forEach(habit => {
    if (!habit.completions) return;
    
    habit.completions.forEach(completion => {
      const date = new Date(completion);
      const dayName = dayNames[date.getDay()];
      dayPatterns[dayName]++;
      totalCompletions++;
    });
  });
  
  // Convert to percentages
  Object.keys(dayPatterns).forEach(day => {
    dayPatterns[day] = totalCompletions > 0 ? 
      Math.round((dayPatterns[day] / totalCompletions) * 100) : 0;
  });
  
  return dayPatterns;
};

export const getTimeOfDayDistribution = (habits) => {
  if (!habits || habits.length === 0) return {};
  
  const timeDistribution = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    anytime: 0
  };
  
  habits.forEach(habit => {
    if (habit.timeOfDay && timeDistribution.hasOwnProperty(habit.timeOfDay)) {
      timeDistribution[habit.timeOfDay]++;
    }
  });
  
  const total = Object.values(timeDistribution).reduce((sum, count) => sum + count, 0);
  
  // Convert to percentages
  Object.keys(timeDistribution).forEach(time => {
    timeDistribution[time] = total > 0 ? 
      Math.round((timeDistribution[time] / total) * 100) : 0;
  });
  
  return timeDistribution;
};

export const getHabitStreakCorrelation = (habits) => {
  if (!habits || habits.length === 0) return { correlation: 0, insights: [] };
  
  const streakData = habits.map(habit => ({
    name: habit.name,
    streak: habit.currentStreak || 0,
    completionRate: habit.completions ? 
      getCompletionRate(habit.completions, 30) : 0,
    timeOfDay: habit.timeOfDay
  }));
  
  // Calculate correlation between streak and completion rate
  const streaks = streakData.map(h => h.streak);
  const rates = streakData.map(h => h.completionRate);
  
  const correlation = calculateCorrelation(streaks, rates);
  
  // Generate insights
  const insights = [];
  const avgStreak = streaks.reduce((sum, s) => sum + s, 0) / streaks.length;
  const avgRate = rates.reduce((sum, r) => sum + r, 0) / rates.length;
  
  if (correlation > 0.7) {
    insights.push("Strong positive correlation between streaks and completion rates");
  } else if (correlation < -0.3) {
    insights.push("Habits with longer streaks tend to have lower recent completion rates");
  }
  
  if (avgStreak > 10) {
    insights.push("High average streak indicates good habit consistency");
  }
  
  return {
    correlation: Math.round(correlation * 100) / 100,
    insights,
    averageStreak: Math.round(avgStreak * 10) / 10,
    averageCompletionRate: Math.round(avgRate)
  };
};

export const getCompletionTrends = (habits, days = 30) => {
  if (!habits || habits.length === 0) return [];
  
  const trends = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toDateString();
    
    let completions = 0;
    habits.forEach(habit => {
      if (habit.completions && habit.completions.some(c => 
        new Date(c).toDateString() === dateString)) {
        completions++;
      }
    });
    
    trends.push({
      date: date.toLocaleDateString(),
      completions,
      percentage: Math.round((completions / habits.length) * 100)
    });
  }
  
  return trends;
};

export const getHabitClusters = (habits) => {
  if (!habits || habits.length === 0) return [];
  
  const clusters = {};
  
  habits.forEach(habit => {
    const key = `${habit.timeOfDay}-${habit.goalId}`;
    
    if (!clusters[key]) {
      clusters[key] = {
        timeOfDay: habit.timeOfDay,
        goalId: habit.goalId,
        habits: [],
        averageStreak: 0,
        totalCompletions: 0
      };
    }
    
    clusters[key].habits.push({
      name: habit.name,
      streak: habit.currentStreak || 0,
      completions: habit.completions ? habit.completions.length : 0
    });
  });
  
  // Calculate cluster statistics
  Object.values(clusters).forEach(cluster => {
    const streaks = cluster.habits.map(h => h.streak);
    const completions = cluster.habits.map(h => h.completions);
    
    cluster.averageStreak = streaks.reduce((sum, s) => sum + s, 0) / streaks.length;
    cluster.totalCompletions = completions.reduce((sum, c) => sum + c, 0);
    cluster.size = cluster.habits.length;
  });
  
  return Object.values(clusters)
    .sort((a, b) => b.size - a.size)
    .map(cluster => ({
      ...cluster,
      averageStreak: Math.round(cluster.averageStreak * 10) / 10
    }));
};

// Helper function for correlation calculation
const calculateCorrelation = (x, y) => {
  if (x.length !== y.length || x.length === 0) return 0;
  
  const n = x.length;
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumXX = x.reduce((sum, val) => sum + val * val, 0);
  const sumYY = y.reduce((sum, val) => sum + val * val, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
};