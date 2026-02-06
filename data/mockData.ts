
import { Module, ModuleType, Difficulty, Quiz, InteractionType } from '../types';

// DigitalBook interface for the archive system
export interface DigitalBook {
  id: string;
  title: string;
  category: string;
  author: string;
  icon: string;
  levelRequired: number;
  summary: string;
  fullText: string;
  isLegal?: boolean;
}

export const APP_MODULES: Module[] = [
  {
    id: ModuleType.CIVICS,
    title: "Soberania e Direito",
    description: "Análise profunda da CRA e direitos fundamentais.",
    icon: "shield",
    color: "border-indigo-500",
    lessons: [
      {
        id: 'civ-l1',
        title: "O Código Fonte da Nação",
        description: "Hierarquia jurídica e soberania popular na CRA.",
        content: "A Constituição da República de Angola (CRA) não é apenas um livro de leis; é o código fonte que define como o nosso 'sistema operacional' nacional deve funcionar. Ela garante que o poder reside no povo e protege a dignidade de cada cidadão angolano.",
        imageUrl: "",
        quizzes: [
          {
            id: 'q-civ-1',
            discipline: 'Direito Constitucional',
            theme: 'Soberania',
            contextIntro: 'Análise do Artigo 3.º da CRA.',
            question: "De acordo com o protocolo fundamental, onde reside a soberania de Angola?",
            options: [
              { id: 'a', text: 'No Governo Central', isCorrect: false },
              { id: 'b', text: 'No Povo Angolano', isCorrect: true },
              { id: 'c', text: 'Nas Forças de Defesa', isCorrect: false }
            ],
            interactionType: InteractionType.MULTIPLE_CHOICE,
            explanation: "O Artigo 3.º estabelece que a soberania reside no povo, que a exerce através do sufrágio e das instituições democráticas.",
            difficulty: Difficulty.ASPIRANTE,
            hint: "Consulta o Artigo 3.º"
          }
        ]
      }
    ]
  },
  {
    id: ModuleType.ROBOTICS,
    title: "Hardware & Satélites",
    description: "Engenharia de semicondutores e o AngoSat.",
    icon: "rocket",
    color: "border-cyan-500",
    lessons: [
      {
        id: 'rob-l1',
        title: "Arquitetura Orbital",
        description: "Como o AngoSat-2 comunica com o solo.",
        content: "Para que Angola tenha internet em todo o território, usamos satélites como o AngoSat-2. Eles utilizam microchips de silício altamente avançados que processam milhões de sinais por segundo para nos manter conectados.",
        imageUrl: "",
        quizzes: []
      }
    ]
  }
];

// Mock data for the digital library featured in the Archive screen
export const DIGITAL_LIBRARY: DigitalBook[] = [
  {
    id: 'b1',
    title: 'Constituição da República de Angola',
    category: 'Direito',
    author: 'Assembleia Nacional',
    icon: 'shield',
    levelRequired: 1,
    summary: 'A Lei Fundamental que define a organização política e os direitos dos cidadãos angolanos.',
    fullText: 'Angola é uma República soberana e independente, baseada na dignidade da pessoa humana e na vontade do povo angolano. A soberania reside no povo, que a exerce através do sufrágio universal e das instituições democráticas. O Estado respeita e protege a pessoa humana, os seus direitos e liberdades fundamentais, garantindo a paz, a democracia e o progresso social.',
    isLegal: true
  },
  {
    id: 'b2',
    title: 'Princípios do AngoSat-2',
    category: 'Tecnologia',
    author: 'GGPEN',
    icon: 'rocket',
    levelRequired: 3,
    summary: 'Exploração técnica do primeiro satélite de comunicações de fabrico nacional.',
    fullText: 'O AngoSat-2 é um satélite de comunicações geoestacionário que opera nas bandas C e Ku. Ele foi concebido para fornecer serviços de telecomunicações, internet de alta velocidade e transmissão de dados em todo o território nacional e partes da região da SADC, contribuindo para a inclusão digital e soberania tecnológica de Angola.',
    isLegal: false
  },
  {
    id: 'b3',
    title: 'Guia de Robótica Nkelo',
    category: 'Engenharia',
    author: 'Equipa Nkelo',
    icon: 'zap',
    levelRequired: 5,
    summary: 'Manual avançado para construção de sistemas autónomos no contexto angolano.',
    fullText: 'A robótica em Angola está em ascensão. Este guia detalha o uso de microcontroladores e sensores para criar soluções locais, desde agricultura inteligente até monitorização ambiental. Aprender robótica é dominar as ferramentas que construirão as infraestruturas do futuro da nossa nação.',
    isLegal: false
  }
];
