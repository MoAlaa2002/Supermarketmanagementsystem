import { createHashRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { POSScreen } from './components/POSScreen';
import { ProductsScreen } from './components/ProductsScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { SettingsScreen } from './components/SettingsScreen';

export const router = createHashRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: POSScreen,
      },
      {
        path: 'products',
        Component: ProductsScreen,
      },
      {
        path: 'reports',
        Component: ReportsScreen,
      },
      {
        path: 'settings',
        Component: SettingsScreen,
      },
    ],
  },
]);
