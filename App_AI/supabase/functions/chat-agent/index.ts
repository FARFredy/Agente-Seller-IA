import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Recibir datos del frontend
    const { conversation_id, message, agent_id } = await req.json();

    if (!conversation_id || !message || !agent_id) {
      throw new Error('Faltan campos: conversation_id, message o agent_id');
    }

    // 2. Cliente Supabase con SERVICE_ROLE (bypasea RLS de forma segura)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 3. Obtener el system_prompt del agente
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('system_prompt, name')
      .eq('id', agent_id)
      .single();

    if (agentError || !agent) {
      throw new Error(`Agente no encontrado: ${agentError?.message}`);
    }

    // 4. Obtener historial de la conversación (últimos 10 mensajes)
    const { data: history, error: historyError } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (historyError) throw new Error(`Error en historial: ${historyError.message}`);

    // Ordenar cronológicamente (Groq necesita orden antiguo → nuevo)
    const formattedHistory = (history || []).reverse().map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    // 5. Llamar a Groq (Groq API)
    const groqKey = Deno.env.get('GROQ_API_KEY');
    if (!groqKey) throw new Error('Falta GROQ_API_KEY');

    const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: agent.system_prompt || 'Eres un asistente útil.'
          },
          ...formattedHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`Error de Groq API: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const assistantMessage = aiData.choices[0].message.content;

    // 6. Guardar mensaje del usuario y respuesta en la BD
    const { error: insertError } = await supabase
      .from('messages')
      .insert([
        { conversation_id, role: 'user', content: message },
        { conversation_id, role: 'assistant', content: assistantMessage }
      ]);

    if (insertError) throw new Error(`Error guardando mensajes: ${insertError.message}`);

    // 7. Retornar respuesta al frontend
    return new Response(
      JSON.stringify({ success: true, reply: assistantMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});