import { RouterProvider } from 'react-router';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from './components/ui/sonner';
import { router } from './routes';

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </LanguageProvider>
  );
}
