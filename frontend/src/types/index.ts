export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  savedRoadmaps: string[];
  progress: ProgressEntry[];
  createdAt: string;
}

export interface ProgressEntry {
  roadmap: string;
  completedResources: string[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  createdBy: string;
}

export interface Stage {
  _id?: string;
  title: string;
  description?: string;
  order: number;
  resources: Resource[];
}

export interface Roadmap {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  category: Category | string;
  coverImage?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  stages: Stage[];
  estimatedTime?: string;
  tags: string[];
  isPublished: boolean;
  createdBy: string | { username?: string };
  enrolledCount: number;
  createdAt: string;
  updatedAt: string;
  isSaved?: boolean;
  progress?: number;
}

export interface Resource {
  _id: string;
  title: string;
  description?: string;
  type: 'youtube' | 'pdf' | 'article';
  url: string;
  youtubeId?: string;
  duration?: string;
  roadmap: string;
  order: number;
  stage?: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
}

export interface Question {
  question: string;
  options: string[];
  correctOption: number;
  explanation?: string;
}

export interface Quiz {
  _id: string;
  title: string;
  description?: string;
  resource?: string | Resource;
  roadmap?: string;
  questions: Question[];
  passingScore: number;
  createdBy: string;
  createdAt: string;
}

export interface QuizAttempt {
  _id: string;
  user: string;
  quiz: string;
  answers: {
    questionIndex: number;
    selectedOption: number;
    isCorrect: boolean;
  }[];
  score: number;
  passed: boolean;
  completedAt: string;
}

export interface Flashcard {
  front: string;
  back: string;
  hint?: string;
}

export interface FlashcardSet {
  _id: string;
  title: string;
  description?: string;
  resource?: string | Resource;
  roadmap?: string;
  cards: Flashcard[];
  createdBy: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  status: number;
}
