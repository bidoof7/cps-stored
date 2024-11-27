import { NextResponse } from "next/server";
import sql, { getPool } from "@/lib/db";
import { CategoryModel, createCategoryModel } from "@/models/category.model";

export const GET = async () => {
  try {
    const pool = await getPool();
    const result = await pool.request().execute("Product_Category_GetAll");
    const categories: CategoryModel[] =
      result.recordset.map(createCategoryModel);
    return new NextResponse(
      JSON.stringify({ message: "Success", categories: categories }),
      { status: 200 }
    );
  } catch (err: unknown) {
    return new NextResponse(JSON.stringify({ message: "Error" + err }), {
      status: 500,
    });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    const newCategory = createCategoryModel(body);
    await transaction.begin();

    const existId = await transaction
      .request()
      .input("id", sql.Int, newCategory.id)
      .execute("Product_Category_GetById");

    if (existId.recordset.length > 0) {
      await transaction.rollback();
      return new NextResponse(
        JSON.stringify({ message: "ID Category existed" }),
        { status: 400 }
      );
    }

    await transaction
      .request()
      .input("id", sql.Int, newCategory.id)
      .input("name", sql.NVarChar, newCategory.name)
      .input("description", sql.NVarChar, newCategory.description)
      .execute("Product_Category_Insert");

    await transaction.commit();
    return new NextResponse(JSON.stringify({ message: "Success" }), {
      status: 200,
    });
  } catch (err: unknown) {
    return new NextResponse(JSON.stringify({ message: "Error" + err }), {
      status: 500,
    });
  }
};
