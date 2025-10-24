// export const config = {
//   matcher: ["/properties/add", "/profile", "/properties/saved", "/messages", "/dashboard"],
// };

import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function proxy(request) {
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/properties/add", "/profile", "/properties/saved", "/messages", "/dashboard"],
};
