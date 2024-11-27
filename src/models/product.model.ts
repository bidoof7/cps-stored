export interface ProductModel {
  id: number;
  available: boolean;
  image: string;
  name: string;
  price: number;
  createdate: Date;
  categoryid: string;
}

export const createProductModel = (
  data: Partial<ProductModel>
): ProductModel => {
  return {
    id: data.id!,
    available: data.available!,
    image: data.image!,
    name: data.name!,
    price: data.price!,
    createdate: data.createdate || new Date(),
    categoryid: data.categoryid!,
  };
};
