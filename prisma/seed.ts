import { db } from "@/lib/db";

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar dados existentes
  await db.eventConfirmation.deleteMany();
  await db.eventLeader.deleteMany();
  await db.event.deleteMany();
  await db.leader.deleteMany();
  await db.news.deleteMany();
  await db.governmentProgram.deleteMany();
  await db.volunteer.deleteMany();
  await db.complaint.deleteMany();
  await db.kitItem.deleteMany();
  await db.alert.deleteMany();

  console.log("📝 Criando líderes...");
  
  // Criar Líderes
  const leaders = await Promise.all([
    db.leader.create({
      data: {
        name: "Dr. António Mendes",
        slug: "antonio-mendes",
        role: "Presidente do Partido",
        province: "Luanda",
        bio: "Líder experiente com mais de 20 anos de dedicação à política angolana. Economista formado pela Universidade de Lisboa, com mestrado em Administração Pública. Foi deputado e ministro em governos anteriores.",
        proposals: JSON.stringify([
          "Reforma profunda do sistema de saúde",
          "Investimento massivo em educação",
          "Diversificação da economia angolana",
        ]),
        socialFacebook: "https://facebook.com/antoniomendes",
        socialTwitter: "https://twitter.com/antoniomendes",
        socialInstagram: "https://instagram.com/antoniomendes",
        order: 1,
      },
    }),
    db.leader.create({
      data: {
        name: "Dra. Maria Santos",
        slug: "maria-santos",
        role: "Vice-Presidente",
        province: "Benguela",
        bio: "Advogada e ativista dos direitos humanos. Pioneira na luta pela igualdade de género em Angola. Formada em Direito pela Universidade Agostinho Neto.",
        proposals: JSON.stringify([
          "Políticas de igualdade de género",
          "Proteção aos direitos das mulheres",
          "Acesso à justiça para todos",
        ]),
        socialFacebook: "https://facebook.com/mariasantos",
        socialTwitter: "https://twitter.com/mariasantos",
        socialInstagram: "https://instagram.com/mariasantos",
        order: 2,
      },
    }),
    db.leader.create({
      data: {
        name: "Eng. João Silva",
        slug: "joao-silva",
        role: "Secretário-Geral",
        province: "Huambo",
        bio: "Engenheiro civil com vasta experiência em projetos de infraestrutura. Defensor do desenvolvimento sustentável e da modernização das cidades angolanas.",
        proposals: JSON.stringify([
          "Infraestrutura em todas as províncias",
          "Energia limpa e acessível",
          "Habitação social para famílias",
        ]),
        socialFacebook: "https://facebook.com/joaosilva",
        socialTwitter: "https://twitter.com/joaosilva",
        order: 3,
      },
    }),
    db.leader.create({
      data: {
        name: "Dr. Pedro Neto",
        slug: "pedro-neto",
        role: "Candidato a Deputado",
        province: "Lunda Sul",
        bio: "Médico comunitário dedicado à saúde rural. Conhecedor profundo das necessidades das comunidades do interior de Angola.",
        proposals: JSON.stringify([
          "Postos de saúde em todas as comunas",
          "Programas de prevenção de doenças",
          "Formação de agentes de saúde comunitários",
        ]),
        order: 4,
      },
    }),
    db.leader.create({
      data: {
        name: "Dra. Ana Costa",
        slug: "ana-costa",
        role: "Candidata a Deputada",
        province: "Cabinda",
        bio: "Professora universitária e especialista em educação. Comprometida com a transformação do sistema educacional angolano.",
        proposals: JSON.stringify([
          "Reforma curricular nacional",
          "Valorização dos professores",
          "Escolas equipadas em todo país",
        ]),
        order: 5,
      },
    }),
    db.leader.create({
      data: {
        name: "Lic. Carlos Ferreira",
        slug: "carlos-ferreira",
        role: "Secretário de Juventude",
        province: "Huíla",
        bio: "Jovem líder estudantil e empreendedor. Voz da nova geração de angolanos que busca oportunidades para todos.",
        proposals: JSON.stringify([
          "Emprego jovem em massa",
          "Incubadoras de startups",
          "Bolsas de estudo internacionais",
        ]),
        order: 6,
      },
    }),
  ]);

  console.log("📰 Criando notícias...");

  // Criar Notícias
  const news = await Promise.all([
    db.news.create({
      data: {
        title: "Partido Liberal lança programa de governo para 2024-2029",
        slug: "programa-governo-2024-2029",
        summary: "Propostas incluem investimentos massivos em saúde, educação e infraestrutura em todas as províncias.",
        content: `O Partido Liberal apresentou hoje o seu programa de governo para o período 2024-2029, com propostas ambiciosas para transformar Angola.

O programa inclui:
- Construção de 50 novos hospitais provinciais
- Contratação de 20.000 profissionais de saúde
- Escolas gratuitas em todas as comunidades
- Pavimentação de 5.000 km de estradas
- Eletrificação rural em todas as províncias

"Este é um programa feito por angolanos, para angolanos. Cada proposta foi discutida com comunidades de todas as 18 províncias", afirmou o presidente do partido.`,
        category: "comunicado",
        featured: true,
        published: true,
        author: "Redação PL",
      },
    }),
    db.news.create({
      data: {
        title: "Comício em Saurimo reúne mais de 10 mil pessoas",
        slug: "comicio-saurimo-10-mil",
        summary: "Evento marcou o lançamento da campanha na província da Lunda Sul com forte presença de jovens.",
        content: `Mais de 10 mil pessoas participaram do comício do Partido Liberal em Saurimo, província da Lunda Sul, no último fim de semana.

O evento foi marcado pela forte presença de jovens, que representaram mais de 60% do público presente.

O candidato a deputado pela província, Dr. Pedro Neto, destacou as propostas para a região:
- Investimento na mineração artesanal
- Estradas ligando todas as comunas
- Hospital provincial moderno`,
        category: "imprensa",
        published: true,
        author: "Nossa Equipe",
      },
    }),
    db.news.create({
      data: {
        title: "Partido Liberal condena violência política",
        slug: "condena-violencia-politica",
        summary: "Nota oficial repudia atos de intolerância e convoca todos os partidos ao diálogo.",
        content: `O Partido Liberal vem a público condenar veementemente todos os atos de violência política registrados nos últimos dias.

Em nota oficial assinada pelo Secretário-Geral, o partido convocou todos os partidos políticos ao diálogo e ao respeito mútuo.

"A democracia se fortalece com o debate de ideias, não com a violência. Convidamos todos os partidos a unirmos forças pelo bem de Angola."`,
        category: "nota_oficial",
        published: true,
        author: "Secretaria-Geral",
      },
    }),
    db.news.create({
      data: {
        title: "Candidatos do PL participam de debate televisivo",
        slug: "debate-televisivo-candidatos",
        summary: "Representantes apresentaram propostas para os setores de saúde e educação.",
        content: `Os candidatos do Partido Liberal participaram de um debate televisivo sobre as principais propostas para os setores de saúde e educação.

A Dra. Maria Santos destacou a importância do investimento em saúde preventiva, enquanto o Dr. Pedro Neto falou sobre a necessidade de postos de saúde em todas as comunas do país.`,
        category: "imprensa",
        published: true,
        author: "Assessoria de Imprensa",
      },
    }),
  ]);

  console.log("📅 Criando eventos...");

  // Criar Eventos
  const events = await Promise.all([
    db.event.create({
      data: {
        title: "Grande Comício em Luanda",
        slug: "comicio-luanda-2024",
        description: "Lançamento oficial da campanha eleitoral com a presença de toda a liderança do partido.",
        location: "Praça da Independência, Luanda",
        province: "Luanda",
        date: new Date("2024-02-20"),
        time: "09:00",
        type: "comicio",
        status: "agendado",
      },
    }),
    db.event.create({
      data: {
        title: "Encontro com Jovens Empreendedores",
        slug: "encontro-jovens-empreendedores",
        description: "Discussão sobre políticas de apoio ao empreendedorismo juvenil.",
        location: "Centro de Conferências, Benguela",
        province: "Benguela",
        date: new Date("2024-02-22"),
        time: "14:00",
        type: "encontro",
        status: "agendado",
      },
    }),
    db.event.create({
      data: {
        title: "Passeata pela Paz",
        slug: "passeata-paz-huambo",
        description: "Caminhada pacífica em defesa da democracia e tolerância.",
        location: "Avenida Principal, Huambo",
        province: "Huambo",
        date: new Date("2024-02-25"),
        time: "07:00",
        type: "passeata",
        status: "agendado",
      },
    }),
    db.event.create({
      data: {
        title: "Reunião de Fiscais",
        slug: "reuniao-fiscais-saurimo",
        description: "Capacitação para fiscais de mesa no dia da eleição.",
        location: "Sede do Partido, Saurimo",
        province: "Lunda Sul",
        date: new Date("2024-02-18"),
        time: "10:00",
        type: "reuniao",
        status: "agendado",
      },
    }),
    db.event.create({
      data: {
        title: "Comício em Cabinda",
        slug: "comicio-cabinda-2024",
        description: "Apresentação das propostas para a província de Cabinda.",
        location: "Estádio Municipal, Cabinda",
        province: "Cabinda",
        date: new Date("2024-02-28"),
        time: "16:00",
        type: "comicio",
        status: "agendado",
      },
    }),
  ]);

  console.log("📋 Criando programa de governo...");

  // Criar Programa de Governo
  await Promise.all([
    db.governmentProgram.create({
      data: {
        title: "Saúde",
        slug: "saude",
        area: "Saúde",
        summary: "Investimentos massivos em hospitais, postos de saúde e formação de profissionais.",
        content: JSON.stringify([
          "Construção de 50 novos hospitais provinciais",
          "Contratação de 20.000 profissionais de saúde",
          "Programa de saúde materno-infantil ampliado",
          "Medicamentos gratuitos para idosos e crianças",
          "Modernização dos sistemas hospitalares",
        ]),
        order: 1,
      },
    }),
    db.governmentProgram.create({
      data: {
        title: "Educação",
        slug: "educacao",
        area: "Educação",
        summary: "Educação de qualidade para todos, desde o ensino primário até a universidade.",
        content: JSON.stringify([
          "Escolas gratuitas em todas as comunidades",
          "Reforma curricular com foco em tecnologia",
          "Bolsas de estudo para alunos meritórios",
          "Formação contínua de professores",
          "Investimento em infraestrutura escolar",
        ]),
        order: 2,
      },
    }),
    db.governmentProgram.create({
      data: {
        title: "Economia",
        slug: "economia",
        area: "Economia",
        summary: "Diversificação econômica, apoio ao empreendedorismo e geração de empregos.",
        content: JSON.stringify([
          "Redução de impostos para pequenas empresas",
          "Programa de microcrédito acessível",
          "Incentivo à agricultura familiar",
          "Criação de zonas económicas especiais",
          "Parcerias público-privadas estratégicas",
        ]),
        order: 3,
      },
    }),
    db.governmentProgram.create({
      data: {
        title: "Infraestrutura",
        slug: "infraestrutura",
        area: "Infraestrutura",
        summary: "Estradas, energia elétrica, água potável e habitação para todos.",
        content: JSON.stringify([
          "Pavimentação de 5.000 km de estradas",
          "Eletrificação rural em todas as províncias",
          "Expansão da rede de abastecimento de água",
          "Programa de habitação social",
          "Transporte público moderno e acessível",
        ]),
        order: 4,
      },
    }),
  ]);

  console.log("📦 Criando kit digital...");

  // Criar Kit Digital
  await Promise.all([
    db.kitItem.create({
      data: {
        title: "Avatar Oficial PL",
        description: "Foto de perfil para suas redes sociais com o símbolo do Partido Liberal.",
        type: "avatar",
        fileUrl: "/kit/avatar-pl.png",
      },
    }),
    db.kitItem.create({
      data: {
        title: "Pack de Stickers WhatsApp",
        description: "Figurinhas divertidas para usar no WhatsApp e espalhar a mensagem do PL.",
        type: "sticker",
        fileUrl: "/kit/stickers-pl.zip",
      },
    }),
    db.kitItem.create({
      data: {
        title: "Banner Facebook - Campanha",
        description: "Capa para seu perfil do Facebook apoiando o Partido Liberal.",
        type: "banner",
        fileUrl: "/kit/banner-facebook.png",
      },
    }),
    db.kitItem.create({
      data: {
        title: "Programa de Governo",
        description: "PDF completo com todas as propostas do Partido Liberal.",
        type: "documento",
        fileUrl: "/kit/programa-governo.pdf",
      },
    }),
  ]);

  console.log("🚨 Criando alertas...");

  // Criar Alertas
  await db.alert.create({
    data: {
      title: "Grande Comício em Luanda",
      message: "Não perca o lançamento da campanha em Luanda no dia 20 de Fevereiro!",
      type: "urgente",
      active: true,
    },
  });

  console.log("✅ Seed concluído com sucesso!");
  console.log(`   - ${leaders.length} líderes criados`);
  console.log(`   - ${news.length} notícias criadas`);
  console.log(`   - ${events.length} eventos criados`);
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
