import { Sidebar } from './components/layout/Sidebar';
import { MainView } from './components/layout/MainView';
import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';

function App() {
  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    // Apply initial theme on mount
    if (theme !== 'purple') {
      document.documentElement.classList.add(`theme-${theme}`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-8 pl-16">
      <div className="w-full max-w-[1200px] h-[800px] flex shadow-2xl rounded-2xl overflow-visible ring-1 ring-gray-900/5 bg-white relative">
        <Sidebar />
        <MainView />
      </div>
    </div>
  );
}

export default App;
