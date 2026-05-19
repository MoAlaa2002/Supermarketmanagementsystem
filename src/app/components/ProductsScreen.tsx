import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { Product } from '../types';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../utils/storage';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'sonner';
import { categories } from '../data/sampleData';

export const ProductsScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    barcode: '',
    nameAr: '',
    nameEn: '',
    category: '1',
    price: 0,
    cost: 0,
    stock: 0,
    unit: 'piece',
    vat: 15,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setProducts(getProducts());
  };

  const filteredProducts = products.filter(product =>
    product.barcode.includes(searchTerm) ||
    product.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...formData } as Product);
      toast.success(t('productUpdated'));
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData as Product,
      };
      addProduct(newProduct);
      toast.success(t('productAdded'));
    }
    
    loadProducts();
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟ / Are you sure you want to delete this product?')) {
      deleteProduct(productId);
      loadProducts();
      toast.success(t('productDeleted'));
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      barcode: '',
      nameAr: '',
      nameEn: '',
      category: '1',
      price: 0,
      cost: 0,
      stock: 0,
      unit: 'piece',
      vat: 15,
    });
  };

  const categoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return '';
    return language === 'ar' ? category.nameAr : category.nameEn;
  };

  const productName = (product: Product) => {
    return language === 'ar' ? product.nameAr : product.nameEn;
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('products')}</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('addProduct')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? t('edit') : t('addProduct')}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('barcode')}</Label>
                      <Input
                        value={formData.barcode}
                        onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('category')}</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {language === 'ar' ? category.nameAr : category.nameEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>اسم المنتج (عربي) / Product Name (Arabic)</Label>
                    <Input
                      value={formData.nameAr}
                      onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                      required
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>اسم المنتج (إنجليزي) / Product Name (English)</Label>
                    <Input
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('price')} ({t('sar')})</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('cost')} ({t('sar')})</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('stock')}</Label>
                      <Input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('unit')}</Label>
                      <Select
                        value={formData.unit}
                        onValueChange={(value) => setFormData({ ...formData, unit: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="piece">{t('piece')}</SelectItem>
                          <SelectItem value="kg">{t('kg')}</SelectItem>
                          <SelectItem value="liter">{t('liter')}</SelectItem>
                          <SelectItem value="pack">{t('pack')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      {t('cancel')}
                    </Button>
                    <Button type="submit">
                      {t('save')}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={t('search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('barcode')}</TableHead>
                  <TableHead>{t('productName')}</TableHead>
                  <TableHead>{t('category')}</TableHead>
                  <TableHead>{t('price')}</TableHead>
                  <TableHead>{t('cost')}</TableHead>
                  <TableHead>{t('stock')}</TableHead>
                  <TableHead>{t('unit')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono">{product.barcode}</TableCell>
                    <TableCell className="font-semibold">{productName(product)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{categoryName(product.category)}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)} {t('sar')}</TableCell>
                    <TableCell>{formatCurrency(product.cost)} {t('sar')}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock < 20 ? 'destructive' : 'default'}>
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>{t(product.unit)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
