
import { cn } from "@/lib/utils";

export function TypingAnimation({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-2 px-4 py-3", className)}>
      <div className="flex space-x-1">
        <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
