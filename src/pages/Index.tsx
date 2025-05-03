
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@/hooks/use-chat";
import { ChatMessage } from "@/components/chat-message";
import { ChatSidebar } from "@/components/chat-sidebar";
import { SettingsDialog } from "@/components/settings-dialog";
import { ThemeProvider } from "@/components/theme-provider";
import { Send, PanelLeft, X } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [initialSidebarState] = useState(isMobile ? false : true);

  // Initialize sidebar state based on device type
  useEffect(() => {
    setSidebarOpen(initialSidebarState);
  }, [initialSidebarState]);

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider>
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />
      )}
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
          onToggle={toggleSidebar}
        />
        
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out", 
          isMobile ? (sidebarOpen ? 'opacity-20' : '') : (sidebarOpen ? 'ml-72' : 'ml-0')
        )}>
          <header className="flex items-center px-4 py-2 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="mr-2"
              aria-label={sidebarOpen ? "Sembunyikan sidebar" : "Tampilkan sidebar"}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
            </Button>
            <h1 className="font-semibold">Chat-KRA</h1>
          </header>
          
          <main className="flex-1 flex flex-col h-full overflow-hidden">
            {activeConversation && (
              <ScrollArea className="flex-1">
                <div className="p-4 sm:p-6">
                  {activeConversation.messages.length > 0 ? (
                    <div className="space-y-4 w-full max-w-full pb-20">
                      {activeConversation.messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center px-4 mt-auto">
                      <h2 className="text-2xl font-semibold mb-2">
                        Welcome
                      </h2>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        Chat in aja ;)
                      </p>
                      
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
              
            <div className="sticky bottom-0 bg-background pt-2 px-4 sm:px-6 pb-4">
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
          
          <footer className="border-t px-4 py-2 text-center text-xs text-muted-foreground">
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
