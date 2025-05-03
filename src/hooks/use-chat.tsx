import { useState, useEffect, useCallback } from "react";
import {
  generateId,
  getCurrentTime,
  callChatApi,
  saveConversationToLocalStorage,
  loadConversationsFromLocalStorage,
  saveSettingsToLocalStorage,
  loadSettingsFromLocalStorage,
  defaultSettings
} from "@/lib/chat-utils";
import { ChatSettings, Conversation, Message } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";

export function useChat() {
  const [conversations, setConversations] = useState<Record<string, Conversation>>({});
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [settings, setSettings] = useState<ChatSettings>(() => loadSettingsFromLocalStorage());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize from localStorage
  useEffect(() => {
    const savedConversations = loadConversationsFromLocalStorage();
    setConversations(savedConversations);
    
    const conversationIds = Object.keys(savedConversations);
    if (conversationIds.length > 0) {
      setActiveConversationId(conversationIds[0]);
    } else {
      createNewConversation();
    }
  }, []);

  // Save to localStorage when conversations change
  useEffect(() => {
    if (Object.keys(conversations).length > 0) {
      saveConversationToLocalStorage(conversations);
    }
  }, [conversations]);

  // Save settings to localStorage when they change
  useEffect(() => {
    saveSettingsToLocalStorage(settings);
  }, [settings]);

  const createNewConversation = useCallback(() => {
    const id = generateId();
    const newConversation: Conversation = {
      id,
      title: `Percakapan ${Object.keys(conversations).length + 1}`,
      messages: [],
      createdAt: getCurrentTime(),
      updatedAt: getCurrentTime()
    };
    
    setConversations(prev => ({
      ...prev,
      [id]: newConversation
    }));
    
    setActiveConversationId(id);
    return id;
  }, [conversations]);

  const updateConversationTitle = (id: string, title: string) => {
    if (!conversations[id]) return;
    
    setConversations(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        title,
        updatedAt: getCurrentTime()
      }
    }));
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => {
      const newConversations = { ...prev };
      delete newConversations[id];
      
      // If the active conversation is deleted, set a new active
      if (activeConversationId === id) {
        const remainingIds = Object.keys(newConversations);
        if (remainingIds.length > 0) {
          setActiveConversationId(remainingIds[0]);
        } else {
          const newId = createNewConversation();
          setActiveConversationId(newId);
        }
      }
      
      return newConversations;
    });
  };

  const clearAllConversations = () => {
    setConversations({});
    const newId = createNewConversation();
    setActiveConversationId(newId);
  };

  const getActiveConversation = (): Conversation | null => {
    if (!activeConversationId) return null;
    return conversations[activeConversationId] || null;
  };

  const addMessage = (content: string, role: Message["role"] = "user") => {
    if (!activeConversationId) {
      const newId = createNewConversation();
      setActiveConversationId(newId);
    }
    
    const message: Message = {
      id: generateId(),
      role,
      content,
      createdAt: getCurrentTime()
    };
    
    setConversations(prev => {
      const convo = prev[activeConversationId!];
      
      // If this is the first user message, use it to generate a title
      let title = convo.title;
      if (role === "user" && convo.messages.length === 0) {
        title = content.length > 30 ? `${content.substring(0, 30)}...` : content;
      }
      
      return {
        ...prev,
        [activeConversationId!]: {
          ...convo,
          title,
          messages: [...convo.messages, message],
          updatedAt: getCurrentTime()
        }
      };
    });
    
    return message;
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    const userMessage = addMessage(content, "user");
    setIsLoading(true);
    
    try {
      const convo = getActiveConversation();
      if (!convo) throw new Error("Tidak ada percakapan aktif");
      
      const allMessages = [...convo.messages, userMessage];
      
      const response = await callChatApi(allMessages, settings);
      
      if (response) {
        if (response.role === "error") {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.content,
          });
        }
        
        addMessage(response.content, response.role);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      addMessage(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Terjadi kesalahan yang tidak diketahui",
        "error"
      );
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengirim pesan. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = (newSettings: Partial<ChatSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveSettingsToLocalStorage(updated);
      return updated;
    });
  };

  return {
    conversations,
    activeConversationId,
    settings,
    isLoading,
    setActiveConversationId,
    createNewConversation,
    updateConversationTitle,
    deleteConversation,
    clearAllConversations,
    getActiveConversation,
    addMessage,
    sendMessage,
    updateSettings
  };
}
