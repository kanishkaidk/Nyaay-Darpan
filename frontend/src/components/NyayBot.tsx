import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Shield, 
  FileText,
  Minimize2,
  ExternalLink 
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const NyayBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm NyayBot. I can help you understand how NyayDarpan works and answer your questions about analyzing contracts.",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const knowledgeBase = {
    // Core Features
    'contract analysis': "NyayDarpan uses advanced AI to analyze your legal contracts and highlight potential issues, unfair clauses, and important terms. Our X-Ray analysis goes deep into the document structure to identify risks you might miss.",
    'x-ray analysis': "X-Ray analysis is our deep-dive feature that examines the internal structure of your contract, identifying hidden clauses, potential conflicts, and areas that need attention. It's like having an experienced lawyer review every detail.",
    'karma check': "Karma Check is our unique feature that evaluates the fairness of contract terms. It rates clauses based on how balanced they are between parties and highlights potentially one-sided terms.",
    'people\'s ledger': "People's Ledger is our community-driven database where users can share experiences about companies and their contract practices, helping you make informed decisions.",
    
    // Security & Privacy
    'secure': "Your data security is our top priority. All documents are encrypted during upload and processing. We never store your contracts permanently and delete them after analysis. Our servers are secured and compliant with industry standards.",
    'privacy': "We take privacy seriously. Your contracts are processed securely and never shared with anyone. Only you have access to your analysis results, and we don't use your data for training our AI models.",
    'data protection': "All uploaded documents are protected with bank-level encryption. We follow strict data protection protocols and automatically delete files after processing. Your legal documents remain completely private.",
    
    // Types of Contracts
    'contract types': "NyayDarpan can analyze various types of contracts including employment agreements, rental agreements, service contracts, vendor agreements, partnership agreements, and more. If it's a legal document, we can help analyze it!",
    'employment contract': "Yes! Employment contracts are one of our specialties. We can identify unfair termination clauses, unclear salary terms, problematic non-compete clauses, and missing benefits.",
    'rental agreement': "Absolutely! We analyze rental agreements for unfair clauses, unclear terms about deposits, maintenance responsibilities, rent increases, and tenant rights.",
    
    // Service Details
    'legal advice': "Important: NyayDarpan provides insights and analysis, but this is NOT legal advice. While our AI is trained on legal principles, you should always consult with a qualified advocate for binding legal counsel, especially before signing important contracts.",
    'accuracy': "Our AI analysis is highly accurate for identifying common contract issues and unfair clauses. However, every contract is unique, and complex legal situations may require human expert review. We recommend using our analysis as a starting point.",
    'free': "Yes! Basic contract analysis is completely free. You can upload and analyze your contracts without any cost. We also offer premium features for more detailed analysis and additional insights.",
    'time': "Most contract analysis takes just 2-3 minutes! Our AI works quickly to provide you with comprehensive insights. Complex documents might take up to 5 minutes.",
    
    // Process
    'how to use': "It's simple! Just upload your contract document (PDF, DOC, or image), and our AI will analyze it within minutes. You'll get a detailed report highlighting potential issues, unfair clauses, and recommendations.",
    'upload': "You can upload PDF files, Word documents, or even take photos of paper contracts. Our AI can read and analyze all these formats. Just drag and drop or click to upload!",
    
    // Troubleshooting
    'not working': "If you're experiencing issues, try refreshing the page or checking your internet connection. For persistent problems, please contact our support team at support@nyaydarpan.com",
    'error': "If you encounter an error during upload or analysis, please try again with a clear, readable document. If the problem continues, reach out to our support team.",
    
    // Fallback responses
    'default': "I'm still learning about that aspect of NyayDarpan, but I can connect you with our support team who can help with that. You can email us at support@nyaydarpan.com or ask me about our core features like contract analysis, security, or how to get started!"
  };

  const getResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Find the best matching response
    for (const [key, response] of Object.entries(knowledgeBase)) {
      if (key !== 'default' && input.includes(key)) {
        return response;
      }
    }
    
    // Check for common variations
    if (input.includes('how') && (input.includes('work') || input.includes('use'))) {
      return knowledgeBase['how to use'];
    }
    
    if (input.includes('safe') || input.includes('security')) {
      return knowledgeBase['secure'];
    }
    
    if (input.includes('lawyer') || input.includes('legal advice')) {
      return knowledgeBase['legal advice'];
    }
    
    if (input.includes('cost') || input.includes('price') || input.includes('free')) {
      return knowledgeBase['free'];
    }
    
    if (input.includes('fast') || input.includes('quick') || input.includes('time')) {
      return knowledgeBase['time'];
    }
    
    return knowledgeBase['default'];
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getResponse(userMessage.content),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const quickQuestions = [
    "How does contract analysis work?",
    "Is my data secure?",
    "What contracts can you analyze?",
    "Is this service free?"
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary-hover shadow-primary animate-pulse-glow"
          size="sm"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 bg-card border-border shadow-card transition-smooth ${
        isMinimized ? 'h-16' : 'h-[500px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-primary rounded-t-lg">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 bg-secondary">
              <AvatarFallback>
                <Bot className="h-4 w-4 text-secondary-foreground" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-primary-foreground text-sm">NyayBot</h3>
              <p className="text-xs text-primary-foreground/80">Legal Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-primary-foreground hover:bg-white/10 h-8 w-8 p-0"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-white/10 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea ref={scrollAreaRef} className="h-80 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'bot' && (
                      <Avatar className="h-7 w-7 bg-secondary">
                        <AvatarFallback>
                          <Bot className="h-3 w-3 text-secondary-foreground" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[75%] ${message.type === 'user' ? 'order-first' : ''}`}>
                      <Card className={`p-3 text-sm ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-accent/50 border-border'
                      }`}>
                        <p className="leading-relaxed">{message.content}</p>
                      </Card>
                      <p className={`text-xs text-muted-foreground mt-1 ${
                        message.type === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>

                    {message.type === 'user' && (
                      <Avatar className="h-7 w-7 bg-muted">
                        <AvatarFallback>
                          <User className="h-3 w-3 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-7 w-7 bg-secondary">
                      <AvatarFallback>
                        <Bot className="h-3 w-3 text-secondary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <Card className="p-3 bg-accent/50 border-border">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-75"></div>
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-150"></div>
                        </div>
                        <span className="text-xs text-muted-foreground">NyayBot is thinking...</span>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-4 pb-3 border-t border-border bg-muted/30">
                <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-1">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => setInputMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border p-4 bg-card/50">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything about NyayDarpan..."
                  disabled={isTyping}
                  className="flex-1 text-sm"
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3 mr-1" />
                <span>Secure & Private</span>
                <span className="mx-2">•</span>
                <a 
                  href="mailto:support@nyaydarpan.com" 
                  className="text-primary hover:underline flex items-center"
                >
                  Contact Support <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default NyayBot;