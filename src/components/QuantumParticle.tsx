import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type QuantumState = "neutral" | "up" | "down";

interface QuantumParticleProps {
  name: string;
  state: QuantumState;
  onClick: () => void;
  separated: boolean;
  position: "left" | "right";
}

const QuantumParticle = ({ name, state, onClick, separated, position }: QuantumParticleProps) => {
  const getStateColor = () => {
    switch (state) {
      case "up":
        return "bg-quantum-spinUp";
      case "down":
        return "bg-quantum-spinDown";
      default:
        return "bg-quantum-neutral";
    }
  };

  const getStateLabel = () => {
    switch (state) {
      case "up":
        return "↑ SPIN UP";
      case "down":
        return "↓ SPIN DOWN";
      default:
        return "◇ NEUTRAL";
    }
  };

  const getGlowClass = () => {
    if (state === "neutral") return "";
    return state === "up" ? "glow-effect" : "glow-effect-secondary";
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ x: 0 }}
      animate={{
        x: separated ? (position === "left" ? -80 : 80) : 0,
      }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <motion.div
        onClick={onClick}
        className={cn(
          "relative cursor-pointer w-32 h-32 md:w-40 md:h-40 rounded-full transition-all duration-500",
          getStateColor(),
          getGlowClass(),
          "float-animation"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: state !== "neutral" 
            ? `0 0 60px ${state === "up" ? "hsl(var(--spin-up))" : "hsl(var(--spin-down))"}`
            : "0 0 30px hsl(var(--neutral))",
        }}
      >
        {/* Inner glow */}
        <div
          className={cn(
            "absolute inset-4 rounded-full",
            state === "up" ? "bg-quantum-spinUp/30" : state === "down" ? "bg-quantum-spinDown/30" : "bg-quantum-neutral/20"
          )}
        />
        
        {/* Core */}
        <div className="absolute inset-8 rounded-full bg-background/20 backdrop-blur-sm" />
      </motion.div>

      <div className="text-center space-y-2">
        <motion.h3
          className="font-bold text-lg tracking-wider text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {name}
        </motion.h3>
        <motion.div
          key={state}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "text-sm font-mono tracking-widest px-4 py-2 rounded-lg border",
            state === "up" 
              ? "text-quantum-spinUp border-quantum-spinUp/50 bg-quantum-spinUp/10"
              : state === "down"
              ? "text-quantum-spinDown border-quantum-spinDown/50 bg-quantum-spinDown/10"
              : "text-quantum-neutral border-quantum-neutral/50 bg-quantum-neutral/10"
          )}
        >
          {getStateLabel()}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuantumParticle;
