import { motion } from "framer-motion";
import { Loader } from "lucide-react";

export default function PageLoader() {
  return (
    <motion.div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader size={48} className="text-blue-600" />
      </motion.div>
    </motion.div>
  );
}
