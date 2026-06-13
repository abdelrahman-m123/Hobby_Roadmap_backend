import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Bike,
  BookOpen,
  Brush,
  Camera,
  CheckCircle,
  Clock,
  Code2,
  CookingPot,
  Dumbbell,
  FileText,
  Flower2,
  Gamepad2,
  Guitar,
  Hammer,
  Heart,
  HelpCircle,
  Layers,
  Loader2,
  Mic2,
  Music,
  Palette,
  Pencil,
  PenTool,
  Plane,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Shirt,
  Tag,
  Trash2,
  Trophy,
  Upload,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

interface Stage {
  title: string;
  description?: string;
  order: number;
  resources: string[];
}

interface Roadmap {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  difficulty: string;
  estimatedTime?: string;
  tags: string[];
  stages: Stage[];
  isPublished: boolean;
  enrolledCount: number;
  category?: string | Category;
}

interface Resource {
  _id: string;
  title: string;
  description?: string;
  type: "youtube" | "pdf";
  url: string;
  duration?: string;
  tags: string[];
  order: number;
  stage?: string;
  roadmap: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctOption: number;
  explanation?: string;
}

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore: number;
  resource?: string;
  roadmap?: string;
}

interface FlashCard {
  front: string;
  back: string;
  hint?: string;
}

interface FlashcardSet {
  _id: string;
  title: string;
  description?: string;
  cards: FlashCard[];
  resource?: string;
  roadmap?: string;
}

type TabType = "categories" | "roadmaps" | "resources" | "quizzes" | "flashcards";

// ─── API shim — replace with your real API service if you already have one ───
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const jsonHeaders = () => ({
  "Content-Type": "application/json",
  ...authHeaders(),
});

const api = {
  categories: {
    getAll: () =>
      fetch("/api/categories")
        .then((r) => r.json())
        .then((d) => d.categories ?? []),
    create: (data: any) =>
      fetch("/api/categories", {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: any) =>
      fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: jsonHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },
  roadmaps: {
    getAllAdmin: () =>
      fetch("/api/roadmaps/admin/all", { headers: authHeaders() })
        .then((r) => r.json())
        .then((d) => d.roadmaps ?? []),
    create: (data: any) =>
      fetch("/api/roadmaps", {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: any) =>
      fetch(`/api/roadmaps/${id}`, {
        method: "PATCH",
        headers: jsonHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetch(`/api/roadmaps/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },
  resources: {
    getByRoadmap: (id: string) =>
      fetch(`/api/resources?roadmap=${id}`, { headers: authHeaders() })
        .then((r) => r.json())
        .then((d) => d.resources ?? []),
    create: (data: any) =>
      fetch("/api/resources", {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: any) =>
      fetch(`/api/resources/${id}`, {
        method: "PATCH",
        headers: jsonHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetch(`/api/resources/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },
  quizzes: {
    getByResource: (id: string) =>
      fetch(`/api/quizzes?resource=${id}`, { headers: authHeaders() })
        .then((r) => r.json())
        .then((d) => d.quizzes ?? []),
    getByRoadmap: (id: string) =>
      fetch(`/api/quizzes?roadmap=${id}`, { headers: authHeaders() })
        .then((r) => r.json())
        .then((d) => d.quizzes ?? []),
    create: (data: any) =>
      fetch("/api/quizzes", {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    importFromJson: (data: any) =>
      fetch("/api/quizzes/import", {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: any) =>
      fetch(`/api/quizzes/${id}`, {
        method: "PATCH",
        headers: jsonHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetch(`/api/quizzes/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },
  flashcards: {
    getByRoadmap: (id: string) =>
      fetch(`/api/flashcards?roadmap=${id}`, { headers: authHeaders() })
        .then((r) => r.json())
        .then((d) => d.flashcardSets ?? []),
    create: (data: any) =>
      fetch("/api/flashcards", {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    importFromJson: (data: any) =>
      fetch("/api/flashcards/import", {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: any) =>
      fetch(`/api/flashcards/${id}`, {
        method: "PATCH",
        headers: jsonHeaders(),
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetch(`/api/flashcards/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },
};

const makeSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const splitTags = (s: string) => s.split(",").map((t) => t.trim()).filter(Boolean);

const getDifficultyClasses = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "bg-primary-100 text-primary-700 border-primary-200";
    case "intermediate":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "advanced":
      return "bg-purple-50 text-purple-700 border-purple-100";
    default:
      return "bg-gray-50 text-gray-700 border-gray-100";
  }
};

const categoryIconRegistry = {
  book: BookOpen,
  music: Music,
  camera: Camera,
  art: Palette,
  fitness: Dumbbell,
  cooking: CookingPot,
  food: CookingPot,
  coding: Code2,
  gaming: Gamepad2,
  gardening: Flower2,
  travel: Plane,
  writing: PenTool,
  singing: Mic2,
  fashion: Shirt,
  cycling: Bike,
  wellness: Heart,
  diy: Hammer,
  painting: Brush,
  guitar: Guitar,
  sports: Trophy,
} as const;

type CategoryIconName = keyof typeof categoryIconRegistry;

const categoryIconLabels: Record<CategoryIconName, string> = {
  book: "Books",
  music: "Music",
  camera: "Photo",
  art: "Art",
  fitness: "Fitness",
  cooking: "Cooking",
  food: "Food",
  coding: "Coding",
  gaming: "Gaming",
  gardening: "Garden",
  travel: "Travel",
  writing: "Writing",
  singing: "Singing",
  fashion: "Fashion",
  cycling: "Cycling",
  wellness: "Wellness",
  diy: "DIY",
  painting: "Painting",
  guitar: "Guitar",
  sports: "Sports",
};

const getCategoryIcon = (icon?: string) => {
  if (icon && icon in categoryIconRegistry) {
    return categoryIconRegistry[icon as CategoryIconName];
  }

  return BookOpen;
};

const CategoryVisualIcon: React.FC<{ icon?: string; className?: string }> = ({
  icon,
  className = "h-5 w-5",
}) => {
  const Icon = getCategoryIcon(icon);
  return <Icon className={className} />;
};

const IconPicker: React.FC<{ value: string; onChange: (value: string) => void }> = ({
  value,
  onChange,
}) => {
  const icons = Object.entries(categoryIconRegistry) as [CategoryIconName, typeof BookOpen][];

  return (
    <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto rounded-xl border border-border bg-cream-50 p-2 sm:grid-cols-4 md:grid-cols-5">
      {icons.map(([name, Icon]) => {
        const selected = value === name;

        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            className={`flex min-h-[78px] flex-col items-center justify-center gap-2 rounded-xl border p-3 text-xs font-medium transition-all ${
              selected
                ? "border-primary bg-primary-50 text-primary ring-2 ring-primary/15"
                : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:bg-primary-50/50 hover:text-primary"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{categoryIconLabels[name]}</span>
          </button>
        );
      })}
    </div>
  );
};

// ─── Shared UI ────────────────────────────────────────────────────────────────
const inputClasses =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60";

const smallIconButtonClasses =
  "inline-flex items-center justify-center rounded-lg border px-2.5 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const Spinner = ({ size = "w-4 h-4" }: { size?: string }) => (
  <Loader2 className={`${size} animate-spin`} />
);

const Toast: React.FC<{
  msg: string;
  type: "success" | "error";
  onDone: () => void;
}> = ({ msg, type, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-cozy ${
        type === "success" ? "bg-primary" : "bg-red-600"
      }`}
    >
      {type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {msg}
    </div>
  );
};

const Dialog: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
  footer?: React.ReactNode;
}> = ({ open, onClose, title, children, width = 640, footer }) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-brown-900/45 p-4 backdrop-blur-sm"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl border border-border bg-card"
        style={{ maxWidth: width }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {footer && (
          <div className="flex shrink-0 justify-end gap-2 border-t border-border bg-cream-100 px-5 py-4">
            {footer}
          </div>
        )}
      </motion.div>
    </div>
  );
};

const Field: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}> = ({ label, required, children, hint }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold uppercase tracking-wide text-foreground">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

const Inp: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = "", ...props }) => (
  <input {...props} className={`${inputClasses} ${className}`} />
);

const Txa: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = "", ...props }) => (
  <textarea {...props} className={`${inputClasses} min-h-[72px] resize-y ${className}`} />
);

const Sel: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }> = ({
  className = "",
  children,
  ...props
}) => (
  <select {...props} className={`${inputClasses} cursor-pointer ${className}`}>
    {children}
  </select>
);

const Btn: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    loading?: boolean;
    icon?: React.ReactNode;
  }
> = ({ variant = "primary", loading, icon, children, disabled, className = "", ...props }) => {
  const variants: Record<string, string> = {
    primary: "bg-primary text-white hover:bg-primary-dark border border-primary",
    secondary: "bg-primary-50 text-primary hover:bg-primary-100 border border-primary-100",
    danger: "bg-red-600 text-white hover:bg-red-700 border border-red-600",
    ghost: "bg-white text-muted-foreground hover:bg-muted hover:text-foreground border border-border",
  };

  return (
    <button
      disabled={disabled || loading}
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
};

const Empty: React.FC<{ label: string; icon?: React.ReactNode }> = ({ label, icon }) => (
  <Card className="border border-dashed border-border bg-card p-10 text-center" animate={false}>
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
      {icon ?? <BookOpen className="h-7 w-7" />}
    </div>
    <h3 className="mb-1 font-display text-lg font-bold text-foreground">No {label} found</h3>
    <p className="text-sm text-muted-foreground">Create one from the button above.</p>
  </Card>
);

// ─── Stage builder ────────────────────────────────────────────────────────────
const StageBuilder: React.FC<{ stages: Stage[]; onChange: (s: Stage[]) => void }> = ({ stages, onChange }) => {
  const add = () => onChange([...stages, { title: "", description: "", order: stages.length + 1, resources: [] }]);
  const remove = (i: number) => onChange(stages.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof Stage, val: any) =>
    onChange(stages.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-cream-100 px-4 py-3">
        <span className="text-xs font-bold uppercase tracking-wide text-foreground">Stages ({stages.length})</span>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <Plus className="h-3 w-3" /> Add Stage
        </button>
      </div>

      {stages.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">No stages yet. Click Add Stage to begin.</div>
      ) : (
        stages.map((stage, i) => (
          <div key={i} className="space-y-3 border-b border-border p-4 last:border-b-0">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">Stage {i + 1}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Inp placeholder="Stage title" value={stage.title} onChange={(e) => update(i, "title", e.target.value)} />
            <Txa
              placeholder="Description (optional)"
              value={stage.description ?? ""}
              onChange={(e) => update(i, "description", e.target.value)}
              className="min-h-[56px]"
            />
            <Inp
              type="number"
              placeholder="Order"
              value={stage.order}
              onChange={(e) => update(i, "order", Number(e.target.value))}
              className="max-w-28"
            />
          </div>
        ))
      )}
    </div>
  );
};

// ─── Quiz question builder ────────────────────────────────────────────────────
const QuestionBuilder: React.FC<{ questions: QuizQuestion[]; onChange: (q: QuizQuestion[]) => void }> = ({
  questions,
  onChange,
}) => {
  const add = () => onChange([...questions, { question: "", options: ["", ""], correctOption: 0, explanation: "" }]);
  const remove = (qi: number) => onChange(questions.filter((_, i) => i !== qi));
  const upd = (qi: number, key: keyof QuizQuestion, val: any) =>
    onChange(questions.map((q, i) => (i === qi ? { ...q, [key]: val } : q)));
  const updOpt = (qi: number, oi: number, val: string) =>
    onChange(
      questions.map((q, i) =>
        i !== qi ? q : { ...q, options: q.options.map((o, j) => (j === oi ? val : o)) }
      )
    );
  const addOpt = (qi: number) =>
    onChange(questions.map((q, i) => (i !== qi ? q : { ...q, options: [...q.options, ""] })));
  const removeOpt = (qi: number, oi: number) =>
    onChange(
      questions.map((q, i) => {
        if (i !== qi || q.options.length <= 2) return q;
        const opts = q.options.filter((_, j) => j !== oi);
        return { ...q, options: opts, correctOption: q.correctOption >= opts.length ? 0 : q.correctOption };
      })
    );

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-cream-100 px-4 py-3">
        <span className="text-xs font-bold uppercase tracking-wide text-foreground">Questions ({questions.length})</span>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <Plus className="h-3 w-3" /> Add Question
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">No questions yet. Click Add Question to begin.</div>
      ) : (
        questions.map((q, qi) => (
          <div key={qi} className="space-y-3 border-b border-border p-4 last:border-b-0">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">Q{qi + 1}</span>
              <button
                type="button"
                onClick={() => remove(qi)}
                className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <Inp placeholder="Question text" value={q.question} onChange={(e) => upd(qi, "question", e.target.value)} />

            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={q.correctOption === oi}
                    onChange={() => upd(qi, "correctOption", oi)}
                    className="h-4 w-4 accent-primary"
                  />
                  <Inp
                    placeholder={`Option ${oi + 1}`}
                    value={opt}
                    onChange={(e) => updOpt(qi, oi, e.target.value)}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeOpt(qi, oi)}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-red-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addOpt(qi)} className="text-xs font-semibold text-primary hover:text-primary-dark">
                + Add option
              </button>
            </div>

            <Txa
              placeholder="Explanation (shown after answering, optional)"
              value={q.explanation ?? ""}
              onChange={(e) => upd(qi, "explanation", e.target.value)}
              className="min-h-[56px]"
            />
          </div>
        ))
      )}
    </div>
  );
};

// ─── Flashcard builder ────────────────────────────────────────────────────────
const FlashcardBuilder: React.FC<{ cards: FlashCard[]; onChange: (c: FlashCard[]) => void }> = ({ cards, onChange }) => {
  const add = () => onChange([...cards, { front: "", back: "", hint: "" }]);
  const remove = (i: number) => onChange(cards.filter((_, idx) => idx !== i));
  const upd = (i: number, key: keyof FlashCard, val: string) =>
    onChange(cards.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)));

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-cream-100 px-4 py-3">
        <span className="text-xs font-bold uppercase tracking-wide text-foreground">Cards ({cards.length})</span>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <Plus className="h-3 w-3" /> Add Card
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">No cards yet. Click Add Card to begin.</div>
      ) : (
        cards.map((card, i) => (
          <div key={i} className="space-y-3 border-b border-border p-4 last:border-b-0">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">Card {i + 1}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Txa placeholder="Front" value={card.front} onChange={(e) => upd(i, "front", e.target.value)} />
              <Txa placeholder="Back" value={card.back} onChange={(e) => upd(i, "back", e.target.value)} />
            </div>

            <Inp placeholder="Hint (optional)" value={card.hint ?? ""} onChange={(e) => upd(i, "hint", e.target.value)} />
          </div>
        ))
      )}
    </div>
  );
};

// ─── JSON Import dialog ───────────────────────────────────────────────────────
const JsonImportDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  type: "quiz" | "flashcard";
  roadmaps: Roadmap[];
  resources: Resource[];
  onImported: () => void;
  onToast: (msg: string, type: "success" | "error") => void;
}> = ({ open, onClose, type, roadmaps, resources, onImported, onToast }) => {
  const [json, setJson] = useState("");
  const [roadmapId, setRoadmapId] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  const [saving, setSaving] = useState(false);
  const [parseError, setParseError] = useState("");

  const validate = () => {
    try {
      JSON.parse(json);
      setParseError("");
      return true;
    } catch (e: any) {
      setParseError(`Invalid JSON: ${e.message}`);
      return false;
    }
  };

  const handleImport = async () => {
    if (!validate()) return;
    if (!roadmapId) {
      onToast("Please select a roadmap", "error");
      return;
    }

    try {
      setSaving(true);
      const parsed = JSON.parse(json);
      if (type === "quiz") {
        await api.quizzes.importFromJson({
          resource: resourceId || undefined,
          roadmap: roadmapId,
          passingScore,
          json: parsed,
        });
      } else {
        await api.flashcards.importFromJson({
          resource: resourceId || undefined,
          roadmap: roadmapId,
          json: parsed,
        });
      }
      onToast(`${type === "quiz" ? "Quiz" : "Flashcard set"} imported successfully`, "success");
      onImported();
      onClose();
      setJson("");
      setRoadmapId("");
      setResourceId("");
    } catch (e: any) {
      onToast(e?.message ?? "Import failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const placeholder =
    type === "quiz"
      ? `{\n  "title": "Photography Basics Quiz",\n  "description": "Test your knowledge",\n  "questions": [\n    {\n      "question": "What does ISO control?",\n      "options": ["Aperture", "Shutter speed", "Sensor sensitivity", "Focus"],\n      "correctOption": 2,\n      "explanation": "ISO controls sensor sensitivity to light."\n    }\n  ]\n}`
      : `{\n  "title": "Guitar Chords",\n  "description": "Common open chords",\n  "cards": [\n    {\n      "front": "G Major chord",\n      "back": "Root: G — fingers on 2nd fret 5th string, 3rd fret 6th and 1st strings",\n      "hint": "Start with your middle finger"\n    }\n  ]\n}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Import ${type === "quiz" ? "Quiz" : "Flashcard Set"} from JSON`}
      width={720}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={handleImport} loading={saving} icon={<Upload className="h-4 w-4" />}>Import</Btn>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-800">
          Paste the JSON output from your AI generator. The format must match the schema shown in the placeholder.
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Roadmap" required>
            <Sel value={roadmapId} onChange={(e) => setRoadmapId(e.target.value)}>
              <option value="">Select roadmap…</option>
              {roadmaps.map((r) => (
                <option key={r._id} value={r._id}>{r.title}</option>
              ))}
            </Sel>
          </Field>

          <Field label="Resource" hint="Optional — links the import to a specific resource">
            <Sel value={resourceId} onChange={(e) => setResourceId(e.target.value)}>
              <option value="">No specific resource</option>
              {resources.map((r) => (
                <option key={r._id} value={r._id}>{r.title}</option>
              ))}
            </Sel>
          </Field>
        </div>

        {type === "quiz" && (
          <Field label="Passing Score (%)" hint="Score needed to pass (0–100)">
            <Inp
              type="number"
              value={passingScore}
              min={0}
              max={100}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              className="max-w-32"
            />
          </Field>
        )}

        <Field label="JSON Payload" required>
          <Txa
            value={json}
            onChange={(e) => {
              setJson(e.target.value);
              setParseError("");
            }}
            onBlur={validate}
            placeholder={placeholder}
            className={`min-h-[280px] font-mono text-xs leading-relaxed ${
              parseError ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""
            }`}
          />
          {parseError && <p className="mt-1 text-xs text-red-600">{parseError}</p>}
        </Field>
      </div>
    </Dialog>
  );
};

// ─── Category Dialog ──────────────────────────────────────────────────────────
const CategoryDialog: React.FC<{
  open: boolean;
  mode: "create" | "edit";
  initial?: Category;
  onClose: () => void;
  onSaved: () => void;
  onToast: (msg: string, t: "success" | "error") => void;
}> = ({ open, mode, initial, onClose, onSaved, onToast }) => {
  const [name, setName] = useState("");
  const [sl, setSl] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setSl(initial?.slug ?? "");
      setDesc(initial?.description ?? "");
      setIcon(initial?.icon ?? "");
    }
  }, [open, initial]);

  const handleSave = async () => {
    if (!name.trim()) {
      onToast("Name is required", "error");
      return;
    }

    try {
      setSaving(true);
      const data = {
        name: name.trim(),
        slug: sl.trim() || makeSlug(name),
        description: desc.trim(),
        icon: icon.trim(),
      };

      if (mode === "create") await api.categories.create(data);
      else await api.categories.update(initial!._id, data);

      onToast(`Category ${mode === "create" ? "created" : "updated"}`, "success");
      onSaved();
      onClose();
    } catch (e: any) {
      onToast(e?.message ?? "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New Category" : "Edit Category"}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={handleSave} loading={saving}>{mode === "create" ? "Create" : "Save changes"}</Btn>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Name" required>
          <Inp
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!initial) setSl(makeSlug(e.target.value));
            }}
            placeholder="e.g. Music"
          />
        </Field>
        <Field label="Slug" hint="Auto-generated from name if left blank">
          <Inp value={sl} onChange={(e) => setSl(e.target.value)} placeholder="e.g. music" />
        </Field>
        <Field label="Description">
          <Txa value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief description of this category" />
        </Field>
        <Field label="Icon" hint="Choose a visual icon. This saves a clean icon name like music, art, or coding.">
          <IconPicker value={icon} onChange={setIcon} />
        </Field>
      </div>
    </Dialog>
  );
};

// ─── Roadmap Dialog ───────────────────────────────────────────────────────────
const RoadmapDialog: React.FC<{
  open: boolean;
  mode: "create" | "edit";
  initial?: Roadmap;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
  onToast: (msg: string, t: "success" | "error") => void;
}> = ({ open, mode, initial, categories, onClose, onSaved, onToast }) => {
  const [title, setTitle] = useState("");
  const [sl, setSl] = useState("");
  const [desc, setDesc] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [tags, setTags] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stages, setStages] = useState<Stage[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setSl(initial?.slug ?? "");
      setDesc(initial?.description ?? "");
      setCoverImage(initial?.coverImage ?? "");
      setDifficulty(initial?.difficulty ?? "beginner");
      setEstimatedTime(initial?.estimatedTime ?? "");
      setTags((initial?.tags ?? []).join(", "));
      setCategoryId(typeof initial?.category === "object" ? (initial?.category as Category)?._id ?? "" : initial?.category ?? "");
      setStages(initial?.stages ?? []);
      setIsPublished(initial?.isPublished ?? false);
    }
  }, [open, initial]);

  const handleSave = async () => {
    if (!title.trim()) {
      onToast("Title is required", "error");
      return;
    }
    if (!categoryId) {
      onToast("Category is required", "error");
      return;
    }

    try {
      setSaving(true);
      const data = {
        title: title.trim(),
        slug: sl.trim() || makeSlug(title),
        description: desc.trim(),
        coverImage: coverImage.trim(),
        difficulty,
        estimatedTime: estimatedTime.trim(),
        tags: splitTags(tags),
        category: categoryId,
        stages,
        isPublished,
      };

      if (mode === "create") await api.roadmaps.create(data);
      else await api.roadmaps.update(initial!._id, data);

      onToast(`Roadmap ${mode === "create" ? "created" : "updated"}`, "success");
      onSaved();
      onClose();
    } catch (e: any) {
      onToast(e?.message ?? "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New Roadmap" : "Edit Roadmap"}
      width={760}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={handleSave} loading={saving}>{mode === "create" ? "Create" : "Save changes"}</Btn>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Title" required>
            <Inp
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!initial) setSl(makeSlug(e.target.value));
              }}
              placeholder="e.g. Learn Guitar"
            />
          </Field>
          <Field label="Slug">
            <Inp value={sl} onChange={(e) => setSl(e.target.value)} placeholder="auto-generated" />
          </Field>
        </div>

        <Field label="Description">
          <Txa value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What will learners achieve?" />
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Category" required>
            <Sel value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.icon ? `${c.icon} ` : ""}{c.name}</option>
              ))}
            </Sel>
          </Field>

          <Field label="Difficulty">
            <Sel value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="all-levels">All Levels</option>
            </Sel>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Estimated Time">
            <Inp value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} placeholder="e.g. 3–6 months" />
          </Field>
          <Field label="Tags" hint="Comma-separated">
            <Inp value={tags} onChange={(e) => setTags(e.target.value)} placeholder="guitar, music, beginner" />
          </Field>
        </div>

        <Field label="Cover Image URL">
          <Inp value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://…" />
        </Field>

        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-cream-100 px-4 py-3 text-sm font-medium text-foreground">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Published visible to users
        </label>

        <Field label="Stages">
          <StageBuilder stages={stages} onChange={setStages} />
        </Field>
      </div>
    </Dialog>
  );
};

// ─── Resource Dialog ──────────────────────────────────────────────────────────
const ResourceDialog: React.FC<{
  open: boolean;
  mode: "create" | "edit";
  initial?: Resource;
  roadmaps: Roadmap[];
  defaultRoadmapId?: string;
  onClose: () => void;
  onSaved: () => void;
  onToast: (msg: string, t: "success" | "error") => void;
}> = ({ open, mode, initial, roadmaps, defaultRoadmapId, onClose, onSaved, onToast }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState<"youtube" | "pdf">("youtube");
  const [url, setUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [tags, setTags] = useState("");
  const [roadmapId, setRoadmapId] = useState("");
  const [order, setOrder] = useState(0);
  const [stage, setStage] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedRoadmap = roadmaps.find((r) => r._id === roadmapId);
  const stageOptions = selectedRoadmap?.stages ?? [];

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setDesc(initial?.description ?? "");
      setType(initial?.type ?? "youtube");
      setUrl(initial?.url ?? "");
      setDuration(initial?.duration ?? "");
      setTags((initial?.tags ?? []).join(", "));
      setRoadmapId(initial?.roadmap ?? defaultRoadmapId ?? "");
      setOrder(initial?.order ?? 0);
      setStage(initial?.stage ?? "");
    }
  }, [open, initial, defaultRoadmapId]);

  const handleSave = async () => {
    if (!title.trim()) {
      onToast("Title is required", "error");
      return;
    }
    if (!url.trim()) {
      onToast("URL is required", "error");
      return;
    }
    if (!roadmapId) {
      onToast("Roadmap is required", "error");
      return;
    }

    try {
      setSaving(true);
      const data = {
        title: title.trim(),
        description: desc.trim(),
        type,
        url: url.trim(),
        duration: duration.trim(),
        tags: splitTags(tags),
        roadmap: roadmapId,
        order,
        stage: stage.trim() || undefined,
      };

      if (mode === "create") await api.resources.create(data);
      else await api.resources.update(initial!._id, data);

      onToast(`Resource ${mode === "create" ? "created" : "updated"}`, "success");
      onSaved();
      onClose();
    } catch (e: any) {
      onToast(e?.message ?? "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New Resource" : "Edit Resource"}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={handleSave} loading={saving}>{mode === "create" ? "Create" : "Save changes"}</Btn>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Title" required>
          <Inp value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Introduction to Music Theory" />
        </Field>

        <Field label="Description">
          <Txa value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What does this resource cover?" />
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Type" required>
            <Sel value={type} onChange={(e) => setType(e.target.value as "youtube" | "pdf")}>
              <option value="youtube">YouTube Video</option>
              <option value="pdf">PDF Document</option>
            </Sel>
          </Field>
          <Field label="Duration" hint="e.g. 14:32 or 45 pages">
            <Inp value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="14:32" />
          </Field>
        </div>

        <Field label="URL" required>
          <Inp value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=… or https://…pdf" />
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Roadmap" required>
            <Sel
              value={roadmapId}
              onChange={(e) => {
                setRoadmapId(e.target.value);
                setStage("");
              }}
            >
              <option value="">Select roadmap…</option>
              {roadmaps.map((r) => (
                <option key={r._id} value={r._id}>{r.title}</option>
              ))}
            </Sel>
          </Field>

          <Field label="Stage" hint="Which stage of the roadmap">
            {stageOptions.length > 0 ? (
              <Sel value={stage} onChange={(e) => setStage(e.target.value)}>
                <option value="">No stage</option>
                {stageOptions.map((s, i) => (
                  <option key={i} value={s.title}>{s.title}</option>
                ))}
              </Sel>
            ) : (
              <Inp value={stage} onChange={(e) => setStage(e.target.value)} placeholder="e.g. Beginner" />
            )}
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Order" hint="Position within the stage">
            <Inp type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
          </Field>
          <Field label="Tags" hint="Comma-separated">
            <Inp value={tags} onChange={(e) => setTags(e.target.value)} placeholder="theory, beginner" />
          </Field>
        </div>
      </div>
    </Dialog>
  );
};

// ─── Quiz Dialog ──────────────────────────────────────────────────────────────
const QuizDialog: React.FC<{
  open: boolean;
  mode: "create" | "edit";
  initial?: Quiz;
  roadmaps: Roadmap[];
  resources: Resource[];
  defaultRoadmapId?: string;
  onClose: () => void;
  onSaved: () => void;
  onToast: (msg: string, t: "success" | "error") => void;
}> = ({ open, mode, initial, roadmaps, resources, defaultRoadmapId, onClose, onSaved, onToast }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  const [roadmapId, setRoadmapId] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setDesc(initial?.description ?? "");
      setPassingScore(initial?.passingScore ?? 70);
      setRoadmapId((typeof initial?.roadmap === "string" ? initial.roadmap : (initial?.roadmap as any)?._id) ?? defaultRoadmapId ?? "");
      setResourceId((typeof initial?.resource === "string" ? initial.resource : (initial?.resource as any)?._id) ?? "");
      setQuestions(initial?.questions ?? []);
    }
  }, [open, initial, defaultRoadmapId]);

  const handleSave = async () => {
    if (!title.trim()) {
      onToast("Title is required", "error");
      return;
    }
    if (questions.length === 0) {
      onToast("Add at least one question", "error");
      return;
    }

    const bad = questions.some((q) => !q.question.trim() || q.options.length < 2 || q.options.some((o) => !o.trim()));
    if (bad) {
      onToast("Each question needs text and at least 2 filled options", "error");
      return;
    }

    try {
      setSaving(true);
      const data = {
        title: title.trim(),
        description: desc.trim(),
        passingScore,
        roadmap: roadmapId || undefined,
        resource: resourceId || undefined,
        questions,
      };

      if (mode === "create") await api.quizzes.create(data);
      else await api.quizzes.update(initial!._id, data);

      onToast(`Quiz ${mode === "create" ? "created" : "updated"}`, "success");
      onSaved();
      onClose();
    } catch (e: any) {
      onToast(e?.message ?? "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New Quiz" : "Edit Quiz"}
      width={760}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={handleSave} loading={saving}>{mode === "create" ? "Create" : "Save changes"}</Btn>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Title" required>
          <Inp value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Chord Theory Quiz" />
        </Field>
        <Field label="Description">
          <Txa value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What does this quiz test?" />
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Passing Score (%)">
            <Inp type="number" value={passingScore} min={0} max={100} onChange={(e) => setPassingScore(Number(e.target.value))} />
          </Field>
          <Field label="Roadmap">
            <Sel value={roadmapId} onChange={(e) => setRoadmapId(e.target.value)}>
              <option value="">None</option>
              {roadmaps.map((r) => (
                <option key={r._id} value={r._id}>{r.title}</option>
              ))}
            </Sel>
          </Field>
          <Field label="Resource" hint="Optional">
            <Sel value={resourceId} onChange={(e) => setResourceId(e.target.value)}>
              <option value="">No specific resource</option>
              {resources.map((r) => (
                <option key={r._id} value={r._id}>{r.title}</option>
              ))}
            </Sel>
          </Field>
        </div>

        <Field label="Questions" required>
          <QuestionBuilder questions={questions} onChange={setQuestions} />
        </Field>
      </div>
    </Dialog>
  );
};

// ─── Flashcard Set Dialog ─────────────────────────────────────────────────────
const FlashcardSetDialog: React.FC<{
  open: boolean;
  mode: "create" | "edit";
  initial?: FlashcardSet;
  roadmaps: Roadmap[];
  resources: Resource[];
  defaultRoadmapId?: string;
  onClose: () => void;
  onSaved: () => void;
  onToast: (msg: string, t: "success" | "error") => void;
}> = ({ open, mode, initial, roadmaps, resources, defaultRoadmapId, onClose, onSaved, onToast }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [roadmapId, setRoadmapId] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setDesc(initial?.description ?? "");
      setRoadmapId((typeof initial?.roadmap === "string" ? initial.roadmap : (initial?.roadmap as any)?._id) ?? defaultRoadmapId ?? "");
      setResourceId((typeof initial?.resource === "string" ? initial.resource : (initial?.resource as any)?._id) ?? "");
      setCards(initial?.cards ?? []);
    }
  }, [open, initial, defaultRoadmapId]);

  const handleSave = async () => {
    if (!title.trim()) {
      onToast("Title is required", "error");
      return;
    }
    if (cards.length === 0) {
      onToast("Add at least one card", "error");
      return;
    }
    const bad = cards.some((c) => !c.front.trim() || !c.back.trim());
    if (bad) {
      onToast("Each card needs front and back text", "error");
      return;
    }

    try {
      setSaving(true);
      const data = {
        title: title.trim(),
        description: desc.trim(),
        roadmap: roadmapId || undefined,
        resource: resourceId || undefined,
        cards,
      };

      if (mode === "create") await api.flashcards.create(data);
      else await api.flashcards.update(initial!._id, data);

      onToast(`Flashcard set ${mode === "create" ? "created" : "updated"}`, "success");
      onSaved();
      onClose();
    } catch (e: any) {
      onToast(e?.message ?? "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New Flashcard Set" : "Edit Flashcard Set"}
      width={760}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={handleSave} loading={saving}>{mode === "create" ? "Create" : "Save changes"}</Btn>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Title" required>
          <Inp value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Guitar Chord Flashcards" />
        </Field>
        <Field label="Description">
          <Txa value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What do these cards cover?" />
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Roadmap">
            <Sel value={roadmapId} onChange={(e) => setRoadmapId(e.target.value)}>
              <option value="">None</option>
              {roadmaps.map((r) => (
                <option key={r._id} value={r._id}>{r.title}</option>
              ))}
            </Sel>
          </Field>
          <Field label="Resource" hint="Optional">
            <Sel value={resourceId} onChange={(e) => setResourceId(e.target.value)}>
              <option value="">No specific resource</option>
              {resources.map((r) => (
                <option key={r._id} value={r._id}>{r.title}</option>
              ))}
            </Sel>
          </Field>
        </div>

        <Field label="Cards" required>
          <FlashcardBuilder cards={cards} onChange={setCards} />
        </Field>
      </div>
    </Dialog>
  );
};

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────
const DeleteDialog: React.FC<{
  open: boolean;
  label: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}> = ({ open, label, onClose, onConfirm }) => {
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    setSaving(true);
    await onConfirm();
    setSaving(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Confirm deletion"
      width={440}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn variant="danger" onClick={handleConfirm} loading={saving}>Delete permanently</Btn>
        </>
      }
    >
      <div className="rounded-xl border border-red-100 bg-red-50 p-4">
        <p className="text-sm leading-relaxed text-red-800">
          Are you sure you want to delete <strong>{label}</strong>? This action cannot be undone.
        </p>
      </div>
    </Dialog>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
interface AdminDashboardProps {
  userRole?: "admin" | "user";
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ userRole = "admin" }) => {
  const [activeTab, setActiveTab] = useState<TabType>("categories");
  const [selectedRoadmapId, setSelectedRoadmapId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [scopedLoading, setScopedLoading] = useState(false);

  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [roadmapsList, setRoadmapsList] = useState<Roadmap[]>([]);
  const [resourcesList, setResourcesList] = useState<Resource[]>([]);
  const [quizzesList, setQuizzesList] = useState<Quiz[]>([]);
  const [flashcardsList, setFlashcardsList] = useState<FlashcardSet[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [jsonImportOpen, setJsonImportOpen] = useState(false);
  const [jsonImportType, setJsonImportType] = useState<"quiz" | "flashcard">("quiz");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string; type: TabType } | null>(null);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = useCallback((msg: string, type: "success" | "error") => setToast({ msg, type }), []);

  const fetchBase = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, roads] = await Promise.all([api.categories.getAll(), api.roadmaps.getAllAdmin()]);
      setCategoriesList(cats);
      setRoadmapsList(roads);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchScoped = useCallback(
    async (roadmapId: string) => {
      if (!roadmapId) {
        setResourcesList([]);
        setQuizzesList([]);
        setFlashcardsList([]);
        return;
      }

      setScopedLoading(true);
      try {
        const [res, qz, fc] = await Promise.all([
          api.resources.getByRoadmap(roadmapId),
          api.quizzes.getByRoadmap(roadmapId),
          api.flashcards.getByRoadmap(roadmapId),
        ]);
        setResourcesList(res);
        setQuizzesList(qz);
        setFlashcardsList(fc);
      } catch {
        showToast("Failed to load roadmap content", "error");
      } finally {
        setScopedLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchBase();
  }, [fetchBase]);

  useEffect(() => {
    fetchScoped(selectedRoadmapId);
  }, [selectedRoadmapId, fetchScoped]);

  const refresh = useCallback(async () => {
    await fetchBase();
    if (selectedRoadmapId) await fetchScoped(selectedRoadmapId);
  }, [fetchBase, fetchScoped, selectedRoadmapId]);

  const openCreate = () => {
    setEditingItem(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const openJsonImport = (type: "quiz" | "flashcard") => {
    setJsonImportType(type);
    setJsonImportOpen(true);
  };

  const confirmDelete = (id: string, label: string, type: TabType) => {
    setDeleteTarget({ id, label, type });
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const handlers: Record<TabType, (id: string) => Promise<any>> = {
      categories: api.categories.delete,
      roadmaps: api.roadmaps.delete,
      resources: api.resources.delete,
      quizzes: api.quizzes.delete,
      flashcards: api.flashcards.delete,
    };

    await handlers[deleteTarget.type](deleteTarget.id);
    showToast("Deleted successfully", "success");
    await refresh();
  };

  const filterList = <T extends { title?: string; name?: string }>(list: T[]): T[] => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((i) => (i.title ?? i.name ?? "").toLowerCase().includes(q));
  };

  const tabs = [
    { id: "categories" as TabType, label: "Categories", icon: Tag, count: categoriesList.length },
    { id: "roadmaps" as TabType, label: "Roadmaps", icon: BookOpen, count: roadmapsList.length },
    { id: "resources" as TabType, label: "Resources", icon: FileText, count: resourcesList.length },
    { id: "quizzes" as TabType, label: "Quizzes", icon: HelpCircle, count: quizzesList.length },
    { id: "flashcards" as TabType, label: "Flashcards", icon: Layers, count: flashcardsList.length },
  ];

  const tabLabel: Record<TabType, string> = {
    categories: "Category",
    roadmaps: "Roadmap",
    resources: "Resource",
    quizzes: "Quiz",
    flashcards: "Flashcard Set",
  };

  const needsRoadmap = (t: TabType) => ["resources", "quizzes", "flashcards"].includes(t);
  const isTabLoading = loading || (needsRoadmap(activeTab) && scopedLoading);

  if (userRole !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="max-w-md border border-border p-10 text-center" animate={false}>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="mb-2 font-display text-2xl font-bold text-foreground">Access Denied</h2>
          <p className="text-sm text-muted-foreground">Admin privileges required.</p>
        </Card>
      </div>
    );
  }

  const ItemRow: React.FC<{
    title: string;
    subtitle?: string;
    badge?: string;
    badgeClassName?: string;
    leading?: React.ReactNode;
    onEdit: () => void;
    onDelete: () => void;
    extra?: React.ReactNode;
  }> = ({ title, subtitle, badge, badgeClassName, leading, onEdit, onDelete, extra }) => (
    <div className="flex items-start gap-4 border-b border-border bg-card p-4 transition-colors last:border-b-0 hover:bg-cream-50">
      {leading && <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">{leading}</div>}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground">{title}</h3>
          {badge && (
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${badgeClassName ?? "border-primary-100 bg-primary-50 text-primary"}`}>
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p>}
        {extra && <div className="mt-2 flex flex-wrap gap-2">{extra}</div>}
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onEdit}
          title="Edit"
          className={`${smallIconButtonClasses} border-border text-primary hover:bg-primary-50`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          title="Delete"
          className={`${smallIconButtonClasses} border-red-100 text-red-500 hover:bg-red-50`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isTabLoading) {
      return (
        <Card className="flex items-center justify-center gap-3 border border-border p-14 text-muted-foreground" animate={false}>
          <Spinner size="h-6 w-6" />
          <span className="text-sm">Loading…</span>
        </Card>
      );
    }

    if (needsRoadmap(activeTab) && !selectedRoadmapId) {
      return (
        <Card className="border border-dashed border-border bg-card p-12 text-center" animate={false}>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="mb-2 font-display text-xl font-bold text-foreground">Choose a roadmap first</h3>
          <p className="text-sm text-muted-foreground">Select a roadmap above to manage its {activeTab}.</p>
        </Card>
      );
    }

    switch (activeTab) {
      case "categories": {
        const list = filterList(categoriesList.map((c) => ({ ...c, title: c.name })));
        if (!list.length) return <Empty label="categories" icon={<Tag className="h-7 w-7" />} />;
        return (
          <Card className="overflow-hidden border border-border" animate={false}>
            {list.map((c) => (
              <ItemRow
                key={c._id}
                title={c.name}
                subtitle={c.description ?? `/${c.slug}`}
                leading={<CategoryVisualIcon icon={c.icon} className="h-5 w-5" />}
                onEdit={() => openEdit(c)}
                onDelete={() => confirmDelete(c._id, c.name, "categories")}
              />
            ))}
          </Card>
        );
      }

      case "roadmaps": {
        const list = filterList(roadmapsList);
        if (!list.length) return <Empty label="roadmaps" icon={<BookOpen className="h-7 w-7" />} />;
        return (
          <Card className="overflow-hidden border border-border" animate={false}>
            {list.map((r) => (
              <ItemRow
                key={r._id}
                title={r.title}
                subtitle={`/${r.slug} · ${r.stages?.length ?? 0} stages · ${r.enrolledCount ?? 0} enrolled`}
                badge={r.difficulty}
                badgeClassName={getDifficultyClasses(r.difficulty)}
                onEdit={() => openEdit(r)}
                onDelete={() => confirmDelete(r._id, r.title, "roadmaps")}
                extra={
                  <>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        r.isPublished
                          ? "border-green-100 bg-green-50 text-green-700"
                          : "border-gray-100 bg-gray-50 text-muted-foreground"
                      }`}
                    >
                      {r.isPublished ? "Published" : "Draft"}
                    </span>
                    {r.estimatedTime && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-cream-100 px-2.5 py-0.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {r.estimatedTime}
                      </span>
                    )}
                  </>
                }
              />
            ))}
          </Card>
        );
      }

      case "resources": {
        const list = filterList(resourcesList);
        if (!list.length) return <Empty label="resources" icon={<FileText className="h-7 w-7" />} />;
        return (
          <Card className="overflow-hidden border border-border" animate={false}>
            {list.map((r) => (
              <ItemRow
                key={r._id}
                title={r.title}
                subtitle={`${r.url.length > 55 ? `${r.url.slice(0, 55)}…` : r.url}${r.duration ? ` · ${r.duration}` : ""}`}
                badge={r.type === "youtube" ? "YouTube" : "PDF"}
                badgeClassName={r.type === "youtube" ? "border-red-100 bg-red-50 text-red-700" : "border-blue-100 bg-blue-50 text-blue-700"}
                onEdit={() => openEdit(r)}
                onDelete={() => confirmDelete(r._id, r.title, "resources")}
              />
            ))}
          </Card>
        );
      }

      case "quizzes": {
        const list = filterList(quizzesList);
        if (!list.length) return <Empty label="quizzes" icon={<HelpCircle className="h-7 w-7" />} />;
        return (
          <Card className="overflow-hidden border border-border" animate={false}>
            {list.map((q) => (
              <ItemRow
                key={q._id}
                title={q.title}
                subtitle={`${q.questions?.length ?? 0} questions · Pass: ${q.passingScore}%${q.description ? ` · ${q.description}` : ""}`}
                onEdit={() => openEdit(q)}
                onDelete={() => confirmDelete(q._id, q.title, "quizzes")}
              />
            ))}
          </Card>
        );
      }

      case "flashcards": {
        const list = filterList(flashcardsList);
        if (!list.length) return <Empty label="flashcard sets" icon={<Layers className="h-7 w-7" />} />;
        return (
          <Card className="overflow-hidden border border-border" animate={false}>
            {list.map((s) => (
              <ItemRow
                key={s._id}
                title={s.title}
                subtitle={`${s.cards?.length ?? 0} cards${s.description ? ` · ${s.description}` : ""}`}
                onEdit={() => openEdit(s)}
                onDelete={() => confirmDelete(s._id, s.title, "flashcards")}
              />
            ))}
          </Card>
        );
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background pb-24 text-foreground">
        <section className="border-b border-border bg-background pt-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                  <Shield className="h-3.5 w-3.5" /> Admin Studio
                </div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">Content Dashboard</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Manage categories, roadmaps, resources, quizzes, and flashcards from one cozy workspace.
                </p>
              </div>

              <Btn variant="secondary" onClick={refresh} icon={<RefreshCw className="h-4 w-4" />} loading={loading}>
                Refresh
              </Btn>
            </motion.div>

            <div className="flex gap-2 overflow-x-auto pb-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearch("");
                    }}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-primary-50 hover:text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        active ? "bg-white/20 text-white" : "bg-cream-100 text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          {needsRoadmap(activeTab) && (
            <Card className="mb-5 border border-border p-4" animate={false}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-foreground">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Roadmap scope
                </div>
                <div className="min-w-0 flex-1 sm:max-w-md">
                  <Sel value={selectedRoadmapId} onChange={(e) => setSelectedRoadmapId(e.target.value)}>
                    <option value="">Select a roadmap to manage its {activeTab}…</option>
                    {roadmapsList.map((r) => (
                      <option key={r._id} value={r._id}>{r.title}</option>
                    ))}
                  </Sel>
                </div>
                {selectedRoadmapId && scopedLoading && <Spinner />}
              </div>
            </Card>
          )}

          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Inp
                placeholder={`Search ${activeTab}…`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {activeTab === "quizzes" && (
                <Btn variant="secondary" icon={<Upload className="h-4 w-4" />} onClick={() => openJsonImport("quiz")}>
                  Import JSON
                </Btn>
              )}
              {activeTab === "flashcards" && (
                <Btn variant="secondary" icon={<Upload className="h-4 w-4" />} onClick={() => openJsonImport("flashcard")}>
                  Import JSON
                </Btn>
              )}
              <Btn icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
                New {tabLabel[activeTab]}
              </Btn>
            </div>
          </div>

          {renderContent()}
        </main>
      </div>

      {activeTab === "categories" && (
        <CategoryDialog
          open={dialogOpen}
          mode={dialogMode}
          initial={editingItem}
          onClose={() => setDialogOpen(false)}
          onSaved={refresh}
          onToast={showToast}
        />
      )}
      {activeTab === "roadmaps" && (
        <RoadmapDialog
          open={dialogOpen}
          mode={dialogMode}
          initial={editingItem}
          categories={categoriesList}
          onClose={() => setDialogOpen(false)}
          onSaved={refresh}
          onToast={showToast}
        />
      )}
      {activeTab === "resources" && (
        <ResourceDialog
          open={dialogOpen}
          mode={dialogMode}
          initial={editingItem}
          roadmaps={roadmapsList}
          defaultRoadmapId={selectedRoadmapId}
          onClose={() => setDialogOpen(false)}
          onSaved={refresh}
          onToast={showToast}
        />
      )}
      {activeTab === "quizzes" && (
        <QuizDialog
          open={dialogOpen}
          mode={dialogMode}
          initial={editingItem}
          roadmaps={roadmapsList}
          resources={resourcesList}
          defaultRoadmapId={selectedRoadmapId}
          onClose={() => setDialogOpen(false)}
          onSaved={refresh}
          onToast={showToast}
        />
      )}
      {activeTab === "flashcards" && (
        <FlashcardSetDialog
          open={dialogOpen}
          mode={dialogMode}
          initial={editingItem}
          roadmaps={roadmapsList}
          resources={resourcesList}
          defaultRoadmapId={selectedRoadmapId}
          onClose={() => setDialogOpen(false)}
          onSaved={refresh}
          onToast={showToast}
        />
      )}

      <JsonImportDialog
        open={jsonImportOpen}
        onClose={() => setJsonImportOpen(false)}
        type={jsonImportType}
        roadmaps={roadmapsList}
        resources={resourcesList}
        onImported={refresh}
        onToast={showToast}
      />

      <DeleteDialog
        open={deleteOpen}
        label={deleteTarget?.label ?? ""}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </>
  );
};

export default AdminDashboard;
