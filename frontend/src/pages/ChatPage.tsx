import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download, Share } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import axios from "axios";

// Chat message type
type ChatMessage = {
  sender: "user" | "ai";
  text: string;
};

const ChatPage = () => {
  const [documentName, setDocumentName] = useState("Contract.pdf");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  // Load contract data from sessionStorage
  const [contractText, setContractText] = useState("");
  useEffect(() => {
    const data = sessionStorage.getItem("contractData");
    if (data) {
      const parsed = JSON.parse(data);
      setContractText(parsed.contractText || "");
      setDocumentName(parsed.partyName || "Contract.pdf");
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !contractText) return;

    const userMessage = inputMessage.trim();

    // Add user message to chat
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInputMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ask-contract`,
        {
          contract_text: contractText,
          user_question: userMessage
        }
      );

      if (response.data.success) {
        const aiText = response.data.answer || "No response from AI";
        setMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: `Error: ${response.data.error}` }
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: `Request failed: ${err.message}` }
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card">
        {/* Header */}
        <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/report">
                <Button variant="ghost" size="sm">
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
                  <p className="text-sm text-muted-foreground">
                    Contract Analysis Chat
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share Chat
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-200px)]">
            <div className="flex-1 overflow-y-auto mb-4 p-4 border border-border rounded-lg bg-card">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Ask specific questions about clauses, payment terms, termination conditions, or other contract concerns.
                </p>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-3 flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[70%] ${
                      msg.sender === "user"
                        ? "bg-primary/20 text-primary-foreground"
                        : "bg-muted/20 text-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your question..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 border border-border rounded-lg p-3 bg-card text-foreground focus:outline-none"
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
