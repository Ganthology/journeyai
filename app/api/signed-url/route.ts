import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { type } = await req.json();

    const agentId =
      type === "reflection"
        ? process.env.REFLECTION_AGENT_ID
        : process.env.IDEATION_AGENT_ID;

    if (!agentId) {
      throw new Error(`Missing agent ID for type: ${type}`);
    }

    const apiKey = process.env.XI_API_KEY;
    if (!apiKey) {
      throw Error("XI_API_KEY is not set");
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get signed URL");
    }

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error("[SIGNED_URL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
