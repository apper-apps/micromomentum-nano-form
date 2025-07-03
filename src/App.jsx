import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/organisms/Layout';
import TodayDashboard from '@/components/pages/TodayDashboard';
import Goals from '@/components/pages/Goals';
import Progress from '@/components/pages/Progress';
import Profile from '@/components/pages/Profile';
import GoalSetup from '@/components/pages/GoalSetup';
import GoalDetail from '@/components/pages/GoalDetail';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<TodayDashboard />} />
            <Route path="goals" element={<Goals />} />
            <Route path="goals/new" element={<GoalSetup />} />
            <Route path="goals/:id" element={<GoalDetail />} />
            <Route path="progress" element={<Progress />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;