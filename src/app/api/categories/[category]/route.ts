/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import sql, { getPool } from "@/lib/db";
import { createCategoryModel } from "@/models/category.model";

export const PATCH = async (req: Request, context: { params: any }) => {
  const { params } = context;
  const id = (await params).category; // lấy thông số category được định nghĩa trên url gán vào id
  try {
    const body = await req.json();
    const { name } = body; // name trong request body

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    const data = {
      id,
      name,
    };

    const newCategory = createCategoryModel(data);

    await transaction.begin();

    const existId = await transaction
      .request()
      .input("id", sql.Int, newCategory.id)
      .execute("Product_Category_GetById");

    if (existId.recordset.length === 0) {
      await transaction.rollback();
      return new NextResponse(
        JSON.stringify({ message: `ID ${id} not existed` }),
        { status: 400 }
      );
    }

    await transaction
      .request()
      .input("id", sql.Int, newCategory.id)
      .input("name", sql.NVarChar, newCategory.name)
      .input("description", sql.NVarChar, newCategory.description)
      .execute("Product_Category_Update");

    await transaction.commit();
    return new NextResponse(
      JSON.stringify({ message: `Category ID ${id} UPDATED successfully` }),
      { status: 200 }
    );
  } catch (err: unknown) {
    return new NextResponse(JSON.stringify({ message: "Error" + err }), {
      status: 500,
    });
  }
};

export const DELETE = async (context: { params: any }) => {
  const { params } = context;
  const id = (await params).category;

  try {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    const data = {
      id,
    };

    const newCategory = createCategoryModel(data);

    await transaction.begin();
    const existId = await transaction
      .request()
      .input("id", sql.VarChar, newCategory.id)
      .execute("Category_GetById");

    if (existId.recordset.length === 0) {
      await transaction.rollback();
      return new NextResponse(
        JSON.stringify({ message: `ID ${id} not existed` }),
        { status: 400 }
      );
    }

    await transaction
      .request()
      .input("id", sql.VarChar, newCategory.id)
      .execute("Category_Delete");

    await transaction.commit();
    return new NextResponse(
      JSON.stringify({ message: `Category ID ${id} DELETED successfully` }),
      { status: 200 }
    );
  } catch (err: unknown) {
    return new NextResponse(JSON.stringify({ message: "Error" + err }), {
      status: 500,
    });
  }
};
