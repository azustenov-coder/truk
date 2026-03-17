import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Send, 
  Search, 
  User, 
  MoreVertical,
  Phone,
  Video,
  Info,
  Circle
} from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { useTranslation } from 'react-i18next';

export function ChatPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: users } = useQuery({
    queryKey: ['users-list'],
    queryFn: async () => {
      const res = await axios.get('/api/users');
      return res.data;
    },
    refetchInterval: 3000 // Poll for unread counts every 3 seconds
  });

  const { data: messages } = useQuery({
    queryKey: ['messages', user?.id, selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser) return [];
      const res = await axios.get(`/api/messages/${user?.id}?otherUserId=${selectedUser?.id}`);
      return res.data;
    },
    enabled: !!selectedUser,
    refetchInterval: 3000 // Poll for new messages every 3 seconds
  });

  const sendMessageMutation = useMutation({
    mutationFn: (newMsg: any) => axios.post('/api/messages', newMsg),
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', user?.id, selectedUser?.id] });
    }
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;
    sendMessageMutation.mutate({
      sender_id: user?.id,
      receiver_id: selectedUser.id,
      content: message
    });
  };

  return (
    <div className="flex h-full bg-white dark:bg-[#0F172A] overflow-hidden">
      {/* Sidebar / User List */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50/30 dark:bg-gray-900/10">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Chat</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              placeholder="Foydalanuvchi qidirish..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      <div className="flex-1 overflow-y-auto">
          {users?.filter((u: any) => u.id !== user?.id).map((u: any) => (
            <div 
              key={u.id}
              onClick={() => {
                setSelectedUser(u);
                // Mark as read immediately in UI if needed, or query invalidation will handle it
              }}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-800/50 ${selectedUser?.id === u.id ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-600' : ''}`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shadow-sm">
                  {u.full_name[0]}
                </div>
                <Circle size={10} className="absolute bottom-0 right-0 text-green-500 fill-green-500 border-2 border-white dark:border-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{u.full_name}</h4>
                  {u.unread_count > 0 && (
                    <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-sm animate-pulse">
                      {u.unread_count}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate uppercase tracking-tighter font-bold">{u.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#0F172A] relative">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white/50 dark:bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {selectedUser.full_name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{selectedUser.full_name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Circle size={8} className="text-green-500 fill-green-500" />
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest ">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <Phone size={18} className="hover:text-blue-600 cursor-pointer transition-colors" />
                <Video size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>
                <Info size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
                <MoreVertical size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
            >
              {messages?.map((msg: any) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex flex-col max-w-[70%] ${msg.sender_id === user?.id ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
                        {msg.sender_id === user?.id ? 'Siz' : (msg.sender_name || 'Admin')}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border ${
                        (msg.sender_role || 'ADMIN') === 'ADMIN' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                        (msg.sender_role || 'ADMIN') === 'DISPATCHER' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-green-100 text-green-700 border-green-200'
                      }`}>
                        {msg.sender_role || 'ADMIN'}
                      </span>
                    </div>

                    <div className={`rounded-2xl p-3 shadow-sm ${
                      msg.sender_id === user?.id 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none'
                    }`}>
                      <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                      <p className={`text-[9px] mt-1.5 opacity-70 font-bold ${msg.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <input 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Xabar yozing..."
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <button 
                  type="submit"
                  disabled={!message.trim()}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-90 shadow-lg shadow-blue-500/20"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
              <User size={32} />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest italic opacity-50">Muloqot qilish uchun foydalanuvchini tanlang</p>
          </div>
        )}
      </div>
    </div>
  );
}
