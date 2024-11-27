// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants";

const secret = process.env.JWT_SECRET_KEY;

export async function middleware(request: NextRequest) {
  const url = request.url;

  // Nếu route là '/api/auth/login' thì bỏ qua middleware
  if (url.includes("/login") || url.includes("/api/auth/") || url.includes("/api/products")) {
    return NextResponse.next(); // Chỉ cần trả về NextResponse.next() để tiếp tục yêu cầu
  }

  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    jwt.verify(token, secret!); // Kiểm tra token, nhưng không truy vấn DB
    return NextResponse.next();
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Invalid token", error },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
