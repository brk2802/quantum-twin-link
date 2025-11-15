import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Eye, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

const SuperpositionDemo = () => {
  const [isSuperposed, setIsSuperposed] = useState(true);
  const [measuredState, setMeasuredState] = useState<"up" | "down" | null>(null);

  const measure = () => {
    const result = Math.random() > 0.5 ? "up" : "down";
    setMeasuredState(result);
    setIsSuperposed(false);
  };

  const reset = () => {
    setIsSuperposed(true);
    setMeasuredState(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-primary">Quantum Superposition</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Before measurement, a quantum particle exists in all possible states simultaneously.
          The act of observation forces it to "choose" one state.
        </p>
      </div>

      <div className="flex justify-center items-center min-h-[300px]">
        <AnimatePresence mode="wait">
          {isSuperposed ? (
            <motion.div
              key="superposed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative"
            >
              {/* Superposition state - multiple overlapping particles */}
              <div className="relative w-40 h-40">
                <motion.div
                  animate={{
                    rotate: 360,
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                    opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 blur-xl"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-4 rounded-full bg-gradient-to-tr from-primary to-secondary"
                />
                <div className="absolute inset-8 rounded-full bg-background/40 backdrop-blur-sm flex items-center justify-center">
                  <Waves className="w-12 h-12 text-primary animate-pulse" />
                </div>
              </div>
              <div className="text-center mt-6">
                <p className="text-lg font-semibold text-primary">
                  |ψ⟩ = α|↑⟩ + β|↓⟩
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Superposition of all states
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="measured"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={cn(
                  "w-40 h-40 rounded-full mx-auto relative",
                  measuredState === "up" ? "bg-primary" : "bg-secondary"
                )}
                style={{
                  boxShadow: `0 0 60px ${
                    measuredState === "up"
                      ? "hsl(var(--primary))"
                      : "hsl(var(--secondary))"
                  }`,
                }}
              >
                <div className="absolute inset-8 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-5xl font-bold">
                    {measuredState === "up" ? "↑" : "↓"}
                  </span>
                </div>
              </motion.div>
              <div className="mt-6">
                <p className="text-lg font-semibold">
                  Measured: {measuredState === "up" ? "SPIN UP" : "SPIN DOWN"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Wave function collapsed!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-3 justify-center">
        {isSuperposed ? (
          <Button onClick={measure} size="lg" className="gap-2">
            <Eye className="w-5 h-5" />
            Measure Particle
          </Button>
        ) : (
          <Button onClick={reset} size="lg" className="gap-2">
            <Waves className="w-5 h-5" />
            Reset to Superposition
          </Button>
        )}
      </div>
    </div>
  );
};

export default SuperpositionDemo;
