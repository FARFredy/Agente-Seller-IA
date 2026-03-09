// src/services/aiService.js
import { supabase } from '../utils/supabase';

/**
 * Llama a la Edge Function para generar y guardar el mensaje del agente
 */
export const sendMessage = async ({ conversationId, message, agentId }) => {
  try {
    const { data, error } = await supabase.functions.invoke('chat-agent', {
      body: {
        conversation_id: conversationId,
        message: message,
        agent_id: agentId
      },
    });

    if (error) {
      throw new Error(`Error en la Edge Function: ${error.message}`);
    }

    // La función retorna { success: true, reply: "..." }
    return data;
  } catch (error) {
    console.error('Error al enviar mensaje a la IA:', error);
    throw new Error('No se pudo comunicar con el asistente. Por favor, intenta de nuevo.');
  }
};

/**
 * Consulta la tabla "messages" en Supabase
 * Ordena por created_at de forma ascendente (antiguos primero)
 */
export const getConversationHistory = async (conversationId) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('role, content, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true }); // true = más antiguos arriba

    if (error) {
      throw new Error(`Error de Supabase: ${error.message}`);
    }

    // Retorna array de { role, content, created_at }
    return data || [];
  } catch (error) {
    console.error('Error al obtener el historial de la conversación:', error);
    throw new Error('Hubo un problema al cargar los mensajes anteriores.');
  }
};

/**
 * Inserta nueva fila en la tabla "conversations" para empezar el chat
 */
export const createConversation = async ({ orgId, agentId, channel, customerName }) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert([
        {
          org_id: orgId,
          agent_id: agentId,
          channel: channel || 'web',
          customer_name: customerName || 'Anónimo',
          status: 'open'
        }
      ])
      .select() // Necesario para que retorne la fila insertada
      .single();

    if (error) {
      throw new Error(`Error de Supabase al crear conversación: ${error.message}`);
    }

    // Retorna el ID de la conversación recién creada
    return data.id;
  } catch (error) {
    console.error('Error al crear una nueva conversación:', error);
    throw new Error('No se pudo inicializar la sala de chat. Revisa la conexión u organización.');
  }
};
