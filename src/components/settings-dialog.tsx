
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { defaultSettings } from "@/lib/chat-utils";
import { ChatSettings } from "@/types/chat";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: ChatSettings;
  onSave: (settings: ChatSettings) => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  settings,
  onSave,
}: SettingsDialogProps) {
  const [tempSettings, setTempSettings] = useState<ChatSettings>({ ...settings });

  const handleSave = () => {
    onSave(tempSettings);
    onOpenChange(false);
  };

  const handleReset = () => {
    setTempSettings({ ...defaultSettings });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pengaturan</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endpoint" className="text-right">
              Endpoint API
            </Label>
            <Input
              id="endpoint"
              value={tempSettings.endpoint}
              onChange={(e) =>
                setTempSettings({ ...tempSettings, endpoint: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right">
              API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={tempSettings.apiKey}
              onChange={(e) =>
                setTempSettings({ ...tempSettings, apiKey: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right">
              Model
            </Label>
            <Input
              id="model"
              value={tempSettings.model}
              onChange={(e) =>
                setTempSettings({ ...tempSettings, model: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="temperature" className="text-right">
              Temperature: {tempSettings.temperature.toFixed(1)}
            </Label>
            <div className="col-span-3">
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.1}
                value={[tempSettings.temperature]}
                onValueChange={(value) =>
                  setTempSettings({ ...tempSettings, temperature: value[0] })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxTokens" className="text-right">
              Maks. Token
            </Label>
            <Input
              id="maxTokens"
              type="number"
              min={1}
              value={tempSettings.maxTokens}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  maxTokens: Number(e.target.value),
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="systemPrompt" className="text-right">
              System Prompt
            </Label>
            <Textarea
              id="systemPrompt"
              value={tempSettings.systemPrompt}
              onChange={(e) =>
                setTempSettings({ ...tempSettings, systemPrompt: e.target.value })
              }
              className="col-span-3 min-h-[100px]"
            />
          </div>
        </div>
        <div className="w-full justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
          >
            Reset ke Default
          </Button>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <div className="flex flex-row gap-2">
              <Button
                type="button"
                variant="default"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
              <Button type="button" onClick={handleSave}>
                Simpan Pengaturan
              </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

