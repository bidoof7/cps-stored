// /* eslint-disable @typescript-eslint/no-explicit-any */
// import sql, { getPool } from "@/lib/db";
// import { NextResponse } from "next/server";

// export const GET = async (request: Request, context: { params: any }) => {
//   //   const url = new URL(request.url);
//   //   const categoryId = url.searchParams.get("category_id");
//   //   const productId = url.searchParams.get("product_id");

//   const productParams = await context.params.product;
//   const { searchParams } = new URL(request.url);
//   console.log(productParams);
//   const categoryId = searchParams.get("categoryId");
//   const productId = searchParams.get("productId");

//   console.log(categoryId);
//   console.log(productId);
//   try {
//     const pool = await getPool();
//     let result;

//     if (categoryId) {
//       // Tìm sản phẩm theo category_id
//       result = await pool
//         .request()
//         .input("category_id", sql.Int, categoryId)
//         .query(
//           "SELECT [id],[name],[description],[category_id],[inventory_id],[price],[discount_id],[created_at],[modified_at],[deleted_at] FROM [VFFRestaurent].[dbo].[product] WHERE [category_id] = @category_id"
//         );
//     } else if (productId) {
//       // Tìm sản phẩm theo product_id
//       result = await pool
//         .request()
//         .input("product_id", sql.Int, productId)
//         .query(
//           "SELECT [id],[name],[description],[category_id],[inventory_id],[price],[discount_id],[created_at],[modified_at],[deleted_at] FROM [VFFRestaurent].[dbo].[product] WHERE id = @product_id"
//         );
//     } else {
//       return new NextResponse(
//         JSON.stringify({ message: "Missing category_id or product_id" }),
//         { status: 400 }
//       );
//     }

//     return NextResponse.json({ result: result.recordset }, { status: 200 });
//   } catch (err) {
//     return new NextResponse(
//       JSON.stringify({ message: "Error when fetching products", err }),
//       { status: 500 }
//     );
//   }
// };
