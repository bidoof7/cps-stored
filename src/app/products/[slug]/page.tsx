"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Price from "@/components/ui/extension/price";
import axios from "axios";
import Image from "next/image";
import React from "react";

interface Product {
  id: number | null;
  name: string | null;
  description: string | null; // Added type for description
  price: number | null;
}

const ProductPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = React.use(params); // Unwrap params

  const [data, setData] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/products?categoryId=${slug}`);
        // Ensure data is an array
        const fetchedData = Array.isArray(response.data.products)
          ? response.data.products
          : [];
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex mt-24">
      <div className="w-[300px]">SIDE BAR</div>
      <div className="grid grid-cols-3 gap-4">
        {data.length > 0 ? (
          data.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <Image
                  priority={true}
                  className="w-full h-full"
                  src="https://res.cloudinary.com/dzdiljeob/image/upload/v1732867437/20241123_tl65l3t9sy_i3lrlh.jpg"
                  width={100}
                  height={100}
                  alt="pick"
                />
              </CardHeader>
              <CardContent>
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  {p.name}
                </h4>
              </CardContent>
              <CardFooter>
                <blockquote className="mt-6 border-l-2 pl-6">
                  Price: <Price price={p.price} /> VND
                </blockquote>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
