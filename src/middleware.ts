import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/app/middleware/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicPath = ["/", "/auth"];
  const publicRoutes = ["/api/login", "/api/register"];

  const isPublicPath = publicPath.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const token = request.cookies.get("token")?.value;

  // Chỉ áp dụng middleware cho các API routes
  if (path.startsWith("/api")) {
    if (isPublicRoute) {
      return NextResponse.next();
    } else if (!isPublicRoute && !token) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 401 }
      );
    }
    if (isPublicPath && token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!isPublicPath && !token) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    const { payload, error } = await verifyJwt(request);

    if (error) {
      return NextResponse.json({ message: error }, { status: 401 });
    }

    // Token hợp lệ, tiếp tục xử lý request
    request.headers.set("user", JSON.stringify(payload));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth", "/dashboard", "/api/:path*"],
};
