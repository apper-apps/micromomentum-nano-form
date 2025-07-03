import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { profileService } from '@/services/api/profileService';
import { toast } from 'react-toastify';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    timezone: '',
    reminderTime: '',
    weeklyGoal: 5,
    preferredTime: 'morning'
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await profileService.getProfile();
      setProfile(data);
      setFormData(data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await profileService.updateProfile(formData);
      setProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProfile} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <ApperIcon name="User" size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-800">
            {profile.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your preferences and settings
          </p>
        </motion.div>

        {/* Profile Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-success to-green-400 flex items-center justify-center">
              <ApperIcon name="Target" size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800">3</div>
            <p className="text-sm text-gray-600">Active Goals</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <ApperIcon name="Flame" size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800">23</div>
            <p className="text-sm text-gray-600">Day Streak</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-accent to-yellow-400 flex items-center justify-center">
              <ApperIcon name="Award" size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-800">12</div>
            <p className="text-sm text-gray-600">Badges Earned</p>
          </Card>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-gray-800">
                Profile Settings
              </h2>
              {!isEditing ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <ApperIcon name="Edit" size={16} className="mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>
              </div>

              {/* Goals and Reminders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Weekly Goal (habits per week)"
                  type="number"
                  name="weeklyGoal"
                  value={formData.weeklyGoal}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  min="1"
                  max="50"
                />
                <Input
                  label="Daily Reminder Time"
                  type="time"
                  name="reminderTime"
                  value={formData.reminderTime}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-red-200">
            <h3 className="text-lg font-display font-bold text-red-600 mb-4">
              Danger Zone
            </h3>
            <p className="text-gray-600 mb-4">
              These actions are irreversible. Please be careful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => toast.info('Reset feature coming soon!')}
              >
                <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                Reset All Progress
              </Button>
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => toast.info('Export feature coming soon!')}
              >
                <ApperIcon name="Download" size={16} className="mr-2" />
                Export Data
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;