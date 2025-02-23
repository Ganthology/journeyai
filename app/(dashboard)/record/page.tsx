"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConversationAI } from "@/components/conversation/conversationAI";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LightbulbIcon, BrainCircuitIcon, ClockIcon } from "lucide-react";

type ConversationType = "ideation" | "reflection" | null;

// Mock data - Replace with actual data from your backend
const pastSessions = [
  {
    id: 1,
    type: "ideation",
    date: "2024-03-20",
    title: "Project Brainstorming",
  },
  { id: 2, type: "reflection", date: "2024-03-19", title: "Daily Reflection" },
  { id: 3, type: "ideation", date: "2024-03-18", title: "Feature Ideas" },
];

export default function RecordPage() {
  const [activeConversation, setActiveConversation] =
    useState<ConversationType>(null);

  const handleConversationStart = (type: ConversationType) => {
    setActiveConversation(type);
  };

  if (activeConversation) {
    return (
      <div className="flex flex-col items-center gap-6">
        <Button
          variant="ghost"
          onClick={() => setActiveConversation(null)}
          className="self-start"
        >
          ← Back
        </Button>
        <h2 className="text-xl font-semibold capitalize">
          {activeConversation} Session
        </h2>
        <ConversationAI />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      {/* Buttons Section */}
      <TooltipProvider>
        <div className="flex gap-4 justify-start">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                onClick={() => handleConversationStart("ideation")}
              >
                <LightbulbIcon className="w-6 h-6" />
                Ideation
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Start a conversation to explore and scribble down potential
                ideas
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                onClick={() => handleConversationStart("reflection")}
              >
                <BrainCircuitIcon className="w-6 h-6" />
                Reflection
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Start a conversation to reflect on your day and thoughts</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* Past Sessions Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ClockIcon className="w-5 h-5" />
          Past Sessions
        </h2>
        <div className="grid gap-3">
          {pastSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex flex-col gap-1">
                <h3 className="font-medium">{session.title}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {session.type}
                </p>
              </div>
              <time className="text-sm text-muted-foreground">
                {new Date(session.date).toLocaleDateString()}
              </time>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
