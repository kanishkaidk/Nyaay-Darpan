import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, FileText, Shield } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatInterfaceProps {
  documentName?: string;
  onSendMessage?: (message: string) => void;
}

const ChatInterface = ({ 
  documentName = "Employment Contract.pdf",
  onSendMessage 
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello! I've analyzed "${documentName}" and found several important points. You can ask me anything about this contract - payment terms, termination clauses, your rights, or any specific concerns you have.`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Call the parent's onSendMessage if provided
    if (onSendMessage) {
      onSendMessage(userMessage.content);
    }

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getDemoResponse(userMessage.content),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const getDemoResponse = (userQuery: string): string => {
    const query = userQuery.toLowerCase();
    
    if (query.includes('payment') || query.includes('salary')) {
      return "Based on the contract analysis, the payment terms are in Clause 5. The salary is ₹8,50,000 annually, paid monthly. However, I noticed there's no clear mention of overtime compensation. You should clarify this with your employer.";
    }
    
    if (query.includes('termination') || query.includes('notice')) {
      return "The termination clause (Clause 12) requires 30 days notice from both parties. However, the company can terminate immediately for 'misconduct' - this term is quite broad and could be problematic. Consider asking for more specific definitions.";
    }
    
    if (query.includes('leave') || query.includes('vacation')) {
      return "The contract mentions 21 days of annual leave, but doesn't specify if unused leave can be carried forward or compensated. This is a common gap that should be clarified before signing.";
    }
    
    return "I can help you understand any specific clause in your contract. Try asking about payment terms, termination conditions, leave policies, or any specific section you're concerned about.";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const suggestedQuestions = [
    "What are the payment terms?",
    "Can I terminate this contract early?",
    "What are my rights regarding overtime?",
    "Are there any concerning clauses?"
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{documentName}</h3>
            <p className="text-sm text-muted-foreground">Chat about your contract</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-success" />
            <span>Secure & Private</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'assistant' && (
                <Avatar className="h-8 w-8 bg-primary/10">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                <Card className={`p-3 ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : 'bg-card border-border'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </Card>
                <p className={`text-xs text-muted-foreground mt-1 ${
                  message.type === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>

              {message.type === 'user' && (
                <Avatar className="h-8 w-8 bg-accent">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 bg-primary/10">
                <AvatarFallback>
                  <Bot className="h-4 w-4 text-primary" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-3 bg-card border-border">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">NyayDarpan is thinking...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="p-4 border-t border-border bg-card/30">
          <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs hover-scale"
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
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about any clause or concern in your contract..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="sm" 
            disabled={!inputMessage.trim() || isLoading}
            className="px-3 hover-scale"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          NyayDarpan provides information only and is NOT legal advice.{" "}
          <span className="text-primary">Consult a qualified advocate</span> for binding legal counsel.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;