import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import QuantumParticle from "@/components/QuantumParticle";
import EntanglementLink from "@/components/EntanglementLink";
import WarpTransition from "@/components/WarpTransition";
import BellsTheoremDemo from "@/components/BellsTheoremDemo";
import SuperpositionDemo from "@/components/SuperpositionDemo";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Maximize2, Zap, LogOut, BookOpen, Atom, Brain, Binary, Orbit } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type QuantumState = "neutral" | "up" | "down";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [showWarp, setShowWarp] = useState(false);
  const [aliceState, setAliceState] = useState<QuantumState>("neutral");
  const [bobState, setBobState] = useState<QuantumState>("neutral");
  const [separated, setSeparated] = useState(false);
  const [isEntangled, setIsEntangled] = useState(false);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setLoading(false);
        // Show warp transition, then intro
        setTimeout(() => setShowWarp(true), 100);
        setTimeout(() => {
          setShowWarp(false);
          setShowIntro(true);
        }, 1300);
        // Hide intro after animations
        setTimeout(() => setShowIntro(false), 4500);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.info("Logged out successfully");
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity }
                }}
                className="w-32 h-32 mx-auto mb-6 relative"
              >
                <Atom className="w-full h-full text-primary" />
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
              >
                Quantum Entanglement
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground mt-4"
              >
                Interactive Simulation
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-background/50 border-b border-border/50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Atom className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Quantum Lab</span>
            </div>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById("info")?.scrollIntoView({ behavior: "smooth" })}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Learn
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/game")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                <Brain className="w-4 h-4 mr-2" />
                Play Game
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById("game")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Simulate
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </nav>

        {/* Information Section */}
        <section id="info" className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                What is Quantum Entanglement?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                One of the most fascinating phenomena in quantum physics
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm"
              >
                <h3 className="text-2xl font-bold mb-3 text-primary">The Phenomenon</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Quantum entanglement occurs when two or more particles become connected in such a way that 
                  the quantum state of one particle instantaneously influences the state of another, 
                  regardless of the distance between them.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm"
              >
                <h3 className="text-2xl font-bold mb-3 text-secondary">Spooky Action</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Einstein famously called this "spooky action at a distance" because measuring one particle 
                  instantly affects its entangled partner, even if they're separated by vast distances. 
                  This defied classical physics understanding.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm"
              >
                <h3 className="text-2xl font-bold mb-3 text-accent">Real Applications</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Today, quantum entanglement is being used in quantum computing, quantum cryptography, 
                  and quantum teleportation. It's not science fiction—it's cutting-edge technology 
                  revolutionizing how we process and secure information.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm"
              >
                <h3 className="text-2xl font-bold mb-3 text-primary">The Mystery</h3>
                <p className="text-muted-foreground leading-relaxed">
                  What makes entanglement mysterious is that the particles don't communicate in the traditional sense. 
                  The correlation is instantaneous, seemingly violating the speed of light limit. 
                  Yet it's been proven experimentally thousands of times.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Game/Simulation Section */}
        <section id="game" className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Interactive Simulation
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Click on either particle to measure its quantum state. Watch as the other particle
                instantly correlates, demonstrating entanglement across any distance.
              </p>
            </motion.div>

            {/* Status Badge */}
            <AnimatePresence>
              {isEntangled && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mb-8 flex justify-center"
                >
                  <div className="px-6 py-3 rounded-full bg-accent/10 border border-accent/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                      <span className="text-accent font-mono font-bold tracking-wider">
                        ENTANGLEMENT LINK ACTIVE
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Particles Container */}
            <div className="relative w-full max-w-4xl mx-auto mb-12">
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-3 justify-center"
            >
              <Button
                onClick={measureBoth}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 font-bold tracking-wide"
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
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-12 text-center max-w-2xl mx-auto"
            >
              <p className="text-sm text-muted-foreground">
                This interactive demo visualizes quantum entanglement, where measuring one particle's
                state instantly determines the other's state, regardless of the distance between them.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Bell's Theorem Section */}
        <section className="py-20 px-4 bg-card/20">
          <div className="container mx-auto max-w-6xl">
            <BellsTheoremDemo />
          </div>
        </section>

        {/* Superposition Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <SuperpositionDemo />
          </div>
        </section>

        {/* Additional Educational Content */}
        <section className="py-20 px-4 bg-card/20">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Quantum Mechanics Fundamentals
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 backdrop-blur"
              >
                <Binary className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-primary">Quantum States</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Unlike classical bits that are either 0 or 1, quantum bits (qubits) can exist in a 
                  superposition of both states simultaneously until measured. This is the foundation of 
                  quantum computing's power.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 backdrop-blur"
              >
                <Brain className="w-12 h-12 text-secondary mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-secondary">Wave-Particle Duality</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Quantum entities exhibit both wave-like and particle-like properties. They exist as 
                  probability waves until observed, when they collapse into definite particles. This 
                  duality is fundamental to quantum behavior.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-8 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 backdrop-blur"
              >
                <Orbit className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-accent">Uncertainty Principle</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Heisenberg's uncertainty principle states we cannot simultaneously know both the exact 
                  position and momentum of a particle. The more precisely we measure one, the less we 
                  know about the other.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 p-8 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20"
            >
              <h3 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                The Quantum Revolution
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
                <div>
                  <h4 className="text-xl font-semibold text-primary mb-3">Quantum Computing</h4>
                  <p className="leading-relaxed">
                    Quantum computers harness superposition and entanglement to perform calculations 
                    exponentially faster than classical computers for specific problems like cryptography, 
                    drug discovery, and optimization.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-secondary mb-3">Quantum Cryptography</h4>
                  <p className="leading-relaxed">
                    Quantum key distribution uses entangled particles to create unbreakable encryption. 
                    Any attempt to intercept the key disturbs the quantum state, immediately alerting 
                    both parties to the breach.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-accent mb-3">Quantum Teleportation</h4>
                  <p className="leading-relaxed">
                    Using entanglement, the exact state of a quantum particle can be transferred to 
                    another particle at a distant location, enabling future quantum networks and 
                    quantum internet.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-primary mb-3">Quantum Sensing</h4>
                  <p className="leading-relaxed">
                    Quantum sensors exploit quantum phenomena to achieve unprecedented precision in 
                    measuring magnetic fields, gravity, time, and other physical quantities—revolutionizing 
                    navigation, medical imaging, and fundamental research.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border/50">
          <div className="container mx-auto max-w-4xl text-center">
            <p className="text-muted-foreground">
              Built to explore the fascinating world of quantum entanglement
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              © 2025 Quantum Learning Platform
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
