import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/organisms/BottomNavigation';
import Header from '@/components/organisms/Header';
import FloatingCheckInButton from '@/components/molecules/FloatingCheckInButton';

const Layout = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>
      
      <FloatingCheckInButton />
      <BottomNavigation />
    </div>
  );
};

export default Layout;