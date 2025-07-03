import { habitData } from '@/services/mockData/habits.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const habitService = {
  async getAll() {
    await delay(300);
    return [...habitData];
  },

  async getById(id) {
    await delay(200);
    const habit = habitData.find(h => h.Id === id);
    if (!habit) {
      throw new Error('Habit not found');
    }
    return { ...habit };
  },

  async getByGoalId(goalId) {
    await delay(250);
    return habitData.filter(h => h.goalId === goalId.toString());
  },

  async getTodayHabits() {
    await delay(400);
    // Return all habits for today's view
    return [...habitData];
  },

  async create(habit) {
    await delay(400);
    const newHabit = {
      ...habit,
      Id: Math.max(...habitData.map(h => h.Id)) + 1,
      currentStreak: 0,
      longestStreak: 0,
      completions: []
    };
    habitData.push(newHabit);
    return { ...newHabit };
  },

  async update(id, updates) {
    await delay(300);
    const index = habitData.findIndex(h => h.Id === id);
    if (index === -1) {
      throw new Error('Habit not found');
    }
    habitData[index] = { ...habitData[index], ...updates };
    return { ...habitData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = habitData.findIndex(h => h.Id === id);
    if (index === -1) {
      throw new Error('Habit not found');
    }
    habitData.splice(index, 1);
    return true;
  }
};