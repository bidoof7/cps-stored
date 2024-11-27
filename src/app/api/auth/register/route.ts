import sql, { getPool } from "@/lib/db";
import { createUserModel } from "@/models/user.model";
import { NextResponse } from "next/server";
import * as argon2 from "argon2";

export const POST = async (request: Request) => {
  const body = await request.json();
  const { username, password, first_name, last_name, email, photo, role } = body;

  try {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    const hashedPassword = await argon2.hash(password);
    const data = {
      username,
      password: hashedPassword,
      first_name,
      last_name,
      email,
      photo,
      role,
    };

    const newUser = createUserModel(data);
    console.log("Beginning transaction...");
    await transaction.begin();
    console.log("Transaction started");

    // Sau khi thực thi truy vấn
    console.log("Executing SQL...");

    const result = await transaction
      .request()
      .input("username", sql.VarChar, newUser.username)
      .input("password", sql.VarChar, newUser.password)
      .input("first_name", sql.NVarChar, newUser.first_name)
      .input("last_name", sql.NVarChar, newUser.last_name)
      .input("email", sql.VarChar, newUser.email)
      .input("photo", sql.VarChar, newUser.photo)
      .input("role", sql.VarChar, newUser.role)
      .execute("User_Register");

    console.log("SQL executed, committing transaction...");
    await transaction.commit();
    console.log("Transaction committed");
    return new NextResponse(
      JSON.stringify({
        message: "User created successfully",
        newUser: result.recordset,
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    return new NextResponse(JSON.stringify({ message: "Error" + err }), {
      status: 500,
    });
  }
};
