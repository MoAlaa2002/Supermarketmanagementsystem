import React, { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { ShoppingCart, Package, BarChart3, Settings, Languages } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { initializeStorage } from '../utils/storage';

export const RootLayout: React.FC = () => {
  const location = useLocation();
  const { t, toggleLanguage, language } = useLanguage();

  useEffect(() => {
    initializeStorage();
  }, []);

  const navigation = [
    { path: '/', icon: ShoppingCart, label: t('pos') },
    { path: '/products', icon: Package, label: t('products') },
    { path: '/reports', icon: BarChart3, label: t('reports') },
    { path: '/settings', icon: Settings, label: t('settings') },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">
                {language === 'ar' ? 'سوبر ماركت المدينة' : 'City Supermarket'}
              </h1>
              <p className="text-xs opacity-90">
                {language === 'ar' ? 'نظام نقاط البيع' : 'Point of Sale System'}
              </p>
            </div>
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleLanguage}
            className="gap-2"
          >
            <Languages className="h-4 w-4" />
            {language === 'ar' ? 'English' : 'العربية'}
          </Button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b shadow-sm">
        <div className="flex gap-2 px-6 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={active ? 'default' : 'ghost'}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};
