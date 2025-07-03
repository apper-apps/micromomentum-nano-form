import { goalData } from '@/services/mockData/goals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const goalService = {
  async getAll() {
    await delay(300);
    return [...goalData];
  },

  async getById(id) {
    await delay(200);
    const goal = goalData.find(g => g.Id === id);
    if (!goal) {
      throw new Error('Goal not found');
    }
    return { ...goal };
  },

  async create(goal) {
    await delay(400);
    const newGoal = {
      ...goal,
      Id: Math.max(...goalData.map(g => g.Id)) + 1,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    goalData.push(newGoal);
    return { ...newGoal };
  },

  async update(id, updates) {
    await delay(300);
    const index = goalData.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error('Goal not found');
    }
    goalData[index] = { ...goalData[index], ...updates };
    return { ...goalData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = goalData.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error('Goal not found');
    }
    goalData.splice(index, 1);
    return true;
  }
};