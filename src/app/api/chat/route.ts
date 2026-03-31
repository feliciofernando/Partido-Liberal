import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

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
- Use emojis ocasionalmente para ser mais amigável (Angola usa muito WhatsApp/emojis)
- Se perguntarem sobre filiamento, explique que podem se voluntariar pelo site
- Mencione as 18 províncias de Angola quando relevante
- Links úteis: site partidoliberal.ao, WhatsApp +244 923 456 789
- Mantenha respostas concisas (2-4 parágrafos no máximo, a menos que pedido detalhe)
- Nunca critique outros partidos políticos ou candidatos de forma agressiva
- Nunca invente dados ou estatísticas - use apenas as informações acima`;

// Store conversations in memory (session-based)
const conversations = new Map<string, Array<{ role: string; content: string }>>();

export async function POST(request: NextRequest) {
  try {
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
      { role: "assistant", content: SYSTEM_PROMPT }
    ];

    // Add user message
    history.push({ role: "user", content: message });

    // Limit conversation history (keep system prompt + last 10 messages)
    if (history.length > 12) {
      history = [
        history[0], // Keep system prompt
        ...history.slice(-10)
      ];
    }

    // Call AI using z-ai-web-dev-sdk
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      thinking: { type: "disabled" },
    });

    const aiResponse =
      completion.choices[0]?.message?.content ||
      "Desculpe, não consegui processar sua mensagem. Tente novamente.";

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
        response:
          "Desculpe, ocorreu um erro. Por favor, tente novamente em alguns instantes. 🙏",
      },
      { status: 500 }
    );
  }
}
