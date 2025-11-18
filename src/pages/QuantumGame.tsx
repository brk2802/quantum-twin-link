import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Trophy, 
  Brain, 
  Zap, 
  CheckCircle2, 
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
  options: string[];
  explanation: string;
  correctAnswer: number;
  type: "spin" | "concept";
}

const challenges: Record<GameLevel, Challenge[]> = {
  tutorial: [
    {
      id: 1,
      question: "When you measure Alice's particle as SPIN UP ⬆️, what will Bob's particle be?",
      options: ["SPIN UP ⬆️", "SPIN DOWN ⬇️", "Random/Uncertain"],
      explanation: "Perfect! In quantum entanglement, particles are perfectly anti-correlated. When Alice is SPIN UP, Bob is always SPIN DOWN!",
      correctAnswer: 1,
      type: "spin"
    },
    {
      id: 2,
      question: "Alice measures SPIN DOWN ⬇️. What's Bob's state?",
      options: ["SPIN UP ⬆️", "SPIN DOWN ⬇️", "Could be either"],
      explanation: "Excellent! Bob's particle will be SPIN UP when Alice is SPIN DOWN. They're perfectly correlated!",
      correctAnswer: 0,
      type: "spin"
    },
    {
      id: 3,
      question: "Before measurement, what are the particles' states?",
      options: ["Both UP", "Both DOWN", "Superposition (both at once)", "Already decided but hidden"],
      explanation: "Great! Before measurement, entangled particles exist in superposition - they don't have definite states until measured!",
      correctAnswer: 2,
      type: "concept"
    }
  ],
  basic: [
    {
      id: 4,
      question: "Bob measures SPIN UP ⬆️. What happened to Alice's particle?",
      options: ["SPIN UP ⬆️", "SPIN DOWN ⬇️", "Still uncertain"],
      explanation: "Correct! When Bob measures SPIN UP, Alice's particle instantly becomes SPIN DOWN. This is quantum entanglement!",
      correctAnswer: 1,
      type: "spin"
    },
    {
      id: 5,
      question: "Can particles send messages faster than light using entanglement?",
      options: ["Yes, instantly!", "No, only correlations exist", "Only over short distances"],
      explanation: "Right! While correlations appear instant, they can't transmit information. Each measurement result appears random!",
      correctAnswer: 1,
      type: "concept"
    },
    {
      id: 6,
      question: "Alice is SPIN DOWN ⬇️. Bob will be...",
      options: ["SPIN UP ⬆️", "SPIN DOWN ⬇️", "Superposition"],
      explanation: "Perfect! The anti-correlation means opposite spins. Alice DOWN = Bob UP!",
      correctAnswer: 0,
      type: "spin"
    },
    {
      id: 7,
      question: "What happens when Alice measures her particle?",
      options: ["Only Alice's state changes", "Bob's state also becomes definite", "Nothing happens to Bob"],
      explanation: "Exactly! The measurement 'collapses' both particles simultaneously, no matter the distance!",
      correctAnswer: 1,
      type: "concept"
    }
  ],
  intermediate: [
    {
      id: 8,
      question: "Particles are 1000 km apart. Alice measures SPIN UP ⬆️. Bob's state?",
      options: ["SPIN UP ⬆️", "SPIN DOWN ⬇️", "Uncorrelated now"],
      explanation: "Brilliant! Distance doesn't matter in quantum entanglement. The correlation is maintained regardless of separation!",
      correctAnswer: 1,
      type: "spin"
    },
    {
      id: 9,
      question: "Einstein called entanglement 'spooky action at a distance.' Why was he skeptical?",
      options: ["It seemed to violate locality", "It was too fast", "It required magic", "It broke thermodynamics"],
      explanation: "Correct! Einstein believed nothing could influence distant objects instantly. But quantum mechanics proved him wrong!",
      correctAnswer: 0,
      type: "concept"
    },
    {
      id: 10,
      question: "After measuring once, Alice measures again. What happens?",
      options: ["Same result as before", "Opposite result", "New random result"],
      explanation: "Right! After the first measurement, the particle has a definite state. Measuring again gives the same result!",
      correctAnswer: 0,
      type: "concept"
    },
    {
      id: 11,
      question: "Bob measures SPIN DOWN ⬇️. Alice will measure...",
      options: ["SPIN UP ⬆️", "SPIN DOWN ⬇️", "Nothing yet"],
      explanation: "Perfect understanding! The anti-correlation continues: Bob DOWN means Alice UP!",
      correctAnswer: 0,
      type: "spin"
    },
    {
      id: 12,
      question: "What breaks the entanglement?",
      options: ["Distance", "Time", "Measurement", "Nothing can break it"],
      explanation: "Excellent! Measurement 'collapses' the quantum state and breaks the entanglement. It's a one-time correlation!",
      correctAnswer: 2,
      type: "concept"
    }
  ],
  advanced: [
    {
      id: 13,
      question: "Alice is SPIN UP ⬆️. What's Bob's spin?",
      options: ["SPIN UP ⬆️", "SPIN DOWN ⬇️", "Depends on distance"],
      explanation: "Masterful! You've mastered the fundamental principle: opposite spins, always!",
      correctAnswer: 1,
      type: "spin"
    },
    {
      id: 14,
      question: "Bell's theorem proved entanglement is...",
      options: ["Classical correlation", "True quantum phenomenon", "An illusion", "Local hidden variables"],
      explanation: "Outstanding! Bell's theorem proved quantum entanglement is real and not just hidden classical information!",
      correctAnswer: 1,
      type: "concept"
    },
    {
      id: 15,
      question: "Can we clone an entangled quantum state?",
      options: ["Yes, easily", "No, quantum no-cloning theorem", "Only if measured first"],
      explanation: "Perfect! The no-cloning theorem states you cannot create identical copies of unknown quantum states!",
      correctAnswer: 1,
      type: "concept"
    },
    {
      id: 16,
      question: "Bob measures SPIN UP ⬆️. Alice's measurement shows...",
      options: ["SPIN UP ⬆️", "SPIN DOWN ⬇️", "Both states"],
      explanation: "Quantum mastery! The perfect anti-correlation: Bob UP = Alice DOWN!",
      correctAnswer: 1,
      type: "spin"
    },
    {
      id: 17,
      question: "What's the practical use of quantum entanglement?",
      options: ["Time travel", "Quantum computing & cryptography", "Teleportation of matter", "Unlimited energy"],
      explanation: "Brilliant! Entanglement enables quantum computers, ultra-secure communication, and quantum teleportation of information!",
      correctAnswer: 1,
      type: "concept"
    },
    {
      id: 18,
      question: "In quantum teleportation, what actually moves?",
      options: ["The particle itself", "Quantum information", "Energy", "Nothing moves"],
      explanation: "Genius! Only the quantum information is transferred, not the physical particle. The original state is destroyed!",
      correctAnswer: 1,
      type: "concept"
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
    setStreak(0);
    setBestStreak(0);
    setMultiplier(1);
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
    setSeparated(true);
  };

  const handleAnswer = (answerIndex: number) => {
    const currentChallenges = challenges[gameLevel];
    const challenge = currentChallenges[currentChallenge];
    setTotalAttempts(prev => prev + 1);
    
    if (answerIndex === challenge.correctAnswer) {
      const newStreak = streak + 1;
      const newMultiplier = Math.min(Math.floor(newStreak / 3) + 1, 5);
      const points = 10 * newMultiplier;
      
      setScore(prev => prev + points);
      setStreak(newStreak);
      setBestStreak(Math.max(bestStreak, newStreak));
      setMultiplier(newMultiplier);
      setShowExplanation(true);
      
      if (newMultiplier > 1) {
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 1000);
      }
      
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 1000);
      
      toast.success(`Correct! +${points} points! 🎉`, {
        description: `${newStreak} streak! ${newMultiplier}x multiplier`
      });
    } else {
      setStreak(0);
      setMultiplier(1);
      setShowExplanation(true);
      toast.error("Not quite! Study the explanation", {
        description: "Streak reset"
      });
    }
  };

  const nextChallenge = () => {
    const levelChallenges = challenges[gameLevel];
    
    if (currentChallenge < levelChallenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      initializeChallenge();
    } else {
      const levels: GameLevel[] = ["tutorial", "basic", "intermediate", "advanced"];
      const currentIndex = levels.indexOf(gameLevel);
      
      if (currentIndex < levels.length - 1) {
        setGameLevel(levels[currentIndex + 1]);
        setCurrentChallenge(0);
        initializeChallenge();
        toast.success(`Level Up! Entering ${levels[currentIndex + 1]} mode!`);
      } else {
        toast.success(`Game Complete! Final Score: ${score}`);
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
                Master quantum mechanics through 18 challenging questions across 4 levels!
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
                    Why measurements affect each other instantly
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">🌌 Spooky Action</h4>
                  <p className="text-sm text-muted-foreground">
                    Einstein's "spooky action at a distance"
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">🎯 Real Applications</h4>
                  <p className="text-sm text-muted-foreground">
                    Quantum computing & cryptography
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Game Features
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left space-y-3">
                <div className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">4 Progressive Levels</p>
                    <p className="text-sm text-muted-foreground">Tutorial to Quantum Master</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-semibold">Streak Multipliers</p>
                    <p className="text-sm text-muted-foreground">Up to 5x points boost</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-secondary mt-0.5" />
                  <div>
                    <p className="font-semibold">18 Unique Challenges</p>
                    <p className="text-sm text-muted-foreground">Spin predictions + concepts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" size="lg" onClick={() => navigate("/")} className="gap-2">
                <Home className="w-4 h-4" />
                Back Home
              </Button>
              <Button size="lg" onClick={startGame} className="gap-2 bg-gradient-to-r from-primary to-secondary">
                <Brain className="w-4 h-4" />
                Start Game
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const challenge = challenges[gameLevel][currentChallenge];
  const totalChallenges = challenges[gameLevel].length;
  const levelProgress = ((currentChallenge + 1) / totalChallenges) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <Home className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Quantum Challenge</h1>
              <p className="text-sm text-muted-foreground">
                Level: {gameLevel.charAt(0).toUpperCase() + gameLevel.slice(1)} - Challenge {currentChallenge + 1}/{totalChallenges}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 items-center flex-wrap">
            <Badge variant="secondary" className="gap-1 px-3 py-1.5">
              <Trophy className="w-4 h-4" />
              Score: {score}
            </Badge>
            <Badge variant="outline" className="gap-1 px-3 py-1.5 border-accent text-accent">
              <Zap className="w-4 h-4" />
              Streak: {streak}
            </Badge>
            <Badge variant="outline" className="gap-1 px-3 py-1.5">
              Best: {bestStreak}
            </Badge>
            <Badge variant="outline" className="gap-1 px-3 py-1.5 border-primary text-primary">
              {multiplier}x
            </Badge>
          </div>
        </div>

        <AnimatePresence>
          {showCombo && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            >
              <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                {multiplier}x COMBO!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Level Progress</span>
              <span className="text-primary font-bold">{Math.round(levelProgress)}%</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>
          
          {streak > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next Multiplier</span>
                <span className="text-accent font-semibold">{3 - (streak % 3)} more!</span>
              </div>
              <Progress value={(streak % 3) * 33.33} className="h-2" />
            </motion.div>
          )}
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              {challenge.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {challenge.type === "spin" ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <QuantumParticle name="Alice" state={aliceState} separated={separated} position="left" />
                  {isEntangled && (
                    <div className="flex items-center justify-center">
                      <EntanglementLink separated={separated} />
                    </div>
                  )}
                  <QuantumParticle name="Bob" state={bobState} separated={separated} position="right" />
                </div>

                {aliceState !== "neutral" && !showExplanation && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground mb-4">Choose Bob's particle state:</p>
                    <div className="grid gap-3">
                      {challenge.options.map((option, index) => (
                        <Button key={index} variant="outline" size="lg" onClick={() => handleAnswer(index)} className="justify-start hover:scale-105 transition-transform">
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {aliceState === "neutral" && (
                  <Button onClick={() => measureAlice()} size="lg" className="w-full">
                    <Zap className="mr-2 h-5 w-5" />
                    Measure Alice's Particle
                  </Button>
                )}
              </>
            ) : (
              <div className="space-y-4">
                {!showExplanation && (
                  <div className="grid gap-3">
                    {challenge.options.map((option, index) => (
                      <Button key={index} variant="outline" size="lg" onClick={() => handleAnswer(index)} className="justify-start hover:scale-105 transition-transform text-left h-auto py-4">
                        <span className="mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1">{option}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {showExplanation && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg space-y-4">
                <p className="text-sm">{challenge.explanation}</p>
                <Button onClick={nextChallenge} className="w-full gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Next Challenge
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuantumGame;
