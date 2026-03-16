import { useEffect, useRef, useState } from 'react';
import api from '../../services/api';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await api.get('/ai/chats');
        setMessages(data.messages || []);
      } catch (error) {
        console.error('Failed to load chat history', error);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message) => {
    const userMessage = { role: 'user', message, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setIsTyping(true);

    try {
      const { data } = await api.post('/ai/chat', { message });
      const aiMessage = { role: 'assistant', message: data.response, createdAt: new Date().toISOString() };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          message: 'Sorry, I could not reach the AI service. Please try again.',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-20">Start a conversation with the AI tutor!</p>
        )}
        {messages.map((msg, idx) => (
          <MessageBubble key={`${msg.role}-${idx}-${msg.createdAt}`} role={msg.role} message={msg.message} />
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl animate-pulse">AI is typing...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t p-4">
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
};

export default ChatWindow;
