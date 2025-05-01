
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  Settings,
  MessageSquare,
  FileText,
  Menu,
  X
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
          isMobile && !isOpen && "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Chat-KRA</h2>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={onToggle}>
                <X className="h-5 w-5" />
              </Button>
            )}
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
        <ScrollArea className="flex-1 px-2 py-2">
          {sortedConversations.length > 0 ? (
            sortedConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelect(conversation.id)}
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2 text-sm font-medium mb-1",
                  "hover:bg-accent",
                  activeId === conversation.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
                role="button"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span className="flex-grow truncate">{conversation.title}</span>
                {activeId !== conversation.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => handleDelete(conversation.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground">
              <FileText className="h-8 w-8 mb-2 opacity-50" />
              <p>Belum ada percakapan.</p>
              <p>Mulai percakapan baru!</p>
            </div>
          )}
        </ScrollArea>
        <div className="p-4 border-t flex flex-col gap-2">
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
        <div className="p-4 border-t text-center text-xs text-muted-foreground">
          By Cakra ©2025
        </div>
      </div>

      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "fixed left-4 top-4 z-50 rounded-full opacity-80",
            isOpen && "hidden"
          )}
          onClick={onToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

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
