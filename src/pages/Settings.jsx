import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isEnabled, enable, disable } from '@tauri-apps/plugin-autostart';
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function Settings() {
  const [minimizeToTray, setMinimizeToTray] = useState(() => {
    return localStorage.getItem("minimizeToTray") !== "false";
  });

  const [autostartEnabled, setAutostartEnabled] = useState(false);

  useEffect(() => {
    localStorage.setItem("minimizeToTray", minimizeToTray.toString());
    window.dispatchEvent(new CustomEvent('setting-minimize-to-tray', { 
      detail: minimizeToTray 
    }));
  }, [minimizeToTray]);

  useEffect(() => {
    async function checkAutostart() {
      try {
        const enabled = await isEnabled();
        setAutostartEnabled(enabled);
      } catch (err) {
        console.error("Failed to check autostart status", err);
      }
    }
    checkAutostart();
  }, []);

  const handleAutostartChange = async (checked) => {
    try {
      if (checked) {
        await enable();
      } else {
        await disable();
      }
      setAutostartEnabled(checked);
    } catch (err) {
      console.error("Failed to toggle autostart", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Fixed Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border bg-background">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between py-4 border-b">
            <div className="flex flex-col gap-1">
              <Label htmlFor="minimize-tray" className="text-base font-medium">
                Minimize to Tray
              </Label>
              <span className="text-sm text-muted-foreground">
                Hide the app in system tray when close button is clicked.
              </span>
            </div>
            <Switch 
              id="minimize-tray" 
              checked={minimizeToTray}
              onCheckedChange={setMinimizeToTray}
            />
          </div>

          <div className="flex items-center justify-between py-4 border-b">
            <div className="flex flex-col gap-1">
              <Label htmlFor="autostart" className="text-base font-medium">
                Autostart on Login
              </Label>
              <span className="text-sm text-muted-foreground">
                Automatically start the application when you log into your computer.
              </span>
            </div>
            <Switch 
              id="autostart" 
              checked={autostartEnabled}
              onCheckedChange={handleAutostartChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}