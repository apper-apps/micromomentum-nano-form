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