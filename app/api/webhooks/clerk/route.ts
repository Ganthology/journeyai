import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// Type definitions for Clerk webhook payload
type WebhookPayload = {
  data: {
    id: string;
  };
  type: string;
};

export async function POST(req: Request) {
  try {
    // Verify webhook secret
    const headerPayload = await headers();
    const webhookSecret = headerPayload.get("webhook-secret");

    console.log("Received webhook with secret:", webhookSecret); // Debug log

    if (webhookSecret !== process.env.CLERK_WEBHOOK_SECRET) {
      console.log("Webhook secret mismatch:", {
        received: webhookSecret,
        expected: process.env.CLERK_WEBHOOK_SECRET,
      });
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const payload = (await req.json()) as WebhookPayload;
    console.log("Received webhook payload:", payload); // Debug log

    // Only handle user.created events
    if (payload.type !== "user.created") {
      return NextResponse.json({ message: "Webhook received" });
    }

    const { id: userId } = payload.data;
    console.log("Creating user with ID:", userId); // Debug log

    // Create user in database
    const user = await prisma.user.create({
      data: {
        id: userId,
      },
    });

    console.log("User created:", user); // Debug log

    return NextResponse.json({
      message: "User created",
      userId,
    });
  } catch (error) {
    console.error("Error in Clerk webhook:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
