import { Search, User, MessageSquare, Phone, MoreHorizontal, PenSquare } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import clsx from 'clsx';

export const Sidebar = () => {
  const { theme, setTheme } = useThemeStore();
  
  const users = [
    { id: 1, name: '张三家', status: '在线', time: '刚刚', unread: 2, avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: '李四的妻子', status: '离线', time: '12:35 AM', unread: 1, avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: '王五家大宝', status: '离线', time: '11:48 PM', unread: 0, avatar: 'https://i.pravatar.cc/150?u=3' },
  ];

  return (
    <div className="w-80 h-full bg-sidebar-bg text-sidebar-text flex flex-col relative shadow-xl rounded-l-2xl z-10">
      
      {/* Floating Action Button */}
      <button className="absolute -left-5 top-8 w-12 h-12 bg-primary-600 rounded-full shadow-lg shadow-primary-500/50 flex items-center justify-center hover:scale-105 transition-transform z-20">
        <PenSquare size={20} className="text-white" />
      </button>

      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6 pl-4">
          <div className="flex items-center space-x-3">
            <img src="https://i.pravatar.cc/150?u=me" alt="Me" className="w-10 h-10 rounded-full border-2 border-primary-500" />
            <div>
              <h2 className="font-semibold text-sm">我 (家庭管理员)</h2>
              <span className="text-xs text-primary-400">在线</span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-white">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="搜索邻居或板块..." 
            className="w-full bg-sidebar-hover text-sm text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder-gray-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2">系统板块</h3>
        <div className="space-y-1 mb-6">
           <div className="p-3 rounded-xl cursor-pointer transition-colors bg-sidebar-hover border-l-4 border-primary-500">
             <div className="flex justify-between items-center">
               <h4 className="font-medium text-sm text-white">约饭</h4>
               <span className="text-xs text-gray-400">活跃</span>
             </div>
           </div>
           <div className="p-3 rounded-xl cursor-pointer hover:bg-sidebar-hover transition-colors border-l-4 border-transparent">
             <div className="flex justify-between items-center">
               <h4 className="font-medium text-sm text-gray-300">帮带娃</h4>
             </div>
           </div>
        </div>

        <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2">邻居列表</h3>
        <div className="space-y-1">
          {users.map(u => (
            <div key={u.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-sidebar-hover cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full" />
                  {u.status === '在线' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-sidebar-bg rounded-full"></div>}
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-200">{u.name}</h4>
                  <p className="text-xs text-gray-400 truncate w-24">打个招呼吧...</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 mb-1">{u.time}</span>
                {u.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center">
                    {u.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-700/50 flex justify-between items-center px-8">
        <button className="text-gray-400 hover:text-primary-400 transition-colors"><User size={20} /></button>
        <button className="text-primary-400 relative">
          <MessageSquare size={20} />
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-400 rounded-full"></div>
        </button>
        <button className="text-gray-400 hover:text-primary-400 transition-colors"><Phone size={20} /></button>
      </div>
      
      {/* Theme Switcher */}
      <div className="absolute -left-12 bottom-10 flex flex-col space-y-4 z-50">
        <button onClick={() => setTheme('purple')} className={clsx("w-6 h-6 rounded-full bg-purple-500 shadow-md hover:scale-110 transition-transform cursor-pointer", theme === 'purple' && "ring-2 ring-white ring-offset-2 ring-offset-sidebar-bg")}></button>
        <button onClick={() => setTheme('green')} className={clsx("w-6 h-6 rounded-full bg-green-500 shadow-md hover:scale-110 transition-transform cursor-pointer", theme === 'green' && "ring-2 ring-white ring-offset-2 ring-offset-sidebar-bg")}></button>
        <button onClick={() => setTheme('blue')} className={clsx("w-6 h-6 rounded-full bg-blue-500 shadow-md hover:scale-110 transition-transform cursor-pointer", theme === 'blue' && "ring-2 ring-white ring-offset-2 ring-offset-sidebar-bg")}></button>
        <button onClick={() => setTheme('orange')} className={clsx("w-6 h-6 rounded-full bg-orange-500 shadow-md hover:scale-110 transition-transform cursor-pointer", theme === 'orange' && "ring-2 ring-white ring-offset-2 ring-offset-sidebar-bg")}></button>
      </div>

    </div>
  );
}
