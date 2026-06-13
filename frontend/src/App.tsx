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
import { AdminDashboard } from '@/pages/admin/AdminDashboard';

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
                <Route path="/admin" element={<AdminDashboard />} />
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
