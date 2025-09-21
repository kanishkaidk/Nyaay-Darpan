import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  FileSearch, 
  Brain, 
  Search, 
  Users, 
  Shield, 
  CheckCircle 
} from "lucide-react";

const AnalyzingPage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [contractData, setContractData] = useState<any>(null);

  const steps = [
    {
      icon: FileSearch,
      title: "Reading your document...",
      description: "Parsing contract structure and identifying key sections",
      duration: 2000
    },
    {
      icon: Brain,
      title: "Performing AI X-Ray scan...",
      description: "Analyzing clauses for hidden risks and ambiguous terms",
      duration: 3000
    },
    {
      icon: Search,
      title: "Scanning public legal records...",
      description: "Searching 10,000+ court cases and legal databases",
      duration: 2500
    },
    {
      icon: Users,
      title: "Consulting The People's Ledger...",
      description: "Gathering community insights and experiences",
      duration: 2000
    },
    {
      icon: Shield,
      title: "Compiling your NyayDarpan Report...",
      description: "Generating comprehensive risk assessment",
      duration: 1500
    }
  ];

  useEffect(() => {
    // Get contract data from sessionStorage
    const data = sessionStorage.getItem('contractData');
    if (!data) {
      navigate('/input');
      return;
    }
    
    setContractData(JSON.parse(data));
  }, [navigate]);

  useEffect(() => {
    if (!contractData) return;

    const callBackendAPI = async () => {
      try {
        // Step 1: Start analysis
        setCurrentStep(0);
        setProgress(10);
        
        console.log('Calling ultra analysis API with:', {
          contract_text: contractData.contractText?.substring(0, 100) + '...',
          contract_type: 'employment',
          partyName: contractData.partyName
        });

        // Call the ultra analysis backend API for comprehensive results
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ultra-analysis`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contract_text: contractData.contractText,
            contract_type: 'employment'
          }),
        });

        console.log('API Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const analysisResult = await response.json();
        console.log('Analysis result received:', analysisResult);
        
        // Store the real analysis result
        sessionStorage.setItem('analysisResult', JSON.stringify(analysisResult));
        console.log('Analysis result stored in sessionStorage');
        
        // Balanced progress steps - fast but not too fast
        let stepIndex = 0;
        const progressInterval = setInterval(() => {
          stepIndex++;
          setCurrentStep(stepIndex);
          setProgress((stepIndex + 1) * 20);
          
          if (stepIndex >= steps.length - 1) {
            clearInterval(progressInterval);
            setProgress(100);
            setTimeout(() => {
              navigate('/report');
            }, 800); // Reasonable redirect time
          }
        }, 1200); // Balanced progress steps

      } catch (error) {
        console.error('Backend API call failed:', error);
        // Fallback to mock animation if backend fails
        let stepIndex = 0;
        let progressValue = 0;
        
        const runAnalysis = () => {
          if (stepIndex < steps.length) {
            setCurrentStep(stepIndex);
            
            const stepDuration = steps[stepIndex].duration;
            const stepProgress = 100 / steps.length;
            const startProgress = stepIndex * stepProgress;
            
            const progressInterval = setInterval(() => {
              progressValue += 2;
              const currentProgress = Math.min(startProgress + (progressValue / stepDuration * stepProgress * 100), (stepIndex + 1) * stepProgress);
              setProgress(currentProgress);
              
              if (progressValue >= stepDuration) {
                clearInterval(progressInterval);
                stepIndex++;
                progressValue = 0;
                
                if (stepIndex >= steps.length) {
                  setTimeout(() => {
                    navigate('/report');
                  }, 500);
                } else {
                  setTimeout(runAnalysis, 300);
                }
              }
            }, 50);
          }
        };
        runAnalysis();
      }
    };

    callBackendAPI();
  }, [contractData, navigate]);

  if (!contractData) {
    return null;
  }

  const currentStepData = steps[currentStep];
  const CurrentIcon = currentStepData?.icon || FileSearch;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Analyzing Your Contract
            </h1>
            <p className="text-xl text-muted-foreground">
              Our AI is working hard to protect you from legal risks
            </p>
          </div>

          {/* Main Analysis Card */}
          <Card className="shadow-primary border-2 border-primary/20 mb-8">
            <CardContent className="p-12">
              {/* Animated Icon */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                  <CurrentIcon className="w-12 h-12 text-primary-foreground animate-pulse" />
                </div>
                
                {/* Current Step */}
                <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                  {currentStepData?.title}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {currentStepData?.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-4 mb-8">
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    {Math.round(progress)}% Complete
                  </p>
                </div>

                {/* Processing Info */}
                <div className="gradient-card p-6 rounded-xl border">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Processing: {contractData.partyName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Contract length: {contractData.contractText.length.toLocaleString()} characters
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <Card 
                  key={index}
                  className={`text-center p-4 transition-smooth border-2 ${
                    isCompleted 
                      ? 'border-success/50 bg-success/5' 
                      : isCurrent 
                      ? 'border-primary/50 bg-primary/5 shadow-card' 
                      : 'border-muted'
                  }`}
                >
                  <CardContent className="p-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                      isCompleted
                        ? 'bg-success text-success-foreground'
                        : isCurrent
                        ? 'gradient-primary text-primary-foreground animate-pulse-glow'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <StepIcon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                      )}
                    </div>
                    <p className={`text-xs font-medium ${
                      isCompleted 
                        ? 'text-success' 
                        : isCurrent 
                        ? 'text-primary' 
                        : 'text-muted-foreground'
                    }`}>
                      Step {index + 1}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Fun Facts During Wait */}
          <Card className="mt-8 bg-muted/30 border-0">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-foreground mb-2">Did you know?</h3>
              <p className="text-sm text-muted-foreground">
                {currentStep === 0 && "Our AI can read a 50-page contract in under 30 seconds"}
                {currentStep === 1 && "We analyze over 200 different types of contractual risks"}
                {currentStep === 2 && "Our database contains information from 10,000+ public legal cases"}
                {currentStep === 3 && "The People's Ledger has helped protect over 50,000 users"}
                {currentStep === 4 && "NyayDarpan reports are trusted by legal professionals across India"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyzingPage;