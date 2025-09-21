import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  MessageCircle, 
  Send, 
  Share2, 
  Download, 
  ArrowLeft,
  Scale,
  Search,
  Users,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [contractData, setContractData] = useState<any>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{role: string, message: string}>>([]);
  const [isSubmittingExperience, setIsSubmittingExperience] = useState(false);
  const [userExperience, setUserExperience] = useState("");

  // Fetch contract data from sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem('contractData');
    if (!data) {
      navigate('/input');
      return;
    }
    setContractData(JSON.parse(data));
  }, [navigate]);

  // Fetch analysis results from backend
  // Fetch analysis results from backend
useEffect(() => {
  if (!contractData) return;

  const fetchAnalysis = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/analyze-contract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractText: contractData.contractText,
          analysis_type: "full",
          partyName: contractData.partyName,
          language: contractData.language || 'en'
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch analysis");

      const data = await response.json();
      setAnalysisResults(data);
    } catch (error: any) {
      toast({
        title: "Error fetching analysis",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  fetchAnalysis();
}, [contractData, toast]);


  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  // Chat submission with backend AI
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newHistory = [...chatHistory, { role: 'user', message: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId: contractData.id, message: chatMessage }),
      });
      if (!response.ok) throw new Error("Chat service failed");

      const data = await response.json();
      setChatHistory((prev) => [...prev, { role: 'ai', message: data.reply }]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Submit user experience to backend
  const handleExperienceSubmit = async () => {
    if (!userExperience.trim()) {
      toast({
        title: "Experience Required",
        description: "Please share your experience before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingExperience(true);
    try {
      const response = await fetch("/api/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId: contractData.id, experience: userExperience }),
      });
      if (!response.ok) throw new Error("Failed to submit experience");

      setUserExperience("");
      toast({
        title: "Thank You!",
        description: "Your experience has been submitted anonymously.",
      });
    } catch (error: any) {
      toast({
        title: "Submission Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmittingExperience(false);
    }
  };

  if (!contractData || !analysisResults) {
    return (
      <Layout>
        <div className="container mx-auto py-20 text-center text-muted-foreground">
          Loading contract analysis...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button asChild variant="ghost" className="mb-4">
                <Link to="/input">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Analyze Another Contract
                </Link>
              </Button>
              <h1 className="font-display text-4xl font-bold text-foreground">
                NyayDarpan Report
              </h1>
              <p className="text-muted-foreground mt-2">
                Contract analysis for: <span className="font-semibold">{contractData.partyName}</span>
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Overall Risk Score */}
          <Card className="mb-8 border-2 border-destructive/20 shadow-primary">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                    Overall Risk Score
                  </h2>
                  <p className="text-muted-foreground">
                    Based on AI analysis, legal precedents, and community insights
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full border-8 border-destructive flex items-center justify-center mb-2">
                    <span className="text-3xl font-bold text-destructive">
                      {analysisResults.overallRisk}
                    </span>
                  </div>
                  <Badge variant="destructive" className="text-sm">
                    {analysisResults.riskLevel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Analysis Sections */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Contract X-Ray Analysis */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-card transition-smooth border-2 hover:border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <span>🔍 Internal Audit (X-Ray)</span>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-4 mt-4">
                    {analysisResults.contractAnalysis.map((finding) => (
                      <Card key={finding.id} className="border-l-4 border-l-destructive">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">{finding.title}</h4>
                              <Badge variant={getRiskColor(finding.riskLevel) as any}>
                                {finding.riskLevel} Risk
                              </Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              Clause {finding.clause}
                            </span>
                          </div>
                          
                          <p className="text-muted-foreground mb-4">{finding.summary}</p>
                          
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm">
                                View Details <ChevronDown className="w-4 h-4 ml-2" />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4 space-y-4">
                              <div className="bg-muted/50 p-4 rounded-lg">
                                <h5 className="font-semibold mb-2">Detailed Analysis:</h5>
                                <p className="text-sm text-muted-foreground">{finding.details}</p>
                              </div>
                              <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                                <h5 className="font-semibold text-success mb-2">💡 Recommendation:</h5>
                                <p className="text-sm text-foreground">{finding.recommendation}</p>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Karma Check */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-card transition-smooth border-2 hover:border-secondary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 gradient-secondary rounded-lg flex items-center justify-center">
                            <Search className="w-5 h-5 text-secondary-foreground" />
                          </div>
                          <span>📜 Behavioral Risk (Karma Check)</span>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-4 mt-4">
                    {analysisResults.karmaCheck.map((caseItem) => (
                      <Card key={caseItem.id} className="border-l-4 border-l-warning">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">{caseItem.caseName}</h4>
                              <Badge variant="outline">{caseItem.year}</Badge>
                            </div>
                            <Badge variant="secondary">{caseItem.outcome}</Badge>
                          </div>
                          
                          <p className="text-muted-foreground mb-4">{caseItem.summary}</p>
                          
                          <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                            <h5 className="font-semibold text-warning mb-2">🎯 Relevance to Your Contract:</h5>
                            <p className="text-sm text-foreground">{caseItem.relevance}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Community Intelligence */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-card transition-smooth border-2 hover:border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <span>👥 Community Intelligence (People's Ledger)</span>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-4 mt-4">
                    {analysisResults.communityInsights.map((insight, index) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-foreground">{insight.theme}</h4>
                            <Badge variant="outline">{insight.count} reports</Badge>
                          </div>
                          <p className="text-muted-foreground">{insight.summary}</p>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-card transition-smooth border-2 border-dashed border-primary/30 hover:border-primary/50">
                          <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                              <Users className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <h4 className="font-semibold text-foreground mb-2">Share Your Experience</h4>
                            <p className="text-sm text-muted-foreground">
                              Help others by sharing your experience with {contractData.partyName}
                            </p>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Share Your Experience Anonymously</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Party Name
                            </label>
                            <Input value={contractData.partyName} disabled />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Your Experience
                            </label>
                            <Textarea
                              value={userExperience}
                              onChange={(e) => setUserExperience(e.target.value)}
                              placeholder="Share your experience working with this party..."
                              className="min-h-[100px]"
                            />
                          </div>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              🔒 This is 100% anonymous. We do not collect any personal identifying information.
                            </p>
                          </div>
                          <Button 
                            onClick={handleExperienceSubmit}
                            disabled={isSubmittingExperience}
                            className="w-full"
                          >
                            {isSubmittingExperience ? "Submitting..." : "Submit Experience"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Chat with Document Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat with Your Document</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Chat History */}
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {chatHistory.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Ask questions about your contract analysis
                      </p>
                    ) : (
                      chatHistory.map((chat, index) => (
                        <div key={index} className={`p-3 rounded-lg ${
                          chat.role === 'user' 
                            ? 'bg-primary text-primary-foreground ml-4' 
                            : 'bg-muted mr-4'
                        }`}>
                          <p className="text-sm">{chat.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Chat Input */}
                  <form onSubmit={handleChatSubmit} className="flex space-x-2">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Ask about your contract..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!chatMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/input">
                      <FileText className="w-4 h-4 mr-2" />
                      Analyze Another Contract
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Scale className="w-4 h-4 mr-2" />
                    Consult a Lawyer
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download Full Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportPage;