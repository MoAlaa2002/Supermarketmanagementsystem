import React, { useRef } from 'react';
import { Download, Upload, Languages, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { useLanguage } from '../contexts/LanguageContext';
import { exportData, importData } from '../utils/storage';
import { toast } from 'sonner';

export const SettingsScreen: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportData();
    toast.success(language === 'ar' ? 'تم تحميل النسخة الاحتياطية' : 'Backup downloaded successfully');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importData(file);
      toast.success(language === 'ar' ? 'تمت استعادة البيانات بنجاح' : 'Data restored successfully');
      window.location.reload();
    } catch (error) {
      toast.error(language === 'ar' ? 'فشلت عملية الاستعادة' : 'Failed to restore data');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t('settings')}</h1>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* Language Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              <CardTitle>{t('language')}</CardTitle>
            </div>
            <CardDescription>
              {language === 'ar' 
                ? 'اختر لغة النظام المفضلة'
                : 'Choose your preferred system language'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={language === 'ar' ? 'default' : 'outline'}
                onClick={toggleLanguage}
                className="flex-1"
              >
                العربية
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                onClick={toggleLanguage}
                className="flex-1"
              >
                English
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Backup & Restore */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>{t('backup')}</CardTitle>
            </div>
            <CardDescription>
              {language === 'ar'
                ? 'قم بحفظ واستعادة بيانات النظام'
                : 'Save and restore your system data'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t('downloadBackup')}</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {language === 'ar'
                  ? 'تحميل نسخة احتياطية من جميع المنتجات والمبيعات'
                  : 'Download a backup of all products and sales data'
                }
              </p>
              <Button onClick={handleExport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                {t('downloadBackup')}
              </Button>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">{t('uploadBackup')}</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {language === 'ar'
                  ? 'استعادة البيانات من ملف النسخ الاحتياطي'
                  : 'Restore data from a backup file'
                }
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                {t('uploadBackup')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('systemSettings')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {t('storeName')}
                </p>
                <p className="text-lg font-semibold">
                  {language === 'ar' ? 'سوبر ماركت المدينة' : 'City Supermarket'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {t('vatRate')}
                </p>
                <p className="text-lg font-semibold">15%</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {t('currency')}
                </p>
                <p className="text-lg font-semibold">
                  {language === 'ar' ? 'ريال سعودي (SAR)' : 'Saudi Riyal (SAR)'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {language === 'ar' ? 'نظام التشغيل' : 'Operating System'}
                </p>
                <p className="text-lg font-semibold">Windows 11 Pro</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold">
                {language === 'ar' ? 'الأجهزة الطرفية' : 'Peripheral Devices'}
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span>
                    {language === 'ar' 
                      ? 'طابعة فواتير Epson TM-T20III' 
                      : 'Epson TM-T20III Receipt Printer'
                    }
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span>
                    {language === 'ar'
                      ? 'قارئ باركود Honeywell Voyager'
                      : 'Honeywell Voyager Barcode Scanner'
                    }
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span>
                    {language === 'ar'
                      ? 'ميزان إلكتروني CAS'
                      : 'CAS Electronic Scale'
                    }
                  </span>
                </li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                {language === 'ar'
                  ? '* الحالة: محاكاة - في بيئة الإنتاج سيتم الاتصال بالأجهزة الفعلية'
                  : '* Status: Simulated - In production, actual devices will be connected'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ar' ? 'حول النظام' : 'About System'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">
                {language === 'ar' ? 'الإصدار:' : 'Version:'}
              </span>{' '}
              1.0.0
            </p>
            <p>
              <span className="font-semibold">
                {language === 'ar' ? 'التطوير:' : 'Development:'}
              </span>{' '}
              {language === 'ar' ? 'نظام نقاط البيع المتقدم' : 'Advanced POS System'}
            </p>
            <p className="text-muted-foreground pt-2">
              {language === 'ar'
                ? 'نظام متكامل لإدارة نقاط البيع مصمم خصيصاً للسوبر ماركت مع دعم كامل للغتين العربية والإنجليزية'
                : 'Complete POS management system designed specifically for supermarkets with full Arabic and English support'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
