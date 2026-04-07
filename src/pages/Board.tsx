import { useEffect, useState } from 'react';
import { Paperclip, Smile, Mic, Send, MoreVertical, Video, Users } from 'lucide-react';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import { apiClient } from '../api/client';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const Board = () => {
  const { boardId } = useParams();
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [boardId]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/posts?boardCode=${boardId}`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      await apiClient.post('/posts', {
        communityId: 'demo-community',
        boardCode: boardId || 'DINNER',
        title: 'New Post',
        content: message,
      });
      setMessage('');
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert('发送失败，请确保已登录。');
    }
  };

  return (
    <div className="flex-1 h-full bg-white rounded-r-2xl flex flex-col shadow-xl z-0 overflow-hidden relative">
      
      {/* Header */}
      <div className="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-sm z-10 shrink-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-800">
            {boardId === 'DINNER' ? '约饭' : boardId === 'BABYSIT' ? '帮带娃' : boardId === 'GOVERNANCE' ? '自治提案' : boardId}
          </h1>
          <div className="flex -space-x-2">
            <img src="https://i.pravatar.cc/150?u=4" className="w-8 h-8 rounded-full border-2 border-white" />
            <img src="https://i.pravatar.cc/150?u=5" className="w-8 h-8 rounded-full border-2 border-white" />
            <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-100 text-primary-600 text-xs flex items-center justify-center font-medium">+12</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-gray-400">
          <button className="hover:text-primary-500 transition-colors"><Users size={20} /></button>
          <button className="hover:text-primary-500 transition-colors"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30">
        {loading && <div className="text-center text-gray-400 text-sm py-10">加载中...</div>}
        {!loading && posts.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-10">暂无帖子，来发第一条吧！</div>
        )}
        
        {posts.map((post, idx) => (
          <div key={post.id} className={clsx("flex items-end space-x-3", "justify-start")}>
            <img src={`https://i.pravatar.cc/150?u=${post.author_user_id}`} alt="User" className="w-8 h-8 rounded-full mb-1" />
            
            <div className="flex flex-col items-start">
              <div className="max-w-md p-4 rounded-2xl shadow-sm bg-white text-gray-800 rounded-bl-sm border border-gray-100">
                <p className="whitespace-pre-line text-sm leading-relaxed">{post.content}</p>
              </div>
              
              <div className="flex items-center space-x-2 mt-1 text-xs text-gray-400">
                <span>邻居 • </span>
                <span>{post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: zhCN }) : '刚刚'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-50 shrink-0">
        <div className="flex items-center space-x-4 bg-gray-50 rounded-full px-6 py-3 shadow-inner">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入消息或发帖..." 
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400"
          />
          <div className="flex items-center space-x-3 text-gray-400">
            <button className="hover:text-primary-500 transition-colors"><Paperclip size={20} /></button>
            <button className="hover:text-primary-500 transition-colors"><Smile size={20} /></button>
            <button 
              onClick={handleSend}
              disabled={!message.trim()}
              className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                message.trim() ? "bg-primary-500 text-white shadow-md shadow-primary-500/30 hover:bg-primary-600" : "bg-gray-200 text-white cursor-not-allowed"
              )}
            >
              <Send size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};
