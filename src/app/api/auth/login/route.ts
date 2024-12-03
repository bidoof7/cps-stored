import { NextResponse } from "next/server";
import { createUserModel } from "@/models/user.model";
import sql, { getPool } from "@/lib/db";
import { serialize } from "cookie";
import { COOKIE_NAME } from "@/constants";
import * as argon2 from "argon2";
import { SignJWT } from "jose";

const secret = process.env.JWT_SECRET_KEY;
const decoded = new TextEncoder().encode(secret);
if (!secret) {
  throw new Error("Can't find secret key in environment.");
}

const MAX_AGE = 60 * 60 * 24 * 30; // days

export const POST = async (request: Request) => {
  const body = await request.json();
  const { username, password } = body;

  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const data = {
      username,
    };

    const userModel = createUserModel(data);

    const result = await transaction
      .request()
      .input("username", sql.VarChar, userModel.username)
      .execute("User_Login");

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { message: "Invalid credentials user" },
        { status: 401 }
      );
    }

    const userResult = result.recordset[0];

    const passwordValid = await argon2.verify(userResult.password, password);
    if (!passwordValid) {
      return NextResponse.json(
        { message: "Invalid password, try again" },
        { status: 401 }
      );
    }

    // Xác thực user
    const payload = {
      user: {
        id: userResult.id,
        username: userResult.username,
        first_name: userResult.first_name,
        last_name: userResult.last_name,
        photo: userResult.photo,
        role: userResult.role,
      },
    };

    const generateToken = await new SignJWT(payload)
      .setExpirationTime("5h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(decoded);

    const serialized = serialize(COOKIE_NAME, generateToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: MAX_AGE,
      path: "/",
    });

    await transaction.commit();

    const res = {
      message: "Authenticated",
      user: payload.user,
    };

    console.log(res);

    return new NextResponse(JSON.stringify({ result: res }), {
      status: 302, // Status code cho redirect
      headers: {
        Location: "/", // Redirect đến trang chủ
        "Set-Cookie": serialized, // Gắn cookie vào header response
      },
    });
  } catch (err: unknown) {
    transaction.rollback();
    console.error("Error during login:", err); // Log chi tiết lỗi phía server
    return new NextResponse(
      JSON.stringify({
        message: "Something went wrong. Please try again later.",
      }),
      {
        status: 500,
      }
    );
  }
};
