import { motion } from "framer-motion";

interface EntanglementLinkProps {
  isActive: boolean;
  separated: boolean;
}

const EntanglementLink = ({ isActive, separated }: EntanglementLinkProps) => {
  if (!isActive) return null;

  const lineLength = separated ? 300 : 180;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <svg
        width={lineLength}
        height="4"
        className="overflow-visible"
      >
        <motion.line
          x1="0"
          y1="2"
          x2={lineLength}
          y2="2"
          stroke="url(#gradient)"
          strokeWidth="2"
          className="entanglement-line"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--spin-up))" />
            <stop offset="50%" stopColor="hsl(var(--accent))" />
            <stop offset="100%" stopColor="hsl(var(--spin-down))" />
          </linearGradient>
        </defs>
        
        {/* Animated particles along the line */}
        {[...Array(3)].map((_, i) => (
          <motion.circle
            key={i}
            r="3"
            fill="hsl(var(--accent))"
            initial={{ cx: 0 }}
            animate={{ cx: [0, lineLength, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "linear",
            }}
            cy="2"
            className="drop-shadow-[0_0_8px_hsl(var(--accent))]"
          />
        ))}
      </svg>
    </div>
  );
};

export default EntanglementLink;
