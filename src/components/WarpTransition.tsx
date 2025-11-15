import { motion } from "framer-motion";

const WarpTransition = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.5, delay: 0.2 }}
      className="fixed inset-0 z-[100] pointer-events-none bg-background"
    >
      {/* Warp lines radiating from center */}
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: "50%",
            y: "50%",
            scaleX: 0,
            opacity: 1,
          }}
          animate={{
            x: `${50 + Math.cos((i / 60) * Math.PI * 2) * 300}%`,
            y: `${50 + Math.sin((i / 60) * Math.PI * 2) * 300}%`,
            scaleX: [0, 5, 0],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            delay: i * 0.005,
          }}
          className="absolute w-2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_10px_rgba(168,85,247,0.8)]"
          style={{
            transform: `rotate(${(i / 60) * 360}deg)`,
          }}
        />
      ))}

      {/* Center bright flash */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 2, 4], opacity: [1, 0.8, 0] }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/40 blur-3xl"
      />
      
      {/* Secondary glow ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: [0, 3, 5], opacity: [0.8, 0.4, 0] }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-4 border-secondary blur-sm"
      />

      {/* Particle swirl effect */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          initial={{
            x: "50%",
            y: "50%",
            scale: 0,
            opacity: 0,
          }}
          animate={{
            x: `${50 + Math.cos((i / 30) * Math.PI * 2 + Math.PI) * 150}%`,
            y: `${50 + Math.sin((i / 30) * Math.PI * 2 + Math.PI) * 150}%`,
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
            delay: i * 0.02,
          }}
          className="absolute w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(244,114,182,0.8)]"
        />
      ))}
    </motion.div>
  );
};

export default WarpTransition;
