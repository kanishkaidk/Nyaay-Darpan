import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { 
  FileText, 
  Brain, 
  Shield, 
  Users, 
  Search, 
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Zap
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/input");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (user) {
    return null; // Will redirect to /input
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight">
                  <span style={{color: '#0B3C5D'}}>Sign Your Contracts</span>{" "}
                  <span style={{color: '#F2C94C'}}>Without Fear</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Don't let the fine print fine you. NyayDarpan is your AI-powered legal shield, 
                  giving you the clarity to negotiate fair terms and sign with 100% confidence.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="hero" size="xl">
                  <Link to="/signup">
                    Start Free Analysis
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <Link to="#demo">
                    See Live Example
                  </Link>
                </Button>
              </div>
              
              {/* Trust Signals */}
              <div className="text-center mb-8">
                <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
                  Why Thousands of Indians Trust NyayDarpan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🤖</div>
                    <h4 className="font-semibold text-foreground mb-2">Zero Cost, Powerful AI</h4>
                    <p className="text-sm text-muted-foreground">
                      Truly free, no hidden fees. Powered by Google's latest Gemini AI.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🛡️</div>
                    <h4 className="font-semibold text-foreground mb-2">Your Data is 100% Private</h4>
                    <p className="text-sm text-muted-foreground">
                      We never store your contracts or personal data. Analysis is completely confidential.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🇮🇳</div>
                    <h4 className="font-semibold text-foreground mb-2">Built for India</h4>
                    <p className="text-sm text-muted-foreground">
                      Full Hindi & English support. Analyzes clauses specific to Indian law.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 gradient-secondary rounded-3xl blur-3xl opacity-20 animate-pulse-glow"></div>
              <img 
                src={heroImage} 
                alt="AI Contract Analysis Visualization" 
                className="relative z-10 w-full h-auto rounded-2xl shadow-primary animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              How It Works: Your Path to Peace of Mind
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to protect yourself from hidden legal risks
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center group hover:shadow-card transition-smooth">
              <CardContent className="p-8">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow transition-smooth">
                  <FileText className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-4">1. Paste Your Contract</h3>
                <p className="text-muted-foreground">
                  Simply paste your contract text into our secure portal. No complex uploads needed.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-card transition-smooth">
              <CardContent className="p-8">
                <div className="w-16 h-16 gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow transition-smooth">
                  <Brain className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-4">2. AI X-Ray Scan</h3>
                <p className="text-muted-foreground">
                  Our AI performs a deep analysis, scanning for unfair clauses, hidden risks, and loopholes.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-card transition-smooth">
              <CardContent className="p-8">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow transition-smooth">
                  <Shield className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-4">3. Understand Your Report</h3>
                <p className="text-muted-foreground">
                  Receive a plain-English report with a clear risk score and actionable steps to take.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              See the Unseen with Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to make informed legal decisions
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-primary transition-smooth border-2 hover:border-primary/20">
              <CardContent className="p-8">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse-glow">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-4">
                  🔬 <span style={{color: '#0B3C5D'}}>Contract X-Ray</span>
                </h3>
                <p className="text-muted-foreground mb-6">
                  Go beyond the surface. Our AI reveals what you can't see: contradictory clauses, 
                  hidden fees, and unfair terms.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5" />
                    <div>
                      <strong>Clause-by-Clause Analysis:</strong> We pinpoint exact sections like "12.B" and explain the risk.
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5" />
                    <div>
                      <strong>Plain English Explanations:</strong> No legal jargon. Just clear, actionable insights.
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5" />
                    <div>
                      <strong>Color-Coded Risk Scoring:</strong> Immediately see what's safe, what's risky, and what's dangerous.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-primary transition-smooth border-2 hover:border-secondary/20">
              <CardContent className="p-8">
                <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse-glow">
                  <Search className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-4">
                  📜 <span style={{color: '#0B3C5D'}}>Karma Check</span>
                </h3>
                <p className="text-muted-foreground mb-6">
                  Know who you're dealing with. We scan thousands of public legal records to find 
                  the other party's history.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5" />
                    <div>
                      <strong>Court Case History:</strong> Discover if they've been involved in lawsuits or disputes.
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5" />
                    <div>
                      <strong>Behavioral Patterns:</strong> See if there's a history of late payments or broken agreements.
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5" />
                    <div>
                      <strong>Reputation Risk Assessment:</strong> Get a score based on their public legal behavior.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-primary transition-smooth border-2 hover:border-primary/20">
              <CardContent className="p-8">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse-glow">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-4">
                  👥 <span style={{color: '#0B3C5D'}}>The People's Ledger</span>
                </h3>
                <p className="text-muted-foreground mb-6">
                  Learn from the community. Access anonymous, AI-summarized experiences from others 
                  who've been in your shoes.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5" />
                    <div>
                      <strong>Anonymous Reviews:</strong> Read honest experiences without fear.
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5" />
                    <div>
                      <strong>AI-Summarized Insights:</strong> Get the overall consensus, not just one-off complaints.
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5" />
                    <div>
                      <strong>Community Trust Warnings:</strong> See collective red flags before you sign.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Trust Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">
              Powered by Cutting-Edge Technology You Can Trust
            </h2>
            
            {/* Google AI Highlight */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-primary-foreground" />
              </div>
              <h4 className="font-display text-xl font-semibold text-foreground mb-2">Google's Gemini AI</h4>
              <p className="text-muted-foreground">
                Leveraging the world's most advanced AI model for accurate, reliable analysis.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl mb-3">🔒</div>
                <h4 className="font-semibold text-foreground mb-2">Enterprise-Grade Security</h4>
                <p className="text-sm text-muted-foreground">
                  Your data is encrypted in transit and never stored on our servers.
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🌐</div>
                <h4 className="font-semibold text-foreground mb-2">Multilingual Support</h4>
                <p className="text-sm text-muted-foreground">
                  Get your full report in both English and Hindi.
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="font-semibold text-foreground mb-2">Instant Results</h4>
                <p className="text-sm text-muted-foreground">
                  Our analysis takes seconds, not days or weeks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Join Over 25,000 Empowered Users
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 text-center shadow-card hover:shadow-primary transition-smooth">
              <CardContent className="p-0">
                <div className="text-4xl mb-4">💰</div>
                <blockquote className="text-lg text-muted-foreground italic mb-4">
                  "I almost signed a rental agreement with a massive hidden maintenance fee. 
                  NyayDarpan saved me ₹50,000!"
                </blockquote>
                <cite className="font-semibold text-foreground">
                  — Rohan M., Bangalore
                </cite>
              </CardContent>
            </Card>
            
            <Card className="p-8 text-center shadow-card hover:shadow-primary transition-smooth">
              <CardContent className="p-0">
                <div className="text-4xl mb-4">⚠️</div>
                <blockquote className="text-lg text-muted-foreground italic mb-4">
                  "The Karma Check showed my potential employer had a history of not paying freelancers. 
                  I avoided a huge mistake."
                </blockquote>
                <cite className="font-semibold text-foreground">
                  — Priya S., Delhi
                </cite>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5"></div>
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
              Ready to See the Truth Behind Your Contract?
            </h2>
            <p className="text-xl text-muted-foreground">
              Stop guessing and start knowing.
            </p>
            <Button asChild variant="cta" size="xl">
              <Link to="/signup">
                🔍 Analyze Your Contract Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              No signup required • 100% free • Results in 60 seconds
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;