import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Send, 
  X, 
  Minimize2,
  Mic,
  MicOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm NyayBot, your AI legal assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (message?: string) => {
    const userMessage = message || inputMessage.trim();
    if (!userMessage) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      console.log('Sending message to NyayBot API:', userMessage);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/nyaybot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: 'legal_assistant',
          user_context: {
            platform: 'NyayDarpan',
            features: ['contract_analysis', 'karma_check', 'community_insights', 'ai_xray'],
            legal_focus: 'Indian_law'
          }
        }),
      });

      console.log('NyayBot API response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('NyayBot API response:', result);
        
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: result.response || "I'm here to help! Could you please rephrase your question?",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        throw new Error(`API responded with status ${response.status}`);
      }
    } catch (error) {
      console.error('NyayBot API error:', error);
      // Fallback response
      const fallbackResponse = getFallbackResponse(userMessage);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: fallbackResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('analysis') || lowerMessage.includes('analyze')) {
      return "Our AI-powered contract analysis uses Gemini 1.5 Pro to scan documents for hidden risks, unclear terms, and legal issues. It provides comprehensive risk scores and actionable recommendations.";
    }
    
    if (lowerMessage.includes('secure') || lowerMessage.includes('privacy')) {
      return "Yes, your data is completely secure! We use end-to-end encryption, and all documents are processed anonymously. We never store personal information or share contracts with third parties.";
    }
    
    if (lowerMessage.includes('contract') || lowerMessage.includes('document')) {
      return "We analyze employment agreements, service contracts, lease agreements, partnerships, and more. We support PDF, DOC, DOCX, and text files up to 10MB.";
    }
    
    if (lowerMessage.includes('free') || lowerMessage.includes('cost')) {
      return "NyayDarpan offers free basic analysis and premium features. Basic contract analysis is free, while advanced features like detailed legal precedents are available with premium plans.";
    }
    
    if (lowerMessage.includes('karma') || lowerMessage.includes('background')) {
      return "Our Karma Check analyzes legal history using public court records and Indian Kanoon database. It helps identify past disputes or issues with the other party.";
    }
    
    if (lowerMessage.includes('voice') || lowerMessage.includes('speak')) {
      return "Yes! We support voice input in both English and Hindi. Just click the microphone icon and speak your contract text or questions.";
    }
    
    return "I'm NyayBot, your AI legal assistant! I can help with contract analysis, data security, document types, pricing, Karma Check, and voice input. What would you like to know?";
  };

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice Input Not Supported",
        description: "Please use Chrome or Edge browser for voice input.",
        variant: "destructive",
      });
      return;
    }

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
    
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak your message now",
      });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
      toast({
        title: "Voice captured",
        description: "Message ready to send",
      });
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      console.error('Speech recognition error:', event.error);
      toast({
        title: "Voice Input Error",
        description: `Error: ${event.error}`,
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
    handleSendMessage();
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 z-50"
          size="icon"
        >
          <Bot className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl border-2 z-50 bg-background">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <span>NyayBot</span>
                <Badge variant="secondary" className="text-xs">AI Assistant</Badge>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  <Minimize2 className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          
          {!isMinimized && (
            <CardContent className="flex flex-col space-y-3 h-[400px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-2 rounded-lg text-xs ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p>{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-2 rounded-lg">
                      <div className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-100"></div>
                        <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex space-x-1">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 text-xs h-8"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleVoiceInput}
                  disabled={isListening || isLoading}
                >
                  {isListening ? <MicOff className="w-3 h-3 text-destructive" /> : <Mic className="w-3 h-3" />}
                </Button>
                <Button type="submit" size="icon" className="h-8 w-8" disabled={!inputMessage.trim() || isLoading}>
                  <Send className="w-3 h-3" />
                </Button>
              </form>
            </CardContent>
          )}
        </Card>
      )}
    </>
  );
};

export default FloatingChatbot;
