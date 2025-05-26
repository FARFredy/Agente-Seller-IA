// src/components/chat/MessageInput.jsx
import React, { useState, useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';

function MessageInput() {
  const [message, setMessage] = useState('');
  const { sendMessage } = useContext(ChatContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Type your message..."
      />
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Send
      </button>
    </form>
  );
}

export default MessageInput;