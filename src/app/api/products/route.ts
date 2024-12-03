import sql, { getPool } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);
  let result;
  try {
    const productId = searchParams.get("productId");
    await transaction.begin();
    if (categoryId) {
      // Get products where category id equal
      result = await transaction
        .request()
        .input("category_id", sql.Int, categoryId)
        .query(
          "SELECT [id],[name],[description],[category_id],[inventory_id],[price],[discount_id],[created_at],[modified_at],[deleted_at] FROM [VFFRestaurent].[dbo].[product] WHERE [category_id] = @category_id"
        );
    } else if (productId) {
      // Get products where product id equal
      result = await transaction
        .request()
        .input("product_id", sql.Int, productId)
        .query(
          "SELECT [id],[name],[description],[category_id],[inventory_id],[price],[discount_id],[created_at],[modified_at],[deleted_at] FROM [VFFRestaurent].[dbo].[product] WHERE id = @product_id"
        );
    } else {
      result = await transaction.request().execute("Product_GetAll");
    }

    if (result?.recordset) {
      await transaction.commit();
      return new NextResponse(
        JSON.stringify({ message: "Successfully", products: result.recordset }),
        { status: 200 }
      );
    }
  } catch (err: unknown) {
    transaction.rollback();
    console.log("Error at products API:", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong." }),
      {
        status: 500,
      }
    );
  }
};
