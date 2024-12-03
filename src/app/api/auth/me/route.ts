import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/constants";
import { NextResponse } from "next/server";
import sql, { getPool } from "@/lib/db";
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

export const GET = async () => {
  const cookieStore = cookies();

  // 1. Get cookie sign from server
  const token = (await cookieStore).get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json(
      {
        authenticated: false,
      },
      { status: 401 }
    );
  }

  // 2. Verify cookie to get info
  const { payload } = (await jwtVerify(token, decoded)) as {
    payload: UserPayload;
  };
  const userVerify = payload.user;

  // 3. Verify user get from cookie with database
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const result = await transaction
      .request()
      .input("id", sql.Int, `${userVerify.id}`)
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

    const userResult = result.recordset[0];

    // Trả về thông tin xác thực và người dùng nếu thành công
    return NextResponse.json({
      authenticated: true,
      user: {
        id: userResult.id,
        username: userResult.username,
        role: userResult.role, // Trả về role của người dùng
        first_name: userResult.first_name,
        last_name: userResult.last_name,
        photo: userResult.photo,
      },
    });
  } catch (err: unknown) {
    transaction.rollback();
    console.log("Something went wrong with check authentication API: ", err);
    return NextResponse.json(
      {
        message: `Something went wrong ${err}`,
      },
      { status: 400 }
    );
  }
};
