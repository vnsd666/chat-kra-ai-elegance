
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) {
      toast({
        title: "Instalasi Tidak Tersedia",
        description: "Aplikasi ini sudah diinstal atau browser Anda tidak mendukung instalasi PWA",
        variant: "destructive",
      });
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === "accepted") {
        toast({
          title: "Terima Kasih!",
          description: "Aplikasi berhasil diinstal",
        });
      } else {
        toast({
          title: "Instalasi Dibatalkan",
          description: "Anda dapat menginstal aplikasi nanti jika berubah pikiran",
        });
      }
      // Reset the deferredPrompt variable
      setDeferredPrompt(null);
      setIsInstallable(false);
    });
  };

  if (!isInstallable) {
    return null;
  }

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleInstallClick}
    >
      <DownloadIcon size={16} />
      <span>Instal Aplikasi</span>
    </Button>
  );
}
