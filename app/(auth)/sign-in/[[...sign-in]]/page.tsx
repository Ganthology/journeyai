import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url');
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "rounded-xl shadow-none",
          },
        }}
        redirectUrl={redirectUrl || "/record"}
      />
    </div>
  );
} 