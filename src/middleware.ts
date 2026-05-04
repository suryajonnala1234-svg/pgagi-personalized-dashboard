import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Protect all dashboard routes, but specifically allow public assets and APIs
  matcher: [
    "/",
    "/trending",
    "/favorites",
    "/settings",
    // Protect other routes if they exist, but skip _next/static, api routes, etc.
  ]
};
