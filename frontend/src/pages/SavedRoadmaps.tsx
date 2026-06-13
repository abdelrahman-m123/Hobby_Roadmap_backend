import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Bookmark,
  AlertCircle,
} from "lucide-react";
import { auth, roadmaps } from "@/services/api";
import type { Roadmap } from "@/types";
import { RoadmapCard } from "@/components/ui/RoadmapCard";
import { Spinner } from "@/components/ui/Spinner";

export const SavedRoadmaps: React.FC = () => {
  const [savedRoadmaps, setSavedRoadmaps] = useState<Roadmap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedRoadmaps();
  }, []);

  const fetchSavedRoadmaps = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userResponse = await auth.getMe();

      const user = userResponse.data.user;

      const savedIds = (user.savedRoadmaps || []).map((item: any) =>
        typeof item === "object" ? item._id : item
      );

      if (savedIds.length === 0) {
        setSavedRoadmaps([]);
        return;
      }

      const roadmapsResponse = await roadmaps.getAll();

      let roadmapsData: Roadmap[] = [];

      if (
        roadmapsResponse.data &&
        Array.isArray((roadmapsResponse.data as any).roadmaps)
      ) {
        roadmapsData = (roadmapsResponse.data as any).roadmaps;
      } else if (Array.isArray(roadmapsResponse.data)) {
        roadmapsData = roadmapsResponse.data;
      }

      const filtered = roadmapsData.filter((roadmap) =>
        savedIds.includes(roadmap._id)
      );

      setSavedRoadmaps(filtered);
    } catch (error: any) {
      console.error("Failed to fetch saved roadmaps:", error);
      setError(error.response?.data?.message || "Failed to load saved roadmaps");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = async (roadmapId: string) => {
    try {
      await roadmaps.save(roadmapId);

      setSavedRoadmaps((prev) =>
        prev.filter((roadmap) => roadmap._id !== roadmapId)
      );
    } catch (error: any) {
      console.error("Failed to unsave roadmap:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>

          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Saved Roadmaps
          </h1>

          <p className="text-gray-600 mb-4">{error}</p>

          <button
            onClick={fetchSavedRoadmaps}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary flex items-center justify-center">
              <Bookmark className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-3xl font-display md:text-5xl font-bold text-gray-900">
                Saved Roadmaps
              </h1>
              <p className="text-sm font-display md:text-base text-gray-600 mt-1">
                Continue learning from the roadmaps you saved
              </p>
            </div>
          </div>
        </motion.div>

        {savedRoadmaps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {savedRoadmaps.map((roadmap, index) => (
              <motion.div
                key={roadmap._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.5) }}
              >
                <RoadmapCard roadmap={roadmap} onUnsave={handleUnsave} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />

            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              No saved roadmaps yet
            </h2>

            <p className="text-sm text-gray-500 mb-5">
              Save roadmaps you like and they will appear here.
            </p>

            <Link
              to="/roadmaps"
              className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Explore Roadmaps
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};