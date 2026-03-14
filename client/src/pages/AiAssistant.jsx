import { useState } from 'react';
import ChatWindow from '../features/ai-assistant/components/ChatWindow';

const AiAssistant = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">AI Assistant</h1>
      <ChatWindow />
    </div>
  );
};

export default AiAssistant;
