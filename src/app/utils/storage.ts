import { Product, Sale } from '../types';
import { sampleProducts } from '../data/sampleData';

const STORAGE_KEYS = {
  PRODUCTS: 'pos_products',
  SALES: 'pos_sales',
};

export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(sampleProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify([]));
  }
};

export const getProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : sampleProducts;
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const getSales = (): Sale[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SALES);
  return data ? JSON.parse(data) : [];
};

export const saveSales = (sales: Sale[]) => {
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
};

export const addSale = (sale: Sale) => {
  const sales = getSales();
  sales.push(sale);
  saveSales(sales);
};

export const updateProduct = (product: Product) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index !== -1) {
    products[index] = product;
    saveProducts(products);
  }
};

export const deleteProduct = (productId: string) => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== productId);
  saveProducts(filtered);
};

export const addProduct = (product: Product) => {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
};

export const updateStock = (productId: string, quantity: number) => {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (product) {
    product.stock -= quantity;
    saveProducts(products);
  }
};

export const exportData = () => {
  const products = getProducts();
  const sales = getSales();
  const data = {
    products,
    sales,
    exportDate: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `pos-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.products) {
          saveProducts(data.products);
        }
        if (data.sales) {
          saveSales(data.sales);
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};
