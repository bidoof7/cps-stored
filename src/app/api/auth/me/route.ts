import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/constants";
import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const secret = process.env.JWT_SECRET_KEY;

if (!secret) {
  throw new Error("JWT_SECRET không được cấu hình trong môi trường.");
}

export async function GET() {
  const cookieStore = cookies();

  const token = (await cookieStore).get(COOKIE_NAME);

  if (!token) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const { value } = token;
  try {
    verify(value, secret!);

    const res = {
      user: "Secret user",
    };
    return new Response(JSON.stringify(res), {
      status: 200,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: `Something went wrong ${err}`,
      },
      { status: 400 }
    );
  }
}
