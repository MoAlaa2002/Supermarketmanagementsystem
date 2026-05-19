export interface Product {
  id: string;
  barcode: string;
  nameAr: string;
  nameEn: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  unit: string;
  vat: number;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
  discount: number;
}

export interface Sale {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  vat: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'both';
  cashierName: string;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
}

export type Language = 'ar' | 'en';
