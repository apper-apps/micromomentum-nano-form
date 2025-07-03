const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let profileData = {
  Id: 1,
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  timezone: 'America/New_York',
  reminderTime: '09:00',
  weeklyGoal: 5,
  preferredTime: 'morning',
  joinedDate: '2024-01-15',
  totalGoals: 3,
  activeStreaks: 2,
  badgesEarned: 12
};

export const profileService = {
  async getProfile() {
    await delay(300);
    return { ...profileData };
  },

  async updateProfile(updates) {
    await delay(400);
    profileData = { ...profileData, ...updates };
    return { ...profileData };
  },

  async resetProgress() {
    await delay(500);
    // This would reset user progress in a real app
    return { success: true };
  },

  async exportData() {
    await delay(600);
    // This would export user data in a real app
    return {
      profile: { ...profileData },
      exportDate: new Date().toISOString()
    };
  }
};