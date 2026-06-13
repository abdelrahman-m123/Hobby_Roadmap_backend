// src/pages/RoadmapDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  BookOpen,
  Link as LinkIcon,
  CheckCircle,
  Circle,
  Layers,
  HelpCircle,
  Clock,
  TrendingUp,
  Share2,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  X,
  FileText,
  Youtube,
  File,
  Timer,
  Target,
  Sparkles,
  Users,
  Tag,
  Calendar,
  User,
} from "lucide-react";
import { roadmaps, quizzes, flashcards } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/Spinner";
import { Card } from "@/components/ui/Card";
import type { Roadmap, Resource, Stage, Quiz, FlashcardSet } from "@/types";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

type QuizAnswers = Record<string, Record<number, number>>;

type QuizResult = {
  score: number;
  passed: boolean;
  correct: number;
  total: number;
};

const getReferencedId = (value?: string | { _id?: string } | null) => {
  if (!value) return undefined;
  return typeof value === "string" ? value : value._id;
};

const isRoadmapSavedByUser = (user: any, roadmapId: string) => {
  if (!user?.savedRoadmaps) return false;

  return user.savedRoadmaps.some((savedRoadmap: any) => {
    if (typeof savedRoadmap === "string") {
      return savedRoadmap === roadmapId;
    }

    return savedRoadmap?._id === roadmapId;
  });
};

export const RoadmapDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [, setProgress] = useState(0);
  const [completedResources, setCompletedResources] = useState<string[]>([]);
  const [quizzesList, setQuizzesList] = useState<Quiz[]>([]);
  const [flashcardsList, setFlashcardsList] = useState<FlashcardSet[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "resources" | "stages"
  >("overview");
  const [expandedStages, setExpandedStages] = useState<Set<number>>(new Set());
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [activeFlashcardSetId, setActiveFlashcardSetId] = useState<
    string | null
  >(null);
  const [visibleHints, setVisibleHints] = useState<Set<string>>(new Set());
  const [flippedFlashcards, setFlippedFlashcards] = useState<Set<string>>(
    new Set(),
  );
  const [flashcardPositions, setFlashcardPositions] = useState<
    Record<string, number>
  >({});
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [quizResults, setQuizResults] = useState<Record<string, QuizResult>>(
    {},
  );
  const [quizErrors, setQuizErrors] = useState<Record<string, string>>({});
  const [submittingQuizzes, setSubmittingQuizzes] = useState<Set<string>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingExtras, setIsLoadingExtras] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState<Record<string, number>>({});

  const toggleHint = (cardId: string) => {
    setVisibleHints((current) => {
      const next = new Set(current);

      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }

      return next;
    });
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (user && roadmap) {
      fetchProgress();
    }
  }, [user, roadmap]);

  useEffect(() => {
    if (!user || !roadmap) {
      setIsSaved(false);
      return;
    }

    setIsSaved(isRoadmapSavedByUser(user, roadmap._id));
  }, [user, roadmap]);

  useEffect(() => {
    if (roadmap) {
      fetchExtras();
    }
  }, [roadmap]);

  const fetchData = async () => {
    if (!slug) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await roadmaps.getBySlug(slug);

      const responseData = response.data as Roadmap | { roadmap: Roadmap };
      const roadmapData =
        "roadmap" in responseData ? responseData.roadmap : responseData;

      setRoadmap(roadmapData);

      if (roadmapData.stages && roadmapData.stages.length > 0) {
        setExpandedStages(new Set([0]));
      }
    } catch (error: any) {
      console.error("Failed to fetch roadmap:", error);
      setError(error.response?.data?.message || "Failed to load roadmap");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProgress = async () => {
    if (!roadmap) return;

    try {
      const progressRes = await roadmaps.getProgress(roadmap._id);
      setProgress((progressRes.data as any).progress || 0);

      if (user?.progress) {
        const roadmapProgress = user.progress.find(
          (p: any) => p.roadmap === roadmap._id,
        );

        if (roadmapProgress) {
          setCompletedResources(roadmapProgress.completedResources);
        }
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    }
  };

  const fetchExtras = async () => {
    if (!roadmap) return;

    try {
      setIsLoadingExtras(true);

      const quizResponse = await quizzes.getByRoadmap(roadmap._id);
      const flashcardResponse = await flashcards.getByRoadmap(roadmap._id);

      const quizData = (quizResponse.data || quizResponse) as any;
      const flashcardData = (flashcardResponse.data ||
        flashcardResponse) as any;

      setQuizzesList(
        Array.isArray(quizData)
          ? quizData
          : Array.isArray(quizData.quizzes)
            ? quizData.quizzes
            : [],
      );

      setFlashcardsList(
        Array.isArray(flashcardData)
          ? flashcardData
          : Array.isArray(flashcardData.flashcardSets)
            ? flashcardData.flashcardSets
            : [],
      );
    } catch (error) {
      console.error("Failed to fetch quizzes or flashcards:", error);
    } finally {
      setIsLoadingExtras(false);
    }
  };

  const handleSave = async () => {
    if (!roadmap || !user) {
      navigate("/login");
      return;
    }

    setIsSaving(true);

    try {
      const response = await roadmaps.save(roadmap._id);
      const data = response.data as { saved: boolean; message: string };

      setIsSaved(data.saved);
    } catch (error) {
      console.error("Failed to save roadmap:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResourceComplete = async (
    resourceId: string,
    isCompleted: boolean,
  ) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await roadmaps.updateProgress(roadmap!._id, resourceId);

      let newCompletedResources;

      if (isCompleted) {
        newCompletedResources = [...completedResources, resourceId];
      } else {
        newCompletedResources = completedResources.filter(
          (id) => id !== resourceId,
        );
      }

      setCompletedResources(newCompletedResources);

      const allResources = getAllResources();
      const newProgress =
        allResources.length > 0
          ? (newCompletedResources.length / allResources.length) * 100
          : 0;

      setProgress(newProgress);
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const toggleStage = (index: number) => {
    const newExpanded = new Set(expandedStages);

    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }

    setExpandedStages(newExpanded);
  };

  const getAllResources = (): Resource[] => {
    if (!roadmap?.stages) return [];
    return roadmap.stages.flatMap((stage) => stage.resources || []);
  };

  const getResourceQuizzes = (resourceId: string) => {
    return quizzesList.filter(
      (quiz) => getReferencedId(quiz.resource) === resourceId,
    );
  };

  const getResourceFlashcardSets = (resourceId: string) => {
    return flashcardsList.filter(
      (set) => getReferencedId(set.resource) === resourceId,
    );
  };

  const toggleFlashcard = (cardId: string) => {
    const nextFlipped = new Set(flippedFlashcards);

    if (nextFlipped.has(cardId)) {
      nextFlipped.delete(cardId);
    } else {
      nextFlipped.add(cardId);
    }

    setFlippedFlashcards(nextFlipped);
  };

  const handleQuizAnswer = (
    quizId: string,
    questionIndex: number,
    selectedOption: number,
  ) => {
    setQuizAnswers((current) => ({
      ...current,
      [quizId]: {
        ...(current[quizId] || {}),
        [questionIndex]: selectedOption,
      },
    }));

    setQuizErrors((current) => {
      const next = { ...current };
      delete next[quizId];
      return next;
    });
  };

  const handleQuizSubmit = async (quiz: Quiz) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const answersForQuiz = quizAnswers[quiz._id] || {};
    const questions = quiz.questions || [];

    const missingAnswer = questions.some(
      (_, index) => answersForQuiz[index] === undefined,
    );

    if (missingAnswer) {
      setQuizErrors((current) => ({
        ...current,
        [quiz._id]: "Answer every question before submitting.",
      }));
      return;
    }

    const nextSubmitting = new Set(submittingQuizzes);
    nextSubmitting.add(quiz._id);
    setSubmittingQuizzes(nextSubmitting);

    try {
      const response = await quizzes.submit(
        quiz._id,
        questions.map((_, index) => ({
          questionIndex: index,
          selectedOption: answersForQuiz[index],
        })),
      );

      const result = (response.data || response) as any;

      setQuizResults((current) => ({
        ...current,
        [quiz._id]: {
          score: result.score,
          passed: result.passed,
          correct:
            result.correct ??
            Math.round((result.score / 100) * questions.length),
          total: result.total ?? questions.length,
        },
      }));

      setQuizErrors((current) => {
        const next = { ...current };
        delete next[quiz._id];
        return next;
      });
    } catch (error: any) {
      setQuizErrors((current) => ({
        ...current,
        [quiz._id]:
          error.response?.data?.message ||
          "Failed to submit quiz. Please try again.",
      }));
    } finally {
      setSubmittingQuizzes((current) => {
        const next = new Set(current);
        next.delete(quiz._id);
        return next;
      });
    }
  };

  const closeActivityDialog = () => {
    setActiveQuizId(null);
    setActiveFlashcardSetId(null);
  };

  const renderResourceActivities = (resource: Resource) => {
    const resourceQuizzes = getResourceQuizzes(resource._id);
    const resourceFlashcardSets = getResourceFlashcardSets(resource._id);

    if (isLoadingExtras) {
      return (
        <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-500">
          Loading activities...
        </div>
      );
    }

    if (resourceQuizzes.length === 0 && resourceFlashcardSets.length === 0) {
      return null;
    }

    return (
      <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
        {resourceQuizzes.map((quiz) => (
          <button
            key={quiz._id}
            type="button"
            onClick={() => {
              setActiveFlashcardSetId(null);
              setActiveQuizId(quiz._id);
            }}
            className="inline-flex max-w-full items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-left text-xs font-medium text-primary transition-colors"
          >
            <HelpCircle className="h-4 w-4 flex-shrink-0" />
            <span className="flex-shrink-0 text-gray-500">Quiz</span>
          </button>
        ))}

        {resourceFlashcardSets.map((set) => (
          <button
            key={set._id}
            type="button"
            onClick={() => {
              setActiveQuizId(null);
              setActiveFlashcardSetId(set._id);
            }}
            className="inline-flex max-w-full items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-left text-xs font-medium text-primary transition-colors"
          >
            <Layers className="h-4 w-4 flex-shrink-0" />
            <span className="flex-shrink-0 text-gray-500">Cards</span>
          </button>
        ))}
      </div>
    );
  };

  const renderQuizDialogContent = (quiz: Quiz) => {
    const answersForQuiz = quizAnswers[quiz._id] || {};
    const result = quizResults[quiz._id];
    const error = quizErrors[quiz._id];
    const isSubmitting = submittingQuizzes.has(quiz._id);

    const currentQuestionIndex = currentQuizQuestion[quiz._id] || 0;
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
    const selectedAnswer = answersForQuiz[currentQuestionIndex];

    return (
      <div className="space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span>{quiz.questions?.length || 0} questions</span>
            <span>Passing {quiz.passingScore}%</span>

            {result && (
              <span
                className={
                  result.passed
                    ? "font-medium text-primary-600"
                    : "font-medium text-red-600"
                }
              >
                Score {result.score}%
              </span>
            )}
          </div>

          {quiz.description && (
            <p className="mt-2 text-sm text-gray-600">{quiz.description}</p>
          )}
        </div>

        {currentQuestion && (
          <div
            key={`${quiz._id}-${currentQuestionIndex}`}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
              <span>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
            </div>

            <p className="text-sm font-medium text-gray-900">
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </p>

            <div className="mt-3 space-y-2">
              {currentQuestion.options.map((option, optionIndex) => {
                const isSelected =
                  answersForQuiz[currentQuestionIndex] === optionIndex;

                const showResult = Boolean(result);
                const isCorrect = currentQuestion.correctOption === optionIndex;

                const isIncorrectSelection =
                  showResult && isSelected && !isCorrect;

                return (
                  <label
                    key={`${quiz._id}-${currentQuestionIndex}-${optionIndex}`}
                    className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2 text-sm transition-colors ${showResult && isCorrect
                        ? "border-primary-300 bg-primary-50 text-primary-800"
                        : isIncorrectSelection
                          ? "border-red-300 bg-red-50 text-red-800"
                          : isSelected
                            ? "border-primary bg-primary/10 text-gray-900"
                            : "border-gray-200 bg-white text-gray-600 hover:border-primary/40"
                      }`}
                  >
                    <input
                      type="radio"
                      name={`${quiz._id}-${currentQuestionIndex}`}
                      checked={isSelected}
                      disabled={showResult}
                      onChange={() =>
                        handleQuizAnswer(
                          quiz._id,
                          currentQuestionIndex,
                          optionIndex
                        )
                      }
                      className="mt-0.5"
                    />

                    <span>{option}</span>
                  </label>
                );
              })}
            </div>

            {result && currentQuestion.explanation && (
              <p className="mt-3 rounded-lg bg-gray-50 p-2 text-xs text-gray-600">
                {currentQuestion.explanation}
              </p>
            )}
          </div>
        )}

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        {result ? (
          <div
            className={`rounded-lg p-3 text-sm ${result.passed
                ? "bg-primary-50 text-primary-700"
                : "bg-red-50 text-red-700"
              }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span>
                {result.passed ? "Passed" : "Try again"}: {result.correct} of{" "}
                {result.total} correct ({result.score}%).
              </span>

              <button
                type="button"
                onClick={() => {
                  setQuizResults((current) => {
                    const next = { ...current };
                    delete next[quiz._id];
                    return next;
                  });

                  setQuizAnswers((current) => {
                    const next = { ...current };
                    delete next[quiz._id];
                    return next;
                  });

                  setCurrentQuizQuestion((current) => ({
                    ...current,
                    [quiz._id]: 0,
                  }));
                }}
                className="self-start rounded-lg border border-current px-3 py-1 text-xs font-medium transition-colors hover:bg-white/70 sm:self-auto"
              >
                Retake
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() =>
                setCurrentQuizQuestion((current) => ({
                  ...current,
                  [quiz._id]: Math.max(currentQuestionIndex - 1, 0),
                }))
              }
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {!isLastQuestion ? (
              <button
                type="button"
                disabled={selectedAnswer === undefined}
                onClick={() =>
                  setCurrentQuizQuestion((current) => ({
                    ...current,
                    [quiz._id]: currentQuestionIndex + 1,
                  }))
                }
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleQuizSubmit(quiz)}
                disabled={isSubmitting || selectedAnswer === undefined}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderFlashcardDialogContent = (set: FlashcardSet) => {
    const totalCards = set.cards.length;
    const currentIndex = Math.min(
      flashcardPositions[set._id] || 0,
      Math.max(totalCards - 1, 0),
    );
    const currentCard = set.cards[currentIndex];
    const currentCardId = `${set._id}-${currentIndex}`;
    const isFlipped = flippedFlashcards.has(currentCardId);

    const goToCard = (nextIndex: number) => {
      setFlashcardPositions((current) => ({
        ...current,
        [set._id]: Math.min(Math.max(nextIndex, 0), totalCards - 1),
      }));
    };

    if (!currentCard) {
      return (
        <p className="text-sm text-gray-500">
          No flashcards are available in this set.
        </p>
      );
    }

    return (
      <div className="space-y-4">
        <div className="h-56 perspective-[1000px]">
          <button
            key={currentCardId}
            type="button"
            onClick={() => toggleFlashcard(currentCardId)}
            className={`relative h-full w-full rounded-lg text-left transition-transform duration-300 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
          >
            <div className="absolute inset-0 mx-20 flex items-center justify-center rounded-lg bg-primary-light/20 p-5 text-center [backface-visibility:hidden]">
              <div className="font-medium leading-relaxed text-gray-900">
                {currentCard.front}
              </div>
            </div>

            <div className="absolute inset-0 mx-20 flex items-center justify-center rounded-lg bg-primary-light/10 p-5 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="font-medium leading-relaxed text-gray-900">
                {currentCard.back}
              </div>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goToCard(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {totalCards}
          </span>

          <button
            type="button"
            onClick={() => goToCard(currentIndex + 1)}
            disabled={currentIndex >= totalCards - 1}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderActivityDialog = () => {
    const activeQuiz = activeQuizId
      ? quizzesList.find((quiz) => quiz._id === activeQuizId)
      : null;

    const activeFlashcardSet = activeFlashcardSetId
      ? flashcardsList.find((set) => set._id === activeFlashcardSetId)
      : null;

    const activeTitle = activeQuiz?.title || activeFlashcardSet?.title;

    if (!activeTitle) return null;

    return (
      <AnimatePresence>
        <motion.div
          key="activity-dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeActivityDialog}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="activity-dialog-title"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-4">
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2 text-xs font-medium text-gray-500">
                  {activeQuiz ? (
                    <>
                      <HelpCircle className="h-4 w-4 text-primary" />
                      Quiz
                    </>
                  ) : (
                    <>
                      <Layers className="h-4 w-4 text-primary" />
                      Flashcards
                    </>
                  )}
                </div>

                <h2
                  id="activity-dialog-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  {activeTitle}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeActivityDialog}
                className="rounded-lg p-2 items-center text-center justify-center text-gray-400 transition-colors hover:text-gray-700"
                aria-label="Close dialog"
              >
                <X className="h-5 justify-center self-center w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              {activeQuiz && renderQuizDialogContent(activeQuiz)}
              {activeFlashcardSet &&
                renderFlashcardDialogContent(activeFlashcardSet)}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "youtube":
        return <Youtube className="w-4 h-4 text-red-500" />;
      case "pdf":
        return <File className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-blue-500" />;
    }
  };

  const getDifficultyDetails = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return {
          color: "text-primary-600",
          bg: "bg-primary-100",
          label: "Beginner",
        };
      case "intermediate":
        return {
          color: "text-blue-600",
          bg: "bg-blue-100",
          label: "Intermediate",
        };
      case "advanced":
        return {
          color: "text-purple-600",
          bg: "bg-purple-100",
          label: "Advanced",
        };
      default:
        return {
          color: "text-gray-600",
          bg: "bg-gray-100",
          label: "All Levels",
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16">
        <Spinner />
        <p className="text-gray-500 mt-4">Loading roadmap...</p>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16 px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-red-600" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Roadmap Not Found
          </h2>

          <p className="text-gray-600 mb-4">
            {error || "The roadmap you're looking for doesn't exist."}
          </p>

          <button
            onClick={() => navigate("/roadmaps")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Browse Roadmaps
          </button>
        </div>
      </div>
    );
  }

  const difficultyDetails = getDifficultyDetails(roadmap.difficulty);
  const allResources = getAllResources();
  const totalResources = allResources.length;
  const completedCount = completedResources.length;
  const progressPercentage =
    totalResources > 0 ? (completedCount / totalResources) * 100 : 0;

  return (
    <div className="min-h-screen bg-background pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/roadmaps")}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4 touch-target"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Roadmaps</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {roadmap.coverImage && (
            <div className="mb-6 rounded-xl overflow-hidden">
              <img
                src={roadmap.coverImage}
                alt={roadmap.title}
                className="w-full h-48 md:h-64 object-cover"
              />
            </div>
          )}

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {roadmap.category && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    {typeof roadmap.category === "object" &&
                      roadmap.category.icon && (
                        <CategoryIcon
                          icon={roadmap.category.icon}
                          className="w-4 h-4"
                        />
                      )}
                    <span>
                      {typeof roadmap.category === "object"
                        ? roadmap.category.name
                        : roadmap.category}
                    </span>
                  </span>
                )}

                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${difficultyDetails.bg} ${difficultyDetails.color}`}
                >
                  <span>{difficultyDetails.label}</span>
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                {roadmap.title}
              </h1>

              {roadmap.description && (
                <p className="text-base md:text-lg text-gray-600 max-w-3xl">
                  {roadmap.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 mt-6">
                {roadmap.estimatedTime && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{roadmap.estimatedTime}</span>
                  </div>
                )}

                {roadmap.enrolledCount > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{roadmap.enrolledCount} enrolled</span>
                  </div>
                )}

                {roadmap.stages && roadmap.stages.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Layers className="w-4 h-4" />
                    <span>{roadmap.stages.length} stages</span>
                  </div>
                )}

                {totalResources > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <BookOpen className="w-4 h-4" />
                    <span>{totalResources} resources</span>
                  </div>
                )}

                {quizzesList.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <HelpCircle className="w-4 h-4" />
                    <span>{quizzesList.length} quizzes</span>
                  </div>
                )}

                {flashcardsList.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Layers className="w-4 h-4" />
                    <span>{flashcardsList.length} flashcard sets</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {formatDate(roadmap.updatedAt)}</span>
                </div>
              </div>

              {roadmap.tags && roadmap.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {roadmap.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                    >
                      <Tag className="w-3 h-3" />#{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 disabled:opacity-50 ${isSaved
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-gray-200 hover:border-primary/50"
                  }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      {isSaving ? "Saving..." : "Saved"}
                    </span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span className="text-sm">
                      {isSaving ? "Saving..." : "Save"}
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: roadmap.title,
                      text: roadmap.description,
                      url: window.location.href,
                    });
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-primary/50 transition-all duration-200"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          {user && totalResources > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-gray-700">
                    Your Progress
                  </span>
                </div>

                <span className="text-sm font-semibold text-primary">
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-primary rounded-full"
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                {completedCount} of {totalResources} resources completed
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border-b border-gray-200 mb-6 overflow-x-auto"
        >
          <div className="flex gap-6 min-w-max">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === "overview"
                  ? "text-primary"
                  : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Overview</span>

              {activeTab === "overview" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab("stages")}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === "stages"
                  ? "text-primary"
                  : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <Layers className="w-4 h-4" />
              <span>Learning Path</span>

              {roadmap.stages && roadmap.stages.length > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {roadmap.stages.length}
                </span>
              )}

              {activeTab === "stages" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab("resources")}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === "resources"
                  ? "text-primary"
                  : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>All Resources</span>

              {totalResources > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {totalResources}
                </span>
              )}

              {activeTab === "resources" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  About This Roadmap
                </h2>

                <p className="text-gray-600 leading-relaxed">
                  {roadmap.description}
                </p>

                {roadmap.createdBy && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>
                      Created by{" "}
                      {typeof roadmap.createdBy === "object"
                        ? roadmap.createdBy.username
                        : roadmap.createdBy}
                    </span>
                  </div>
                )}
              </Card>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <Layers className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {roadmap.stages?.length || 0}
                  </div>
                  <div className="text-xs text-gray-500">Learning Stages</div>
                </Card>

                <Card className="p-4 text-center">
                  <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {totalResources}
                  </div>
                  <div className="text-xs text-gray-500">Total Resources</div>
                </Card>

                <Card className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {roadmap.enrolledCount || 0}
                  </div>
                  <div className="text-xs text-gray-500">Students Enrolled</div>
                </Card>

                <Card className="p-4 text-center">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {roadmap.estimatedTime || "N/A"}
                  </div>
                  <div className="text-xs text-gray-500">Estimated Time</div>
                </Card>
              </div>

              {roadmap.tags && roadmap.tags.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    Topics Covered
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {roadmap.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {activeTab === "stages" && (
            <motion.div
              key="stages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {roadmap.stages && roadmap.stages.length > 0 ? (
                roadmap.stages.map((stage: Stage, index: number) => {
                  const stageResources = stage.resources || [];
                  const completedStageResources = stageResources.filter((r) =>
                    completedResources.includes(r._id),
                  );

                  const stageProgress =
                    stageResources.length > 0
                      ? (completedStageResources.length /
                        stageResources.length) *
                      100
                      : 0;

                  return (
                    <Card key={stage._id || index} className="overflow-hidden">
                      <button
                        onClick={() => toggleStage(index)}
                        className="w-full p-5 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                                {index + 1}
                              </div>

                              <h3 className="font-semibold text-gray-900 text-lg">
                                {stage.title}
                              </h3>
                            </div>

                            {stage.description && (
                              <p className="text-sm text-gray-500 ml-11">
                                {stage.description}
                              </p>
                            )}

                            {user && stageResources.length > 0 && (
                              <div className="ml-11 mt-3">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-gray-500">
                                    Stage Progress
                                  </span>
                                  <span className="text-primary font-medium">
                                    {Math.round(stageProgress)}%
                                  </span>
                                </div>

                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full transition-all duration-300"
                                    style={{ width: `${stageProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {expandedStages.has(index) ? (
                            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedStages.has(index) &&
                          stageResources.length > 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border-t border-gray-100"
                            >
                              <div className="p-5 space-y-3">
                                {stageResources.map((resource: Resource) => {
                                  const isCompleted =
                                    completedResources.includes(resource._id);

                                  return (
                                    <div
                                      key={resource._id}
                                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                      {user && (
                                        <button
                                          onClick={() =>
                                            handleResourceComplete(
                                              resource._id,
                                              !isCompleted,
                                            )
                                          }
                                          className="flex-shrink-0 mt-0.5"
                                        >
                                          {isCompleted ? (
                                            <CheckCircle className="w-5 h-5 text-primary-500" />
                                          ) : (
                                            <Circle className="w-5 h-5 text-gray-400 hover:text-primary transition-colors" />
                                          )}
                                        </button>
                                      )}

                                      <div className="flex-shrink-0">
                                        {getResourceIcon(resource.type)}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <p
                                          className={`text-sm font-medium ${isCompleted
                                              ? "text-gray-500 line-through"
                                              : "text-gray-900"
                                            }`}
                                        >
                                          {resource.title}
                                        </p>

                                        {resource.description && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            {resource.description}
                                          </p>
                                        )}

                                        <a
                                          href={resource.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
                                        >
                                          <LinkIcon className="w-3 h-3" />
                                          View Resource
                                        </a>

                                        {renderResourceActivities(resource)}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                      </AnimatePresence>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <Layers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No learning stages available yet.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "resources" && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {allResources.length > 0 ? (
                allResources.map((resource, index) => {
                  const isCompleted = completedResources.includes(resource._id);

                  return (
                    <motion.div
                      key={resource._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Card className="p-4 hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                          {user && (
                            <button
                              onClick={() =>
                                handleResourceComplete(
                                  resource._id,
                                  !isCompleted,
                                )
                              }
                              className="flex-shrink-0 mt-1"
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-primary-500" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400 hover:text-primary transition-colors" />
                              )}
                            </button>
                          )}

                          <div className="flex-shrink-0">
                            {getResourceIcon(resource.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3
                              className={`font-semibold ${isCompleted
                                  ? "text-gray-500 line-through"
                                  : "text-gray-900"
                                }`}
                            >
                              {resource.title}
                            </h3>

                            {resource.description && (
                              <p className="text-sm text-gray-500 mt-1">
                                {resource.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              {resource.duration && (
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <Timer className="w-3 h-3" />
                                  <span>{resource.duration}</span>
                                </div>
                              )}

                              {resource.type && (
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <span className="capitalize">
                                    {resource.type}
                                  </span>
                                </div>
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

                            {renderResourceActivities(resource)}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No resources available yet.</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Check back soon for updates!
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {renderActivityDialog()}
      </div>
    </div>
  );
};