export interface CategoryModel {
  id: number;
  name: string;
  description: string;
  created_at: Date;
}

export const createCategoryModel = (
  data: Partial<CategoryModel>
): CategoryModel => {
  return {
    id: data.id!,
    name: data.name!,
    description: data.description!,
    created_at: data.created_at || new Date(),
  };
};
