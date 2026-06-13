#!/bin/bash

# Create project directory structure
mkdir -p src/components/Layout
mkdir -p src/components/ui
mkdir -p src/pages
mkdir -p src/contexts
mkdir -p src/services
mkdir -p src/types
mkdir -p src/hooks
mkdir -p public

# package.json
cat > package.json << 'EOF'
{
  "name": "hobbyroadmap-frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "axios": "^1.6.5",
    "@tanstack/react-query": "^5.17.0",
    "react-hook-form": "^7.49.3",
    "zod": "^3.22.4",
    "framer-motion": "^11.0.2",
    "clsx": "^2.1.0",
    "lucide-react": "^0.309.0",
    "react-intersection-observer": "^9.5.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.19.1",
    "@typescript-eslint/parser": "^6.19.1",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.12"
  }
}
EOF

# tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# tsconfig.node.json
cat > tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

# vite.config.ts
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
EOF

# tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2e7d32',
          light: '#4caf50',
          dark: '#1b5e20',
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
        },
        background: '#ffffff',
        foreground: '#1a1a1a',
        muted: '#f5f5f5',
        "muted-foreground": '#757575',
        border: '#e5e5e5',
        destructive: '#dc2626',
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [],
}
EOF

# postcss.config.js
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# .gitignore
cat > .gitignore << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
EOF

# index.html
cat > index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#2e7d32" />
    <title>HobbyRoadmap - Master Your Favorite Hobbies</title>
    <meta name="description" content="Discover structured learning paths for your favorite hobbies. Track progress, take quizzes, and master new skills at your own pace." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# src/index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  
  html {
    -webkit-tap-highlight-color: transparent;
  }
  
  body {
    @apply bg-background text-foreground;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Better touch targets on mobile */
  button, 
  a,
  [role="button"] {
    @apply min-h-[44px] min-w-[44px];
  }
  
  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }
  
  /* Prevent zoom on input focus on iOS */
  @media screen and (max-width: 768px) {
    input, select, textarea {
      font-size: 16px !important;
    }
  }
}

@layer components {
  .container-safe {
    @apply px-4 sm:px-6 lg:px-8;
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
  }
  
  .touch-target {
    @apply min-h-[44px] min-w-[44px] inline-flex items-center justify-center;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
EOF

# src/main.tsx
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# src/App.tsx
cat > src/App.tsx << 'EOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Layout/Navbar';
import { BottomNav } from '@/components/Layout/BottomNav';
import { Footer } from '@/components/Layout/Footer';
import { Home } from '@/pages/Home';
import { Roadmaps } from '@/pages/Roadmaps';
import { RoadmapDetail } from '@/pages/RoadmapDetail';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Profile } from '@/pages/Profile';
import { SavedRoadmaps } from '@/pages/SavedRoadmaps';
import { QuizDetail } from '@/pages/QuizDetail';
import { FlashcardDetail } from '@/pages/FlashcardDetail';
import { Categories } from '@/pages/Categories';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const queryClient = new QueryClient();

function App() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1 pb-20 md:pb-0 pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/roadmaps" element={<Roadmaps />} />
                <Route path="/roadmaps/:slug" element={<RoadmapDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/quizzes/:id" element={<QuizDetail />} />
                <Route path="/flashcards/:id" element={<FlashcardDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/saved" element={<SavedRoadmaps />} />
              </Routes>
            </main>
            {isMobile && <BottomNav />}
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
EOF

# src/hooks/useMediaQuery.ts
cat > src/hooks/useMediaQuery.ts << 'EOF'
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}
EOF

# src/hooks/useTouch.ts
cat > src/hooks/useTouch.ts << 'EOF'
import { useState, useCallback } from 'react';

export function useTouch() {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);

  const getSwipeDirection = useCallback(() => {
    if (!touchStart || !touchEnd) return null;
    
    const xDiff = touchStart.x - touchEnd.x;
    const yDiff = touchStart.y - touchEnd.y;
    
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      return xDiff > 0 ? 'left' : 'right';
    } else {
      return yDiff > 0 ? 'up' : 'down';
    }
  }, [touchStart, touchEnd]);

  return { onTouchStart, onTouchMove, getSwipeDirection };
}
EOF

# src/types/index.ts
cat > src/types/index.ts << 'EOF'
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
  coverImage?: string;
  createdBy: string;
}

export interface Stage {
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
  createdBy: string;
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
  resource?: string;
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
  resource?: string;
  roadmap?: string;
  cards: Flashcard[];
  createdBy: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  status: number;
}
EOF

# src/services/api.ts
cat > src/services/api.ts << 'EOF'
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

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post<{ token: string; user: User }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; user: User }>('/auth/login', data),
  getMe: () => api.get<{ user: User }>('/auth/me'),
  updateMe: (data: { username?: string; email?: string }) =>
    api.patch<{ user: User }>('/auth/me', data),
};

export const categories = {
  getAll: () => api.get<Category[]>('/categories'),
  getBySlug: (slug: string) => api.get<Category>(`/categories/${slug}`),
};

export const roadmaps = {
  getAll: () => api.get<Roadmap[]>('/roadmaps'),
  getAllAdmin: () => api.get<Roadmap[]>('/roadmaps/admin/all'),
  getBySlug: (slug: string) => api.get<Roadmap>(`/roadmaps/${slug}`),
  create: (data: Partial<Roadmap>) => api.post<Roadmap>('/roadmaps', data),
  update: (id: string, data: Partial<Roadmap>) => api.patch<Roadmap>(`/roadmaps/${id}`, data),
  delete: (id: string) => api.delete(`/roadmaps/${id}`),
  save: (id: string) => api.post(`/roadmaps/${id}/save`),
  getProgress: (id: string) => api.get<{ progress: number }>(`/roadmaps/${id}/progress`),
  updateProgress: (id: string, completedResourceId: string) =>
    api.patch(`/roadmaps/${id}/progress`, { completedResourceId }),
};

export const resources = {
  getByRoadmap: (roadmapId: string) => api.get<Resource[]>('/resources', { params: { roadmapId } }),
  getById: (id: string) => api.get<Resource>(`/resources/${id}`),
};

export const quizzes = {
  getByResource: (resourceId: string) => api.get<Quiz[]>('/quizzes', { params: { resourceId } }),
  getById: (id: string) => api.get<Quiz>(`/quizzes/${id}`),
  getAttempts: (id: string) => api.get<QuizAttempt[]>(`/quizzes/${id}/attempts`),
  submit: (id: string, answers: { questionIndex: number; selectedOption: number }[]) =>
    api.post<{ score: number; passed: boolean; total: number }>(`/quizzes/${id}/submit`, { answers }),
};

export const flashcards = {
  getByResource: (resourceId: string) => api.get<FlashcardSet[]>('/flashcards', { params: { resourceId } }),
  getById: (id: string) => api.get<FlashcardSet>(`/flashcards/${id}`),
};

export default api;
EOF

# src/contexts/AuthContext.tsx
cat > src/contexts/AuthContext.tsx << 'EOF'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/services/api';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          const response = await auth.getMe();
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await auth.login({ email, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setUser(response.data.user);
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await auth.register({ username, email, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
EOF

# src/components/Layout/Navbar.tsx
cat > src/components/Layout/Navbar.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, User, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/roadmaps', label: 'Roadmaps' },
    { path: '/categories', label: 'Categories' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md border-b border-gray-100' : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <Link to="/" className="flex items-center space-x-2 group active:opacity-70 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg md:text-xl tracking-tight text-gray-900">
                Hobby<span className="text-primary">Roadmap</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <div className="flex items-center space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === link.path ? 'text-primary' : 'text-gray-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/saved"
                      className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                    >
                      Saved
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-light/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{user.username}</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/login"
                      className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-dark transition-all duration-200 shadow-sm"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            {isMobile && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="touch-target p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-40 w-full max-w-sm bg-white shadow-xl"
            style={{ top: '56px' }}
          >
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="flex-1 py-6 divide-y divide-gray-100">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between px-6 py-4 text-base font-medium text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    {link.label}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
                
                {user ? (
                  <>
                    <Link
                      to="/saved"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between px-6 py-4 text-base font-medium text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      Saved Roadmaps
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between px-6 py-4 text-base font-medium text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      Profile
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-between w-full px-6 py-4 text-base font-medium text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
                    >
                      Sign Out
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="p-6 space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center text-base font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center text-base font-medium rounded-lg bg-primary text-white hover:bg-primary-dark active:bg-primary-dark transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
EOF

# src/components/Layout/BottomNav.tsx
cat > src/components/Layout/BottomNav.tsx << 'EOF'
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, Bookmark, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/roadmaps', icon: Compass, label: 'Explore' },
    ...(user ? [
      { path: '/saved', icon: Bookmark, label: 'Saved' },
      { path: '/profile', icon: User, label: 'Profile' }
    ] : [
      { path: '/login', icon: User, label: 'Account' }
    ])
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg safe-bottom">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center touch-target"
            >
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center space-y-1 px-3 py-1 rounded-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
EOF

# src/components/Layout/Footer.tsx
cat > src/components/Layout/Footer.tsx << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 mt-20 py-8 md:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 text-center md:text-left">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">
                Hobby<span className="text-primary">Roadmap</span>
              </span>
            </Link>
            <p className="text-sm text-gray-600 max-w-md mx-auto md:mx-0">
              Discover structured learning paths for your favorite hobbies. 
              Track progress, take quizzes, and master new skills at your own pace.
            </p>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/roadmaps" className="hover:text-primary transition-colors">Roadmaps</Link></li>
              <li><Link to="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Account</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Register</Link></li>
              <li><Link to="/profile" className="hover:text-primary transition-colors">Profile</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} HobbyRoadmap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
EOF

# src/components/ui/Spinner.tsx
cat > src/components/ui/Spinner.tsx << 'EOF'
import React from 'react';
import { motion } from 'framer-motion';

export const Spinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
      />
    </div>
  );
};
EOF

# src/components/ui/Card.tsx
cat > src/components/ui/Card.tsx << 'EOF'
import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick, animate = true }) => {
  const Component = animate ? motion.div : 'div';
  const props = animate ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.4 }
  } : {};

  return (
    <Component
      {...props}
      onClick={onClick}
      className={clsx(
        'bg-white rounded-xl border border-gray-200 hover:border-primary/30 transition-all duration-300',
        onClick && 'cursor-pointer active:scale-[0.98]',
        className
      )}
    >
      {children}
    </Component>
  );
};
EOF

# src/pages/Home.tsx
cat > src/pages/Home.tsx << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Trophy, Target, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: BookOpen,
    title: 'Structured Roadmaps',
    description: 'Follow curated learning paths designed by experts to master any hobby efficiently.',
    color: 'bg-primary-100 text-primary'
  },
  {
    icon: Trophy,
    title: 'Track Progress',
    description: 'Monitor your learning journey and celebrate milestones along the way.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Target,
    title: 'Interactive Quizzes',
    description: 'Test your knowledge with engaging quizzes and flashcards.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Zap,
    title: 'Save Resources',
    description: 'Bookmark important resources and access them anytime.',
    color: 'bg-orange-100 text-orange-600'
  },
];

const stats = [
  { value: '50+', label: 'Roadmaps' },
  { value: '500+', label: 'Resources' },
  { value: '10k+', label: 'Active Learners' },
  { value: '95%', label: 'Success Rate' },
];

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-20 overflow-hidden bg-gradient-to-br from-primary-50 via-white to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-primary-100 text-primary px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm font-medium mb-4 md:mb-6"
            >
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              Start Your Learning Journey Today
            </motion.div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 tracking-tight text-gray-900">
              Master Your
              <span className="text-primary block mt-1 md:mt-2">Favorite Hobbies</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Discover structured learning paths, track your progress, and connect with a community of passionate learners.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-medium rounded-lg bg-primary text-white hover:bg-primary-dark transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
              >
                Start Learning
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/roadmaps"
                className="inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary transition-all duration-200 active:scale-95"
              >
                Explore Roadmaps
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-12 md:mt-16 pt-6 md:pt-8 border-t border-gray-200"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
              Powerful tools to help you learn effectively and stay motivated
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-5 md:p-6">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${feature.color} flex items-center justify-center mb-3 md:mb-4`}>
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">{feature.title}</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl md:rounded-3xl p-6 md:p-12 border border-primary/20"
          >
            <div className="text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 max-w-lg mx-auto px-4">
                Join thousands of learners who are mastering new skills with HobbyRoadmap
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base font-medium rounded-lg bg-primary text-white hover:bg-primary-dark transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
EOF

# Create remaining page files (simplified versions for brevity - will add more if needed)
cat > src/pages/Roadmaps.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen, Clock, ChevronRight, Filter } from 'lucide-react';
import { roadmaps, categories } from '@/services/api';
import type { Roadmap, Category } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';

export const Roadmaps: React.FC = () => {
  const [allRoadmaps, setAllRoadmaps] = useState<Roadmap[]>([]);
  const [filteredRoadmaps, setFilteredRoadmaps] = useState<Roadmap[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roadmapsRes, categoriesRes] = await Promise.all([
          roadmaps.getAll(),
          categories.getAll(),
        ]);
        setAllRoadmaps(roadmapsRes.data);
        setFilteredRoadmaps(roadmapsRes.data);
        setCategoriesList(categoriesRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = allRoadmaps;
    
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(r => 
        typeof r.category === 'object' ? r.category._id === selectedCategory : r.category === selectedCategory
      );
    }
    
    setFilteredRoadmaps(filtered);
  }, [searchTerm, selectedCategory, allRoadmaps]);

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen pt-4 md:pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-4">
            Learning Roadmaps
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Discover structured paths to master your favorite hobbies
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 md:mb-12"
        >
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search roadmaps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="touch-target px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                >
                  <option value="">All Categories</option>
                  {categoriesList.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Roadmaps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredRoadmaps.map((roadmap, index) => (
            <motion.div
              key={roadmap._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5) }}
            >
              <Link to={`/roadmaps/${roadmap.slug}`}>
                <Card className="p-5 md:p-6 h-full">
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="p-2 rounded-lg bg-primary-100">
                      <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    {roadmap.progress !== undefined && roadmap.progress > 0 && (
                      <div className="text-xs md:text-sm text-primary font-medium">
                        {Math.round(roadmap.progress)}%
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2 line-clamp-2">
                    {roadmap.title}
                  </h3>
                  
                  {roadmap.description && (
                    <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2">
                      {roadmap.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Updated {new Date(roadmap.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredRoadmaps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No roadmaps found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
EOF

# Create placeholder files for remaining pages
cat > src/pages/RoadmapDetail.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, BookOpen, Link as LinkIcon, CheckCircle, Circle, Layers, HelpCircle } from 'lucide-react';
import { roadmaps, resources, quizzes, flashcards } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/Spinner';
import type { Roadmap, Resource, Quiz, FlashcardSet } from '@/types';

export const RoadmapDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [resourcesList, setResourcesList] = useState<Resource[]>([]);
  const [quizzesList, setQuizzesList] = useState<Quiz[]>([]);
  const [flashcardsList, setFlashcardsList] = useState<FlashcardSet[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'resources' | 'quizzes' | 'flashcards'>('resources');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        const roadmapRes = await roadmaps.getBySlug(slug);
        setRoadmap(roadmapRes.data);
        const resourcesRes = await resources.getByRoadmap(roadmapRes.data._id);
        setResourcesList(resourcesRes.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch roadmap:', error);
        navigate('/roadmaps');
      }
    };
    fetchData();
  }, [slug, navigate]);

  if (isLoading) return <Spinner />;
  if (!roadmap) return null;

  return (
    <div className="min-h-screen pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/roadmaps')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4 touch-target"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">{roadmap.title}</h1>
          {roadmap.description && (
            <p className="text-sm md:text-base text-gray-600">{roadmap.description}</p>
          )}
        </div>

        <div className="border-b border-gray-200 mb-4 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {['resources', 'quizzes', 'flashcards'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === tab ? 'text-primary' : 'text-gray-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'resources' && (
          <div className="space-y-3">
            {resourcesList.map((resource) => (
              <div key={resource._id} className="p-4 bg-white rounded-xl border border-gray-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">{resource.title}</h3>
                    </div>
                    {resource.description && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{resource.description}</p>
                    )}
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <LinkIcon className="w-3 h-3" />
                      View Resource
                    </a>
                  </div>
                  {user && (
                    <button className="flex-shrink-0">
                      <Circle className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
EOF

# Create remaining page placeholder files
cat > src/pages/Categories.tsx << 'EOF'
export const Categories: React.FC = () => {
  return <div className="pt-20 px-4"><h1 className="text-2xl font-bold">Categories</h1></div>;
};
EOF

cat > src/pages/Profile.tsx << 'EOF'
import { useAuth } from '@/contexts/AuthContext';
export const Profile: React.FC = () => {
  const { user } = useAuth();
  return <div className="pt-20 px-4"><h1 className="text-2xl font-bold">Profile: {user?.username}</h1></div>;
};
EOF

cat > src/pages/SavedRoadmaps.tsx << 'EOF'
export const SavedRoadmaps: React.FC = () => {
  return <div className="pt-20 px-4"><h1 className="text-2xl font-bold">Saved Roadmaps</h1></div>;
};
EOF

cat > src/pages/QuizDetail.tsx << 'EOF'
export const QuizDetail: React.FC = () => {
  return <div className="pt-20 px-4"><h1 className="text-2xl font-bold">Quiz Details</h1></div>;
};
EOF

cat > src/pages/FlashcardDetail.tsx << 'EOF'
export const FlashcardDetail: React.FC = () => {
  return <div className="pt-20 px-4"><h1 className="text-2xl font-bold">Flashcard Set</h1></div>;
};
EOF

cat > src/pages/Login.tsx << 'EOF'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-20 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
          <button type="submit" disabled={isLoading}
            className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-all active:scale-95">
            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account? <Link to="/register" className="text-primary font-medium">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};
EOF

cat > src/pages/Register.tsx << 'EOF'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-20 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Start your learning journey</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password (min 6 characters)"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
          <button type="submit" disabled={isLoading}
            className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-all active:scale-95">
            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <Link to="/login" className="text-primary font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};
EOF

# .env file
cat > .env << 'EOF'
VITE_API_URL=http://localhost:5000/api
EOF

echo "✅ All files created successfully!"
echo ""
echo "To get started:"
echo "1. cd into the project directory"
echo "2. Run: npm install"
echo "3. Run: npm run dev"
echo ""
echo "Features included:"
echo "- Responsive design with mobile-first approach"
echo "- Bottom navigation bar for mobile devices"
echo "- Touch-friendly tap targets (44px minimum)"
echo "- Smooth animations and transitions"
echo "- Helvetica font family"
echo "- primary & white color scheme"
echo "- Safe area support for modern phones (notch, home indicator)"
echo "- Swipe gesture support ready"
echo "- Mobile-optimized forms with 16px font (prevents zoom)"
echo ""
echo "Make sure your backend server is running on http://localhost:5000"