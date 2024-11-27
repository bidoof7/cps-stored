// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { COOKIE_NAME } from "./constants";
import { parse } from "cookie";
const secret = process.env.JWT_SECRET_KEY;

const protectedRoutes = ["/dashboard"];
const publicRoutes = [
  "/login",
  "/",
  "/api/products",
  "/api/auth/me",
  "/api/auth/logout",
  "/api/auth/login",
  "/api/categories"
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  if (isPublicRoute) {
    return NextResponse.next();
  }
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const cookies = parse(request.headers.get("cookie") || "");
    const ntoken = cookies[COOKIE_NAME];

    if (!ntoken) {
      return NextResponse.next(); // Nếu không có token, tiếp tục yêu cầu (không chuyển hướng)
    }
    if (!token) {
      // Nếu không có token và đang truy cập route bảo vệ, chuyển hướng đến login
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
      }
      return NextResponse.next(); // Trường hợp khác không cần token
    }

    // Xác minh token
    const verifyUser = jwt.verify(token, secret!) as JwtPayload;

    // Kiểm tra thông tin người dùng từ token
    if (isProtectedRoute && !verifyUser.user?.userId) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    // Kiểm tra token, nhưng không truy vấn DB
    return NextResponse.next();
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Invalid token", error },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/dashboard", "/api/:path*"],
};
