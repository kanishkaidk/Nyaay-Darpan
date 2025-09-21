import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Shield, Check, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

const SignupPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToUpdates, setAgreeToUpdates] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithProvider } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-destructive", "bg-warning", "bg-warning", "bg-success", "bg-success"];

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the terms of service to continue.",
        variant: "destructive",
      });
      return;
    }

    if (passwordStrength < 3) {
      toast({
        title: "Password too weak",
        description: "Please create a stronger password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
      navigate("/input");
    }
    
    setIsLoading(false);
  };

  const handleSocialSignup = async (provider: 'google' | 'linkedin_oidc') => {
    const { error } = await signInWithProvider(provider);
    
    if (error) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-3">
                Create Your Free Account or Start Protecting Yourself in Seconds
              </h1>
              <p className="text-sm text-muted-foreground">
                Join thousands of Indians who are signing contracts with 100% confidence. 
                Your data is always private and secure.
              </p>
            </div>

            {/* Trust Signals */}
            <div className="bg-card rounded-lg p-4 mb-6 border border-border shadow-card">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-success" />
                  <span className="text-muted-foreground">Encrypted & Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-muted-foreground">No Data Sharing</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-8 shadow-card border border-border animate-scale-in">
              {/* Social Sign-up Options */}
              <div className="space-y-3 mb-6">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full hover-scale"
                  onClick={() => handleSocialSignup('google')}
                >
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign up with Google
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full hover-scale"
                  onClick={() => handleSocialSignup('linkedin_oidc')}
                >
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 fill-[#0077B5]" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Sign up with LinkedIn
                  </div>
                </Button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Your Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="transition-smooth"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="transition-smooth"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 transition-smooth"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-smooth"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              level <= passwordStrength
                                ? strengthColors[passwordStrength - 1] || "bg-muted"
                                : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password strength: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : "Too short"}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        <p>Password must contain:</p>
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          <li className={password.length >= 8 ? "text-success" : ""}>At least 8 characters</li>
                          <li className={/[0-9]/.test(password) ? "text-success" : ""}>At least 1 number</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Trust & Privacy Signals */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="updates" 
                      checked={agreeToUpdates}
                      onCheckedChange={(checked) => setAgreeToUpdates(checked as boolean)}
                    />
                    <Label htmlFor="updates" className="text-sm leading-relaxed">
                      I agree to receive occasional product updates and tips (optional)
                    </Label>
                  </div>
                </div>

                {/* Security Message */}
                <div className="bg-accent/50 rounded-lg p-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-foreground font-medium">Your contract data is encrypted</p>
                      <p className="text-muted-foreground">
                        We never share your personal information.{" "}
                        <Link to="/security" className="text-primary hover:underline">
                          Learn more about security
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  type="submit"
                  size="lg" 
                  className="w-full font-semibold hover-scale"
                  disabled={!agreeToTerms || isLoading}
                >
                  {isLoading ? "Creating Account..." : "Start Analyzing Contracts"}
                </Button>
              </form>

              {/* Login Redirect */}
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-medium hover:underline story-link">
                    Log in
                  </Link>
                </p>
              </div>
            </div>

            {/* Language Toggle */}
            <div className="flex justify-center mt-6">
              <Button variant="ghost" size="sm" className="hover-scale">
                <Globe className="h-4 w-4 mr-2" />
                English / हिन्दी
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;