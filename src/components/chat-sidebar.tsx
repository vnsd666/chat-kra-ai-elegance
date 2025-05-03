
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  Settings,
  MessageSquare,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation } from "@/types/chat";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatSidebarProps {
  conversations: Record<string, Conversation>;
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onOpenSettings: () => void;
  isMobile: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onClearAll,
  onOpenSettings,
  isMobile,
  isOpen,
  onToggle,
}: ChatSidebarProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clearAllConfirmOpen, setClearAllConfirmOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  // Sort conversations by updatedAt date (newest first)
  const sortedConversations = Object.values(conversations).sort((a, b) => 
    b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversationToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (conversationToDelete) {
      onDelete(conversationToDelete);
    }
    setDeleteConfirmOpen(false);
  };

  return (
    <>
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-background border-r transition-transform duration-300 ease-in-out",
          (isMobile && !isOpen) && "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Chat-KRA</h2>
          <div className="flex items-center gap-1">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex p-4">
          <Button
            onClick={onNew}
            className="flex-1 gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Percakapan Baru</span>
          </Button>
        </div>
        <ScrollArea className="flex-1 p-3">
          {sortedConversations.length > 0 ? (
            sortedConversations.map((conversation) => (
              <Tooltip key={conversation.id}>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => onSelect(conversation.id)}
                    className={cn(
                      "group flex items-center rounded-lg p-3 text-sm font-medium mb-1",
                      "hover:bg-accent",
                      activeId === conversation.id
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                    role="button"
                  >
                    <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-1 flex-grow text-left">{conversation.title}</span>
                    {activeId !== conversation.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 flex-shrink-0"
                        onClick={(e) => handleDelete(conversation.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" align="start" className="max-w-[250px]">
                  {conversation.title}
                </TooltipContent>
              </Tooltip>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground">
              <FileText className="h-8 w-8 mb-2 opacity-50" />
              <p>Belum ada percakapan.</p>
              <p>Mulai percakapan baru!</p>
            </div>
          )}
        </ScrollArea>
        <div className="px-4 py-2 border-t flex flex-col gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onOpenSettings}
          >
            <Settings className="h-4 w-4" />
            <span>Pengaturan</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setClearAllConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            <span>Hapus Semua Percakapan</span>
          </Button>
        </div>
      </div>

      <AlertDialog 
        open={deleteConfirmOpen} 
        onOpenChange={setDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Percakapan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus percakapan ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog 
        open={clearAllConfirmOpen} 
        onOpenChange={setClearAllConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Semua Percakapan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus semua percakapan? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={onClearAll}>Hapus Semua</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
