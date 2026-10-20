import React, { useState } from 'react';
import {
  Sparkles,
  Bookmark,
  Plus,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { EventBanner } from '../components/layout/EventBanner';
import { Button } from '../components/common/Button';
import { IdeaCard } from '../components/ideas/IdeaCard';
import { AddIdeaModal } from '../components/ideas/AddIdeaModal';
import { EmptyState } from '../components/common/EmptyState';
import { Toast } from '../components/common/Toast';
import { generateIdeasWithAI } from '../utils/api';
import { calculateIdeaDeliverableDetails } from '../utils/date';

export const IdeasPage = () => {
  const { activeEvent, toggleIdeaFavorite, addCustomIdea, addTask } = useEvents();
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [ideasNotice, setIdeasNotice] = useState(null);
  const [toast, setToast] = useState({
    isOpen: false,
    message: '',
    type: 'success',
    actionLabel: '',
    actionPath: '',
  });

  if (!activeEvent) return null;

  const ideas = activeEvent.aiIdeas || [];

  const categories = [
    { id: 'all', label: 'All Concepts' },
    { id: 'theme', label: 'Themes & Aesthetics' },
    { id: 'decor', label: 'Decor & Florals' },
    { id: 'food', label: 'Food & Curated Menus' },
    { id: 'entertainment', label: 'Entertainment & Music' },
  ];

  const filteredIdeas = ideas.filter((idea) => {
    const matchesCat = activeCategory === 'all' || idea.type === activeCategory;
    const matchesFav = !showFavoritesOnly || idea.favorite;
    return matchesCat && matchesFav;
  });

  const handleToggleFavorite = (ideaId) => {
    toggleIdeaFavorite(activeEvent.id, ideaId);
  };

  const handleAddCustomIdea = (ideaData) => {
    addCustomIdea(activeEvent.id, ideaData);
  };

  const handleAddTaskFromIdea = (idea) => {
    const taskTitle = `Plan: ${idea.title}`;
    const currentTasks = activeEvent.timelineTasks || [];
    const isAlreadyAdded = currentTasks.some(
      (t) =>
        t.title.toLowerCase().trim() === taskTitle.toLowerCase().trim() ||
        t.title.toLowerCase().trim() === idea.title.toLowerCase().trim()
    );

    if (isAlreadyAdded) {
      setToast({
        isOpen: true,
        message: `"${idea.title}" is already in your Event Deliverables.`,
        type: 'info',
        actionLabel: 'View in Timeline',
        actionPath: '/timeline',
      });
      return;
    }

    const { dueDate, phase, priority, category } = calculateIdeaDeliverableDetails(
      idea,
      activeEvent.date
    );

    addTask(activeEvent.id, {
      title: taskTitle,
      phase,
      category,
      priority,
      dueDate,
      notes: idea.description,
    });

    setToast({
      isOpen: true,
      message: `Added "${idea.title}" to your plan (Target: ${dueDate}, Phase: ${phase}).`,
      type: 'success',
      actionLabel: 'View in Timeline',
      actionPath: '/timeline',
    });
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setIdeasNotice(null);

    try {
      // Attempt generation with live Google Gemini AI
      const newIdeas = await generateIdeasWithAI({
        event: activeEvent,
        category: activeCategory,
      });

      if (Array.isArray(newIdeas) && newIdeas.length > 0) {
        newIdeas.forEach((item) => {
          addCustomIdea(activeEvent.id, item);
        });
        setIdeasNotice({
          type: 'success',
          text: `Synthesized ${newIdeas.length} fresh concepts using Google Gemini AI!`,
        });
      }
    } catch (err) {
      // Gemini API not configured or offline - transparently explain without fabricating
      setIdeasNotice({
        type: 'warning',
        text: `${err.message} Added curated lifestyle sample concepts.`,
      });

      // Add sample curated ideas
      const fallbackIdeas = [
        {
          title: `Artisanal Clay-Pot Kulhad Chai & Mithai Station`,
          type: 'food',
          tag: 'Food & Menu',
          description: `Interactive live tea counter serving slow-brewed cardamom saffron tea in terracotta kulhads paired with miniature pistachio desserts for ${activeEvent.expectedGuests} attendees.`,
          costImpact: 'Budget-friendly',
        },
        {
          title: `Floating Brass Urli Candle Pathway`,
          type: 'decor',
          tag: 'Decor & Styling',
          description: `A serene illuminated entrance pathway accented with aged brass vessels floating yellow marigolds, soft jasmine garlands, and amber candle drops.`,
          costImpact: 'Moderate',
        },
      ];

      fallbackIdeas.forEach((item) => {
        addCustomIdea(activeEvent.id, item);
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div>
      <EventBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-left">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-stoneborder">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-sage-800 font-semibold">
              Curated Concepts
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-charcoal font-normal">
              Aesthetic Direction & Culinary Ideas
            </h2>
            <p className="text-sm text-muted">
              Tailored suggestions reflecting "{activeEvent.theme}" for {activeEvent.expectedGuests} guests
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              loading={isRegenerating}
              onClick={handleRegenerate}
            >
              Synthesize Concepts
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Concept
            </Button>
          </div>
        </div>

        {/* Notice Banner (if any) */}
        {ideasNotice && (
          <div
            className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-2 ${
              ideasNotice.type === 'success'
                ? 'bg-sage-50 border-sage-200 text-sage-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{ideasNotice.text}</span>
            </div>
            <button
              onClick={() => setIdeasNotice(null)}
              className="text-xs font-semibold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filter Pills and Bookmarks */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-stoneborder pb-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-sage-700 text-white shadow-subtle'
                      : 'bg-white text-muted border border-stoneborder hover:text-charcoal hover:border-sage-300'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                showFavoritesOnly
                  ? 'bg-sage-100 text-sage-900 border-sage-300 font-semibold'
                  : 'bg-white text-muted border-stoneborder hover:text-charcoal'
              }`}
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-sage-800 text-sage-800' : ''}`}
              />
              <span>Saved Only</span>
            </button>
          </div>
        </div>

        {/* Ideas Grid */}
        {filteredIdeas.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No concepts in this category"
            description="Explore another category or click 'Synthesize Concepts' to generate ideas."
            actionLabel="Synthesize Concepts"
            onAction={handleRegenerate}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredIdeas.map((idea) => {
              const currentTasks = activeEvent.timelineTasks || [];
              const taskTitleLower = `plan: ${idea.title.toLowerCase().trim()}`;
              const isAdded = currentTasks.some(
                (t) =>
                  t.title.toLowerCase().trim() === taskTitleLower ||
                  t.title.toLowerCase().trim() === idea.title.toLowerCase().trim()
              );

              return (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  isAdded={isAdded}
                  onToggleFavorite={handleToggleFavorite}
                  onAddTaskFromIdea={handleAddTaskFromIdea}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Add Custom Idea Modal */}
      <AddIdeaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddIdea={handleAddCustomIdea}
      />

      {/* Tasteful Non-Blocking Success Toast */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        actionLabel={toast.actionLabel}
        actionPath={toast.actionPath}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
