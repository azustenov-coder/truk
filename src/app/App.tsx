import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider } from './providers/ThemeProvider';
import { FilterProvider } from './providers/FilterProvider';
import { AuthProvider } from './providers/AuthProvider';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FilterProvider>
          <RouterProvider router={router} />
        </FilterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
