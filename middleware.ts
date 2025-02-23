import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ["/api/webhooks(.*)"],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: ["/api/webhooks(.*)"],
  afterAuth(auth, req) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return Response.redirect(signInUrl);
    }

    // Redirect signed in users from auth pages to record page
    if (
      auth.userId &&
      (req.nextUrl.pathname === "/sign-in" ||
        req.nextUrl.pathname === "/sign-up")
    ) {
      return Response.redirect(new URL("/record", req.url));
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
