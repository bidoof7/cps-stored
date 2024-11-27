import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyJwt } from "@/app/middleware/auth";
import { createUserModel } from "@/models/user.model";
import sql, { getPool } from "@/lib/db";
import { serialize } from "cookie";
import { COOKIE_NAME } from "@/constants";
import * as argon2 from "argon2";

const secret = process.env.JWT_SECRET_KEY;

if (!secret) {
  throw new Error("Can't find secret key in environment.");
}

const MAX_AGE = 60 * 60 * 24 * 30; // days

export const POST = async (request: Request) => {
  const body = await request.json();
  const { username, password } = body;

  try {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    const data = {
      username,
    };

    const userModel = createUserModel(data);
    await transaction.begin();

    const result = await transaction
      .request()
      .input("username", sql.VarChar, userModel.username)
      .execute("User_GetByUsername");

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { message: "Invalid credentials user" },
        { status: 401 }
      );
    }

    const user = result.recordset[0];
    
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      return NextResponse.json(
        { message: "Invalid password, try again" },
        { status: 401 }
      );
    }
    const userInfo = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    // Xác thực user
    const payload = { user: user };
    const token = jwt.sign(
      payload,
      secret, // Secret key
      { expiresIn: "5h" } // Hạn token
    );

    const serialized = serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: MAX_AGE,
      path: "/",
    });

    await transaction.commit();

    const res = {
      message: "Authenticated",
      user: userInfo,
    };
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: {
        "Set-Cookie": serialized,
      },
    });
  } catch (err: unknown) {
    return new NextResponse(JSON.stringify({ message: "Error" + err }), {
      status: 500,
    });
  }
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
