import sql, { getPool } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    const result = await transaction.request().execute("Product_GetAll");
    await transaction.commit();
    return new NextResponse(
      JSON.stringify({ message: "Successfully", products: result.recordset }),
      { status: 200 }
    );
  } catch (err: unknown) {
    return new NextResponse(JSON.stringify({ message: "Error", err }), {
      status: 500,
    });
  }
};
