import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/constants";
import { NextResponse } from "next/server";
import { JwtPayload, verify } from "jsonwebtoken";
import sql, { getPool } from "@/lib/db";

const secret = process.env.JWT_SECRET_KEY;

if (!secret) {
  throw new Error("JWT_SECRET không được cấu hình trong môi trường.");
}

export const GET = async () => {
  const cookieStore = cookies();

  const token = (await cookieStore).get(COOKIE_NAME);

  if (!token) {
    return NextResponse.json(
      {
        authenticated: false,
      },
      { status: 401 }
    );
  }
  const { value } = token;
  try {
    const decoded = verify(value, secret) as JwtPayload & { id: string };
    const pool = await getPool();

    const result = await pool
      .request()
      .input("id", sql.Int, `${decoded.user.id}`)
      .execute("User_GetById");

    if (result.recordset.length === 0) {
      return NextResponse.json(
        {
          authenticated: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const user = result.recordset[0];

    // Trả về thông tin xác thực và người dùng nếu thành công
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role, // Trả về role của người dùng
        first_name: user.first_name,
        last_name: user.last_name,
        photo: user.photo,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: `Something went wrong ${err}`,
      },
      { status: 400 }
    );
  }
};
