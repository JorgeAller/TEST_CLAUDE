import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'dashboard-widget-order';

const DEFAULT_WIDGETS = ['stats', 'highlights', 'featured'];

export function useDashboardLayout() {
  const [widgets, setWidgets] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as string[];
        // Ensure all default widgets are present
        const valid = parsed.filter((w) => DEFAULT_WIDGETS.includes(w));
        const missing = DEFAULT_WIDGETS.filter((w) => !valid.includes(w));
        return [...valid, ...missing];
      }
    } catch {
      // ignore parse errors
    }
    return DEFAULT_WIDGETS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
  }, [widgets]);

  const reorderWidgets = useCallback((oldIndex: number, newIndex: number) => {
    setWidgets((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, removed);
      return updated;
    });
  }, []);

  return { widgets, reorderWidgets };
}
