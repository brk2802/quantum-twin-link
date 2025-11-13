import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");

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
      // Look up student by name to get their email
      const { data: students, error: lookupError } = await supabase
        .from("students")
        .select("*")
        .eq("name", name)
        .limit(1);

      if (lookupError) throw lookupError;

      if (!students || students.length === 0) {
        toast.error("Student not found. Please check your name.");
        setLoading(false);
        return;
      }

      const student = students[0];
      
      // Create email from registration number if user doesn't exist
      const email = `${registrationNo}@students.local`;

      // Try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
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

          toast.success("Account created and logged in!");
        } else {
          throw signInError;
        }
      } else {
        toast.success("Logged in successfully!");
      }

      // Update student record with user_id if not set
      if (signInData?.user && !student.user_id) {
        await supabase
          .from("students")
          .update({ user_id: signInData.user.id })
          .eq("id", student.id);
      }

    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};

export default Auth;
