// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET_KEY;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Không áp dụng middleware với các route công khai
  const publicRoutes = ["/api/auth/login", "/api/auth/me", "/api/categories"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, secret!); // Kiểm tra token, nhưng không truy vấn DB
    return NextResponse.next();
  } catch (error: unknown) {
    return NextResponse.json({ message: "Invalid token", error}, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
