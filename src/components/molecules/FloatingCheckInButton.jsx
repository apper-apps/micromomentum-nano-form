import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import VoiceCheckInModal from '@/components/organisms/VoiceCheckInModal';

const FloatingCheckInButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(true);

  const handleClick = () => {
    setShowModal(true);
    setShouldPulse(false);
  };

  return (
    <>
      <motion.button
        className={`floating-action-button ${shouldPulse ? 'pulse' : ''}`}
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.5
        }}
      >
        <ApperIcon name="Mic" size={24} className="text-white" />
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <VoiceCheckInModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingCheckInButton;