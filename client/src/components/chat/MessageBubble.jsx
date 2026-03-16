import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageBubble = ({ role, message }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] whitespace-pre-wrap break-words px-4 py-3 rounded-xl shadow-sm ${
          isUser ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'
        }`}
      >
        {isUser ? (
          <span>{message}</span>
        ) : (
          <div className="prose prose-sm prose-slate">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
