import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuantumParticle from "@/components/QuantumParticle";
import EntanglementLink from "@/components/EntanglementLink";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Maximize2, Zap } from "lucide-react";
import { toast } from "sonner";

type QuantumState = "neutral" | "up" | "down";

const Index = () => {
  const [aliceState, setAliceState] = useState<QuantumState>("neutral");
  const [bobState, setBobState] = useState<QuantumState>("neutral");
  const [separated, setSeparated] = useState(false);
  const [isEntangled, setIsEntangled] = useState(false);

  const measureParticle = (particle: "alice" | "bob") => {
    const newState: QuantumState = Math.random() > 0.5 ? "up" : "down";
    const correlatedState: QuantumState = newState === "up" ? "down" : "up";

    if (particle === "alice") {
      setAliceState(newState);
      setBobState(correlatedState);
    } else {
      setBobState(newState);
      setAliceState(correlatedState);
    }

    setIsEntangled(true);
    toast.success("Quantum state measured! Entanglement active.", {
      icon: <Sparkles className="w-4 h-4" />,
    });
  };

  const measureBoth = () => {
    const newState: QuantumState = Math.random() > 0.5 ? "up" : "down";
    const correlatedState: QuantumState = newState === "up" ? "down" : "up";

    setAliceState(newState);
    setBobState(correlatedState);
    setIsEntangled(true);

    toast.success("Both particles measured simultaneously!", {
      icon: <Zap className="w-4 h-4" />,
    });
  };

  const reset = () => {
    setAliceState("neutral");
    setBobState("neutral");
    setIsEntangled(false);
    setSeparated(false);
    toast.info("Quantum states reset to neutral");
  };

  const toggleSeparation = () => {
    setSeparated(!separated);
    if (!separated) {
      toast.info("Particles separated - but still entangled!", {
        icon: <Maximize2 className="w-4 h-4" />,
      });
    } else {
      toast.info("Particles brought together");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          The Entangled Twins
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
          Click on either particle to measure its quantum state. Watch as the other particle
          instantly correlates, demonstrating quantum entanglement across any distance.
        </p>
      </motion.div>

      {/* Status Badge */}
      <AnimatePresence>
        {isEntangled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-6 px-6 py-3 rounded-full bg-accent/10 border border-accent/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              <span className="text-accent font-mono font-bold tracking-wider">
                ENTANGLEMENT LINK ACTIVE
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particles Container */}
      <div className="relative w-full max-w-4xl mb-12">
        <div className="flex items-center justify-center gap-8 md:gap-20 relative">
          <QuantumParticle
            name="ALICE'S PARTICLE"
            state={aliceState}
            onClick={() => measureParticle("alice")}
            separated={separated}
            position="left"
          />

          <EntanglementLink isActive={isEntangled} separated={separated} />

          <QuantumParticle
            name="BOB'S PARTICLE"
            state={bobState}
            onClick={() => measureParticle("bob")}
            separated={separated}
            position="right"
          />
        </div>
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <Button
          onClick={measureBoth}
          variant="default"
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wide"
        >
          <Zap className="w-4 h-4 mr-2" />
          MEASURE BOTH
        </Button>

        <Button
          onClick={toggleSeparation}
          variant="outline"
          size="lg"
          className="border-secondary text-secondary hover:bg-secondary/20 font-bold tracking-wide"
        >
          <Maximize2 className="w-4 h-4 mr-2" />
          {separated ? "BRING TOGETHER" : "SEPARATE PARTICLES"}
        </Button>

        <Button
          onClick={reset}
          variant="outline"
          size="lg"
          className="border-muted-foreground/50 text-muted-foreground hover:bg-muted font-bold tracking-wide"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          RESET
        </Button>
      </motion.div>

      {/* Info Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center max-w-2xl"
      >
        <p className="text-xs md:text-sm text-muted-foreground">
          This interactive demo visualizes quantum entanglement, where measuring one particle's
          state instantly determines the other's state, regardless of the distance between them.
        </p>
      </motion.div>
    </div>
  );
};

export default Index;
