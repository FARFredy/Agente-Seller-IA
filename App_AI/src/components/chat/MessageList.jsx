// src/components/chat/MessageList.jsx
import React from 'react';

function MessageList({ messages }) {
  return (
    <div className="space-y-4 p-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-xs md:max-w-md p-3 rounded-lg ${
              message.sender === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-900'
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <span className="text-xs opacity-75 mt-1 block">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;