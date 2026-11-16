import React, { useState, useEffect } from 'react';
import { SupportConversation, SupportMessage } from '../../types';
import { PortalService } from '../../services/portalService';
import { MessageSquare, Send, User, CheckCircle2, RefreshCw, Clock } from 'lucide-react';

export const AdminSupportChatManager: React.FC = () => {
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<SupportConversation | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadConversations = async () => {
    setLoading(true);
    const list = await PortalService.getAllAdminConversations();
    setConversations(list);
    if (list.length > 0 && !selectedConv) {
      setSelectedConv(list[0]);
      PortalService.getMessages(list[0].id).then(setMessages);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const handleSelectConv = (conv: SupportConversation) => {
    setSelectedConv(conv);
    PortalService.getMessages(conv.id).then(setMessages);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !replyText.trim()) return;

    setSending(true);
    try {
      const msg = await PortalService.sendMessage(selectedConv.id, {
        senderId: 'admin_concierge',
        senderName: 'MOS MOS Expedition Concierge',
        senderRole: 'admin',
        message: replyText.trim()
      });
      setMessages(prev => [...prev, msg]);
      setReplyText('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white border border-[#D9D0C2] rounded-sm shadow-sm overflow-hidden flex flex-col md:flex-row h-[620px]">
      {/* Conversations Sidebar */}
      <div className="w-full md:w-80 border-r border-[#D9D0C2] flex flex-col bg-[#F7F4ED]/40">
        <div className="p-4 border-b border-[#D9D0C2] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#78634B]" />
            <h3 className="font-serif text-base font-semibold text-[#20221F]">
              Patron Inbox
            </h3>
          </div>
          <button
            onClick={loadConversations}
            className="p-1 text-gray-500 hover:text-[#78634B] cursor-pointer"
            title="Refresh conversations"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#D9D0C2]/50">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#20221F]/50 italic">
              No customer message threads yet.
            </div>
          ) : (
            conversations.map((conv) => {
              const isSelected = selectedConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConv(conv)}
                  className={`p-4 transition-colors cursor-pointer ${
                    isSelected ? 'bg-white border-l-4 border-[#78634B]' : 'hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-xs text-[#20221F] truncate">
                      {conv.customerName}
                    </span>
                    <span className="text-[10px] text-[#20221F]/40 font-mono">
                      {new Date(conv.lastMessageAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#78634B] block mb-1">
                    {conv.customerEmail}
                  </span>
                  <p className="text-xs text-[#20221F]/60 line-clamp-1 font-light">
                    {conv.lastMessageSnippet}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Messages Thread Pane */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConv ? (
          <>
            {/* Conversation Header */}
            <div className="p-4 border-b border-[#D9D0C2] bg-[#20221F] text-white flex items-center justify-between">
              <div>
                <h4 className="font-serif text-lg font-light text-white">
                  {selectedConv.customerName}
                </h4>
                <p className="text-xs text-[#B69A68]">
                  {selectedConv.customerEmail}
                  {selectedConv.bookingReference && ` · Ref: ${selectedConv.bookingReference}`}
                </p>
              </div>
              <span className="px-2.5 py-1 bg-white/10 text-[10px] uppercase tracking-wider text-white/80 rounded">
                Active Thread
              </span>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#F7F4ED]/20">
              {messages.map((m) => {
                const isAdmin = m.senderRole === 'admin';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-[10px] text-[#20221F]/50">
                      <span className="font-medium text-[#20221F]">
                        {isAdmin ? 'Concierge Team' : selectedConv.customerName}
                      </span>
                      <span>·</span>
                      <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div
                      className={`max-w-[80%] p-3.5 text-xs leading-relaxed rounded-sm ${
                        isAdmin
                          ? 'bg-[#78634B] text-white rounded-br-none'
                          : 'bg-white border border-[#D9D0C2] text-[#20221F] shadow-sm rounded-bl-none'
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Bar */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-[#D9D0C2] bg-white flex gap-3">
              <input
                type="text"
                placeholder="Reply directly to customer as Safari Concierge..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-4 py-2 bg-[#F7F4ED] border border-[#D9D0C2] text-xs text-[#20221F] focus:outline-none focus:border-[#78634B]"
              />
              <button
                type="submit"
                disabled={sending || !replyText.trim()}
                className="px-6 py-2 bg-[#20221F] hover:bg-[#78634B] text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-[#20221F]/50">
            Select a conversation thread from the sidebar to inspect and reply.
          </div>
        )}
      </div>
    </div>
  );
};
