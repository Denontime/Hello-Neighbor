import { Sidebar } from '../components/layout/Sidebar';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

export const Layout = () => {
  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    if (theme !== 'purple') {
      document.documentElement.classList.add(`theme-${theme}`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-8 pl-16 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="w-full max-w-[1200px] h-[800px] flex shadow-2xl rounded-2xl overflow-visible ring-1 ring-gray-900/5 bg-white relative z-10">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};
