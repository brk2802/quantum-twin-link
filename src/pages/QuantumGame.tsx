import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Trophy, 
  Brain, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  BookOpen,
  Target
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import QuantumParticle from "@/components/QuantumParticle";
import EntanglementLink from "@/components/EntanglementLink";

type QuantumState = "neutral" | "up" | "down";
type GameLevel = "tutorial" | "basic" | "intermediate" | "advanced";

interface Challenge {
  id: number;
  question: string;
  explanation: string;
  correctAnswer: "same" | "opposite" | "random";
}

const challenges: Record<GameLevel, Challenge[]> = {
  tutorial: [
    {
      id: 1,
      question: "When you measure Alice's particle as SPIN UP, what will Bob's particle be?",
      explanation: "In quantum entanglement, particles are correlated. When one is measured as SPIN UP, the entangled partner will always be SPIN DOWN!",
      correctAnswer: "opposite"
    }
  ],
  basic: [
    {
      id: 2,
      question: "If Bob's particle shows SPIN DOWN, what happened to Alice's particle?",
      explanation: "Perfect! Entangled particles show instant correlation. Bob's SPIN DOWN means Alice must be SPIN UP.",
      correctAnswer: "opposite"
    },
    {
      id: 3,
      question: "Can the particles communicate faster than light?",
      explanation: "No! While the correlation is instant, no information travels between them. The measurement reveals pre-existing correlations.",
      correctAnswer: "opposite"
    }
  ],
  intermediate: [
    {
      id: 4,
      question: "If particles are separated by 1000 km, will they still be correlated?",
      explanation: "Yes! Distance doesn't matter for quantum entanglement. The correlation persists regardless of separation.",
      correctAnswer: "opposite"
    },
    {
      id: 5,
      question: "What happens to entanglement after the first measurement?",
      explanation: "After measurement, the entanglement collapses! The correlation only exists until one particle is measured.",
      correctAnswer: "opposite"
    }
  ],
  advanced: [
    {
      id: 6,
      question: "Can we use entanglement to send messages instantly?",
      explanation: "No! Even though correlations are instant, we can't use them to send information faster than light. Each measurement result is random.",
      correctAnswer: "opposite"
    }
  ]
};

const QuantumGame = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [gameLevel, setGameLevel] = useState<GameLevel>("tutorial");
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [aliceState, setAliceState] = useState<QuantumState>("neutral");
  const [bobState, setBobState] = useState<QuantumState>("neutral");
  const [isEntangled, setIsEntangled] = useState(false);
  const [separated, setSeparated] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [showCombo, setShowCombo] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setLoading(false);
      }
    });
  }, [navigate]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTotalAttempts(0);
    setCurrentChallenge(0);
    setGameLevel("tutorial");
    initializeChallenge();
  };

  const initializeChallenge = () => {
    setAliceState("neutral");
    setBobState("neutral");
    setIsEntangled(false);
    setSeparated(false);
    setShowExplanation(false);
  };

  const measureAlice = () => {
    const newState: QuantumState = Math.random() > 0.5 ? "up" : "down";
    const correlatedState: QuantumState = newState === "up" ? "down" : "up";
    
    setAliceState(newState);
    setBobState(correlatedState);
    setIsEntangled(true);
  };

  const handleAnswer = (playerGuess: "same" | "opposite") => {
    const challenge = challenges[gameLevel][currentChallenge];
    const correct = playerGuess === challenge.correctAnswer;
    
    setTotalAttempts(prev => prev + 1);
    
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      
      // Calculate multiplier based on streak
      const newMultiplier = Math.min(Math.floor(newStreak / 3) + 1, 5);
      setMultiplier(newMultiplier);
      
      const points = 10 * newMultiplier;
      setScore(prev => prev + points);
      
      // Show combo animation for streaks
      if (newStreak >= 3) {
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 2000);
      }
      
      // Create particle explosion
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 1000);
      
      toast.success(newStreak >= 3 ? `${newStreak}x COMBO! +${points} points 🔥` : `Correct! +${points} points`, {
        icon: <CheckCircle2 className="w-4 h-4" />
      });
    } else {
      setStreak(0);
      setMultiplier(1);
      toast.error("Streak broken! Study the explanation", {
        icon: <XCircle className="w-4 h-4" />
      });
    }
    
    setShowExplanation(true);
    measureAlice();
  };

  const nextChallenge = () => {
    const levelChallenges = challenges[gameLevel];
    
    if (currentChallenge < levelChallenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      initializeChallenge();
    } else {
      // Move to next level
      const levels: GameLevel[] = ["tutorial", "basic", "intermediate", "advanced"];
      const currentIndex = levels.indexOf(gameLevel);
      
      if (currentIndex < levels.length - 1) {
        setGameLevel(levels[currentIndex + 1]);
        setCurrentChallenge(0);
        initializeChallenge();
        toast.success(`Level Up! Entering ${levels[currentIndex + 1]} mode!`, {
          icon: <Trophy className="w-4 h-4" />
        });
      } else {
        toast.success(`Game Complete! Final Score: ${score}`, {
          icon: <Trophy className="w-4 h-4" />
        });
        setGameStarted(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary text-2xl">Loading...</div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <Brain className="w-20 h-20 mx-auto text-primary" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Quantum Entanglement Game
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Learn about quantum entanglement through interactive challenges. 
                Test your understanding and master the mysteries of quantum mechanics!
              </p>
            </div>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">🔬 Quantum Correlation</h4>
                  <p className="text-sm text-muted-foreground">
                    How entangled particles are perfectly correlated
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">⚡ Instant Connection</h4>
                  <p className="text-sm text-muted-foreground">
                    Why measurements appear to affect each other instantly
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">🌌 Spooky Action</h4>
                  <p className="text-sm text-muted-foreground">
                    Einstein's "spooky action at a distance" explained
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">🎯 Real Applications</h4>
                  <p className="text-sm text-muted-foreground">
                    How entanglement is used in quantum computing
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={startGame}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                <Target className="w-5 h-5 mr-2" />
                Start Learning
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/")}
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Simulation
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const challenge = challenges[gameLevel][currentChallenge];
  const levelProgress = ((currentChallenge + 1) / challenges[gameLevel].length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Quantum Entanglement Challenge
            </h1>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-primary border-primary">
                Level: {gameLevel.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-secondary border-secondary">
                Challenge {currentChallenge + 1}/{challenges[gameLevel].length}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-4 relative">
            <Card className="border-primary/20 relative overflow-hidden">
              <CardContent className="pt-4 text-center min-w-[100px]">
                <Trophy className="w-6 h-6 mx-auto mb-1 text-primary" />
                <motion.div 
                  key={score}
                  initial={{ scale: 1.5, color: "hsl(var(--primary))" }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-primary"
                >
                  {score}
                </motion.div>
                <div className="text-xs text-muted-foreground">Score</div>
              </CardContent>
              
              {/* Particle Explosion Effect */}
              <AnimatePresence>
                {particles.map(particle => (
                  <motion.div
                    key={particle.id}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{ 
                      x: particle.x, 
                      y: particle.y, 
                      scale: 0,
                      opacity: 0 
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full"
                    style={{ 
                      boxShadow: "0 0 10px hsl(var(--primary))",
                    }}
                  />
                ))}
              </AnimatePresence>
            </Card>
            
            <Card className="border-accent/20">
              <CardContent className="pt-4 text-center min-w-[100px]">
                <Zap className="w-6 h-6 mx-auto mb-1 text-accent" />
                <motion.div 
                  key={streak}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-accent"
                >
                  {streak}x
                </motion.div>
                <div className="text-xs text-muted-foreground">Streak</div>
                {multiplier > 1 && (
                  <Badge className="mt-1 bg-accent/20 text-accent border-0 text-[10px]">
                    {multiplier}x Multi
                  </Badge>
                )}
              </CardContent>
            </Card>
            
            <Card className="border-secondary/20">
              <CardContent className="pt-4 text-center min-w-[100px]">
                <Target className="w-6 h-6 mx-auto mb-1 text-secondary" />
                <div className="text-2xl font-bold text-secondary">
                  {totalAttempts > 0 ? Math.round((score / (totalAttempts * 10)) * 100) : 0}%
                </div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Combo Display */}
        <AnimatePresence>
          {showCombo && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            >
              <div className="relative">
                <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                  {streak}x COMBO!
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 border-4 border-primary rounded-full blur-md -z-10"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Level Progress</span>
              <span className="text-primary font-bold">{Math.round(levelProgress)}%</span>
            </div>
            <Progress value={levelProgress} className="h-3 bg-secondary/20" />
          </div>
          
          {/* Streak Progress to Next Multiplier */}
          {streak > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2"
            >
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next Multiplier Bonus</span>
                <span className="text-accent font-semibold">
                  {3 - (streak % 3)} more correct!
                </span>
              </div>
              <Progress value={(streak % 3) * 33.33} className="h-2 bg-accent/20" />
            </motion.div>
          )}
        </div>

        {/* Challenge Question */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">{challenge.question}</CardTitle>
            <CardDescription>
              Observe the particles and make your prediction
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Quantum Particles Visualization */}
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="relative flex items-center justify-center gap-8 md:gap-16 min-h-[300px]">
              <QuantumParticle
                name="ALICE"
                state={aliceState}
                onClick={() => !isEntangled && measureAlice()}
                separated={separated}
                position="left"
              />
              
              <EntanglementLink isActive={isEntangled} separated={separated} />
              
              <QuantumParticle
                name="BOB"
                state={bobState}
                onClick={() => {}}
                separated={separated}
                position="right"
              />
            </div>

            {!isEntangled && (
              <div className="text-center mt-6">
                <Button
                  onClick={measureAlice}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  Measure Alice's Particle
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Answer Buttons */}
        {isEntangled && !showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleAnswer("opposite")}
                className="w-full h-auto py-6 flex-col gap-2 border-2 hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all duration-300"
              >
                <span className="text-lg font-bold">Opposite Spins ⚡</span>
                <span className="text-sm text-muted-foreground">
                  They will have opposite measurements
                </span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleAnswer("same")}
                className="w-full h-auto py-6 flex-col gap-2 border-2 hover:border-secondary hover:bg-secondary/10 hover:shadow-[0_0_20px_hsl(var(--secondary)/0.3)] transition-all duration-300"
              >
                <span className="text-lg font-bold">Same Spins 🔄</span>
                <span className="text-sm text-muted-foreground">
                  They will have identical measurements
                </span>
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="border-accent/20 bg-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-accent" />
                    Explanation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{challenge.explanation}</p>
                  <Button
                    onClick={nextChallenge}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    Next Challenge
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Home Button */}
        <div className="text-center">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            Back to Simulation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuantumGame;
