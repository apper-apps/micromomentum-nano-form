import suggestionData from '@/services/mockData/suggestions.json';
import { habitService } from '@/services/api/habitService';
import { analyzeHabitPatterns, findAvailableTimeSlots, getHabitRecommendationScore } from '@/utils/habitUtils';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const suggestionService = {
  async generateSuggestions(limit = 10) {
    await delay(400);
    try {
      const userHabits = await habitService.getAll();
      const userPatterns = analyzeHabitPatterns(userHabits);
      const availableTimeSlots = findAvailableTimeSlots(userHabits);
      
      // Score and sort suggestions
      const scoredSuggestions = suggestionData.suggestionData.map(suggestion => ({
        ...suggestion,
        score: getHabitRecommendationScore(suggestion, userHabits, userPatterns)
      }));
      
      return scoredSuggestions
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ score, ...suggestion }) => suggestion);
    } catch (error) {
      // Fallback to default suggestions if analysis fails
      return suggestionData.suggestionData.slice(0, limit);
    }
  },

  async getSuggestionsByGoal(goalId, limit = 5) {
    await delay(200);
    const goalSuggestions = suggestionData.suggestionData.filter(
      suggestion => suggestion.goalId === goalId.toString()
    );
    return goalSuggestions.slice(0, limit);
  },

  async getSuggestionsByTimeOfDay(timeOfDay, limit = 5) {
    await delay(200);
    const timeSuggestions = suggestionData.suggestionData.filter(
      suggestion => suggestion.timeOfDay === timeOfDay
    );
    return timeSuggestions.slice(0, limit);
  },

  async getSuggestionById(id) {
    await delay(100);
    const suggestion = suggestionData.suggestionData.find(s => s.Id === id);
    if (!suggestion) {
      throw new Error('Suggestion not found');
    }
    return { ...suggestion };
  },

  async acceptSuggestion(suggestionId) {
    await delay(300);
    const suggestion = await this.getSuggestionById(suggestionId);
    
    // Convert suggestion to habit format
    const newHabit = {
      title: suggestion.title,
      goalId: suggestion.goalId,
      frequency: 'daily',
      timeOfDay: suggestion.timeOfDay,
      description: suggestion.description,
      category: suggestion.category,
      estimatedDuration: suggestion.estimatedDuration
    };
    
    // Create the habit using habitService
    const createdHabit = await habitService.create(newHabit);
    return createdHabit;
  },

  async dismissSuggestion(suggestionId) {
    await delay(100);
    // In a real app, this would mark the suggestion as dismissed
    // For now, we'll just return success
    return { success: true, message: 'Suggestion dismissed' };
  }
};