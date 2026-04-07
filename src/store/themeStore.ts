import { create } from 'zustand';

type Theme = 'purple' | 'green' | 'blue' | 'orange';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'purple',
  setTheme: (theme) => {
    // Remove previous theme class
    document.documentElement.classList.remove('theme-purple', 'theme-green', 'theme-blue', 'theme-orange');
    // Add new theme class if not default
    if (theme !== 'purple') {
      document.documentElement.classList.add(`theme-${theme}`);
    }
    set({ theme });
  },
}));
