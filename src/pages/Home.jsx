import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';
import confetti from "canvas-confetti";
import { Button } from "../components/ui/button";
import { Atom, Zap, Wind, Box, Palette, PartyPopper, Settings, BellRing } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

export default function Home() {
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const triggerNotification = async () => {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }
    if (permissionGranted) {
      sendNotification({ title: 'Change Name from ./src/pages/Home.jsx', body: 'Hello from Tauri v2!' });
    }
  };

  const stack = [
    { name: "React", icon: Atom },
    { name: "Vite", icon: Zap },
    { name: "Tailwind", icon: Wind },
    { name: "Tauri", icon: Box },
    { name: "shadcn/ui", icon: Palette },
  ];

  return (
    <main className="flex-1 flex flex-col items-center justify-center relative bg-background text-foreground overflow-hidden">
      {/* Top action buttons */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <Button variant="outline" onClick={triggerNotification}>
          <BellRing className="w-4 h-4 mr-2" />
          Send Notification
        </Button>

        <Button variant="ghost" size="icon" asChild>
          <Link to="/settings">
            <Settings className="w-5 h-5" />
          </Link>
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full px-6 text-center gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Welcome to Tauri
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A minimal, blazingly fast desktop application template.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {stack.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.name} className="w-32 h-32 flex flex-col items-center justify-center transition-colors hover:bg-muted/50 cursor-pointer border shadow-sm">
                <CardContent className="p-0 flex flex-col items-center gap-3">
                  <Icon className="w-8 h-8 text-primary" />
                  <span className="font-medium text-sm">{item.name}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-6 right-6">
        <Button onClick={triggerConfetti} size="lg" className="shadow-md">
          <PartyPopper className="w-4 h-4 mr-2" />
          Click Me!
        </Button>
      </div>
    </main>
  );
}
