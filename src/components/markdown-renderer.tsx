
import React from "react";
import { CodeBlock } from "@/components/code-block";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Detect and parse code blocks
  const detectAndRenderCodeBlocks = (text: string) => {
    // Regex to match markdown code blocks with language specification
    const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
    
    // Split text by code blocks
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.slice(lastIndex, match.index)
        });
      }
      
      // Add code block
      const language = match[1] || "plaintext";
      const code = match[2];
      parts.push({
        type: "code",
        language,
        content: code
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex)
      });
    }
    
    return parts;
  };

  const renderTextWithFormatting = (text: string) => {
    // Handle HTML tags by escaping them safely (for display, not execution)
    text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Handle bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle italic
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Handle inline code
    text = text.replace(/`([^`]+)`/g, '<code class="bg-apple-gray-100 dark:bg-apple-gray-900 p-1 rounded text-sm">$1</code>');
    
    // Handle links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-apple-blue dark:text-apple-teal underline">$1</a>');
    
    // Handle lists
    const lines = text.split('\n');
    let inList = false;
    let formattedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Unordered list
      if (line.match(/^\s*-\s/)) {
        if (!inList) {
          formattedLines.push('<ul class="ml-6 list-disc my-2">');
          inList = true;
        }
        line = `<li>${line.replace(/^\s*-\s/, '')}</li>`;
      }
      // Numbered list
      else if (line.match(/^\s*\d+\.\s/)) {
        if (!inList) {
          formattedLines.push('<ol class="ml-6 list-decimal my-2">');
          inList = true;
        }
        line = `<li>${line.replace(/^\s*\d+\.\s/, '')}</li>`;
      }
      // Not a list item
      else if (inList) {
        formattedLines.push(inList ? '</ul>' : '');
        inList = false;
      }
      
      formattedLines.push(line);
    }
    
    if (inList) {
      formattedLines.push('</ul>');
    }
    
    text = formattedLines.join('\n');
    
    // Handle headings h1-h3
    text = text.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold my-2">$1</h3>');
    text = text.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold my-3">$1</h2>');
    text = text.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>');
    
    // Handle paragraphs
    text = text.split('\n\n').map(p => {
      if (!p.trim()) return '';
      if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<ol')) return p;
      return `<p class="my-2">${p}</p>`;
    }).join('\n');
    
    return text;
  };

  // Handling empty content
  if (!content || content.trim() === '') {
    return <div className="text-muted-foreground italic">Tidak ada konten</div>;
  }

  const parts = detectAndRenderCodeBlocks(content);
  
  return (
    <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none break-words">
      {parts.map((part, index) => {
        if (part.type === "code") {
          return (
            <CodeBlock 
              key={index} 
              code={part.content} 
              language={part.language} 
            />
          );
        } else {
          return (
            <div 
              key={index} 
              dangerouslySetInnerHTML={{ 
                __html: renderTextWithFormatting(part.content) 
              }} 
            />
          );
        }
      })}
    </div>
  );
}
