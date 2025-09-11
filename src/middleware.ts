import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware((_auth, req) => {
  // Only allow public routes to bypass auth; no need for .protect()
  if (!isPublicRoute(req)) {
    // Auth can be handled inside your route using currentUser()
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
