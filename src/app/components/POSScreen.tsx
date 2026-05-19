import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, Calculator } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { useLanguage } from '../contexts/LanguageContext';
import { Product, CartItem } from '../types';
import { getProducts, addSale, updateStock } from '../utils/storage';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'sonner';
import { categories } from '../data/sampleData';

export const POSScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'both'>('cash');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Simulate barcode scanner - focus on search input
    searchInputRef.current?.focus();
  }, [cart]);

  const loadProducts = () => {
    setProducts(getProducts());
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.barcode.includes(searchTerm) ||
      product.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, discount: 0 }]);
    }
    
    setSearchTerm('');
    toast.success(t('productAdded'));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateVAT = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.15; // 15% VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  const completeSale = () => {
    if (cart.length === 0) {
      toast.error(t('cartEmpty'));
      return;
    }

    const sale = {
      id: `INV-${Date.now()}`,
      date: new Date().toISOString(),
      items: cart,
      subtotal: calculateSubtotal(),
      vat: calculateVAT(),
      discount: 0,
      total: calculateTotal(),
      paymentMethod,
      cashierName: 'المدير',
    };

    // Update stock
    cart.forEach(item => {
      updateStock(item.id, item.quantity);
    });

    addSale(sale);
    
    // Print invoice (simulated)
    printInvoice(sale);
    
    setCart([]);
    loadProducts();
    toast.success(t('saleCompleted'));
  };

  const printInvoice = (sale: any) => {
    // In real application, this would send data to thermal printer
    // For now, we'll just log it
    console.log('Printing invoice:', sale);
    
    // Simulate printer beep sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAo=');
    audio.play().catch(() => {});
  };

  const productName = (product: Product) => {
    return language === 'ar' ? product.nameAr : product.nameEn;
  };

  const categoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return '';
    return language === 'ar' ? category.nameAr : category.nameEn;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Products Section */}
      <div className="flex-1 flex flex-col p-6">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder={t('searchProduct')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredProducts.length > 0) {
                  addToCart(filteredProducts[0]);
                }
              }}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className="whitespace-nowrap"
          >
            {t('all')}
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {language === 'ar' ? category.nameAr : category.nameEn}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <ShoppingCart className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="font-semibold mb-1 line-clamp-2 min-h-[2.5rem]">
                    {productName(product)}
                  </h3>
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {categoryName(product.category)}
                  </Badge>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(product.price)} {t('sar')}
                    </span>
                    <Badge variant={product.stock < 20 ? 'destructive' : 'outline'} className="text-xs">
                      {product.stock}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white border-l shadow-lg flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {t('cart')}
            </div>
            <Badge variant="secondary">
              {cart.length} {cart.length === 1 ? t('item') : t('items')}
            </Badge>
          </CardTitle>
        </CardHeader>

        <ScrollArea className="flex-1 p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart className="h-16 w-16 mb-4" />
              <p>{t('cartEmpty')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <Card key={item.id}>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm flex-1">
                        {productName(item)}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {formatCurrency(item.price)} × {item.quantity}
                        </div>
                        <div className="font-bold text-primary">
                          {formatCurrency(item.price * item.quantity)} {t('sar')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Totals */}
        <div className="border-t p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('subtotal')}</span>
            <span className="font-semibold">{formatCurrency(calculateSubtotal())} {t('sar')}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('vat')} (15%)</span>
            <span className="font-semibold">{formatCurrency(calculateVAT())} {t('sar')}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between text-lg font-bold">
            <span>{t('total')}</span>
            <span className="text-primary">{formatCurrency(calculateTotal())} {t('sar')}</span>
          </div>

          {/* Payment Method */}
          <div className="flex gap-2">
            <Button
              variant={paymentMethod === 'cash' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('cash')}
              className="flex-1"
              size="sm"
            >
              <Banknote className="h-4 w-4 mr-2" />
              {t('cash')}
            </Button>
            <Button
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('card')}
              className="flex-1"
              size="sm"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {t('card')}
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={clearCart}
              disabled={cart.length === 0}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('clearCart')}
            </Button>
            <Button
              onClick={completeSale}
              disabled={cart.length === 0}
              className="flex-1"
            >
              <Calculator className="h-4 w-4 mr-2" />
              {t('completeSale')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
