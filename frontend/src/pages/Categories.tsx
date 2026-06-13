// src/pages/Categories.tsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  Calendar,
  User,
  Eye,
  AlertCircle,
} from "lucide-react";
import { categories, roadmaps } from "@/services/api";
import type { Category, Roadmap } from "@/types";
import { Spinner } from "@/components/ui/Spinner";
import { RoadmapCard } from "@/components/ui/RoadmapCard";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { useAuth } from "@/contexts/AuthContext";

const categoryColors = [
  "bg-primary-100 text-primary-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-indigo-100 text-indigo-700",
  "bg-teal-100 text-teal-700",
  "bg-red-100 text-red-700",
  "bg-yellow-100 text-yellow-700",
  "bg-cyan-100 text-cyan-700",
];

const formatDate = (dateString?: string) => {
  if (!dateString) return "Unknown";

  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const Categories: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryIdFromUrl = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoryRoadmaps, setCategoryRoadmaps] = useState<Roadmap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRoadmaps, setIsLoadingRoadmaps] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchCategoryDetails();
  }, [categoryIdFromUrl]);

  const fetchCategoryDetails = async () => {
    if (!categoryIdFromUrl) {
      setError("No category selected.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await categories.getAll();

      let categoriesData: Category[] = [];

      if (response.data && Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (
        response.data &&
        response.data.categories &&
        Array.isArray(response.data.categories)
      ) {
        categoriesData = response.data.categories;
      } else if (Array.isArray(response)) {
        categoriesData = response;
      }

      const matchedCategory = categoriesData.find(
        (category) => category._id === categoryIdFromUrl
      );

      if (!matchedCategory) {
        setSelectedCategory(null);
        setError("Category not found.");
        return;
      }

      setSelectedCategory(matchedCategory);
      await fetchRoadmapsForCategory(matchedCategory._id);
    } catch (error: any) {
      console.error("Failed to fetch category details:", error);
      setError(error.response?.data?.message || "Failed to load category");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoadmapsForCategory = async (categoryId: string) => {
    try {
      setIsLoadingRoadmaps(true);

      const response = await roadmaps.getAll();

      let roadmapsData: Roadmap[] = [];

      if (response.data && Array.isArray(response.data)) {
        roadmapsData = response.data;
      } else if (
        response.data &&
        response.data.roadmaps &&
        Array.isArray(response.data.roadmaps)
      ) {
        roadmapsData = response.data.roadmaps;
      } else if (Array.isArray(response)) {
        roadmapsData = response;
      }

      const filtered = roadmapsData.filter((roadmap) =>
        typeof roadmap.category === "object"
          ? roadmap.category?._id === categoryId
          : roadmap.category === categoryId
      );

      setCategoryRoadmaps(filtered);
    } catch (error) {
      console.error("Failed to fetch roadmaps:", error);
      setCategoryRoadmaps([]);
    } finally {
      setIsLoadingRoadmaps(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Spinner />
      </div>
    );
  }

  if (error || !selectedCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Category
          </h2>

          <p className="text-gray-600 mb-4">
            {error || "Category not found."}
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const colorClass = categoryColors[0];

  return (
    <div className="min-h-screen bg-background pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4 md:mb-6"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors touch-target"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl ${colorClass} flex items-center justify-center flex-shrink-0`}
              >
                <CategoryIcon
                  icon={selectedCategory.icon || "📚"}
                  className="w-10 h-10 md:w-12 md:h-12"
                />
              </div>

              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                  {selectedCategory.name}
                </h1>

                {selectedCategory.description && (
                  <p className="text-sm md:text-base text-gray-600 mt-2 max-w-2xl">
                    {selectedCategory.description}
                  </p>
                )}

              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                <BookOpen className="w-4 h-4" />
                <span>{categoryRoadmaps.length} roadmaps available</span>
              </div>

              {isAdmin && (
                <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span>
                      Created by:{" "}
                      {typeof selectedCategory.createdBy === "object" &&
                      selectedCategory.createdBy
                        ? selectedCategory.createdBy.username
                        : "Unknown"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Created: {formatDate(selectedCategory.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Updated: {formatDate(selectedCategory.updatedAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Eye className="w-3 h-3" />
                    <span>Slug: {selectedCategory.slug}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </motion.div>

        <div id="category-roadmaps">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            Roadmaps in this Category
          </h2>

          {isLoadingRoadmaps ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : categoryRoadmaps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {categoryRoadmaps.map((roadmap, index) => (
                <motion.div
                  key={roadmap._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.5) }}
                >
                  <RoadmapCard roadmap={roadmap} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">
                No roadmaps available in this category yet.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Check back soon for new content!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};