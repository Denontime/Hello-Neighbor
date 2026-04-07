import { useState } from 'react';
import { Paperclip, Smile, Mic, Send, MoreVertical, Video, Users } from 'lucide-react';
import clsx from 'clsx';

export const MainView = () => {
  const [message, setMessage] = useState('');
  
  const messages = [
    { id: 1, text: '各位邻居，这周末有人想一起在小区楼下烧烤吗？', sender: 'Ana', time: '09:23 AM', avatar: 'https://i.pravatar.cc/150?u=4', isMe: false },
    { id: 2, text: '好主意！算我们家一个。', sender: 'Me', time: '09:24 AM', avatar: 'https://i.pravatar.cc/150?u=me', isMe: true },
    { id: 3, text: '带上我们家的狗可以吗？它很乖。', sender: 'Mario', time: '09:25 AM', avatar: 'https://i.pravatar.cc/150?u=5', isMe: false, isAudio: true, duration: '01:18' },
    { id: 4, text: '哈哈没问题，不过要牵好绳子哦！', sender: 'Me', time: '09:26 AM', avatar: 'https://i.pravatar.cc/150?u=me', isMe: true },
    { id: 5, text: '那我们准备一些水果和饮料吧。', sender: 'Ana', time: '09:27 AM', avatar: 'https://i.pravatar.cc/150?u=4', isMe: false },
    { id: 6, text: '太棒了，大家分工合作！\n具体时间是周六下午5点吗？', sender: 'Me', time: '09:29 AM', avatar: 'https://i.pravatar.cc/150?u=me', isMe: true },
  ];

  return (
    <div className="flex-1 h-full bg-white rounded-r-2xl flex flex-col shadow-xl z-0 overflow-hidden relative">
      
      {/* Header */}
      <div className="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-sm z-10">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-800">约饭 (Dinner)</h1>
          <div className="flex -space-x-2">
            <img src="https://i.pravatar.cc/150?u=4" className="w-8 h-8 rounded-full border-2 border-white" />
            <img src="https://i.pravatar.cc/150?u=5" className="w-8 h-8 rounded-full border-2 border-white" />
            <img src="https://i.pravatar.cc/150?u=6" className="w-8 h-8 rounded-full border-2 border-white" />
            <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-100 text-primary-600 text-xs flex items-center justify-center font-medium">+12</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-gray-400">
          <button className="hover:text-primary-500 transition-colors"><Users size={20} /></button>
          <button className="hover:text-primary-500 transition-colors"><Video size={20} /></button>
          <button className="hover:text-primary-500 transition-colors"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30">
        {messages.map((msg, idx) => (
          <div key={msg.id} className={clsx("flex items-end space-x-3", msg.isMe ? "justify-end" : "justify-start")}>
            {!msg.isMe && <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full mb-1" />}
            
            <div className={clsx("flex flex-col", msg.isMe ? "items-end" : "items-start")}>
              <div className={clsx(
                "max-w-md p-4 rounded-2xl shadow-sm",
                msg.isMe 
                  ? "bg-primary-500 text-white rounded-br-sm" 
                  : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
              )}>
                {msg.isAudio ? (
                  <div className="flex items-center space-x-3 min-w-[200px]">
                    <button className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-current border-b-4 border-b-transparent ml-1"></div>
                    </button>
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-primary-500"></div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{msg.duration}</span>
                    <Mic size={16} className="text-gray-400" />
                  </div>
                ) : (
                  <p className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 mt-1 text-xs text-gray-400">
                {!msg.isMe && <span>{msg.sender} • </span>}
                <span>{msg.time}</span>
                {msg.isMe && <span className="text-green-500 font-bold ml-1">✓</span>}
              </div>
            </div>

            {msg.isMe && <img src={msg.avatar} alt="Me" className="w-8 h-8 rounded-full mb-1" />}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-50">
        <div className="flex items-center space-x-4 bg-gray-50 rounded-full px-6 py-3 shadow-inner">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入消息或回复邻居..." 
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400"
          />
          <div className="flex items-center space-x-3 text-gray-400">
            <button className="hover:text-primary-500 transition-colors"><Paperclip size={20} /></button>
            <button className="hover:text-primary-500 transition-colors"><Smile size={20} /></button>
            {message ? (
              <button className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-md shadow-primary-500/30 hover:bg-primary-600 transition-colors">
                <Send size={16} className="ml-1" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
      
    </div>
  );
}
