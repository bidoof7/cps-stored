// NOT USED

import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET_KEY;

if (!secret) {
  throw new Error("JWT_SECRET không được cấu hình trong môi trường.");
} // Thay bằng secret key của bạn

// Middleware kiểm tra JWT
export async function verifyJwt(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Missing or invalid token" };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret as string);
    return { payload: decoded }; // Trả về payload nếu token hợp lệ
  } catch (err: unknown) {
    return { error: "Invalid or expired token", err };
  }
}
