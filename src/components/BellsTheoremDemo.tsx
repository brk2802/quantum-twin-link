import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dices, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const BellsTheoremDemo = () => {
  const [trials, setTrials] = useState(0);
  const [violations, setViolations] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const runExperiment = () => {
    setIsRunning(true);
    let count = 0;
    let violationCount = 0;

    const interval = setInterval(() => {
      count++;
      // Simulate quantum correlation (violates Bell's inequality ~85% of the time)
      if (Math.random() > 0.15) {
        violationCount++;
      }
      
      setTrials(count);
      setViolations(violationCount);

      if (count >= 100) {
        clearInterval(interval);
        setIsRunning(false);
        toast.success("Experiment complete! Quantum mechanics prevails!", {
          icon: <BarChart3 className="w-4 h-4" />,
        });
      }
    }, 20);
  };

  const reset = () => {
    setTrials(0);
    setViolations(0);
  };

  const violationRate = trials > 0 ? (violations / trials) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-primary">Bell's Theorem Experiment</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Test if quantum correlations violate classical physics predictions. 
          Bell's inequality proves quantum entanglement is real and not just hidden variables.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-lg border border-primary/20 bg-card/50 backdrop-blur"
        >
          <div className="text-sm text-muted-foreground mb-2">Total Trials</div>
          <div className="text-3xl font-bold text-primary">{trials}</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-lg border border-secondary/20 bg-card/50 backdrop-blur"
        >
          <div className="text-sm text-muted-foreground mb-2">Bell Violations</div>
          <div className="text-3xl font-bold text-secondary">{violations}</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-lg border border-accent/20 bg-card/50 backdrop-blur"
        >
          <div className="text-sm text-muted-foreground mb-2">Violation Rate</div>
          <div className="text-3xl font-bold text-accent">{violationRate.toFixed(1)}%</div>
        </motion.div>
      </div>

      <div className="space-y-3">
        <Progress value={trials} className="h-2" />
        <div className="flex gap-3 justify-center">
          <Button
            onClick={runExperiment}
            disabled={isRunning}
            size="lg"
            className="gap-2"
          >
            <Dices className="w-5 h-5" />
            {isRunning ? "Running..." : "Run Experiment"}
          </Button>
          <Button onClick={reset} variant="outline" size="lg">
            Reset
          </Button>
        </div>
      </div>

      {trials >= 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-primary/10 border border-primary/20"
        >
          <p className="text-sm">
            <strong>Result:</strong> {violationRate > 70 ? "✓" : "✗"} Quantum correlations detected! 
            The violation rate of {violationRate.toFixed(1)}% exceeds the classical limit (50%), 
            proving entanglement exists beyond local hidden variables.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default BellsTheoremDemo;
