"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/record");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background">
      <div className="text-center space-y-4 mb-4">
        <h1 className="text-4xl font-bold tracking-tight">JourneyAI</h1>
        <p className="text-muted-foreground text-lg">
          Your AI-powered companion for reflection and ideation
        </p>
      </div>

      <div className="flex gap-4">
        <SignInButton mode="modal" appearance={{
          elements: {
            modalContent: "sm:max-w-md",
            card: "shadow-none rounded-lg",
            rootBox: "!items-center",
          }
        }}>
          <Button variant="outline">Sign In</Button>
        </SignInButton>
        <SignUpButton mode="modal" appearance={{
          elements: {
            modalContent: "sm:max-w-md",
            card: "shadow-none rounded-lg",
            rootBox: "!items-center",
          }
        }}>
          <Button>Sign Up</Button>
        </SignUpButton>
      </div>
    </main>
  );
}
