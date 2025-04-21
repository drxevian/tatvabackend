export interface Product {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  images: string[];
  subproductImages?: Record<string, string>;
  isNew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductWithId = Product & { id: string };

export type ProductInput = Omit<Product, 'createdAt' | 'updatedAt'>;