import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { 
  FileText, 
  Mic, 
  Upload, 
  Shield, 
  Globe,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InputPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contractText, setContractText] = useState("");
  const [partyName, setPartyName] = useState("");
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const translations = {
    en: {
      title: "Contract Analysis",
      subtitle: "Let our AI X-ray your legal document",
      contractLabel: "Contract Text",
      contractPlaceholder: "Paste your contract text here...",
      partyLabel: "Other Party Name",
      partyPlaceholder: "Enter the full name of the company or person",
      voiceTooltip: "Speak your query",
      generateButton: "Generate My Report",
      switchToHindi: "हिन्दी में बदलें",
      switchToEnglish: "Switch to English",
      uploadText: "Or upload a document",
      securityNote: "Your data is encrypted and processed securely"
    },
    hi: {
      title: "अनुबंध विश्लेषण",
      subtitle: "हमारी एआई से अपने कानूनी दस्तावेज़ का एक्स-रे कराएं",
      contractLabel: "अनुबंध पाठ",
      contractPlaceholder: "यहां अपना अनुबंध पाठ पेस्ट करें...",
      partyLabel: "दूसरे पक्ष का नाम",
      partyPlaceholder: "कंपनी या व्यक्ति का पूरा नाम दर्ज करें",
      voiceTooltip: "अपनी बात कहें",
      generateButton: "मेरी रिपोर्ट बनाएं",
      switchToHindi: "हिन्दी में बदलें",
      switchToEnglish: "अंग्रेजी में बदलें",
      uploadText: "या कोई दस्तावेज़ अपलोड करें",
      securityNote: "आपका डेटा एन्क्रिप्टेड और सुरक्षित रूप से प्रोसेस किया जाता है"
    }
  };

  const t = translations[language];

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPartyName(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => {
        setIsListening(false);
        toast({ title: "Voice Input Error", description: "Could not capture voice input.", variant: "destructive" });
      };
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } else {
      toast({ title: "Voice Input Not Supported", description: "Your browser doesn't support voice input.", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!contractText.trim()) {
    toast({
      title: "Contract Required",
      description: "Please paste your contract text.",
      variant: "destructive",
    });
    return;
  }

  if (!partyName.trim()) {
    toast({
      title: "Party Name Required",
      description: "Please enter the other party's name.",
      variant: "destructive",
    });
    return;
  }

  setLoading(true);

  try {
    // ✅ Directly save in sessionStorage
    sessionStorage.setItem(
      "contractData",
      JSON.stringify({
        contractText,
        partyName,
        language,
        timestamp: Date.now(),
      })
    );

    toast({
      title: "Analysis Starting",
      description: "Redirecting to analysis page...",
    });

    // ✅ Navigate to analyzing page
    navigate("/analyzing");
  } catch (error) {
    console.error(error);
    toast({
      title: "Unexpected Error",
      description: "Something went wrong while saving contract locally.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">{t.title}</h1>
            <p className="text-xl text-muted-foreground mb-8">{t.subtitle}</p>
            <Button variant="outline" onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className="mb-8">
              <Globe className="w-4 h-4 mr-2" />
              {language === 'en' ? t.switchToHindi : t.switchToEnglish}
            </Button>
          </div>

          {/* Form */}
          <Card className="shadow-card border-2 hover:border-primary/20 transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-display text-2xl">Document Analysis Form</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="contract">{t.contractLabel}</Label>
                  <Textarea
                    id="contract"
                    value={contractText}
                    onChange={(e) => setContractText(e.target.value)}
                    placeholder={t.contractPlaceholder}
                    className="min-h-[300px] text-base border-2 focus:border-primary/50 transition-smooth"
                    required
                  />

                  <div className="flex items-center justify-center p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg hover:border-primary/50 transition-smooth cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">{t.uploadText}</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX supported</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="party">{t.partyLabel}</Label>
                  <div className="relative">
                    <Input
                      id="party"
                      value={partyName}
                      onChange={(e) => setPartyName(e.target.value)}
                      placeholder={t.partyPlaceholder}
                      className="text-base pr-12 border-2 focus:border-primary/50 transition-smooth"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={`absolute right-2 top-1/2 -translate-y-1/2 ${isListening ? 'text-destructive animate-pulse' : 'text-muted-foreground hover:text-primary'}`}
                      onClick={handleVoiceInput}
                      title={t.voiceTooltip}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                  {isListening && (
                    <p className="text-sm text-destructive flex items-center">
                      <div className="w-2 h-2 bg-destructive rounded-full animate-pulse mr-2"></div>
                      Listening...
                    </p>
                  )}
                </div>

                <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg border">
                  <Shield className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Secure & Private</p>
                    <p className="text-sm text-muted-foreground">{t.securityNote}</p>
                  </div>
                </div>

                <Button type="submit" variant="hero" size="xl" className="w-full" disabled={!contractText.trim() || !partyName.trim() || loading}>
                  {loading ? "Processing..." : t.generateButton}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default InputPage;
