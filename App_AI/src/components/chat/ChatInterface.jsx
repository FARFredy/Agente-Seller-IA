// src/components/chat/ChatInterface.jsx
import React, { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatInterface() {
  const { messages } = useContext(ChatContext);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <MessageList messages={messages} />
          </div>
          <div className="p-4 border-t border-gray-200">
            <MessageInput />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;