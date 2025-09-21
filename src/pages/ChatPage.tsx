import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download, Share } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ChatInterface from "@/components/ChatInterface";

const ChatPage = () => {
  const [documentName, setDocumentName] = useState("Employment Contract.pdf");
  const [messages, setMessages] = useState<Array<{sender: string, text: string}>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [contractText, setContractText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load contract data from sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem("contractData");
    console.log("ChatPage: Loading contract data from sessionStorage:", data);
    if (data) {
      const parsed = JSON.parse(data);
      console.log("ChatPage: Parsed contract data:", parsed);
      setContractText(parsed.contractText || "");
      setDocumentName(parsed.partyName || "Contract.pdf");
      console.log("ChatPage: Contract text set to:", parsed.contractText?.substring(0, 100) + "...");
    } else {
      console.log("ChatPage: No contract data found in sessionStorage");
    }
  }, []);

  const handleSendMessage = async (message: string) => {
    console.log('ChatPage handleSendMessage called with:', message);
    console.log('Contract text available:', contractText ? 'Yes' : 'No');
    console.log('Contract text length:', contractText?.length || 0);

    if (!message.trim() || !contractText) {
      console.log('Early return: message or contractText missing');
      return;
    }

    const userMessage = message.trim();

    // Add user message to chat
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/intelligent-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contract_text: contractText,
          user_question: userMessage,
          chat_history: messages.map(msg => ({role: msg.sender, message: msg.text}))
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.chat_response) {
          const aiText = result.chat_response.answer || "No response from AI";
          setMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: `Error: ${result.error || 'Unknown error'}` }
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: `Request failed with status: ${response.status}` }
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: `Request failed: ${err.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card">
        {/* Header */}
        <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/report">
                  <Button variant="ghost" size="sm" className="hover-scale">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Report
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-semibold text-foreground">{documentName}</h1>
                    <p className="text-sm text-muted-foreground">Contract Analysis Chat</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hover-scale">
                  <Share className="h-4 w-4 mr-2" />
                  Share Chat
                </Button>
                <Button variant="outline" size="sm" className="hover-scale">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden h-[calc(100vh-200px)]">
              <ChatInterface 
                documentName={documentName}
                onSendMessage={handleSendMessage}
                messages={messages}
                isLoading={isLoading}
              />
            </div>
            
            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                💡 Ask specific questions about clauses, payment terms, termination conditions, or any concerns you have about this contract.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;