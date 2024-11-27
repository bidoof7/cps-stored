import { COOKIE_NAME } from "@/constants";
import { serialize } from "cookie";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async () => {
  const cookieStore = cookies();

  const token = (await cookieStore).get(COOKIE_NAME);

  const serialized = serialize(COOKIE_NAME, "", {
    maxAge: -1, // Đặt Max-Age bằng -1 để xóa cookie ngay lập tức
    path: "/", // Đảm bảo cookie được xóa trên toàn bộ domain
    sameSite: "strict", // Đảm bảo bảo mật
    httpOnly: true, // Không thể truy cập cookie từ JavaScript
    secure: process.env.NODE_ENV === "production", // Chỉ gửi qua HTTPS trong môi trường production
  });

  if (token) {
    const res = {
      message: "Logout successfully",
    };
    return new NextResponse(JSON.stringify(res), {
      status: 200,
      headers: {
        Location: "/",
        "Set-Cookie": serialized,
      },
    });
  } else {
    // Nếu không có cookie token, có thể trả về lỗi
    const res = {
      message: "No active session",
    };
    return new Response(JSON.stringify(res), {
      status: 400, // Trạng thái lỗi 400 nếu không tìm thấy cookie
    });
  }
};
