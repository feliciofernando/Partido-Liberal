import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
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

export async function POST(request: NextRequest) {
  try {
    if (!OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY não configurada nas variáveis de ambiente");
      return NextResponse.json(
        { success: false, response: "Assistente IA indisponível no momento. ⏳" },
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

    let history = conversations.get(sid) || [
      { role: "system", content: SYSTEM_PROMPT }
    ];

    history.push({ role: "user", content: message });

    if (history.length > 12) {
      history = [history[0], ...history.slice(-10)];
    }

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
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
      const errorText = await response.text();
      console.error("OpenRouter error:", response.status, errorText);
      return NextResponse.json(
        { success: false, response: "Desculpe, ocorreu um erro. Tente novamente. 🙏" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "Não consegui processar sua mensagem.";

    history.push({ role: "assistant", content: aiResponse });
    conversations.set(sid, history);

    return NextResponse.json({ success: true, response: aiResponse });
  } catch (error) {
    console.error("Erro no chat:", error);
    return NextResponse.json(
      { success: false, response: "Desculpe, ocorreu um erro. Tente novamente. 🙏" },
      { status: 500 }
    );
  }
}
