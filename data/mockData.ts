
import { Module, ModuleType, Difficulty, Quiz, InteractionType } from '../types';

export const APP_MODULES: Module[] = [
  {
    id: ModuleType.HISTORY,
    title: "Soberania e Diplomacia",
    description: "A arte da governação e resistência ancestral angolana.",
    icon: "award",
    color: "border-amber-500",
    lessons: [
      {
        id: 'hist-l1',
        title: "Njinga: Protocolo de Elite",
        description: "Diplomacia luso-africana no século XVII.",
        content: "A Rainha Njinga Mbandi era uma mestre da 'Realpolitik'. Ela dominava o protocolo diplomático para manter a soberania do Ndongo. Em 1622, na conferência de Luanda, ela demonstrou igualdade de estatuto ao exigir tratamento de monarca perante o governador português, utilizando táticas de negociação que são estudadas hoje como exemplos de diplomacia de alta pressão.",
        imageUrl: "",
        quizzes: []
      },
      {
        id: 'hist-l2',
        title: "Estrutura do Reino do Kongo",
        description: "Administração centralizada e economia fiduciária.",
        content: "O Reino do Kongo possuía uma administração centralizada altamente eficiente. O Nzimbo (moeda) era controlado pelo Manikongo, permitindo uma economia estável que facilitava o comércio de sal, tecidos e metais por toda a África Central, muito antes da introdução de sistemas bancários europeus.",
        imageUrl: "",
        quizzes: []
      }
    ]
  },
  {
    id: ModuleType.ROBOTICS,
    title: "Sistemas Orbitais",
    description: "Engenharia aeroespacial e o futuro do AngoSat-2.",
    icon: "rocket",
    color: "border-indigo-400",
    lessons: [
      {
        id: 'rob-l1',
        title: "Física do AngoSat-2",
        description: "Transponders e Órbita Geoestacionária.",
        content: "O AngoSat-2 opera a 36.000 km de altitude. Ele utiliza transponders em Banda Ku e Banda C para converter sinais de rádio. A física envolvida exige precisão milimétrica na correção de órbita, usando propulsão elétrica iónica para manter o satélite exatamente sobre o território angolano.",
        imageUrl: "",
        quizzes: []
      },
      {
        id: 'rob-l2',
        title: "Semicondutores",
        description: "A base da computação moderna.",
        content: "Robôs e satélites dependem de semicondutores. O Silício, quando dopado com outros elementos, permite controlar o fluxo de eletrões (corrente elétrica). Entender a junção P-N é fundamental para criar processadores que movem desde drones até os supercomputadores da Nkelo.",
        imageUrl: "",
        quizzes: []
      }
    ]
  },
  {
    id: ModuleType.PHYSICS,
    title: "Energia e Matéria",
    description: "Termodinâmica e Física Quântica aplicada.",
    icon: "zap",
    color: "border-rose-400",
    lessons: [
      {
        id: 'phy-l1',
        title: "Efeito Fotoelétrico no Namibe",
        description: "Transformando fotões em eletrões.",
        content: "A energia solar funciona através do Efeito Fotoelétrico. No deserto do Namibe, a radiação solar intensa atinge os painéis de silício, libertando eletrões que geram energia limpa. Esta é a aplicação direta da física quântica para resolver o problema energético nacional.",
        imageUrl: "",
        quizzes: []
      }
    ]
  },
  {
    id: ModuleType.BIOLOGY,
    title: "Biosfera Angola",
    description: "Genética e ecossistemas estratégicos.",
    icon: "activity",
    color: "border-emerald-500",
    lessons: [
      {
        id: 'bio-l1',
        title: "DNA da Palanca Negra",
        description: "Conservação genética de elite.",
        content: "A Palanca Negra Gigante é um tesouro genético. Biólogos angolanos utilizam marcadores de DNA para monitorizar a diversidade da espécie no Parque de Cangandala, garantindo que a subespécie sobreviva a doenças e mantenha a sua robustez física única.",
        imageUrl: "",
        quizzes: []
      }
    ]
  }
];
