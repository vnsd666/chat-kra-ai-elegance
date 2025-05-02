
import { useState, useEffect, useRef } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-php";
import "prismjs/components/prism-go";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-ruby";
import "prismjs/themes/prism-tomorrow.css";
import "./prism-override.css";

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Use requestAnimationFrame for better timing
        const highlightCode = () => {
          requestAnimationFrame(() => {
            if (Prism && codeRef.current) {
              Prism.highlightElement(codeRef.current);
            }
          });
        };
        
        highlightCode();
        
        // Also add a fallback timeout just to be sure
        const timeout = setTimeout(highlightCode, 200);
        return () => clearTimeout(timeout);
      } catch (error) {
        console.error("Prism highlighting error:", error);
      }
    }
  }, [code, language]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Sanitize language to prevent highlighting errors
  const safeLanguage = ["markup", "html", "xml", "css", "javascript", "typescript", 
    "jsx", "tsx", "json", "python", "java", "c", "cpp", "csharp", "bash", 
    "sql", "php", "go", "dart", "rust", "kotlin", "swift", "ruby"].includes(language.toLowerCase()) 
      ? language.toLowerCase() 
      : "plaintext";

  return (
    <div className="relative my-4 rounded-lg bg-apple-gray-100 dark:bg-apple-gray-900 w-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-apple-gray-200 dark:bg-apple-gray-950">
        <span className="text-sm font-medium text-apple-gray-800 dark:text-apple-gray-300">
          {language || "code"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="sr-only">
            {copied ? "Disalin" : "Salin kode"}
          </span>
        </Button>
      </div>
      <div className="overflow-x-auto w-full max-w-full">
        <pre className="p-4 overflow-x-auto w-full" style={{ margin: 0 }}>
          <code 
            ref={codeRef}
            className={`language-${safeLanguage}`}
            style={{ whiteSpace: "pre", wordBreak: "normal", overflowWrap: "normal", display: "block" }}
          >
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
