import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileSearch, Brain, Search, Users, Shield, CheckCircle } from "lucide-react";

const AnalyzingPage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [contractData, setContractData] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const steps = [
    { icon: FileSearch, title: "Reading your document...", description: "Parsing contract structure", duration: 2000 },
    { icon: Brain, title: "Performing AI X-Ray scan...", description: "Analyzing clauses for hidden risks", duration: 3000 },
    { icon: Search, title: "Scanning public legal records...", description: "Searching legal databases", duration: 2500 },
    { icon: Users, title: "Consulting The People's Ledger...", description: "Gathering community insights", duration: 2000 },
    { icon: Shield, title: "Compiling your NyayDarpan Report...", description: "Generating comprehensive risk assessment", duration: 1500 }
  ];

  // Load contract data from sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem("contractData");
    if (!data) {
      navigate("/input");
      return;
    }
    const parsed = JSON.parse(data);
    if (!parsed.contractText || !parsed.partyName) {
      alert("Invalid contract data in sessionStorage");
      navigate("/input");
      return;
    }
    setContractData(parsed);
  }, [navigate]);

  // Call backend API for contract analysis
  useEffect(() => {
    if (!contractData?.contractText) return;

    const analyzeContractBackend = async () => {
      try {
        const payload = {
          contractText: contractData.contractText, // matches Flask backend
          analysis_type: "full"
        };

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/analyze-contract`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );

        setAnalysisResult(response.data);
        sessionStorage.setItem("analysisResult", JSON.stringify(response.data));

        // After backend result, start animation
        runAnimation();
      } catch (error: any) {
        console.error("Backend analysis failed:", error.response?.data || error.message);
        alert("Contract analysis failed. Check console for details.");
      }
    };

    const runAnimation = () => {
      let stepIndex = 0;
      let progressValue = 0;

      const nextStep = () => {
        if (stepIndex < steps.length) {
          setCurrentStep(stepIndex);
          const stepDuration = steps[stepIndex].duration;
          const stepProgress = 100 / steps.length;
          progressValue = 0;

          const interval = setInterval(() => {
            progressValue += 50; // increment ms
            const currentProgress = Math.min(
              stepIndex * stepProgress + (progressValue / stepDuration) * stepProgress,
              (stepIndex + 1) * stepProgress
            );
            setProgress(currentProgress);

            if (progressValue >= stepDuration) {
              clearInterval(interval);
              stepIndex++;
              setTimeout(nextStep, 300);
            }
          }, 50);
        } else {
          setProgress(100);
          setTimeout(() => navigate("/report"), 500);
        }
      };

      nextStep();
    };

    analyzeContractBackend();
  }, [contractData, navigate]);

  if (!contractData) return null;

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
              <div className="text-center mb-8">
                <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                  <CurrentIcon className="w-12 h-12 text-primary-foreground animate-pulse" />
                </div>

                <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                  {currentStepData?.title}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {currentStepData?.description}
                </p>

                <div className="space-y-4 mb-8">
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</p>
                </div>

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
                      ? "border-success/50 bg-success/5"
                      : isCurrent
                      ? "border-primary/50 bg-primary/5 shadow-card"
                      : "border-muted"
                  }`}
                >
                  <CardContent className="p-0">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                        isCompleted
                          ? "bg-success text-success-foreground"
                          : isCurrent
                          ? "gradient-primary text-primary-foreground animate-pulse-glow"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <StepIcon className={`w-5 h-5 ${isCurrent ? "animate-pulse" : ""}`} />
                      )}
                    </div>
                    <p
                      className={`text-xs font-medium ${
                        isCompleted ? "text-success" : isCurrent ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      Step {index + 1}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyzingPage;
