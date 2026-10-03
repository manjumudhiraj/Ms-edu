import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStore, updateStore } from '@/store/useStore';
import { PageHeader, SectionCard } from '@/components/ui';
import { Send, MessageSquare, GraduationCap } from 'lucide-react';
import type { Message } from '@/types';

export default function ParentMessages() {
  const { user } = useAuth();
  const { data } = useStore();
  const child = data.students.find((s) => s.id === user?.childId) || data.students[0];

  const childMessages = data.messages.filter((m) => m.studentId === child.id);
  const [reply, setReply] = useState('');

  const sendReply = () => {
    if (!reply.trim()) return;
    const newMsg: Message = {
      id: `M${Date.now()}`,
      from: user?.name || 'Parent',
      to: 'Ms. Lakshmi Iyer',
      fromRole: 'parent',
      toRole: 'teacher',
      content: reply,
      date: new Date().toISOString().split('T')[0],
      studentId: child.id,
    };
    updateStore((d) => { d.messages.push(newMsg); });
    setReply('');
  };

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Messages" subtitle="Conversation with your child's teacher" />

      <div className="card p-0 overflow-hidden flex flex-col" style={{ maxHeight: '70vh' }}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-edu-blue to-edu-cyan flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy-800">Ms. Lakshmi Iyer</p>
            <p className="text-xs text-gray-400">Class Teacher · 8-A</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
          {childMessages.map((msg) => {
            const isParent = msg.fromRole === 'parent';
            return (
              <div key={msg.id} className={`flex ${isParent ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${isParent ? 'bg-edu-blue text-white rounded-br-md' : 'bg-gray-100 text-navy-800 rounded-bl-md'}`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isParent ? 'text-blue-100' : 'text-gray-400'}`}>{msg.date}</p>
                </div>
              </div>
            );
          })}
          {childMessages.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No messages yet</p>
            </div>
          )}
        </div>

        {/* Reply input */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendReply()}
              placeholder="Type your reply..."
              className="input-field flex-1"
            />
            <button onClick={sendReply} disabled={!reply.trim()} className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
