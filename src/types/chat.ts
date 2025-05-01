
export interface Message {
  id: string;
  role: "system" | "user" | "assistant" | "error";
  content: string;
  createdAt: Date;
}

export interface ChatSettings {
  endpoint: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OpenRouterResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: {
    message: {
      role: string;
      content: string;
    };
    index: number;
    finish_reason: string;
  }[];
}
