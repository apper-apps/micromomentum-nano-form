import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { goalService } from '@/services/api/goalService';

const GoalSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: '',
    priority: 'medium'
  });
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalSteps = 3;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!formData.title || !formData.targetDate) {
        toast.error('Please fill in all required fields');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Simulate AI processing
      setIsProcessing(true);
      await simulateAiProcessing();
      setCurrentStep(3);
    }
  };

  const simulateAiProcessing = async () => {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysis = `Based on your goal "${formData.title}", I've identified these key daily micro-habits:

1. **Morning Foundation** (5 minutes)
   - Start each day with a 5-minute focused planning session
   - Review your progress from yesterday
   - Set your daily intention

2. **Skill Building** (15 minutes)
   - Dedicate 15 minutes to core skill development
   - Practice the fundamental techniques
   - Track your learning progress

3. **Consistency Check** (2 minutes)
   - Evening reflection on today's progress
   - Identify what worked well
   - Plan tomorrow's focus area

4. **Weekly Review** (10 minutes)
   - Every Sunday, assess your weekly progress
   - Adjust your approach based on learnings
   - Celebrate small wins

These micro-habits are designed to compound over time, making your larger goal feel achievable through consistent daily actions.`;

    setAiAnalysis(analysis);
    setIsProcessing(false);
  };

  const handleSubmit = async () => {
    try {
      const goalData = {
        ...formData,
        aiAnalysis,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      await goalService.create(goalData);
      toast.success('Goal created successfully!');
      navigate('/goals');
    } catch (err) {
      toast.error('Failed to create goal');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <ApperIcon name="Target" size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-800">
                What's your goal?
              </h2>
              <p className="text-gray-600 mt-2">
                Let's start by understanding what you want to achieve
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Goal Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Learn to play guitar, Start a business, Get fit"
                className="text-lg"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell us more about your goal..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Target Date"
                  type="date"
                  name="targetDate"
                  value={formData.targetDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  >
                    <option value="">Select category</option>
                    <option value="health">Health & Fitness</option>
                    <option value="career">Career & Business</option>
                    <option value="education">Education & Learning</option>
                    <option value="personal">Personal Development</option>
                    <option value="creative">Creative & Hobbies</option>
                    <option value="relationships">Relationships</option>
                    <option value="finance">Finance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-yellow-400 flex items-center justify-center">
                <ApperIcon name="Zap" size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-800">
                AI is analyzing your goal
              </h2>
              <p className="text-gray-600 mt-2">
                Creating your personalized daily micro-habits
              </p>
            </div>

            {isProcessing ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center space-x-2">
                  <div className="w-4 h-4 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-4 h-4 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-4 h-4 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-gray-600 mt-4">
                  Processing your goal and creating micro-habits...
                </p>
              </div>
            ) : (
              <div className="bg-surface rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Your Personalized Micro-Habits Plan
                </h3>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {aiAnalysis}
                  </pre>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-success to-green-400 flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-800">
                Ready to start building momentum?
              </h2>
              <p className="text-gray-600 mt-2">
                Your goal has been broken down into manageable daily actions
              </p>
            </div>

            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-display font-bold gradient-text">
                  {formData.title}
                </h3>
                <p className="text-gray-600">
                  Target: {new Date(formData.targetDate).toLocaleDateString()}
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Target" size={16} />
                    <span>4 Daily Habits</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Clock" size={16} />
                    <span>~20 min/day</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="text-center">
              <p className="text-gray-600 mb-6">
                We'll track your progress and send gentle reminders to keep you on track. 
                You can always adjust your habits as you learn what works best for you.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/goals')}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" size={20} />
              <span>Back to Goals</span>
            </Button>
            <div className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-8">
            {renderStep()}
          </Card>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={isProcessing}
              className="min-w-[120px]"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Next'
              )}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="min-w-[120px]"
            >
              Create Goal
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalSetup;