"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Conversation } from "@11labs/client";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { ReflectionContent } from "@/lib/types/conversation";

async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch {
    console.error("Microphone permission denied");
    return false;
  }
}

async function getSignedUrl(): Promise<string> {
  const response = await fetch("/api/signed-url");
  if (!response.ok) {
    throw Error("Failed to get signed url");
  }
  const data = await response.json();
  return data.signedUrl;
}

type CreateConversationPayload = {
  type: "reflection" | "ideation";
  title: string;
  content: ReflectionContent;
};

export function ConversationAI() {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const createConversation = useMutation({
    mutationFn: (payload: CreateConversationPayload) =>
      axios.post("/api/conversations", payload),
    onError: (error) => {
      console.error("Failed to save reflection:", error);
      // You could add a toast notification here
    },
  });

  async function startConversation() {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      alert("No permission");
      return;
    }
    const signedUrl = await getSignedUrl();
    const conversation = await Conversation.startSession({
      signedUrl: signedUrl,
      onConnect: () => {
        setIsConnected(true);
        setIsSpeaking(true);
      },
      onDisconnect: () => {
        setIsConnected(false);
        setIsSpeaking(false);
      },
      onError: (error) => {
        console.log(error);
        alert("An error occurred during the conversation");
      },
      onModeChange: ({ mode }) => {
        setIsSpeaking(mode === "speaking");
      },
      clientTools: {
        summariseReflection: async (convo) => {
          const result = await createConversation.mutateAsync({
            type: "reflection",
            title: "Daily Reflection",
            content: convo as ReflectionContent,
          });

          return result.data;
        },
      },
    });
    setConversation(conversation);
  }

  async function endConversation() {
    if (!conversation) {
      return;
    }
    await conversation.endSession();
    setConversation(null);
  }

  return (
    <div className={"flex justify-center items-center gap-x-4"}>
      <Card className={"rounded-3xl"}>
        <CardContent>
          <CardHeader>
            <CardTitle className={"text-center"}>
              {createConversation.isPending
                ? "Saving reflection..."
                : isConnected
                ? isSpeaking
                  ? `Agent is speaking`
                  : "Agent is listening"
                : "Disconnected"}
            </CardTitle>
          </CardHeader>
          <div className={"flex flex-col gap-y-4 text-center"}>
            <div
              className={cn(
                "orb my-16 mx-12",
                isSpeaking ? "animate-orb" : conversation && "animate-orb-slow",
                isConnected ? "orb-active" : "orb-inactive"
              )}
            ></div>

            <Button
              variant={"outline"}
              className={"rounded-full"}
              size={"lg"}
              disabled={conversation !== null && isConnected}
              onClick={startConversation}
            >
              Start conversation
            </Button>
            <Button
              variant={"outline"}
              className={"rounded-full"}
              size={"lg"}
              disabled={conversation === null && !isConnected}
              onClick={endConversation}
            >
              End conversation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
