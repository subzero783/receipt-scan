import { withAuth } from "next-auth/middleware";

// Export as default
export default withAuth;

export const config = {
  matcher: ["/properties/add", "/profile", "/properties/saved", "/messages"],
};
