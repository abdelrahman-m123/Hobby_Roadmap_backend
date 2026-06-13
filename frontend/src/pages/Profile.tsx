import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Shield,
  Calendar,
  BookOpen,
  Bookmark,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Save,
  X,
  LogOut,
  Clock,
  Award,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { auth, roadmaps } from '@/services/api';
import type { Roadmap } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

interface EnrolledRoadmap {
  roadmap: Roadmap;
  completedCount: number;
  totalCount: number;
  percentage: number;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-primary-100 text-primary-700';
    case 'intermediate': return 'bg-blue-100 text-blue-700';
    case 'advanced': return 'bg-purple-100 text-purple-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getInitials = (username: string) =>
  username
    .split(/[^a-zA-Z]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

export const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [enrolledRoadmaps, setEnrolledRoadmaps] = useState<EnrolledRoadmap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProgress();
  }, [user]);

  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [userRes, roadmapsRes] = await Promise.all([
        auth.getMe(),
        roadmaps.getAll(),
      ]);

      const freshUser = userRes.data.user;
      updateUser(freshUser);

      let allRoadmaps: Roadmap[] = [];
      if (roadmapsRes.data && Array.isArray(roadmapsRes.data)) {
        allRoadmaps = roadmapsRes.data;
      } else if (roadmapsRes.data && (roadmapsRes.data as any).roadmaps) {
        allRoadmaps = (roadmapsRes.data as any).roadmaps;
      }

      // Build enrolled roadmap list using progress entries
      const progress = freshUser.progress || [];
      const enrolled: EnrolledRoadmap[] = [];

      for (const entry of progress) {
        const roadmapId = typeof entry.roadmap === 'object'
          ? (entry.roadmap as any)?._id
          : entry.roadmap;

        const roadmap = allRoadmaps.find((r) => r._id === roadmapId);
        if (!roadmap) continue;

        const totalResources = roadmap.stages.reduce(
          (sum, stage) => sum + (stage.resources?.length || 0),
          0
        );
        const completedCount = entry.completedResources?.length || 0;
        const percentage = totalResources > 0
          ? Math.round((completedCount / totalResources) * 100)
          : 0;

        enrolled.push({ roadmap, completedCount, totalCount: totalResources, percentage });
      }

      setEnrolledRoadmaps(enrolled);
    } catch (err: any) {
      console.error('Failed to load profile data:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEditing = () => {
    setEditUsername(user?.username || '');
    setEditEmail(user?.email || '');
    setEditError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError(null);
  };

  const handleSaveEdit = async () => {
    if (!editUsername.trim()) {
      setEditError('Username cannot be empty.');
      return;
    }
    try {
      setIsSaving(true);
      setEditError(null);
      const res = await auth.updateMe({
        username: editUsername.trim(),
        email: editEmail.trim(),
      });
      updateUser(res.data.user);
      setIsEditing(false);
    } catch (err: any) {
      setEditError(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const completedRoadmaps = enrolledRoadmaps.filter((e) => e.percentage === 100).length;
  const totalCompleted = enrolledRoadmaps.reduce((s, e) => s + e.completedCount, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Avatar + Name Card */}
          <Card className="overflow-hidden border border-gray-100" animate={false}>

            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-4 mb-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-primary-light/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">
                    {getInitials(user.username)}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={handleStartEditing}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        disabled={isSaving}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-60"
                      >
                        {isSaving ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Profile info / Edit form */}
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {editError && (
                      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {editError}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Username</label>
                      <input
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-gray-400" />
                        <span className="capitalize">{user.role}</span>
                      </span>
                      {user.createdAt && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          Joined {formatDate(user.createdAt)}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        {/* Saved Roadmaps Quick Link */}
        {(user.savedRoadmaps?.length || 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            <Link to="/saved">
              <Card className="p-5 border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-300 group" animate={false}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Bookmark className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Saved Roadmaps</p>
                      <p className="text-sm text-gray-500">{user.savedRoadmaps.length} saved for later</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </Card>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};
