import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import WarpTransition from "@/components/WarpTransition";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [showWarp, setShowWarp] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !registrationNo) {
      toast.error("Please enter both name and registration number");
      return;
    }

    setLoading(true);

    try {
      // Create email from registration number
      const email = `${registrationNo}@students.local`;

      // Try to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: registrationNo,
      });

      if (signInError) {
        // If user doesn't exist, create account
        if (signInError.message.includes("Invalid login credentials")) {
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password: registrationNo,
          });

          if (signUpError) throw signUpError;

          // Sign in after signup
          const { error: signInError2 } = await supabase.auth.signInWithPassword({
            email,
            password: registrationNo,
          });

          if (signInError2) throw signInError2;
        } else {
          throw signInError;
        }
      }

      // Now verify and claim the student record
      const { data: isValid, error: verifyError } = await supabase.rpc(
        'verify_and_claim_student',
        { p_name: name, p_registration_no: registrationNo }
      );

      if (verifyError) throw verifyError;

      if (!isValid) {
        // Sign out if verification failed
        await supabase.auth.signOut();
        toast.error("Student not found. Please check your name and registration number.");
        setLoading(false);
        return;
      }

      toast.success("Logged in successfully!");
      
      // Trigger warp transition before navigation
      setShowWarp(true);
      setTimeout(() => {
        navigate("/");
      }, 1200); // Delay navigation for warp animation
      return; // Exit early to prevent setting loading to false

    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showWarp && <WarpTransition />}
      </AnimatePresence>
      
      <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 backdrop-blur-sm bg-card/50">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-2">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Student Login
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to access the quantum entanglement simulation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNo">Registration Number</Label>
                <Input
                  id="registrationNo"
                  type="password"
                  placeholder="Enter your registration number"
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                  disabled={loading}
                  className="bg-background/50"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
    </>
  );
};

export default Auth;
