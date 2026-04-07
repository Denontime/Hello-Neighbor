import { useEffect, useState } from 'react';
import { ShieldAlert, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import { apiClient } from '../api/client';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const Governance = () => {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/proposals');
      setProposals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id: str, choice: str) => {
    try {
      await apiClient.post(`/proposals/${id}/vote`, { choice });
      alert(`已成功投出: ${choice === 'YES' ? '赞成' : choice === 'NO' ? '反对' : '弃权'}`);
    } catch (err) {
      alert('投票失败，请确保已登录家庭管理员账号。');
    }
  };

  const handleCreateMockProposal = async () => {
    try {
      await apiClient.post('/proposals', {
        communityId: 'demo-community',
        type: 'HIDE_POST',
        target: { type: 'post', id: 'some-post-id' },
        reason: '该帖子内容含有广告营销信息，建议隐藏。',
      });
      fetchProposals();
    } catch (err) {
      alert('创建提案失败');
    }
  };

  return (
    <div className="flex-1 h-full bg-white rounded-r-2xl flex flex-col shadow-xl z-0 overflow-hidden relative">
      <div className="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-sm z-10 shrink-0">
        <div className="flex items-center space-x-4">
          <ShieldAlert size={24} className="text-primary-500" />
          <h1 className="text-xl font-bold text-gray-800">自治大厅</h1>
        </div>
        <button 
          onClick={handleCreateMockProposal}
          className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
        >
          发起治理提案
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30">
        {loading && <div className="text-center text-gray-400 py-10">加载中...</div>}
        {!loading && proposals.length === 0 && (
          <div className="flex flex-col items-center justify-center text-gray-400 py-20 space-y-4">
            <AlertCircle size={48} className="text-gray-300" />
            <p>目前没有进行中的提案</p>
          </div>
        )}

        {proposals.map(prop => (
          <div key={prop.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded">违规隐藏</span>
                  <span className="text-xs text-gray-400">
                    发起于 {prop.created_at ? formatDistanceToNow(new Date(prop.created_at), { addSuffix: true, locale: zhCN }) : '刚刚'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">{prop.reason}</h3>
              </div>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                {prop.status === 'VOTING' ? '投票中' : prop.status}
              </span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>目标: {prop.target_type} ({prop.target_id?.substring(0, 8)}...)</span>
                <span>需要 5 票通过</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => handleVote(prop.id, 'YES')}
                className="flex-1 flex items-center justify-center space-x-2 py-3 bg-white border border-green-200 text-green-600 hover:bg-green-50 rounded-xl transition-colors font-medium"
              >
                <ThumbsUp size={18} />
                <span>同意隐藏</span>
              </button>
              <button 
                onClick={() => handleVote(prop.id, 'NO')}
                className="flex-1 flex items-center justify-center space-x-2 py-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
              >
                <ThumbsDown size={18} />
                <span>反对</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
