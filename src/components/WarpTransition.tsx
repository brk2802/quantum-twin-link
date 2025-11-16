import { motion } from "framer-motion";

const WarpTransition = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 1.2 }}
      className="fixed inset-0 z-[100] pointer-events-none bg-background overflow-hidden"
    >
      {/* Hyperspace light speed lines - horizontal stretching */}
      {[...Array(100)].map((_, i) => {
        const yPos = (i / 100) * 100;
        const delay = i * 0.003;
        return (
          <motion.div
            key={`line-${i}`}
            initial={{
              x: "50%",
              y: `${yPos}%`,
              scaleX: 0,
              opacity: 0,
            }}
            animate={{
              x: ["50%", "150%"],
              scaleX: [0, 50, 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: delay,
            }}
            className="absolute h-[2px] w-8 origin-left"
            style={{
              background: `linear-gradient(90deg, transparent, ${
                i % 3 === 0 ? 'hsl(var(--primary))' : 
                i % 3 === 1 ? 'hsl(var(--accent))' : 
                'hsl(var(--secondary))'
              }, transparent)`,
              boxShadow: `0 0 10px ${
                i % 3 === 0 ? 'hsl(var(--primary) / 0.8)' : 
                i % 3 === 1 ? 'hsl(var(--accent) / 0.8)' : 
                'hsl(var(--secondary) / 0.8)'
              }`,
            }}
          />
        );
      })}

      {/* Stars zooming past */}
      {[...Array(80)].map((_, i) => {
        const angle = (i / 80) * Math.PI * 2;
        const distance = 20 + Math.random() * 30;
        return (
          <motion.div
            key={`star-${i}`}
            initial={{
              x: "50%",
              y: "50%",
              scale: 0,
              opacity: 0,
            }}
            animate={{
              x: `${50 + Math.cos(angle) * distance * 10}%`,
              y: `${50 + Math.sin(angle) * distance * 10}%`,
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
              delay: i * 0.005,
            }}
            className="absolute w-1 h-1 rounded-full bg-foreground"
            style={{
              boxShadow: '0 0 4px hsl(var(--foreground))',
            }}
          />
        );
      })}

      {/* Center acceleration flash */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ 
          scale: [0, 1.5, 8],
          opacity: [1, 1, 0],
        }}
        transition={{ 
          duration: 1,
          ease: "easeOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.8), hsl(var(--primary) / 0.3), transparent)',
        }}
      />

      {/* Horizontal motion blur effect */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ 
          scaleX: [0, 2, 4],
          opacity: [0, 0.5, 0],
        }}
        transition={{ 
          duration: 0.8,
          ease: "easeOut",
          delay: 0.2,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 origin-center"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)',
          filter: 'blur(20px)',
        }}
      />

      {/* Tunnel vignette effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 20%, hsl(var(--background)) 80%)',
        }}
      />
    </motion.div>
  );
};

export default WarpTransition;
