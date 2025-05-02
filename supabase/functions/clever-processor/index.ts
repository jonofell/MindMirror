
// import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
// import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1'

// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
// }

// serve(async (req) => {
//   if (req.method === 'OPTIONS') {
//     return new Response('ok', { headers: corsHeaders })
//   }

//   try {
//     const { content } = await req.json()

//     const configuration = new Configuration({
//       apiKey: Deno.env.get('OPENAI_API_KEY'),
//     })
//     const openai = new OpenAIApi(configuration)

//     const completion = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: "You are a thoughtful journaling assistant. Analyze the journal entry and provide a brief, insightful reflection that captures the key themes and emotions."
//         },
//         {
//           role: "user",
//           content: content
//         }
//       ],
//       max_tokens: 200,
//       temperature: 0.7,
//     })

//     const reflection = completion.data.choices[0].message.content

//     return new Response(
//       JSON.stringify({ reflection }),
//       {
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         status: 200,
//       },
//     )
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ error: error.message }),
//       {
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         status: 500,
//       },
//     )
//   }
// })
