import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const VoiceCheckInModal = ({ isOpen, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    // Simulate recording start
    toast.info('Recording started!');
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Simulate recording stop and processing
    const simulatedTranscript = "I'm feeling good about my progress today. I completed my morning routine and I'm ready to tackle the day ahead. The habit tracking is really helping me stay consistent.";
    setTranscript(simulatedTranscript);
    setAudioUrl('simulated-audio-url');
    toast.success('Recording saved!');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    toast.success('Check-in submitted successfully!');
    onClose();
  };

  const handleClose = () => {
    if (isRecording) {
      stopRecording();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          <motion.div
            className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold gradient-text">
                Voice Check-in
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Recording Interface */}
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center relative">
                  <motion.div
                    className="w-full h-full rounded-full border-4 border-white/30 absolute"
                    animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.button
                    onClick={isRecording ? stopRecording : startRecording}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ApperIcon 
                      name={isRecording ? 'Square' : 'Mic'} 
                      size={24} 
                      className={isRecording ? 'text-red-500' : 'text-primary'} 
                    />
                  </motion.button>
                </div>

                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <div className="voice-waveform">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="voice-bar" />
                      ))}
                    </div>
                    <p className="text-lg font-mono text-primary">
                      {formatTime(recordingTime)}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Transcript */}
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface rounded-xl p-4"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">Transcript:</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {transcript}
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={!transcript}
                >
                  Submit
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceCheckInModal;