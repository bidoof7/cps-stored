import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyJwt } from "@/app/middleware/auth";
import { createUserModel } from "@/models/user.model";
import sql, { getPool } from "@/lib/db";
// import { getPool } from "@/lib/db";
// import { createUserInfoModel, UserInfoModel } from "@/models/userinfo.model";

export const POST = async (request: Request) => {
  const { username, password } = await request.json();
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret) {
    throw new Error("JWT_SECRET không được cấu hình trong môi trường.");
  }

  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  const data = {
    username,
    password,
  };

  const userCheck = createUserModel(data);

  await transaction.begin();

  const userLogin = await transaction
    .request()
    .input("username", sql.VarChar, userCheck.username)
    .input("password", sql.VarChar, userCheck.password)
    .query(
      "SELECT [username], [password] FROM [VFFRestaurent].[dbo].[user] WHERE username = @username and password = @password"
    );

  async function saveTokenToDatabase(username: string, token: string) {
    const pool = await getPool();
    await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("token", sql.VarChar, token)
      .query(
        "UPDATE [VFFRestaurent].[dbo].[user] SET token = @token WHERE username = @username" // Hoặc INSERT nếu token lưu ở bảng khác
      );
  }
  const result = userLogin.recordset;
  const payload = { result };
  // Xác thực user
  if (userLogin) {
    const token = jwt.sign(
      payload, // Payload
      secret, // Secret key
      { expiresIn: "5h" } // Hạn token
    );
    await saveTokenToDatabase(username, token);
    return NextResponse.json({ token });
  }

  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
};

export async function GET(request: Request) {
  // Kiểm tra JWT token
  const { payload, error } = await verifyJwt(request);

  if (error) {
    return NextResponse.json({ message: error }, { status: 401 });
  }

  // Nếu token hợp lệ
  return NextResponse.json({
    message: "Access granted",
    user: payload, // Trả về payload từ token
  });
}
