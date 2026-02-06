import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
  disableLayout?: boolean;
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.08,
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  }),
};

export function AnimatedCard({ children, index = 0, className, disableLayout = false }: AnimatedCardProps) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      layout={!disableLayout}
      className={className}
    >
      {children}
    </motion.div>
  );
}
