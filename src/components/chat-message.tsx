
import { Message } from "@/types/chat";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isError = message.role === "error";
  
  return (
    <div 
      className={cn(
        "flex w-full pb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "rounded-2xl px-4 py-3 max-w-[85%] sm:max-w-[75%] overflow-x-auto",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : isError 
              ? "bg-destructive text-destructive-foreground" 
              : "bg-secondary text-secondary-foreground"
        )}
      >
        <MarkdownRenderer content={message.content} />
      </div>
    </div>
  );
}
