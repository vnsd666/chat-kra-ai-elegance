
import { ChatSettings, Message, OpenRouterResponse } from "@/types/chat";

export const defaultSettings: ChatSettings = {
  endpoint: "https://openrouter.ai/api/v1/chat/completions",
  apiKey: "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",
  model: "qwen/qwen3-235b-a22b:free",
  temperature: 0.7,
  maxTokens: 1000,
  systemPrompt: "Kamu adalah asisten AI yang membantu, sopan dan akurat. Berikan jawaban yang singkat, padat dan informatif."
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

export const getCurrentTime = (): Date => {
  return new Date();
};

export async function callChatApi(
  messages: Message[],
  settings: ChatSettings
): Promise<Message | null> {
  const systemMessage = {
    role: "system",
    content: settings.systemPrompt
  };

  const formattedMessages = [
    systemMessage,
    ...messages
      .filter(message => message.role !== "error")
      .map(message => ({
        role: message.role,
        content: message.content
      }))
  ];

  try {
    const response = await fetch(settings.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: settings.model,
        messages: formattedMessages,
        temperature: settings.temperature,
        max_tokens: settings.maxTokens
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Terjadi kesalahan saat menghubungi API");
    }

    const data = await response.json() as OpenRouterResponse;
    
    if (data.choices && data.choices.length > 0) {
      return {
        id: generateId(),
        role: "assistant",
        content: data.choices[0].message.content,
        createdAt: getCurrentTime()
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error calling chat API:", error);
    return {
      id: generateId(),
      role: "error",
      content: error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui",
      createdAt: getCurrentTime()
    };
  }
}

export const saveConversationToLocalStorage = (
  conversations: Record<string, any>
) => {
  localStorage.setItem("chat-kra-conversations", JSON.stringify(conversations));
};

export const loadConversationsFromLocalStorage = () => {
  const saved = localStorage.getItem("chat-kra-conversations");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      
      // Convert string dates back to Date objects
      Object.values(parsed).forEach((convo: any) => {
        convo.createdAt = new Date(convo.createdAt);
        convo.updatedAt = new Date(convo.updatedAt);
        convo.messages.forEach((msg: any) => {
          msg.createdAt = new Date(msg.createdAt);
        });
      });
      
      return parsed;
    } catch (e) {
      console.error("Error parsing saved conversations:", e);
      return {};
    }
  }
  return {};
};

export const saveSettingsToLocalStorage = (settings: ChatSettings) => {
  localStorage.setItem("chat-kra-settings", JSON.stringify(settings));
};

export const loadSettingsFromLocalStorage = (): ChatSettings => {
  const saved = localStorage.getItem("chat-kra-settings");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing saved settings:", e);
      return defaultSettings;
    }
  }
  return defaultSettings;
};
