// src/components/chat/ChatInterface.jsx
import React, { useState, useEffect } from 'react';
import { sendMessage, getConversationHistory } from '../../services/aiService';

// IDs fijos de prueba
const CONVERSATION_ID = 'c0000000-0000-0000-0000-000000000001';
const AGENT_ID = 'b0000000-0000-0000-0000-000000000001';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  // Cargar historial al abrir el chat
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getConversationHistory(CONVERSATION_ID);
        setMessages(history);
      } catch (err) {
        setError('No se pudo cargar el historial.');
      }
    };
    loadHistory();
  }, []);

  // Enviar mensaje y recibir respuesta de Luna
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;

    // 1. Mostrar mensaje del usuario inmediatamente
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setError(null);

    try {
      // 2. Llamar al backend
      const response = await sendMessage({
        conversationId: CONVERSATION_ID,
        message: text,
        agentId: AGENT_ID,
      });

      // 3. Agregar respuesta de Luna
      const lunaMessage = { role: 'assistant', content: response.reply };
      setMessages(prev => [...prev, lunaMessage]);
    } catch (err) {
      setError('Luna no pudo responder. Intenta de nuevo.');
    } finally {
      setIsTyping(false);
    }
  };

  // Enviar con tecla Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-purple-600 text-white p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center font-bold">
          L
        </div>
        <div>
          <p className="font-semibold">Luna</p>
          <p className="text-xs text-purple-200">Asistente de Mi Tienda Demo</p>
        </div>
      </div>

      {/* Lista de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-8">
            ¡Hola! Soy Luna 🌸 ¿En qué te puedo ayudar hoy?
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${msg.role === 'user'
                ? 'bg-purple-600 text-white rounded-br-none'
                : 'bg-white text-gray-800 shadow rounded-bl-none'
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Indicador "Luna está escribiendo..." */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-500 px-4 py-2 rounded-2xl rounded-bl-none shadow text-sm italic">
              Luna está escribiendo...
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <p className="text-center text-red-400 text-sm">{error}</p>
        )}
      </div>

      {/* Input de mensaje */}
      <div className="p-4 border-t border-gray-200 bg-white flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe un mensaje..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-purple-400"
          disabled={isTyping}
        />
        <button
          onClick={handleSend}
          disabled={isTyping || !inputText.trim()}
          className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium disabled:opacity-50 hover:bg-purple-700 transition"
        >
          Enviar
        </button>
      </div>

    </div>
  );
}

export default ChatInterface;


/*
## Lo que Aprendes Aquí
```
useState   → guarda los mensajes, el texto, el estado de "escribiendo"
useEffect  → ejecuta código cuando el componente carga(historial)
async / await → espera la respuesta del backend antes de continuar
prev =>    → forma segura de actualizar listas en React  */