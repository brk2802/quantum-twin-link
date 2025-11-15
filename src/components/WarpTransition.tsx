import { motion } from "framer-motion";

const WarpTransition = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.2, delay: 0.3 }}
      className="fixed inset-0 z-[100] pointer-events-none"
    >
      {/* Warp lines radiating from center */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: "50%",
            y: "50%",
            scaleX: 0,
            opacity: 0.8,
          }}
          animate={{
            x: `${50 + Math.cos((i / 40) * Math.PI * 2) * 200}%`,
            y: `${50 + Math.sin((i / 40) * Math.PI * 2) * 200}%`,
            scaleX: [0, 3, 0],
            opacity: [0.8, 1, 0],
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: i * 0.01,
          }}
          className="absolute w-1 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{
            transform: `rotate(${(i / 40) * 360}deg)`,
          }}
        />
      ))}

      {/* Center bright flash */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/30 blur-3xl"
      />
    </motion.div>
  );
};

export default WarpTransition;
