import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const outputDir = './public/images/news';

// Criar diretório se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const imagePrompts = [
  {
    filename: 'political-rally.png',
    prompt: 'Political rally in African city, large crowd of people waving blue flags, modern cityscape background, democratic campaign event, professional photojournalism style, high quality',
    size: '1344x768' as const
  },
  {
    filename: 'healthcare-program.png',
    prompt: 'Modern hospital building in African city, healthcare workers in blue uniforms, patients being cared for, clean modern medical facility, professional photography, high quality',
    size: '1344x768' as const
  },
  {
    filename: 'education-initiative.png',
    prompt: 'Modern school classroom in Africa, diverse students learning with tablets and computers, teacher presenting, bright colorful educational environment, professional photo, high quality',
    size: '1344x768' as const
  },
  {
    filename: 'youth-empowerment.png',
    prompt: 'Young African entrepreneurs in modern office, startup environment, technology and innovation, diverse team working together, professional business photography, high quality',
    size: '1344x768' as const
  },
  {
    filename: 'infrastructure-project.png',
    prompt: 'Modern infrastructure construction in African city, new roads and bridges, workers with safety equipment, urban development, professional photography, high quality',
    size: '1344x768' as const
  },
  {
    filename: 'community-event.png',
    prompt: 'Community meeting in African village, people gathered discussing, local leaders addressing crowd, outdoor setting with trees, documentary style photography, high quality',
    size: '1344x768' as const
  },
  {
    filename: 'press-conference.png',
    prompt: 'Political press conference, candidate at podium with blue backdrop, journalists with cameras and microphones, professional political event, news photography style, high quality',
    size: '1344x768' as const
  },
  {
    filename: 'agriculture-support.png',
    prompt: 'African farmers in green fields, modern agriculture techniques, irrigation systems, diverse crops, sustainable farming, professional photography, high quality',
    size: '1344x768' as const
  }
];

async function generateImages() {
  console.log('Iniciando geração de imagens...\n');
  
  const zai = await ZAI.create();
  
  for (let i = 0; i < imagePrompts.length; i++) {
    const { filename, prompt, size } = imagePrompts[i];
    const outputPath = path.join(outputDir, filename);
    
    console.log(`[${i + 1}/${imagePrompts.length}] Gerando: ${filename}`);
    console.log(`Prompt: ${prompt.substring(0, 60)}...`);
    
    try {
      const response = await zai.images.generations.create({
        prompt: prompt,
        size: size
      });
      
      const imageBase64 = response.data[0].base64;
      const buffer = Buffer.from(imageBase64, 'base64');
      fs.writeFileSync(outputPath, buffer);
      
      console.log(`✓ Salvo: ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)\n`);
    } catch (error: any) {
      console.error(`✗ Erro ao gerar ${filename}: ${error.message}\n`);
    }
  }
  
  console.log('Geração de imagens concluída!');
}

generateImages().catch(console.error);
