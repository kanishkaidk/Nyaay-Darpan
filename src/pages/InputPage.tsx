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
  AlertCircle,
  Camera
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InputPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contractText, setContractText] = useState("");
  const [partyName, setPartyName] = useState("");
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isListening, setIsListening] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
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

  const handleMultipleFileUpload = async (files: FileList) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    let processedCount = 0;
    let totalFiles = files.length;

    toast({
      title: `Processing ${totalFiles} files...`,
      description: "Please wait while we extract text from all files.",
    });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file type
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt|jpg|jpeg|png|gif|webp)$/i)) {
        toast({
          title: "Unsupported file type",
          description: `${file.name} is not supported. Skipping...`,
          variant: "destructive",
        });
        continue;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is too large. Skipping...`,
          variant: "destructive",
        });
        continue;
      }

      try {
        // For text files, read directly
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          const text = await file.text();
          setContractText(prev => prev + (prev ? '\n\n' : '') + `--- ${file.name} ---\n${text}`);
          processedCount++;
        } else {
          // For other files, send to backend
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/extract-text`, {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              const extractedText = result.extracted_text || result.text || '';
              setContractText(prev => prev + (prev ? '\n\n' : '') + `--- ${file.name} ---\n${extractedText}`);
              processedCount++;
            }
          }
        }
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
      }
    }

    toast({
      title: "Multiple files processed",
      description: `Successfully processed ${processedCount} out of ${totalFiles} files.`,
    });

    // Clear the input
    const input = document.getElementById('file-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File upload triggered!', event.target.files);
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }
    
    console.log(`Processing ${files.length} file(s):`, Array.from(files).map(f => ({ name: f.name, type: f.type, size: f.size })));

    // Handle multiple files
    if (files.length > 1) {
      await handleMultipleFileUpload(files);
      return;
    }

    const file = files[0];

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, DOCX, or TXT file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('File upload details:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      });

      // For text files, read directly and append to existing text
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        console.log('Processing as text file');
        const text = await file.text();
        setContractText(prev => prev + (prev ? '\n\n' : '') + text);
        toast({
          title: "File uploaded successfully",
          description: "Text content has been added to your contract.",
        });
        return;
      }

      // For other files, send to backend for OCR/extraction
      console.log('Processing as non-text file, sending to backend');
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file to backend:', file.name, file.type, file.size);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/extract-text`, {
        method: 'POST',
        body: formData,
      });

      console.log('Backend response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Backend response:', result);
        
        if (result.success) {
          const extractedText = result.extracted_text || result.text || '';
          setContractText(prev => prev + (prev ? '\n\n' : '') + extractedText);
          toast({
            title: "File uploaded successfully",
            description: "Text content has been extracted and added to your contract.",
          });
        } else {
          throw new Error(result.error || 'Failed to extract text');
        }
      } else {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: "Upload failed",
        description: "Could not process the uploaded file. Please try again or paste the text directly.",
        variant: "destructive",
      });
    }
  };

  const handleScreenshotCapture = async () => {
    setIsCapturing(true);
    
    try {
      // Use the Screen Capture API
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        // Stop the stream
        stream.getTracks().forEach(track => track.stop());
        
        // Convert canvas to blob and send to backend
        canvas.toBlob(async (blob) => {
          if (blob) {
            const formData = new FormData();
            formData.append('file', blob, 'screenshot.png');
            
            try {
              const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/extract-text`, {
                method: 'POST',
                body: formData,
              });
              
              if (response.ok) {
                const result = await response.json();
                if (result.success) {
                  setContractText(prev => prev + (prev ? '\n\n' : '') + result.text);
                  toast({
                    title: "Screenshot captured successfully",
                    description: "Text content has been extracted and added to your contract.",
                  });
                } else {
                  throw new Error(result.error || 'Failed to extract text from screenshot');
                }
              } else {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
            } catch (error) {
              console.error('Screenshot processing error:', error);
              toast({
                title: "Screenshot processing failed",
                description: "Could not extract text from screenshot. Please try again or paste the text directly.",
                variant: "destructive",
              });
            }
          }
        }, 'image/png');
      };
      
    } catch (error) {
      console.error('Screenshot capture error:', error);
      toast({
        title: "Screenshot capture failed",
        description: "Could not capture screenshot. Please try uploading a file or pasting text directly.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const handleVoiceInput = async () => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input. Please use Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    // Check if microphone permission is granted
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      });
      return;
    }

      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
    recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      toast({
        title: "Listening...",
        description: `Speak in ${language === 'hi' ? 'Hindi' : 'English'}`,
      });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
      setContractText(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      toast({
        title: "Voice input captured",
        description: "Text has been added to your contract.",
      });
      };

    recognition.onerror = (event: any) => {
        setIsListening(false);
      console.error('Speech recognition error:', event.error);
        toast({
          title: "Voice Input Error",
        description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

    try {
      recognition.start();
    } catch (error) {
      setIsListening(false);
      toast({
        title: "Voice Input Failed",
        description: "Could not start voice recognition. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contractText.trim()) {
      toast({
        title: "Contract Required",
        description: "Please paste your contract text to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (!partyName.trim()) {
      toast({
        title: "Party Name Required",
        description: "Please enter the name of the other party.",
        variant: "destructive",
      });
      return;
    }

    // Store the data in sessionStorage for the analysis page
    sessionStorage.setItem('contractData', JSON.stringify({
      contractText,
      partyName,
      language,
      timestamp: Date.now()
    }));

    toast({
      title: "Analysis Starting",
      description: "Redirecting to analysis page...",
    });

    navigate('/analyzing');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t.subtitle}
            </p>
            
            {/* Language Toggle */}
            <Button
              variant="outline"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="mb-8"
            >
              <Globe className="w-4 h-4 mr-2" />
              {language === 'en' ? t.switchToHindi : t.switchToEnglish}
            </Button>
          </div>

          {/* Main Form */}
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
                {/* Contract Text Area */}
                <div className="space-y-3">
                  <Label htmlFor="contract" className="text-base font-semibold">
                    {t.contractLabel}
                  </Label>
                  <Textarea
                    id="contract"
                    value={contractText}
                    onChange={(e) => setContractText(e.target.value)}
                    placeholder={t.contractPlaceholder}
                    className="min-h-[300px] text-base border-2 focus:border-primary/50 transition-smooth"
                    required
                  />
                  
                  {/* Upload Option */}
                  <div 
                    className="flex items-center justify-center p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg hover:border-primary/50 transition-smooth cursor-pointer"
                    onClick={() => {
                      console.log('Upload area clicked');
                      document.getElementById('file-upload')?.click();
                    }}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="text-center cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {t.uploadText}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, DOC, DOCX, TXT, Images supported • Multiple files OK • Adds to existing text
                      </p>
                      <p className="text-xs text-primary mt-2 font-medium">
                        Click here to upload files
                      </p>
                    </div>
                  </div>

                  {/* Debug Test Buttons */}
                  <div className="text-center mt-4 space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        console.log('Debug: Testing file upload...');
                        const input = document.getElementById('file-upload') as HTMLInputElement;
                        if (input) {
                          console.log('File input found:', input);
                          input.click();
                        } else {
                          console.error('File input not found!');
                        }
                      }}
                    >
                      🐛 Test Upload
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        console.log('Debug: Adding test text...');
                        const testText = `TEST CONTRACT

Employee: John Doe
Company: Test Corp
Salary: $5000/month
Start Date: January 1, 2024

This is a test contract added via debug button.`;
                        setContractText(prev => prev + (prev ? '\n\n' : '') + testText);
                        toast({
                          title: "Test text added",
                          description: "Test contract text has been added to the form.",
                        });
                      }}
                    >
                      🧪 Add Test Text
                    </Button>
                  </div>

                  {/* Screenshot Capture Option */}
                  <div className="flex items-center justify-center p-4 border-2 border-dashed border-primary/30 rounded-lg hover:border-primary/50 transition-smooth cursor-pointer" onClick={handleScreenshotCapture}>
                    <div className="text-center">
                      <Camera className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm text-primary font-medium">
                        {isCapturing ? "Capturing..." : "Or capture screenshot"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Take a screenshot of your document • Adds to existing text
                      </p>
                    </div>
                  </div>
                </div>

                {/* Party Name Input */}
                <div className="space-y-3">
                  <Label htmlFor="party" className="text-base font-semibold">
                    {t.partyLabel}
                  </Label>
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
                      className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                        isListening ? 'text-destructive animate-pulse' : 'text-muted-foreground hover:text-primary'
                      }`}
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

                {/* Security Note */}
                <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg border">
                  <Shield className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Secure & Private</p>
                    <p className="text-sm text-muted-foreground">
                      {t.securityNote}
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="xl" 
                  className="w-full"
                  disabled={!contractText.trim() || !partyName.trim()}
                >
                  {t.generateButton}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="text-center p-6 hover:shadow-card transition-smooth">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Contract X-Ray</h3>
              <p className="text-sm text-muted-foreground">
                Deep AI analysis reveals hidden risks and unclear terms
              </p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-card transition-smooth">
              <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Karma Check</h3>
              <p className="text-sm text-muted-foreground">
                Background verification of the other party's legal history
              </p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-card transition-smooth">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Risk Assessment</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive risk scoring and plain-English explanations
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InputPage;