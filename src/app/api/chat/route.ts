import { NextRequest, NextResponse } from "next/server";
import { supabasePublicGetOne } from "@/lib/supabase-public";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.0-flash-001";

const SYSTEM_PROMPT = `Você é o assistente virtual oficial do Partido Liberal de Angola (PL). Seu nome é "PL Assistente".

INFORMAÇÕES SOBRE O PARTIDO:
- O Partido Liberal é um partido político angolano comprometido com a liberdade, democracia e desenvolvimento de Angola.
- Cores oficiais: Azul (#1e3a5f) e Amarelo (#eab308)
- Lema: "Construindo o Futuro de Angola"
- Fundado para transformar Angola em uma nação próspera e justa
- Presidente: Dr. António Mendes
- Vice-Presidente: Dra. Maria Santos
- Secretário-Geral: Eng. João Silva
- O partido está presente em todas as 18 províncias de Angola
- Site oficial: partidoliberal.ao

PROGRAMA DE GOVERNO PRINCIPAL:
1. Saúde: Construção de 50 novos hospitais, contratação de 20.000 profissionais
2. Educação: Escolas gratuitas em todas as comunidades, reforma curricular
3. Economia: Diversificação econômica, microcrédito, apoio ao empreendedorismo
4. Infraestrutura: 5.000 km de estradas, eletrificação rural, habitação social
5. Segurança: Modernização das forças, combate à corrupção, reforma judicial
6. Juventude: Emprego jovem, centros de formação, incentivo ao empreendedorismo
7. Meio Ambiente: Energias renováveis, reflorestamento, saneamento básico
8. Tecnologia: Internet em todo país, parques tecnológicos, governo digital

COMO DEVE SE COMPORTAR:
- Seja simpático, acolhedor e profissional
- Responda em português de Angola
- Use um tom acessível e amigável
- Seja honesto sobre o que sabe e não sabe
- Para perguntas fora do tema político, redirecione educadamente para o foco do partido
- Incentive o engajamento: voluntariado, filiação, participação em eventos
- Forneça informações práticas: como se voluntariar, próximos eventos, contatos
- Use emojis ocasionalmente para ser mais amigável
- Se perguntarem sobre filiamento, explique que podem se voluntariar pelo site
- Mencione as 18 províncias de Angola quando relevante
- Mantenha respostas concisas (2-4 parágrafos no máximo, a menos que pedido detalhe)
- Nunca critique outros partidos políticos ou candidatos de forma agressiva
- Nunca invente dados ou estatísticas - use apenas as informações acima`;

// Store conversations in memory (session-based)
const conversations = new Map<string, Array<{ role: string; content: string }>>();

// Cache the API key to avoid fetching from Supabase on every request
let cachedApiKey: string | null = null;
let apiKeyCacheTime = 0;
const API_KEY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getOpenRouterApiKey(): Promise<string | null> {
  const now = Date.now();
  if (cachedApiKey && (now - apiKeyCacheTime) < API_KEY_CACHE_TTL) {
    return cachedApiKey;
  }

  try {
    const config = await supabasePublicGetOne('SiteConfig?select=openrouterApiKey&limit=1');
    const key = (config as any)?.openrouterApiKey;

    if (key) {
      cachedApiKey = key;
      apiKeyCacheTime = now;
      return key;
    }
  } catch (error) {
    console.error("Erro ao buscar API key do Supabase:", error);
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Buscar chave API do Supabase
    const apiKey = await getOpenRouterApiKey();

    if (!apiKey) {
      return NextResponse.json(
        { success: false, response: "Assistente IA indisponível. A chave API não está configurada. Peça ao administrador para configurar no painel." },
        { status: 503 }
      );
    }

    const { message, sessionId } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Mensagem é obrigatória" },
        { status: 400 }
      );
    }

    const sid = sessionId || "default";

    // Get or create conversation history
    let history = conversations.get(sid) || [
      { role: "system", content: SYSTEM_PROMPT }
    ];

    // Add user message
    history.push({ role: "user", content: message });

    // Limit conversation history (keep system prompt + last 10 messages)
    if (history.length > 12) {
      history = [
        history[0],
        ...history.slice(-10)
      ];
    }

    // Call OpenRouter API
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://partido-liberal.vercel.app",
        "X-Title": "PL Assistente - Partido Liberal Angola",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: history.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API error:", response.status, errorData);
      return NextResponse.json(
        { success: false, response: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente. 🙏" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "Desculpe, não consegui processar sua mensagem. Tente novamente.";

    // Add AI response to history
    history.push({ role: "assistant", content: aiResponse });

    // Save updated history
    conversations.set(sid, history);

    return NextResponse.json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.error("Erro no chat:", error);
    return NextResponse.json(
      {
        success: false,
        response: "Desculpe, ocorreu um erro. Por favor, tente novamente em alguns instantes. 🙏",
      },
      { status: 500 }
    );
  }
}
