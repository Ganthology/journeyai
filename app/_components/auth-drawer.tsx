"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface AuthDrawerProps {
  mode: "sign-in" | "sign-up";
}

export function AuthDrawer({ mode }: AuthDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant={mode === "sign-in" ? "outline" : "default"}>
          {mode === "sign-in" ? "Sign In" : "Sign Up"}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="focus-visible:outline-none">
        <DrawerHeader className="flex justify-center border-b-0">
          <DrawerTitle>
            {mode === "sign-in" ? "Welcome Back" : "Create Account"}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          {mode === "sign-in" ? (
            <SignIn
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none border-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  footerAction: "hidden",
                  dividerRow: "hidden",
                  socialButtonsBlockButton: "border-2 shadow-none",
                  formFieldInput: "border-2 shadow-none",
                },
              }}
            />
          ) : (
            <SignUp
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none border-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  footerAction: "hidden",
                  dividerRow: "hidden",
                  socialButtonsBlockButton: "border-2 shadow-none",
                  formFieldInput: "border-2 shadow-none",
                },
              }}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
