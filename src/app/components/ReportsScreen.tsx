import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Package, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useLanguage } from '../contexts/LanguageContext';
import { getSales, getProducts } from '../utils/storage';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sale, Product } from '../types';

export const ReportsScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSales(getSales());
    setProducts(getProducts());
  };

  // Calculate today's sales
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);

  // Calculate total profit
  const totalProfit = sales.reduce((sum, sale) => {
    const saleProfit = sale.items.reduce((itemSum, item) => {
      return itemSum + ((item.price - item.cost) * item.quantity);
    }, 0);
    return sum + saleProfit;
  }, 0);

  // Low stock products
  const lowStockProducts = products.filter(p => p.stock < 20);

  // Sales over time (last 7 days)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split('T')[0],
        dateDisplay: date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        revenue: 0,
        transactions: 0,
      });
    }
    return days;
  };

  const salesOverTime = getLast7Days().map(day => {
    const daySales = sales.filter(sale => sale.date.split('T')[0] === day.date);
    return {
      ...day,
      revenue: daySales.reduce((sum, sale) => sum + sale.total, 0),
      transactions: daySales.length,
    };
  });

  // Top selling products
  const productSales = new Map<string, { product: Product; quantity: number; revenue: number }>();
  
  sales.forEach(sale => {
    sale.items.forEach(item => {
      const existing = productSales.get(item.id);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
      } else {
        productSales.set(item.id, {
          product: item as Product,
          quantity: item.quantity,
          revenue: item.price * item.quantity,
        });
      }
    });
  });

  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  const productName = (product: Product) => {
    return language === 'ar' ? product.nameAr : product.nameEn;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t('reports')}</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('todaySales')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(todayRevenue)} {t('sar')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {todaySales.length} {t('transactions')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalProfit')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalProfit)} {t('sar')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {sales.length} {t('totalSales')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('lowStock')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('productsNeedReorder')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">{t('salesReport')}</TabsTrigger>
          <TabsTrigger value="products">{t('topProducts')}</TabsTrigger>
          <TabsTrigger value="inventory">{t('inventoryReport')}</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('salesOverTime')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateDisplay" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    name={t('revenue')}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('recentSales')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('invoiceNumber')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                    <TableHead>{t('time')}</TableHead>
                    <TableHead>{t('items')}</TableHead>
                    <TableHead>{t('total')}</TableHead>
                    <TableHead>{t('payment')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.slice(-10).reverse().map(sale => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-mono">{sale.id}</TableCell>
                      <TableCell>{formatDate(sale.date, language)}</TableCell>
                      <TableCell>{formatTime(sale.date, language)}</TableCell>
                      <TableCell>
                        <Badge>{sale.items.length}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(sale.total)} {t('sar')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{t(sale.paymentMethod)}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('topProducts')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey={(item) => productName(item.product)} 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name={t('revenue')} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('productPerformance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('productName')}</TableHead>
                    <TableHead>{t('quantity')}</TableHead>
                    <TableHead>{t('revenue')}</TableHead>
                    <TableHead>{t('profit')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((item, index) => {
                    const profit = (item.product.price - item.product.cost) * item.quantity;
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-semibold">
                          {productName(item.product)}
                        </TableCell>
                        <TableCell>
                          <Badge>{item.quantity}</Badge>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(item.revenue)} {t('sar')}
                        </TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          {formatCurrency(profit)} {t('sar')}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('lowStock')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('barcode')}</TableHead>
                    <TableHead>{t('productName')}</TableHead>
                    <TableHead>{t('currentStock')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono">{product.barcode}</TableCell>
                      <TableCell className="font-semibold">
                        {productName(product)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">{product.stock}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">{t('reorderNow')}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('inventoryValue')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-lg font-semibold">{t('totalProducts')}</span>
                  <span className="text-2xl font-bold">{products.length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-lg font-semibold">{t('totalStockValue')}</span>
                  <span className="text-2xl font-bold">
                    {formatCurrency(products.reduce((sum, p) => sum + (p.price * p.stock), 0))} {t('sar')}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-lg font-semibold">{t('totalCostValue')}</span>
                  <span className="text-2xl font-bold">
                    {formatCurrency(products.reduce((sum, p) => sum + (p.cost * p.stock), 0))} {t('sar')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
