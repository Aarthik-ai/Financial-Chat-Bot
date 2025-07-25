// components/MicPulse.tsx
import { motion } from "framer-motion";

const MicPulse = () => {
  const ringVariants = {
    animate: {
      scale: [1, 2.2],
      opacity: [0.8, 0],
      transition: {
        duration: 1.5,
        ease: "easeOut",
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  return (
    <div className="relative w-12 h-12">
      {[0, 0.5, 1].map((delay, index) => (
        <motion.div
          key={index}
          className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-blue-400"
          variants={ringVariants}
          animate="animate"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
      <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500 shadow-md" />
    </div>
  );
};

export default MicPulse;
