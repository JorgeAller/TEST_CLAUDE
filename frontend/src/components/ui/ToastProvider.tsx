import { Toaster } from 'sonner';
import { useThemeMode } from '@/theme/ThemeProvider';

export function ToastProvider() {
  const { mode } = useThemeMode();

  return (
    <Toaster
      theme={mode}
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          fontFamily: 'DM Sans, sans-serif',
        },
      }}
    />
  );
}
