import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyJwt } from "@/app/middleware/auth";
// import { createUserModel } from "@/models/user.model";
// import sql, { getPool } from "@/lib/db";
import { serialize } from "cookie";
import { COOKIE_NAME } from "@/constants";
// import { getPool } from "@/lib/db";
// import { createUserInfoModel, UserInfoModel } from "@/models/userinfo.model";

const secret = process.env.JWT_SECRET_KEY;

if (!secret) {
  throw new Error("JWT_SECRET không được cấu hình trong môi trường.");
}

const MAX_AGE = 60 * 60 * 24 * 30; // days

export const POST = async (request: Request) => {
  const body = await request.json();
  const { username, password } = body;

  if (username !== "admin" || password !== "admin") {
    return (
      NextResponse.json({
        message: "Unauthorized",
      }),
      { status: 401 }
    );
  }

  // const pool = await getPool();
  // const transaction = new sql.Transaction(pool);

  // const data = {
  //   username,
  //   password,
  // };

  // const userCheck = createUserModel(data);

  // await transaction.begin();

  // const userLogin = await transaction
  //   .request()
  //   .input("username", sql.VarChar, userCheck.username)
  //   .input("password", sql.VarChar, userCheck.password)
  //   .query(
  //     "SELECT [username], [password] FROM [VFFRestaurent].[dbo].[user] WHERE username = @username and password = @password"
  //   );

  // if (userLogin.recordset.length === 0) {
  //   return NextResponse.json(
  //     { message: "Invalid credentials" },
  //     { status: 401 }
  //   );
  // }

  // const user = userLogin.recordset[0];

  // async function saveTokenToDatabase(username: string, token: string) {
  //   const pool = await getPool();
  //   await pool
  //     .request()
  //     .input("username", sql.VarChar, username)
  //     .input("token", sql.VarChar, token)
  //     .query(
  //       "UPDATE [VFFRestaurent].[dbo].[user] SET token = @token WHERE username = @username" // Hoặc INSERT nếu token lưu ở bảng khác
  //     );
  // }
  // const payload = { user: user };
  // Xác thực user
  // if (userLogin) {
  const token = jwt.sign(
    {username}, // Payload
    secret, // Secret key
    { expiresIn: "5h" } // Hạn token
  );
  // await saveTokenToDatabase(username, token);

  const serialized = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });

  const res = {
    message: "Authenticated",
  };
  return new Response(JSON.stringify(res), {
    status: 200,
    headers: {
      "Set-Cookie": serialized,
    },
  });
};
// }
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
