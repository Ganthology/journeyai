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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type ConversationType = "ideation" | "reflection" | null;

type Conversation = {
  id: string;
  type: "ideation" | "reflection";
  title: string;
  createdAt: string;
};

function EmptyState() {
  return (
    <div className="text-center p-8 rounded-lg border border-dashed bg-muted/50">
      <div className="flex flex-col items-center gap-2">
        <LightbulbIcon className="w-10 h-10 text-muted-foreground" />
        <h3 className="font-semibold text-lg">No conversations yet</h3>
        <p className="text-sm text-muted-foreground">
          Start a new conversation by selecting one of the options above
        </p>
      </div>
    </div>
  );
}

function ErrorState() {
  return <EmptyState />;
}

export default function RecordPage() {
  const [activeConversation, setActiveConversation] =
    useState<ConversationType>(null);

  const {
    data: conversations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await axios.get("/api/conversations");
      return response.data as Conversation[];
    },
    initialData: [],
  });

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
        <ConversationAI type={activeConversation} />
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
          {isLoading ? (
            <div className="text-center p-8 rounded-lg border bg-muted/50">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Loading conversations...
                </p>
              </div>
            </div>
          ) : error ? (
            <ErrorState />
          ) : conversations?.length === 0 ? (
            <EmptyState />
          ) : (
            conversations?.map((session) => (
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
                  {new Date(session.createdAt).toLocaleDateString()}
                </time>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
