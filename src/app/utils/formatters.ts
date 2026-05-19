export const formatCurrency = (amount: number): string => {
  return amount.toFixed(2);
};

export const formatDate = (date: string, language: 'ar' | 'en'): string => {
  const d = new Date(date);
  return d.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');
};

export const formatTime = (date: string, language: 'ar' | 'en'): string => {
  const d = new Date(date);
  return d.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date: string, language: 'ar' | 'en'): string => {
  return `${formatDate(date, language)} ${formatTime(date, language)}`;
};
