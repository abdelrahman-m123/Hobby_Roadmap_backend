import axios from 'axios';
import type { 
  User, Category, Roadmap, Resource, Quiz, FlashcardSet, QuizAttempt 
} from '@/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple debug logger
const log = (type: string, ...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log(`[API ${type}]`, ...args);
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.group(`📤 ${config.method?.toUpperCase()} ${config.url}`);
  console.log('Headers:', { ...config.headers, Authorization: token ? 'Bearer [HIDDEN]' : undefined });
  console.log('Params:', config.params);
  console.log('Data:', config.data);
  console.groupEnd();
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.group(`📥 ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log('Response:', response.data);
    console.groupEnd();
    return response;
  },
  (error) => {
    console.error(`❌ ${error.response?.status || 'Network Error'} ${error.config?.url}`, error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (data: { username: string; email: string; password: string }) => {
    log('Auth', 'Register:', { username: data.username, email: data.email });
    return api.post<{ token: string; user: User }>('/auth/register', data);
  },
  login: (data: { email: string; password: string }) => {
    log('Auth', 'Login:', { email: data.email });
    return api.post<{ token: string; user: User }>('/auth/login', data);
  },
  getMe: () => {
    log('Auth', 'GetMe');
    return api.get<{ user: User }>('/auth/me');
  },
  updateMe: (data: { username?: string; email?: string }) => {
    log('Auth', 'UpdateMe:', data);
    return api.patch<{ user: User }>('/auth/me', data);
  },
};

export const categories = {
  getAll: () => {
    log('Categories', 'GetAll');
    return api.get<Category[]>('/categories');
  },
  getBySlug: (slug: string) => {
    log('Categories', 'GetBySlug:', slug);
    return api.get<Category>(`/categories/${slug}`);
  },
  create: (data: { name: string; slug: string; description?: string; icon?: string }) => {
    log('Categories', 'Create:', data);
    return api.post<Category>('/categories', data);
  },
  update: (id: string, data: { name?: string; slug?: string; description?: string; icon?: string }) => {
    log('Categories', 'Update:', { id, data });
    return api.patch<Category>(`/categories/${id}`, data);
  },
  delete: (id: string) => {
    log('Categories', 'Delete:', id);
    return api.delete(`/categories/${id}`);
  },
};

export const roadmaps = {
  getAll: () => {
    log('Roadmaps', 'GetAll');
    return api.get<Roadmap[]>('/roadmaps');
  },
  getAllAdmin: () => {
    log('Roadmaps', 'GetAllAdmin');
    return api.get<Roadmap[]>('/roadmaps/admin/all');
  },
  getBySlug: (slug: string) => {
    log('Roadmaps', 'GetBySlug:', slug);
    return api.get<Roadmap>(`/roadmaps/${slug}`);
  },
  getById: (id: string) => {
    log('Roadmaps', 'GetById:', id);
    return api.get<Roadmap>(`/roadmaps/id/${id}`);
  },
  create: (data: Partial<Roadmap>) => {
    log('Roadmaps', 'Create:', { title: data.title, slug: data.slug });
    return api.post<Roadmap>('/roadmaps', data);
  },
  update: (id: string, data: Partial<Roadmap>) => {
    log('Roadmaps', 'Update:', { id, data });
    return api.patch<Roadmap>(`/roadmaps/${id}`, data);
  },
  delete: (id: string) => {
    log('Roadmaps', 'Delete:', id);
    return api.delete(`/roadmaps/${id}`);
  },
  save: (id: string) => {
    log('Roadmaps', 'Save:', id);
    return api.post(`/roadmaps/${id}/save`);
  },
  getProgress: (id: string) => {
    log('Roadmaps', 'GetProgress:', id);
    return api.get<{ progress: number }>(`/roadmaps/${id}/progress`);
  },
  updateProgress: (id: string, completedResourceId: string) => {
    log('Roadmaps', 'UpdateProgress:', { id, completedResourceId });
    return api.patch(`/roadmaps/${id}/progress`, { completedResourceId });
  },
};

export const resources = {
  getAll: () => {
    log('Resources', 'GetAll');
    return api.get<Resource[]>('/resources');
  },
  getByRoadmap: (roadmapId: string) => {
    log('Resources', 'GetByRoadmap:', roadmapId);
    return api.get<Resource[]>('/resources', { params: { roadmapId } });
  },
  getById: (id: string) => {
    log('Resources', 'GetById:', id);
    return api.get<Resource>(`/resources/${id}`);
  },
  create: (data: { 
    title: string; 
    description?: string; 
    type: 'youtube' | 'pdf' | 'article'; 
    url: string; 
    duration?: string; 
    roadmapId: string; 
    order?: number; 
    tags?: string[];
  }) => {
    log('Resources', 'Create:', data);
    return api.post<Resource>('/resources', data);
  },
  update: (id: string, data: { 
    title?: string; 
    description?: string; 
    type?: 'youtube' | 'pdf' | 'article'; 
    url?: string; 
    duration?: string; 
    order?: number; 
    tags?: string[];
  }) => {
    log('Resources', 'Update:', { id, data });
    return api.patch<Resource>(`/resources/${id}`, data);
  },
  delete: (id: string) => {
    log('Resources', 'Delete:', id);
    return api.delete(`/resources/${id}`);
  },
};

export const quizzes = {
  getAll: () => {
    log('Quizzes', 'GetAll');
    return api.get<Quiz[]>('/quizzes');
  },
  getByResource: (resourceId: string) => {
    log('Quizzes', 'GetByResource:', resourceId);
    return api.get<Quiz[]>('/quizzes', { params: { resourceId } });
  },
  getByRoadmap: (roadmapId: string) => {
    log('Quizzes', 'GetByRoadmap:', roadmapId);
    return api.get<Quiz[]>('/quizzes', { params: { roadmapId } });
  },
  getById: (id: string) => {
    log('Quizzes', 'GetById:', id);
    return api.get<Quiz>(`/quizzes/${id}`);
  },
  create: (data: { 
    title: string; 
    description?: string; 
    resourceId?: string; 
    roadmapId?: string; 
    questions: {
      question: string;
      options: string[];
      correctOption: number;
      explanation?: string;
    }[];
    passingScore?: number;
  }) => {
    log('Quizzes', 'Create:', { title: data.title, questionCount: data.questions.length });
    return api.post<Quiz>('/quizzes', data);
  },
  update: (id: string, data: { title?: string; description?: string; questions?: any[]; passingScore?: number }) => {
    log('Quizzes', 'Update:', { id, data });
    return api.patch<Quiz>(`/quizzes/${id}`, data);
  },
  delete: (id: string) => {
    log('Quizzes', 'Delete:', id);
    return api.delete(`/quizzes/${id}`);
  },
  getAttempts: (id: string) => {
    log('Quizzes', 'GetAttempts:', id);
    return api.get<QuizAttempt[]>(`/quizzes/${id}/attempts`);
  },
  submit: (id: string, answers: { questionIndex: number; selectedOption: number }[]) => {
    log('Quizzes', 'Submit:', { id, answerCount: answers.length });
    return api.post<{ score: number; passed: boolean; total: number }>(`/quizzes/${id}/submit`, { answers });
  },
  import: (data: any[]) => {
    log('Quizzes', 'Import:', { count: data.length });
    return api.post<{ imported: number }>('/quizzes/import', { data });
  },
};

export const flashcards = {
  getAll: () => {
    log('Flashcards', 'GetAll');
    return api.get<FlashcardSet[]>('/flashcards');
  },
  getByResource: (resourceId: string) => {
    log('Flashcards', 'GetByResource:', resourceId);
    return api.get<FlashcardSet[]>('/flashcards', { params: { resourceId } });
  },
  getByRoadmap: (roadmapId: string) => {
    log('Flashcards', 'GetByRoadmap:', roadmapId);
    return api.get<FlashcardSet[]>('/flashcards', { params: { roadmapId } });
  },
  getById: (id: string) => {
    log('Flashcards', 'GetById:', id);
    return api.get<FlashcardSet>(`/flashcards/${id}`);
  },
  create: (data: { 
    title: string; 
    description?: string; 
    resourceId?: string; 
    roadmapId?: string; 
    cards: {
      front: string;
      back: string;
      hint?: string;
    }[];
  }) => {
    log('Flashcards', 'Create:', { title: data.title, cardCount: data.cards.length });
    return api.post<FlashcardSet>('/flashcards', data);
  },
  update: (id: string, data: { title?: string; description?: string; cards?: any[] }) => {
    log('Flashcards', 'Update:', { id, data });
    return api.patch<FlashcardSet>(`/flashcards/${id}`, data);
  },
  delete: (id: string) => {
    log('Flashcards', 'Delete:', id);
    return api.delete(`/flashcards/${id}`);
  },
  import: (data: any[]) => {
    log('Flashcards', 'Import:', { count: data.length });
    return api.post<{ imported: number }>('/flashcards/import', { data });
  },
};

// Health check
export const health = {
  check: () => {
    log('Health', 'Check');
    return api.get('/health');
  },
};

export default api;