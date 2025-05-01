
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@/hooks/use-chat";
import { ChatMessage } from "@/components/chat-message";
import { ChatSidebar } from "@/components/chat-sidebar";
import { SettingsDialog } from "@/components/settings-dialog";
import { ThemeProvider } from "@/components/theme-provider";
import { Send } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const {
    conversations,
    activeConversationId,
    settings,
    isLoading,
    setActiveConversationId,
    createNewConversation,
    deleteConversation,
    clearAllConversations,
    getActiveConversation,
    sendMessage,
    updateSettings,
  } = useChat();

  const [input, setInput] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const activeConversation = getActiveConversation();

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages]);

  // Focus input on load
  useEffect(() => {
    if (!isMobile) {
      inputRef.current?.focus();
    }
  }, [activeConversationId, isMobile]);

  // Close sidebar on mobile when conversation is selected
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [activeConversationId, isMobile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    sendMessage(input);
    setInput("");
  };

  const handleSaveSettings = (newSettings: any) => {
    updateSettings(newSettings);
    toast({
      title: "Pengaturan disimpan",
      description: "Pengaturan baru Anda telah diterapkan.",
    });
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <ChatSidebar 
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={setActiveConversationId}
          onNew={createNewConversation}
          onDelete={deleteConversation}
          onClearAll={clearAllConversations}
          onOpenSettings={() => setSettingsOpen(true)}
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <div className={`flex-1 flex flex-col overflow-hidden ${isMobile && sidebarOpen ? 'opacity-20' : ''}`}>
          <main className="flex-1 overflow-hidden flex flex-col p-4 sm:p-6">
            {activeConversation && (
              <div className="flex-1 overflow-y-auto pb-20 sm:pb-16 w-full">
                {activeConversation.messages.length > 0 ? (
                  <div className="space-y-4 w-full">
                    {activeConversation.messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center px-4">
                    <h2 className="text-2xl font-semibold mb-2">
                      Selamat datang di Chat-KRA
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      Mulai percakapan baru dengan mengetikkan pesan di bawah ini. 
                      Chat-KRA siap membantu Anda!
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div className="sticky bottom-0 bg-background pt-2 w-full">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Ketik pesan..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                  required
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Kirim</span>
                </Button>
              </form>
            </div>
          </main>
          
          <footer className="border-t p-2 text-center text-xs text-muted-foreground">
            By Cakra ©2025
          </footer>
        </div>
      </div>
      
      <SettingsDialog 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSave={handleSaveSettings}
      />
      
      <Toaster />
    </ThemeProvider>
  );
};

export default Index;
