// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "./constants"; // Đảm bảo rằng constant này được cấu hình đúng
import { jwtVerify } from "jose";

const secret = process.env.JWT_SECRET_KEY;
const decoded = new TextEncoder().encode(secret);
if (!secret) {
  throw new Error("Can't find secret key in environment.");
}

interface UserPayload {
  user: {
    id: string;
    username: string;
    role: string;
    first_name: string;
    last_name: string;
    photo: string;
  };
}

// Định nghĩa các route bảo vệ (như trang admin)
const protectedRoutes = ["/dashboard"]; // Các route như /dashboard sẽ là protected

// Cấu hình matcher để áp dụng middleware cho tất cả các route ngoài các route protected
export const config = {
  matcher: [
    "/((?!dashboard).*)", // Tất cả các route ngoại trừ /dashboard
  ],
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Kiểm tra xem route có phải là protected không
  const isProtectedRoute = protectedRoutes.includes(path);

  // Nếu là một route public (ngoài /dashboard), không cần kiểm tra token
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  try {
    // Lấy token từ cookies
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      // Nếu không có token và người dùng truy cập route protected, chuyển hướng đến trang login
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    // Xác thực token JWT
    const { payload } = (await jwtVerify(token, decoded)) as {
      payload: UserPayload;
    };

    const userVerify = payload.user;

    // Kiểm tra xem đối tượng user có tồn tại trong payload (token hợp lệ hay không)
    if (!userVerify) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    // Kiểm tra quyền truy cập của người dùng (có thể kiểm tra role tại đây)
    const userRole = userVerify.role; // Giả sử 'role' được lưu trong payload của JWT
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/login", request.nextUrl)); // Hoặc chuyển hướng đến trang "không có quyền truy cập"
    }

    // Nếu người dùng hợp lệ và có quyền, tiếp tục đến route được yêu cầu
    return NextResponse.next();
  } catch (error: unknown) {
    console.error("Error during middleware:", error);
    // Trả về lỗi khi không xác thực được người dùng
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }
}
