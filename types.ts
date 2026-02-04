
export enum LearningMode {
  STORYTELLING = 'STORYTELLING', // Modo Ancestral / História
  PRACTICE = 'PRACTICE',           // Modo Operacional / Prática
  TACTICAL = 'TACTICAL'          // Modo Direto / Tático
}

export enum ModuleType {
  MATHEMATICS = 'MATHEMATICS',
  PHYSICS = 'PHYSICS',
  HISTORY = 'HISTORY',
  GEOGRAPHY = 'GEOGRAPHY',
  CIVICS = 'CIVICS',
  ECONOMY = 'ECONOMY',
  AGRICULTURE = 'AGRICULTURE',
  ROBOTICS = 'ROBOTICS',
  ARTS = 'ARTS',
  LOGIC = 'LOGIC',
  PORTUGUESE = 'PORTUGUESE',
  CODING = 'CODING',
  BIOLOGY = 'BIOLOGY',
  MAKER = 'MAKER',
  GEOPOLITICS = 'GEOPOLITICS',
  ECOLOGY = 'ECOLOGY'
}

export enum InteractionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SIMULATOR = 'SIMULATOR',
  MAP_LOCATOR = 'MAP_LOCATOR',
  WORD_SCRAMBLE = 'WORD_SCRAMBLE',
  MATCHING = 'MATCHING',
  FILL_BLANKS = 'FILL_BLANKS'
}

export enum Difficulty {
  ASPIRANTE = 'ASPIRANTE',
  TECNICO = 'TÉCNICO',
  ENGENHEIRO = 'ENGENHEIRO'
}

export enum UserRole {
  ASPIRANTE = 'ASPIRANTE',
  ENTUSIASTA = 'ENTUSIASTA',
  ADMIN = 'ADMIN'
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
  date?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  rank: string;
  role: UserRole;
  credits: number; 
  achievements: Achievement[];
  favoriteModule: ModuleType;
  preferredMode?: LearningMode;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface Quiz {
  id: string;
  discipline: string;
  theme: string;
  contextIntro: string;
  question: string;
  options?: QuizOption[];
  interactionType: InteractionType;
  correctAnswer?: string | number | string[];
  matchingPairs?: MatchingPair[];
  blankOptions?: string[];
  explanation: string;
  difficulty: Difficulty;
  visualAid?: string;
  hint?: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  quizzes: Quiz[];
  description?: string;
}

export interface Module {
  id: ModuleType;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export interface UserProgress {
  totalPoints: number;
  completedLessons: string[];
  timeSpent: number;
}

export interface Broadcast {
  id: string;
  message: string;
  sender: string;
  timestamp: number;
}

export type AppTab = 'dashboard' | 'nexus' | 'learn' | 'worldcup' | 'profile' | 'admin';
