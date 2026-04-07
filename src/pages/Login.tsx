import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        
        const res = await apiClient.post('/auth/login', formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        localStorage.setItem('token', res.data.access_token);
        navigate('/app/boards/DINNER');
      } else {
        await apiClient.post('/auth/register', { username, password });
        setIsLogin(true); // Switch to login after register
        setError('注册成功，请登录！');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || '操作失败，请检查输入。');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">邻居，你好！</h1>
          <p className="text-gray-500">远亲不如近邻，欢迎回到社区。</p>
        </div>

        {error && (
          <div className={`p-3 mb-6 rounded-lg text-sm ${error.includes('成功') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 focus:bg-white transition-colors"
              placeholder="请输入用户名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 focus:bg-white transition-colors"
              placeholder="请输入密码"
            />
          </div>
          
          <button type="submit" className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-lg shadow-primary-500/30 transition-all hover:shadow-primary-500/50 active:scale-[0.98]">
            {isLogin ? '登 录' : '注 册'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500">
            {isLogin ? '还没有家庭账号？' : '已有家庭账号？'}
          </span>
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            className="ml-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            {isLogin ? '立即注册创建' : '直接登录'}
          </button>
        </div>
      </div>
    </div>
  );
};
