import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, TrendingUp, Bookmark } from "lucide-react";
import { Card } from "./Card";
import { CategoryIcon } from "./CategoryIcon";
import type { Roadmap } from "@/types";

interface RoadmapCardProps {
  roadmap: Roadmap;
  onUnsave?: (id: string) => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "bg-primary-100 text-primary-700";
    case "intermediate":
      return "bg-blue-100 text-blue-700";
    case "advanced":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getRoadmapCategoryIcon = (roadmap: Roadmap) => {
  if (roadmap.category && typeof roadmap.category === "object") {
    return roadmap.category.icon || "book";
  }

  return "book";
};

const getRoadmapCategoryName = (roadmap: Roadmap) => {
  if (roadmap.category && typeof roadmap.category === "object") {
    return roadmap.category.name;
  }

  return null;
};

export const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap, onUnsave }) => {
  const categoryIcon = getRoadmapCategoryIcon(roadmap);
  const categoryName = getRoadmapCategoryName(roadmap);

  return (
    <div className="group relative h-full">
      {onUnsave && (
        <div className="absolute right-3 top-3 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onUnsave(roadmap._id);
            }}
            className="flex items-center justify-center rounded-full border border-gray-100 bg-white/90 p-2 text-primary shadow-sm transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow active:scale-95"
            title="Unsave Roadmap"
            type="button"
          >
            <Bookmark className="h-4 w-4 fill-primary text-primary" />
          </button>
        </div>
      )}

      <Link to={`/roadmaps/${roadmap.slug}`} className="block h-full">
        <Card className="h-full overflow-hidden border border-gray-100 transition-all duration-300" animate={false}>
          {roadmap.coverImage ? (
            <div className="relative h-32 overflow-hidden md:h-40">
              <img
                src={roadmap.coverImage}
                alt={roadmap.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />

              {categoryName && (
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                  <CategoryIcon icon={categoryIcon} className="h-3.5 w-3.5 text-primary" />
                  <span>{categoryName}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100/50 md:h-40">
              <CategoryIcon icon={categoryIcon} className="h-12 w-12 text-primary/35" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
            </div>
          )}

          <div className="flex h-[calc(100%-8rem)] min-h-[220px] flex-col justify-between p-5 md:h-[calc(100%-10rem)] md:p-6">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getDifficultyColor(roadmap.difficulty)}`}>
                  {roadmap.difficulty || "Beginner"}
                </span>

                {roadmap.enrolledCount > 0 && (
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    <span>{roadmap.enrolledCount} enrolled</span>
                  </div>
                )}
              </div>

              <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900 transition-colors duration-200 md:text-lg">
                {roadmap.title}
              </h3>

              {roadmap.description && (
                <p className="mb-4 line-clamp-2 text-xs text-gray-600 md:text-sm">
                  {roadmap.description}
                </p>
              )}
            </div>

            <div>
              {roadmap.tags && roadmap.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1">
                  {roadmap.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="rounded-full border border-gray-100 bg-gray-50 px-2 py-0.5 text-xs text-gray-600">
                      #{tag}
                    </span>
                  ))}
                  {roadmap.tags.length > 3 && (
                    <span className="rounded-full border border-gray-100 bg-gray-50 px-2 py-0.5 text-xs text-gray-600">
                      +{roadmap.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  {roadmap.estimatedTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span>{roadmap.estimatedTime}</span>
                    </div>
                  )}
                  {roadmap.stages && roadmap.stages.length > 0 && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3 text-gray-400" />
                      <span>{roadmap.stages.length} stages</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
};
