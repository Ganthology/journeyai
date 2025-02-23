export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center">
      <div className="mx-auto w-full max-w-[480px] p-4">{children}</div>
    </div>
  );
} 