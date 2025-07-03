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