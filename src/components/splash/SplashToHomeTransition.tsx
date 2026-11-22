import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashToHomeTransitionProps {
  isSplashActive: boolean;
  children: React.ReactNode;
}

/**
 * SplashToHomeTransition
 *
 * Ensures the homepage is pre-rendered underneath the splash screen to avoid
 * layout shifts or blank flickers. When the splash lifts away, the home hero
 * transitions into view seamlessly.
 */
export const SplashToHomeTransition: React.FC<SplashToHomeTransitionProps> = ({
  isSplashActive,
  children,
}) => {
  return (
    <div className="relative w-full min-h-screen">
      {/* Homepage pre-rendered underneath */}
      <motion.div
        initial={{ opacity: 0.94 }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
};
