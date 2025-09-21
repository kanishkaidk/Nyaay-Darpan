import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Send, 
  MessageCircle, 
  Brain, 
  Scale, 
  FileText,
  Mic,
  MicOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const NyayBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm NyayBot, your AI legal assistant. I can help you understand how NyayDarpan works and answer your questions about analyzing contracts. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const quickQuestions = [
    "How does contract analysis work?",
    "Is my data secure?",
    "What contracts can you analyze?",
    "Is this service free?"
  ];

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
      // Call the backend API for NyayBot responses
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/nyaybot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: 'general_help'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: result.response || "I'm here to help! Could you please rephrase your question?",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        // Fallback responses if API is not available
        const fallbackResponse = getFallbackResponse(userMessage);
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: fallbackResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
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
      return "Our AI-powered contract analysis uses advanced machine learning to scan your documents for hidden risks, unclear terms, and potential legal issues. It provides a comprehensive risk score and actionable recommendations in simple language.";
    }
    
    if (lowerMessage.includes('secure') || lowerMessage.includes('privacy') || lowerMessage.includes('data')) {
      return "Yes, your data is completely secure! We use end-to-end encryption, and all documents are processed anonymously. We never store your personal information or share your contracts with third parties.";
    }
    
    if (lowerMessage.includes('contract') || lowerMessage.includes('document')) {
      return "We can analyze various types of contracts including employment agreements, service contracts, lease agreements, partnership agreements, and more. We support PDF, DOC, DOCX, and text files up to 10MB.";
    }
    
    if (lowerMessage.includes('free') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      return "NyayDarpan offers both free and premium services. The basic analysis is free, while advanced features like detailed legal precedents and priority support are available with our premium plans.";
    }
    
    if (lowerMessage.includes('karma') || lowerMessage.includes('background')) {
      return "Our Karma Check feature analyzes the legal history of the other party using public court records and legal databases. It helps you understand if there have been any disputes or issues with this party in the past.";
    }
    
    if (lowerMessage.includes('community') || lowerMessage.includes('review')) {
      return "The Community Intelligence feature allows users to anonymously share their experiences with different parties. This helps others make informed decisions based on real user experiences.";
    }
    
    return "I'm NyayBot, your AI legal assistant! I can help you understand contract analysis, data security, supported document types, pricing, and more. Feel free to ask me anything about NyayDarpan!";
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

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      toast({
        title: "Voice Input Error",
        description: `Error: ${event.error}`,
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <span>NyayBot</span>
          <Badge variant="secondary" className="ml-auto">AI Assistant</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 max-h-96">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Questions */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(question)}
                className="text-xs"
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about NyayDarpan"
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleVoiceInput}
            disabled={isListening || isLoading}
            className={isListening ? 'text-destructive' : ''}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button type="submit" size="icon" disabled={!inputMessage.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NyayBot;