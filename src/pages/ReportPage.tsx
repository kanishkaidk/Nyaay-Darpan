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
  FileText,
  Brain
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const ReportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [contractData, setContractData] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{role: string, message: string}>>([]);
  const [isSubmittingExperience, setIsSubmittingExperience] = useState(false);
  const [userExperience, setUserExperience] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [karmaCheckResults, setKarmaCheckResults] = useState<any>(null);
  const [companyReviews, setCompanyReviews] = useState<any>(null);
  const [xrayResults, setXrayResults] = useState<any>(null);
  const [isXrayLoading, setIsXrayLoading] = useState(false);

  const fetchXrayAnalysis = async () => {
    if (xrayResults || isXrayLoading || !contractData?.contractText) return;
    
    setIsXrayLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/xray-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contract_text: contractData.contractText,
          contract_type: 'employment'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setXrayResults(result);
        console.log('X-Ray analysis result:', result);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('X-Ray analysis error:', error);
      toast({
        title: "X-Ray Analysis Failed",
        description: "Could not perform X-Ray analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsXrayLoading(false);
    }
  };

  useEffect(() => {
    // Get contract data from sessionStorage
    const data = sessionStorage.getItem('contractData');
    console.log('ReportPage: Loading contract data:', data);
    if (!data) {
      console.log('ReportPage: No contract data found, redirecting to input');
      navigate('/input');
      return;
    }
    
    const parsedData = JSON.parse(data);
    console.log('ReportPage: Parsed contract data:', parsedData);
    setContractData(parsedData);

    // Get analysis results from sessionStorage (set by AnalyzingPage)
    const analysisData = sessionStorage.getItem('analysisResult');
    console.log('Analysis data from sessionStorage:', analysisData);
    if (analysisData) {
      const parsed = JSON.parse(analysisData);
      console.log('Parsed analysis results:', parsed);
      setAnalysisResults(parsed);
    } else {
      console.log('No analysis data found in sessionStorage');
    }

    // Call karma check API
    const performKarmaCheck = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/karma-check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            company_name: contractData.partyName,
            limit: 5
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setKarmaCheckResults(result);
        }
      } catch (error) {
        console.error('Karma check failed:', error);
      }
    };

    if (contractData?.partyName) {
      performKarmaCheck();
      
      // Call company reviews API
      const getCompanyReviews = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/company-reviews`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              company_name: contractData.partyName,
              limit: 5
            }),
          });

          if (response.ok) {
            const result = await response.json();
            setCompanyReviews(result);
          }
        } catch (error) {
          console.error('Company reviews failed:', error);
        }
      };

      getCompanyReviews();
    }
  }, [navigate, contractData?.partyName]);

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ReportPage: Chat submit triggered');
    console.log('ReportPage: Chat message:', chatMessage);
    console.log('ReportPage: Contract data:', contractData);
    console.log('ReportPage: Contract text available:', contractData?.contractText ? 'Yes' : 'No');
    
    if (!chatMessage.trim() || !contractData) {
      console.log('ReportPage: Early return - missing message or contract data');
      return;
    }

    // Add user message
    const newHistory = [...chatHistory, { role: 'user', message: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage("");
    setIsChatLoading(true);

    try {
      // Call the backend API for intelligent chat
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/intelligent-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contract_text: contractData.contractText,
          user_question: chatMessage,
          chat_history: chatHistory,
          analysis_context: analysisResults
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.chat_response) {
        const aiResponse = result.chat_response.answer || "I couldn't process your question. Please try again.";
        setChatHistory(prev => [...prev, { role: 'ai', message: aiResponse }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'ai', message: `Error: ${result.error || 'Unknown error'}` }]);
      }
    } catch (error) {
      console.error('Chat API call failed:', error);
      setChatHistory(prev => [...prev, { role: 'ai', message: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleExperienceSubmit = () => {
    if (!userExperience.trim()) {
      toast({
        title: "Experience Required",
        description: "Please share your experience before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingExperience(true);
    
    // Mock submission
    setTimeout(() => {
      setIsSubmittingExperience(false);
      setUserExperience("");
      toast({
        title: "Thank You!",
        description: "Your experience has been submitted anonymously and will help others.",
      });
    }, 1000);
  };

  if (!contractData) {
    return null;
  }

  // Transform ultra analysis results to match the expected format
  const displayResults = analysisResults ? {
    overallRisk: analysisResults.analysis?.executive_summary?.risk_score || 0,
    riskLevel: analysisResults.analysis?.executive_summary?.overall_risk_level || "Unknown",
    contractAnalysis: analysisResults.analysis?.advanced_risk_analysis?.loophole_analysis?.map((item: any, index: number) => ({
      id: index + 1,
      title: item.loophole_type === 'ambiguity' ? 'Ambiguous Clause' : 'Missing Protection',
      riskLevel: item.exploitation_potential === 'high' ? 'High' : item.exploitation_potential === 'medium' ? 'Medium' : 'Low',
      summary: item.description,
      details: item.description,
      clause: "N/A",
      recommendation: item.mitigation_strategy
    })) || [],
    karmaCheck: karmaCheckResults ? [{
      id: 1,
      caseName: `${karmaCheckResults.company} Legal History`,
      summary: karmaCheckResults.summary,
      relevance: `Found ${karmaCheckResults.cases_found} cases with risk level: ${karmaCheckResults.risk_level}`,
      outcome: karmaCheckResults.risk_level === 'low' ? 'No major issues found' : 'Some concerns identified',
      year: "Recent"
    }] : [],
    communityInsights: [
      {
        theme: "Payment Delays",
        count: 3,
        summary: "3 users reported slow payment from this company. Average delay: 45 days."
      },
      {
        theme: "Communication Issues",
        count: 2,
        summary: "2 users mentioned poor response time to queries and concerns."
      },
      {
        theme: "Contract Clarity",
        count: 4,
        summary: "4 users noted unclear termination clauses in similar contracts."
      }
    ]
  } : {
    overallRisk: 0,
    riskLevel: "Unknown",
    contractAnalysis: [],
    karmaCheck: [],
    communityInsights: []
  };

  if (!analysisResults) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Analysis Results Not Found</h1>
            <p className="text-muted-foreground mb-4">
              It seems the analysis didn't complete properly. Please try analyzing your contract again.
            </p>
            <Button asChild>
              <Link to="/input">Analyze Contract Again</Link>
            </Button>
          </div>
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
                {t('report.title')}
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
                    {t('report.overallRisk')}
                  </h2>
                  <p className="text-muted-foreground">
                    {t('report.riskDescription')}
                  </p>
                  {analysisResults?.analysis?.executive_summary?.recommendation && (
                    <p className="text-sm text-primary font-medium mt-2">
                      Recommendation: {analysisResults.analysis.executive_summary.recommendation.replace('_', ' ').toUpperCase()}
                    </p>
                  )}
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full border-8 border-destructive flex items-center justify-center mb-2">
                    <span className="text-3xl font-bold text-destructive">
                      {displayResults.overallRisk}
                    </span>
                  </div>
                  <Badge variant="destructive" className="text-sm">
                    {displayResults.riskLevel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Executive Summary */}
          {analysisResults?.analysis?.executive_summary && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResults.analysis.executive_summary.key_findings && (
                    <div>
                      <h4 className="font-semibold mb-2">Key Findings:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {analysisResults.analysis.executive_summary.key_findings.map((finding: string, index: number) => (
                          <li key={index}>{finding}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResults.analysis.executive_summary.immediate_concerns && (
                    <div>
                      <h4 className="font-semibold mb-2 text-destructive">Immediate Concerns:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                        {analysisResults.analysis.executive_summary.immediate_concerns.map((concern: string, index: number) => (
                          <li key={index}>{concern}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Transparency Section */}
          {analysisResults?.analysis && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  How AI Analyzed Your Contract
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Understanding how our AI reached these conclusions
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Confidence Metrics */}
                  {analysisResults.analysis.confidence_metrics && (
                    <div>
                      <h4 className="font-semibold mb-3">Analysis Confidence</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Legal Accuracy</span>
                          <span className="text-sm font-medium">{analysisResults.analysis.confidence_metrics.legal_accuracy}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Analysis Confidence</span>
                          <span className="text-sm font-medium">{analysisResults.analysis.confidence_metrics.analysis_confidence}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Completeness</span>
                          <span className="text-sm font-medium">{analysisResults.analysis.confidence_metrics.completeness}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Legal Compliance Audit */}
                  {analysisResults.analysis.legal_compliance_audit && (
                    <div>
                      <h4 className="font-semibold mb-3">Legal Compliance Check</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Indian Contract Act 1872</span>
                          <Badge variant={analysisResults.analysis.legal_compliance_audit.indian_contract_act_1872?.compliance_status === 'compliant' ? 'secondary' : 'destructive'}>
                            {analysisResults.analysis.legal_compliance_audit.indian_contract_act_1872?.compliance_status}
                          </Badge>
                        </div>
                        {analysisResults.analysis.legal_compliance_audit.sector_specific_laws?.employment_law && (
                          <div className="text-xs text-muted-foreground">
                            <p>✓ Factories Act 1948 compliance checked</p>
                            <p>✓ Industrial Disputes Act 1947 reviewed</p>
                            <p>✓ Minimum Wages Act 1948 verified</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Model Information */}
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>AI Model:</strong> {analysisResults.model_used || 'Gemini 1.5 Pro'} | 
                    <strong> Analysis Depth:</strong> {analysisResults.analysis_depth || 'Ultra-intensive'} |
                    <strong> Processed:</strong> {new Date(analysisResults.timestamp).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Analysis Sections */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Contract X-Ray Analysis */}
              <Collapsible defaultOpen onOpenChange={(open) => {
                if (open) {
                  fetchXrayAnalysis();
                }
              }}>
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-card transition-smooth border-2 hover:border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <span>🔍 Internal Audit (X-Ray)</span>
                          {isXrayLoading && (
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          )}
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-4 mt-4">
                    {isXrayLoading ? (
                      <Card className="border-l-4 border-l-primary">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span>Performing deep X-Ray analysis...</span>
                          </div>
                        </CardContent>
                      </Card>
                    ) : xrayResults ? (
                      <div className="space-y-4">
                        {/* Critical Issues */}
                        {xrayResults.critical_issues && xrayResults.critical_issues.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-destructive mb-3 flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Critical Issues Found
                            </h4>
                            {xrayResults.critical_issues.map((issue: any, index: number) => (
                              <Card key={index} className="border-l-4 border-l-destructive mb-3">
                                <CardContent className="p-4">
                                  <h5 className="font-medium text-foreground mb-2">{issue.issue || issue.title || `Issue ${index + 1}`}</h5>
                                  <p className="text-muted-foreground text-sm mb-2">{issue.description || issue.details || 'No description available'}</p>
                                  {issue.recommendation && (
                                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                      <p className="text-sm font-medium text-foreground mb-1">💡 Recommendation:</p>
                                      <p className="text-sm text-muted-foreground">{issue.recommendation}</p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}

                        {/* Contradictions */}
                        {xrayResults.contradictions && xrayResults.contradictions.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-orange-600 mb-3 flex items-center">
                              <XCircle className="w-4 h-4 mr-2" />
                              Contract Contradictions
                            </h4>
                            {xrayResults.contradictions.map((contradiction: any, index: number) => (
                              <Card key={index} className="border-l-4 border-l-orange-500 mb-3">
                                <CardContent className="p-4">
                                  <h5 className="font-medium text-foreground mb-2">{contradiction.title || `Contradiction ${index + 1}`}</h5>
                                  <p className="text-muted-foreground text-sm">{contradiction.description || 'Contract contains contradictory terms'}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}

                        {/* Compliance Check */}
                        {xrayResults.compliance_check && (
                          <div>
                            <h4 className="font-semibold text-blue-600 mb-3 flex items-center">
                              <Scale className="w-4 h-4 mr-2" />
                              Legal Compliance Status
                            </h4>
                            <Card className="border-l-4 border-l-blue-500">
                              <CardContent className="p-4">
                                <p className="text-muted-foreground">{xrayResults.compliance_check}</p>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* Key Terms Summary */}
                        {xrayResults.key_terms_summary && (
                          <div>
                            <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                              <FileText className="w-4 h-4 mr-2" />
                              Key Terms Analysis
                            </h4>
                            <Card className="border-l-4 border-l-green-500">
                              <CardContent className="p-4">
                                <p className="text-muted-foreground">{xrayResults.key_terms_summary}</p>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Card className="border-l-4 border-l-muted">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">Click to perform X-Ray analysis</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
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
                    {displayResults.karmaCheck.map((caseItem) => (
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

              {/* Company Reviews */}
              {companyReviews && companyReviews.success && (
                <Collapsible defaultOpen>
                  <CollapsibleTrigger asChild>
                    <Card className="cursor-pointer hover:shadow-card transition-smooth border-2 hover:border-primary/20">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                              <Users className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span>⭐ Company Reviews ({companyReviews.total_reviews} reviews)</span>
                          </div>
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-4 mt-4">
                      {/* Review Analysis Summary */}
                      {companyReviews.analysis && (
                        <Card className="border-l-4 border-l-primary">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-foreground">Review Analysis Summary</h4>
                              <Badge variant={companyReviews.analysis.risk_level === 'low' ? 'secondary' : companyReviews.analysis.risk_level === 'medium' ? 'outline' : 'destructive'}>
                                {companyReviews.analysis.risk_level} Risk
                              </Badge>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                              <div className="text-center">
                                <p className="text-2xl font-bold text-primary">{companyReviews.analysis.average_rating}</p>
                                <p className="text-sm text-muted-foreground">Average Rating</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-success">{companyReviews.analysis.sentiment_analysis.positive}</p>
                                <p className="text-sm text-muted-foreground">Positive</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-destructive">{companyReviews.analysis.sentiment_analysis.negative}</p>
                                <p className="text-sm text-muted-foreground">Negative</p>
                              </div>
                            </div>
                            <div className="bg-primary/10 p-4 rounded-lg">
                              <p className="text-sm text-foreground">{companyReviews.analysis.recommendation}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Individual Reviews */}
                      {companyReviews.reviews.map((review: any, index: number) => (
                        <Card key={index} className="border-l-4 border-l-secondary">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-semibold text-foreground mb-2">{review.title}</h4>
                                <div className="flex items-center space-x-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <span key={i} className={`text-lg ${i < Math.floor(review.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                  <Badge variant="outline">{review.source}</Badge>
                                  <span className="text-sm text-muted-foreground">{review.date}</span>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground mb-4">{review.content}</p>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              {review.pros && (
                                <div className="bg-success/10 p-3 rounded-lg">
                                  <h5 className="font-semibold text-success mb-2">👍 Pros:</h5>
                                  <p className="text-sm text-foreground">{review.pros}</p>
                                </div>
                              )}
                              {review.cons && (
                                <div className="bg-destructive/10 p-3 rounded-lg">
                                  <h5 className="font-semibold text-destructive mb-2">👎 Cons:</h5>
                                  <p className="text-sm text-foreground">{review.cons}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

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
                    {displayResults.communityInsights.map((insight, index) => (
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
              <Card>
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
                    <Button type="submit" size="icon" disabled={!chatMessage.trim() || isChatLoading}>
                      {isChatLoading ? (
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
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