// src/pages/Roadmaps.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  BookOpen, 
  X,
  Loader2,
  SlidersHorizontal
} from 'lucide-react';
import { roadmaps, categories } from '@/services/api';
import type { Roadmap, Category } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { RoadmapCard } from '@/components/ui/RoadmapCard';

export const Roadmaps: React.FC = () => {
  const [allRoadmaps, setAllRoadmaps] = useState<Roadmap[]>([]);
  const [filteredRoadmaps, setFilteredRoadmaps] = useState<Roadmap[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const difficulties = [
    { value: '', label: 'All Difficulties' },
    { value: 'beginner', label: '🌱 Beginner', color: 'text-primary-600' },
    { value: 'intermediate', label: '📚 Intermediate', color: 'text-blue-600' },
    { value: 'advanced', label: '🚀 Advanced', color: 'text-purple-600' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'az', label: 'A to Z' },
    { value: 'za', label: 'Z to A' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortRoadmaps();
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy, allRoadmaps]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching roadmaps and categories...');
      
      const [roadmapsRes, categoriesRes] = await Promise.all([
        roadmaps.getAll(),
        categories.getAll(),
      ]);
      
      console.log('Roadmaps response:', roadmapsRes);
      console.log('Categories response:', categoriesRes);
      
      // Handle different response formats
      let roadmapsData = [];
      if (roadmapsRes.data && Array.isArray(roadmapsRes.data)) {
        roadmapsData = roadmapsRes.data;
      } else if (roadmapsRes.data && roadmapsRes.data.roadmaps && Array.isArray(roadmapsRes.data.roadmaps)) {
        roadmapsData = roadmapsRes.data.roadmaps;
      } else if (Array.isArray(roadmapsRes)) {
        roadmapsData = roadmapsRes;
      }
      
      let categoriesData = [];
      if (categoriesRes.data && Array.isArray(categoriesRes.data)) {
        categoriesData = categoriesRes.data;
      } else if (categoriesRes.data && categoriesRes.data.categories && Array.isArray(categoriesRes.data.categories)) {
        categoriesData = categoriesRes.data.categories;
      } else if (Array.isArray(categoriesRes)) {
        categoriesData = categoriesRes;
      }
      
      setAllRoadmaps(roadmapsData);
      setFilteredRoadmaps(roadmapsData);
      setCategoriesList(categoriesData);
      
      if (roadmapsData.length === 0) {
        setError('No roadmaps found. Please check back later.');
      }
    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      setError(err.response?.data?.message || 'Failed to load roadmaps');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortRoadmaps = () => {
    let filtered = [...allRoadmaps];
    
    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(roadmap =>
        roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(roadmap => {
        const categoryId = typeof roadmap.category === 'object' 
          ? roadmap.category?._id 
          : roadmap.category;
        return categoryId === selectedCategory;
      });
    }
    
    // Filter by difficulty
    if (selectedDifficulty) {
      filtered = filtered.filter(roadmap => roadmap.difficulty === selectedDifficulty);
    }
    
    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0));
        break;
      case 'az':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    
    setFilteredRoadmaps(filtered);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setSortBy('newest');
    setShowFilters(false);
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedDifficulty || sortBy !== 'newest';


  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-gray-500">Loading roadmaps...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center my-8 md:my-12"
        >
          <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-3 md:mb-4">
            Learning Roadmaps
          </h1>
          <p className="text-sm font-display md:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Discover structured paths to master your favorite hobbies, from beginner to advanced
          </p>
        </motion.div>

        {/* Search and Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search roadmaps by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`touch-target px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                  hasActiveFilters 
                    ? 'bg-primary text-white border-primary' 
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-white text-primary rounded-full">
                    {[selectedCategory, selectedDifficulty, searchTerm].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {/* Active Filters Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                    Search: {searchTerm}
                    <button onClick={() => setSearchTerm('')} className="hover:bg-primary/20 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                    Category: {categoriesList.find(c => c._id === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory('')} className="hover:bg-primary/20 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedDifficulty && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                    <button onClick={() => setSelectedDifficulty('')} className="hover:bg-primary/20 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {sortBy !== 'newest' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                    Sort: {sortOptions.find(s => s.value === sortBy)?.label}
                    <button onClick={() => setSortBy('newest')} className="hover:bg-primary/20 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-gray-500 hover:text-primary transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Expanded Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden"
              >
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                      >
                        <option value="">All Categories</option>
                        {categoriesList.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Difficulty Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty Level
                      </label>
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                      >
                        {difficulties.map((diff) => (
                          <option key={diff.value} value={diff.value}>
                            {diff.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort By
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Found <span className="font-semibold text-gray-900">{filteredRoadmaps.length}</span> roadmaps
          </p>
        </div>

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-gray-500 text-lg">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Roadmaps Grid */}
        {!error && (
          <AnimatePresence mode="wait">
            {filteredRoadmaps.length > 0 ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
              >
                {filteredRoadmaps.map((roadmap, index) => (
                  <motion.div
                    key={roadmap._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.05, 0.5) }}
                  >
                    <RoadmapCard roadmap={roadmap} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No roadmaps found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your filters or search terms
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};