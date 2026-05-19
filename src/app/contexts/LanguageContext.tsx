import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  ar: {
    // Navigation
    pos: 'نقطة البيع',
    products: 'المنتجات',
    reports: 'التقارير',
    settings: 'الإعدادات',
    
    // POS Screen
    searchProduct: 'بحث عن منتج أو باركود...',
    cart: 'السلة',
    item: 'صنف',
    items: 'أصناف',
    subtotal: 'المجموع الفرعي',
    vat: 'ضريبة القيمة المضافة',
    discount: 'الخصم',
    total: 'الإجمالي',
    cash: 'نقدي',
    card: 'بطاقة',
    both: 'مختلط',
    payment: 'الدفع',
    clearCart: 'مسح السلة',
    completeSale: 'إتمام البيع',
    
    // Products
    addProduct: 'إضافة منتج',
    productName: 'اسم المنتج',
    barcode: 'الباركود',
    category: 'التصنيف',
    price: 'السعر',
    cost: 'التكلفة',
    stock: 'المخزون',
    unit: 'الوحدة',
    actions: 'الإجراءات',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    
    // Reports
    salesReport: 'تقرير المبيعات',
    profitReport: 'تقرير الأرباح',
    inventoryReport: 'تقرير المخزون',
    todaySales: 'مبيعات اليوم',
    totalProfit: 'إجمالي الربح',
    lowStock: 'مخزون منخفض',
    salesOverTime: 'المبيعات عبر الوقت',
    topProducts: 'المنتجات الأكثر مبيعاً',
    quantity: 'الكمية',
    revenue: 'الإيرادات',
    profit: 'الربح',
    
    // Common
    sar: 'ريال',
    halala: 'هللة',
    search: 'بحث',
    all: 'الكل',
    date: 'التاريخ',
    time: 'الوقت',
    cashier: 'الكاشير',
    invoiceNumber: 'رقم الفاتورة',
    
    // Messages
    saleCompleted: 'تمت عملية البيع بنجاح',
    cartEmpty: 'السلة فارغة',
    productAdded: 'تمت إضافة المنتج',
    productUpdated: 'تم تحديث المنتج',
    productDeleted: 'تم حذف المنتج',
    
    // Categories
    foodItems: 'مواد غذائية',
    beverages: 'مشروبات',
    cleaningProducts: 'منتجات تنظيف',
    dairy: 'ألبان',
    snacks: 'وجبات خفيفة',
    
    // Units
    kg: 'كجم',
    piece: 'حبة',
    liter: 'لتر',
    pack: 'علبة',
    
    // Settings
    language: 'اللغة',
    backup: 'نسخ احتياطي',
    restore: 'استعادة',
    downloadBackup: 'تحميل نسخة احتياطية',
    uploadBackup: 'رفع نسخة احتياطية',
    systemSettings: 'إعدادات النظام',
    storeName: 'اسم المتجر',
    vatRate: 'معدل الضريبة',
    currency: 'العملة',
    
    // Reports additional
    recentSales: 'المبيعات الأخيرة',
    transactions: 'معاملات',
    totalSales: 'مجموع المبيعات',
    productsNeedReorder: 'منتجات تحتاج إعادة طلب',
    productPerformance: 'أداء المنتجات',
    reorderNow: 'أعد الطلب الآن',
    totalProducts: 'إجمالي المنتجات',
    totalStockValue: 'قيمة المخزون الكلية',
    totalCostValue: 'قيمة التكلفة الكلية',
    currentStock: 'المخزون الحالي',
    status: 'الحالة',
  },
  en: {
    // Navigation
    pos: 'Point of Sale',
    products: 'Products',
    reports: 'Reports',
    settings: 'Settings',
    
    // POS Screen
    searchProduct: 'Search for product or barcode...',
    cart: 'Cart',
    item: 'item',
    items: 'items',
    subtotal: 'Subtotal',
    vat: 'VAT',
    discount: 'Discount',
    total: 'Total',
    cash: 'Cash',
    card: 'Card',
    both: 'Both',
    payment: 'Payment',
    clearCart: 'Clear Cart',
    completeSale: 'Complete Sale',
    
    // Products
    addProduct: 'Add Product',
    productName: 'Product Name',
    barcode: 'Barcode',
    category: 'Category',
    price: 'Price',
    cost: 'Cost',
    stock: 'Stock',
    unit: 'Unit',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    
    // Reports
    salesReport: 'Sales Report',
    profitReport: 'Profit Report',
    inventoryReport: 'Inventory Report',
    todaySales: "Today's Sales",
    totalProfit: 'Total Profit',
    lowStock: 'Low Stock',
    salesOverTime: 'Sales Over Time',
    topProducts: 'Top Products',
    quantity: 'Quantity',
    revenue: 'Revenue',
    profit: 'Profit',
    
    // Common
    sar: 'SAR',
    halala: 'Halala',
    search: 'Search',
    all: 'All',
    date: 'Date',
    time: 'Time',
    cashier: 'Cashier',
    invoiceNumber: 'Invoice Number',
    
    // Messages
    saleCompleted: 'Sale completed successfully',
    cartEmpty: 'Cart is empty',
    productAdded: 'Product added',
    productUpdated: 'Product updated',
    productDeleted: 'Product deleted',
    
    // Categories
    foodItems: 'Food Items',
    beverages: 'Beverages',
    cleaningProducts: 'Cleaning Products',
    dairy: 'Dairy',
    snacks: 'Snacks',
    
    // Units
    kg: 'kg',
    piece: 'pc',
    liter: 'L',
    pack: 'pack',
    
    // Settings
    language: 'Language',
    backup: 'Backup',
    restore: 'Restore',
    downloadBackup: 'Download Backup',
    uploadBackup: 'Upload Backup',
    systemSettings: 'System Settings',
    storeName: 'Store Name',
    vatRate: 'VAT Rate',
    currency: 'Currency',
    
    // Reports additional
    recentSales: 'Recent Sales',
    transactions: 'transactions',
    totalSales: 'total sales',
    productsNeedReorder: 'products need reorder',
    productPerformance: 'Product Performance',
    reorderNow: 'Reorder Now',
    totalProducts: 'Total Products',
    totalStockValue: 'Total Stock Value',
    totalCostValue: 'Total Cost Value',
    currentStock: 'Current Stock',
    status: 'Status',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ar] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};