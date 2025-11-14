import { motion, Variants } from "framer-motion";

export default function Loader() {
  const ringAVariants: Variants = {
    animate: {
      strokeDasharray: [
        "0 660", "0 660", "60 600", "60 600", "0 660", 
        "0 660", "60 600", "60 600", "0 660", "0 660"
      ],
      strokeWidth: [20, 20, 30, 30, 20, 20, 30, 30, 20, 20],
      strokeDashoffset: [-330, -330, -335, -595, -660, -660, -665, -925, -990, -990],
      transition: {
        duration: 2,
        times: [0, 0.04, 0.12, 0.32, 0.40, 0.54, 0.62, 0.82, 0.90, 1],
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const ringBVariants: Variants = {
    animate: {
      strokeDasharray: [
        "0 220", "0 220", "20 200", "20 200", "0 220", 
        "0 220", "20 200", "20 200", "0 220", "0 220"
      ],
      strokeWidth: [20, 20, 30, 30, 20, 20, 30, 30, 20, 20],
      strokeDashoffset: [-110, -110, -115, -195, -220, -220, -225, -305, -330, -330],
      transition: {
        duration: 2,
        times: [0, 0.12, 0.20, 0.40, 0.48, 0.62, 0.70, 0.90, 0.98, 1],
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const ringCVariants: Variants = {
    animate: {
      strokeDasharray: [
        "0 440", "40 400", "40 400", "0 440", "0 440", 
        "40 400", "40 400", "0 440", "0 440"
      ],
      strokeWidth: [20, 30, 30, 20, 20, 30, 30, 20, 20],
      strokeDashoffset: [0, -5, -175, -220, -220, -225, -395, -440, -440],
      transition: {
        duration: 2,
        times: [0, 0.08, 0.28, 0.36, 0.58, 0.66, 0.86, 0.94, 1],
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const ringDVariants: Variants = {
    animate: {
      strokeDasharray: [
        "0 440", "0 440", "40 400", "40 400", "0 440", 
        "40 400", "40 400", "0 440", "0 440"
      ],
      strokeWidth: [20, 20, 30, 30, 20, 30, 30, 20, 20],
      strokeDashoffset: [0, 0, -5, -175, -220, -225, -395, -440, -440],
      transition: {
        duration: 2,
        times: [0, 0.08, 0.16, 0.36, 0.44, 0.58, 0.78, 0.86, 1],
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <div className="flex items-center justify-center">
      <svg
        viewBox="0 0 240 240"
        height="240"
        width="240"
        className="w-24 h-24"
      >
        <motion.circle
          strokeLinecap="round"
          stroke="#4803FE"
          fill="none"
          r="105"
          cy="120"
          cx="120"
          variants={ringAVariants}
          animate="animate"
        />
        <motion.circle
          strokeLinecap="round"
          stroke="#A118FE"
          fill="none"
          r="35"
          cy="120"
          cx="120"
          variants={ringBVariants}
          animate="animate"
        />
        <motion.circle
          strokeLinecap="round"
          stroke="#4803FE"
          fill="none"
          r="70"
          cy="120"
          cx="85"
          variants={ringCVariants}
          animate="animate"
        />
        <motion.circle
          strokeLinecap="round"
          stroke="#A118FE"
          fill="none"
          r="70"
          cy="120"
          cx="155"
          variants={ringDVariants}
          animate="animate"
        />
      </svg>
    </div>
  );
}