/* eslint-disable @typescript-eslint/no-explicit-any */

import sql, { getPool } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request: Request, context: { params: any }) => {
  const searchQuery = await context.params.product;

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("searchQuery", sql.NVarChar, `%${searchQuery}%`)
      .query(
        "SELECT name, price FROM [VFFRestaurent].[dbo].[product] WHERE name LIKE @searchQuery "
      );

    return NextResponse.json({ result: result }, { status: 200 });
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ message: "Error when find product", err }),
      { status: 500 }
    );
  }
};
