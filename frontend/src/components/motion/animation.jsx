import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AnimatedSection({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, // Only animate once
    amount: 0.2, // Trigger earlier (reduced from 0.3)
    margin: "0px 0px -100px 0px" // Trigger before element is fully in view
  }); 

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.4, ease: 'easeOut' }} // Faster animation
    >
      {children}
    </motion.div>
  );
}