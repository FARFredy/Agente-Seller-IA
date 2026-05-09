import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const VERIFY_TOKEN = 'seller_ai_webhook_2024';

serve(async (req) => {

  if (req.method === 'GET') {
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return new Response(challenge, { status: 200 });
    }
    return new Response('Token invalido', { status: 403 });
  }

  if (req.method === 'POST') {
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      const body = await req.json();
      const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (!message || message.type !== 'text') {
        return new Response('OK', { status: 200 });
      }

      const customerPhone = message.from;
      const customerText = message.text.body;

      let { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('customer_phone', customerPhone)
        .eq('status', 'open')
        .maybeSingle();

      if (!conversation) {
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({
            org_id: 'a0000000-0000-0000-0000-000000000001',
            agent_id: 'b0000000-0000-0000-0000-000000000001',
            channel: 'whatsapp',
            customer_phone: customerPhone,
            customer_name: 'WA_' + customerPhone,
            status: 'open'
          })
          .select('id')
          .single();
        conversation = newConv;
      }

      const { data: aiResponse } = await supabase.functions.invoke('chat-agent', {
        body: {
          conversation_id: conversation.id,
          message: customerText,
          agent_id: 'b0000000-0000-0000-0000-000000000001'
        }
      });

      const replyText = aiResponse?.reply || 'Hola, estoy aqui para ayudarte';

      const metaToken = Deno.env.get('META_ACCESS_TOKEN');
      const phoneNumId = Deno.env.get('META_PHONE_NUMBER_ID');

      await fetch(`https://graph.facebook.com/v18.0/${phoneNumId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${metaToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: customerPhone,
          type: 'text',
          text: { body: replyText }
        }),
      });

      return new Response('OK', { status: 200 });

    } catch (error) {
      console.error('Error:', error);
      return new Response('OK', { status: 200 });
    }
  }

  return new Response('Metodo no permitido', { status: 405 });
});
