import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Trophy, Target, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { categories } from "@/services/api";
import type { Category } from "@/types";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

const features = [
  {
    icon: BookOpen,
    title: "Structured Roadmaps",
    description:
      "Follow curated learning paths to master any hobby efficiently.",
    color: "bg-primary-100 text-primary",
  },
  {
    icon: Trophy,
    title: "Track Progress",
    description:
      "Monitor your learning journey and celebrate milestones along the way.",
    color: "bg-primary-100 text-primary",
  },
  {
    icon: Target,
    title: "Interactive Quizzes",
    description: "Test your knowledge with engaging quizzes and flashcards.",
    color: "bg-primary-100 text-primary",
  },
  {
    icon: Zap,
    title: "Save Resources",
    description: "Bookmark important resources and access them anytime.",
    color: "bg-primary-100 text-primary",
  },
];

export const Home: React.FC = () => {
  const [homeCategories, setHomeCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchHomeCategories();
  }, []);

  const fetchHomeCategories = async () => {
    try {
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

      setHomeCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch home categories:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
                                    
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight leading-[1.05] text-foreground"> 
              RoadMaps To Master Your
                Favorite Hobbies
            </h1>
          </motion.div>
        </div>

        {/* Categories Section */}
        {homeCategories.length > 0 && (
          <div className="max-w-7xl mt-14 md:mt-16 mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              {homeCategories.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.05, 0.4) }}
                >
                  <Link to={`/categories?category=${category._id}`}>
                    <Card className="p-5 h-full bg-card  hover:-translate-y-0.5 transition-all duration-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary flex items-center justify-center flex-shrink-0">
                          <CategoryIcon
                            icon={category.icon || "📚"}
                            className="w-6 h-6"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-foreground mb-1 line-clamp-1">
                            {category.name}
                          </h3>

                          {category.description && (
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold font-display text-foreground mb-3 md:mb-4">
              Everything You Need to Succeed
            </h2>

            <p className="text-sm font-display md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Multiple tools to help you learn effectively and stay motivated.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-5 md:p-6 bg-card  transition-all duration-200"
              >
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${feature.color} flex items-center justify-center mb-3 md:mb-4`}
                >
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>

                <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 md:mb-2">
                  {feature.title}
                </h3>

                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};